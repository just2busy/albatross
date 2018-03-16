var GameController = (function(){
    var gameScreen = new CanvasNavigation();
    var gameState, availablePages = [], currentPage = 0;
    var layout, timers = {}, gameDisplay, gameDisplayTimerId;
    var drawingStarted = false, enableDraw = false, scoring = false;
    var writingCanvas, writingCanvasId = 'drawingCanvas', context;

    function initDrawingCanvas() {
        writingCanvas = gameScreen.init(gameState.containerId, writingCanvasId, gameState.containerWidth, gameState.containerHeight);
        context = gameScreen.getContext();
        initializeDrawingArea();
        drawScoreButton();
        return writingCanvas;
    }

    function drawScoreButton() {
        gameScreen.createButton('scoreEvent', calculateScore, 'Score Writing', 275, 245, 150, 50, 0, true);
    }

    function initializeDrawingArea() {
        var drawingLayout = layout.drawing;
        // draw a button first then clear it to get the region hit
        gameScreen.createButton('drawingEvent', drawOnWritingCanvas, '', drawingLayout.x, drawingLayout.y, drawingLayout.width, drawingLayout.height, 0, true);
        clearWritingCanvas();
    }

    function drawOnWritingCanvas(x, y, isActive) {
        if (!scoring) {
            if (isActive) {
                var drawingStyles = LayoutRenderer.getStyles(layout, 'drawing', 'drawingStyles');
                CanvasRenderer.setContextStyle(context, drawingStyles);
                if (!drawingStarted) {
                    drawingStarted = true;
                    startTimers();
                }
                if (enableDraw) {
                    context.lineTo(x, y); 
                    context.stroke(); 
                } else {
                    enableDraw = true;
                    context.beginPath(); 
                    context.moveTo(x, y);
                }
            } else {
                if (drawingStarted) {
                    if (enableDraw) {
                        context.closePath();
                        enableDraw = false;
                    }
                }    
            }
        }
    }

    function pauseGame() {
        if (enableDraw) {
            context.closePath();
            enableDraw = false;
        }
        gameState.paused = true;
        stopTimers();
        window.router.getRoute('pauseGame')();
        gameScreen.resetState();
    }

    function clearWritingCanvas() {
        var drawingLayout = layout.drawing;
        CanvasRenderer.clearRectangle(context, drawingLayout.x, drawingLayout.y, drawingLayout.width, drawingLayout.height);
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
                time.time = timeRemaining;
                if (timeRemaining <= 0) {
                    time.time = 0;
                    calculateScore();
                }
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

    function startTimers() {
        Object.keys(timers).forEach(function(timerId) {
            var timer = timers[timerId];
            if (timer.time.renderMode !== 'hidden') {
                timer.time.display = true;
            }
            if (timer.time.totalTime || drawingStarted) {
                timer.timer.restartTimer();
            } else {
                timer.timer.startTimer();
            }
        });
        gameDisplayTimerId = setInterval(gameDisplay.renderTimes.bind(gameDisplay), 100);
    }

    function stopTimers(destroy) {
        Object.keys(timers).forEach(function(timerId) {
            var timer = timers[timerId];
            if (destroy) {
                timer.timer.destroy();
                timer.time.display = false;
                gameDisplay.clearTime(timer.time);
            } else {
                if (timer.time.totalTime) {
                    timer.timer.lapTimer();
                }
                timer.timer.stopTimer();
            }
        });
        setTimeout(function() {clearInterval(gameDisplayTimerId);}, 100);
        gameDisplayTimerId = null;
    }

    // drawing finished! time to score and update
    function calculateScore() {
        console.log(this);
        gameState.paused = true;
        scoring = true;
        if (currentPage === gameState.maxPages - 1) {
            gameState.gameOver = true;
        }
        stopTimers();

        var drawingLayout = layout.drawing;
        console.log('Time Stamp: ' + Date.now() + ' ElapsedTime: ' + timers['ElapsedTime'].timer.getTime());
        var results = ComputerVision.compareImages(
            gameDisplay.getAnswerImageData(gameState.preferences.fontColor),
            context.getImageData(drawingLayout.x, drawingLayout.y, drawingLayout.width, drawingLayout.height),
            drawingLayout.width,
            drawingLayout.height,
            gameState.difficulty
        );
        console.log(results);

        window.router.getRoute('scoreGame')();
    }

    function resetGameState(destroy) {
        scoring = false;
        drawingStarted = false;
        enableDraw = false;
        gameState.gameOver = false;
        clearWritingCanvas();
        stopTimers(destroy);
    }

    return {
        initialize: function() {
            gameState = window.gameState;    

            initializeGameDisplay();

            writingCanvas = initDrawingCanvas();
            return [ gameDisplay.canvas, writingCanvas ];
        },
        restartGame: function() {
            resetGameState(true);
        },
        destroy: function(elements) {
            if (gameState.paused) {
                return false;
            }
            scoring = false;
            drawingStarted = false;
            enableDraw = false;
            gameState.resetState();
            stopTimers();
            timers = {};
            return CanvasRenderer.destroy(elements);
        },
        resumeGame: function() {
            gameState.paused = false;
            if (drawingStarted) {
                startTimers();
            }
        },
        advanceGame: function() {
            resetGameState();
            currentPage++;
            gameDisplay.page = getPage();
            gameDisplay.render();
        },
        addKeyEvents: function() {
            window.router.addKeyEvents('game', 80, pauseGame);
        }
    }
}());