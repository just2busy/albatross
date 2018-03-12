var GameController = (function(){
    var elapsedTimerStarted = false, remainingTimerId = 0;
    var drawingStarted = false;
    var enableDraw = false;
    var writingCanvas, writingCanvasId = 'drawingCanvas', context;
    var gameState, availablePages = [], currentPage = 0;
    var gameDisplay, gameTimer;

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
        enableDraw = true;
        context.beginPath();
        if (!elapsedTimerStarted) {
            elapsedTimerStarted = true;
            gameTimer.startElapsedTimer();
        }
        gameTimer.stopTimeRemainingTimer();
    }

    function onPointerUp(event) {
        if (drawingStarted) {
            if (enableDraw) {
                context.closePath();
                enableDraw = false;
            }
            drawingStarted = false;
            gameTimer.startRemainingTimer(onTimerExpiredCallback);
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
                    gameTimer.setStoppedTime();
                    gameTimer.destroy(); // Only clears intervals but should probably change
                    window.router.getRoute('pauseGame')();
                    break;
            }
        }
    }

    function clearWritingCanvas() {
        context.globalCompositeOperation = 'destination-out';
        context.fillRect(-10, -10, gameState.containerWidth + 20, gameState.containerHeight + 20, 'white');
        context.globalCompositeOperation = 'source-over';
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
    
    function configureGameDisplay() {
        generatePages();
        gameDisplay = new GameDisplay();
        gameDisplay.setPage(getPage());
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

    // drawing finished! time to score and update
    function onTimerExpiredCallback(timingData) {
        gameState.paused = true;
        if (currentPage === availablePages.length) {
            gameState.gameOver = true;
        }
        console.log(timingData);
        var results = ComputerVision.compareImages(
            getAnswerImageData(),
            context.getImageData(0, 0, gameState.containerWidth, gameState.containerHeight),
            gameState.containerWidth,
            gameState.containerHeight
        );
        console.log(results);
        window.router.getRoute('scoreGame')();
    }

    function resetGameState() {
        elapsedTimerStarted = false;
        drawingStarted = false;
        enableDraw = false;
        gameState.gameOver = false;
        clearWritingCanvas();
        gameTimer.restart();
}

    return {
        initialize: function() {
            gameState = window.gameState;    

            currentPage = 0;
            configureGameDisplay();
            var backgroundCanvas = gameDisplay.initialize();
            gameDisplay.render(gameState.preferences.font);

            gameTimer = new GameTimer();
            var gameTimerCanvas = gameTimer.initialize();
            writingCanvas = initDrawingCanvas();
            return [ backgroundCanvas, gameTimerCanvas, writingCanvas ];
        },
        restartGame: function() {
            resetGameState();
        },
        destroy: function(elements) {
            if (gameState.paused) {
                return false;
            }
            elapsedTimerStarted = false;
            drawingStarted = false;
            enableDraw = false;
            gameState.resetState();
            gameTimer.destroy();
            return CanvasRenderer.destroy(elements);
        },
        resumeGame: function() {
            gameState.paused = false;
            gameTimer.restartElapsedTimer();
        },
        advanceGame: function() {
            resetGameState();
            currentPage++;
            gameDisplay.setPage(getPage());
            gameDisplay.render(gameState.preferences.font);
        }
    }
}());