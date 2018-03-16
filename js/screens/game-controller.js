var GameController = (function(){
    var gameState, availablePages = [], currentPage = 0;
    var layout, timers = {}, gameDisplay, gameDisplayTimerId;
    var drawingStarted = false, enableDraw = false;
    var writingCanvas, writingCanvasId = 'drawingCanvas', context;

    function initDrawingCanvas() {
        writingCanvas = CanvasRenderer.createCanvas(gameState.containerId, writingCanvasId, gameState.containerWidth, gameState.containerHeight);
        context = writingCanvas.getContext('2d');
        context.strokeStyle = gameState.preferences.fontColor;
        context.lineWidth = 6;
        writingCanvas.addEventListener('pointermove', onPointerMove, false);
        writingCanvas.addEventListener('pointerdown', onPointerDown, false); 
        writingCanvas.addEventListener('pointerup', onPointerUp, false); 
        writingCanvas.addEventListener('pointerout', onPointerUp, false);
        document.addEventListener('keyup', onKeyUp, false);

        return writingCanvas;
    }

    function onPointerMove(event) {
        var x, y;
        x = event.offsetX;
        y = event.offsetY;
        if (enableDraw) {
            if (!drawingStarted) { 
                drawingStarted = true; 
                context.beginPath(); 
                context.moveTo(x, y); 
            } 
            else { 
                context.lineTo(x, y); 
                context.stroke(); 
            }
        }
    }

    function onPointerDown(event) {
        if (!drawingStarted) {
            drawingStarted = true;
            startTimers();
        }
        enableDraw = true;
        context.beginPath();
    }

    function onPointerUp(event) {
        if (drawingStarted) {
            if (enableDraw) {
                context.closePath();
                enableDraw = false;
            }
        }
    }

    function onKeyUp(event) {
        if (window.router.getCurrentRoute() === 'game') {
            var key = event.keyCode;
            switch(key) {
                case 80: // p
                    if (enableDraw) {
                        context.closePath();
                        enableDraw = false;
                    }
                    gameState.paused = true;
                    stopTimers();
                    window.router.getRoute('pauseGame')();
                    break;
            }
        }
    }

    function clearWritingCanvas() {
        CanvasRenderer.clearRectangle(this.context, 0, 0, this.canvas.width, this.canvas.height);
    }

    function generatePages() {
        for (var i = 0; i < gameState.package.pages.length;i++) {
            availablePages.push(i);
        }
        if (gameState.randomize) {
            availablePages = shuffle(availablePages);
        }
    }

    // Fisher-Yates shuffle
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    function getPage() {
        return gameState.package.pages[availablePages[currentPage]];
    }
    
    function initializeGameDisplay() {
        currentPage = 0;
        generatePages();
        layout = LayoutRenderer.buildLayout(gameState.gameMode.name);
        gameDisplay = new gameState.gameMode(getPage(), layout);
        addTimers();
        gameDisplay.render();
    }

    // These are functions to handle timers
    function createTimerStartCallback(time) {
        if (time.maxTime > 0) {
            return function(timeElapsed) {
                var timeRemaining = time.maxTime - timeElapsed;
                var percent = 1 - timeRemaining / time.maxTime;
                timeRemaining = timeRemaining / 1000;
                timeRemaining = timeRemaining.toFixed(1);
                time.circleStyles.fillStyle = 'rgba('+Math.floor(255 * percent)+',0,0,1)';
                if (timeRemaining <= 0) {
                    timeRemaining = 0;
                    setTimeout(calculateScore.bind(this), 100);
                }
                time.time = timeRemaining;
            }
        }
        return function(timeElapsed) {
            time.time = (timeElapsed / 1000).toFixed(1);
        };
    }

    function createTimerStopCallback(time) {
        time.display = false;
        if (time.renderMode === 'always') {
            return function() {};
        }
        return function() {
            time.display = !time.display;
            gameDisplay.clearTime(time);
        };
    }

    function addTimers() {
        Object.keys(layout.times).forEach(function (timeId) {
            var time = layout.times[timeId];
            time.circleStyles = LayoutRenderer.getStyles(layout, 'times.' + timeId, 'circleStyles');
            time.textStyles = LayoutRenderer.getStyles(layout, 'times.' + timeId, 'textStyles');
            var start = createTimerStartCallback(time);
            var stop = createTimerStopCallback(time);
            var timer = new StopWatch(start, stop);
            gameDisplay.addTime(timeId, time);
            timers[timeId] = {timer: timer, time: time};
        });
    }

    // TODO: handle start/resume/restart
    // start - totalTime restarts, !totalTime starts
    // resume - totalTime restarts, !totalTime restarts
    // restart - totalTime starts from last lap, !totalTime starts
    function startTimers() {
        Object.keys(timers).forEach(function(timerId) {
            var timer = timers[timerId];
            if (timer.time.renderMode !== 'hidden') {
                timer.time.display = true;
            }
            if (timer.time.totalTime) {
                timer.timer.restartTimer();
            } else {
                timer.timer.startTimer();
            }
        });
        gameDisplayTimerId = setInterval(gameDisplay.renderTimes.bind(gameDisplay), 100);
    }

    function stopTimers() {
        Object.keys(timers).forEach(function(timerId) {
            var timer = timers[timerId];
            timer.timer.lapTimer();
            timer.timer.stopTimer();
        });
        clearInterval(gameDisplayTimerId);
        gameDisplayTimerId = null;
    }

    // drawing finished! time to score and update
    function calculateScore() {
        gameState.paused = true;
        if (currentPage === gameState.maxPages - 1) {
            gameState.gameOver = true;
        }
        stopTimers();
        console.log(timers['ElapsedTime'].timer.getTime());
        var results = ComputerVision.compareImages(
            getAnswerImageData(),
            context.getImageData(0, 0, gameState.containerWidth, gameState.containerHeight),
            gameState.containerWidth,
            gameState.containerHeight,
            gameState.difficulty
        );
        console.log(results);
        window.router.getRoute('scoreGame')();
    }

    function getAnswerImageData() {
        var canvas = document.createElement('canvas');
        canvas.width = gameState.containerWidth;
        canvas.height = gameState.containerHeight;
        var context = canvas.getContext('2d');
        context.font = '200px Comic Sans MS';
        context.fillStyle = gameState.preferences.fontColor;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(getPage().answer, canvas.width / 2, canvas.height / 2);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }

    function resetGameState() {
        drawingStarted = false;
        enableDraw = false;
        gameState.gameOver = false;
        clearWritingCanvas();
        stopTimers();
    }

    return {
        initialize: function() {
            gameState = window.gameState;    

            initializeGameDisplay();

            writingCanvas = initDrawingCanvas();
            return [ gameDisplay.canvas, writingCanvas ];
        },
        restartGame: function() {
            resetGameState();
        },
        destroy: function(elements) {
            if (gameState.paused) {
                return false;
            }
            drawingStarted = false;
            enableDraw = false;
            gameState.resetState();
            stopTimers();
            timers = [];
            return CanvasRenderer.destroy(elements);
        },
        resumeGame: function() {
            gameState.paused = false;
            startTimers();
        },
        advanceGame: function() {
            resetGameState();
            currentPage++;
            gameDisplay.page = getPage();
            gameDisplay.render();
        }
    }
}());