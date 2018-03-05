var GameTimer = (function() {
    var gameTimer = new CanvasNavigation();
    var canvasId = 'gameTimerCanvas';
    var context;
    var gameState = window.gameState;
    var timeStarted, waitTime = 5000, timeStopped, timerElapsedId, timerRemainingId;
    var timeElapsedX = 50, timeElapsedY = 50, timeElapsedRadius = 20;
    var timeRemainingX = 650, timeRemainingY = 50, timeRemainingRadius = 20;

    function clearIntervals() {
        clearInterval(timerElapsedId || 0);
        clearInterval(timerRemainingId || 0);
        timerElapsedId = 0;
        timerRemainingId = 0;
    }

    function timeElapsedTimer() {
        var diff=Date.now()-timeStarted;
        drawTimeElapsedCircle(diff);
    }

    function createDiv(divId) {
        return AppGI.createElement(gameState.containerId, divId, 'div');
    }

    function drawCircle(x, y, r, start, end, color) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, r, start, end, false);
        context.closePath();
        context.fill();
    }

    function clearTimeElapsed() {
        timeStarted = null;
        context.globalCompositeOperation = 'destination-out';
        drawCircle(timeElapsedX, timeElapsedY, timeElapsedRadius + 2, 0, Math.PI * 2, 'white');
        context.globalCompositeOperation = 'source-over';
    }

    function clearTimeRemaining() {
        timeStopped = null;
        context.globalCompositeOperation = 'destination-out';
        drawCircle(timeRemainingX, timeRemainingY, timeRemainingRadius + 2, 0, Math.PI * 2, 'white');
        context.globalCompositeOperation = 'source-over';
    }

    function drawTimeElapsed(time, x, y, r, color) {
        time = time / 1000;
        time = time.toFixed(1);
        drawCircle(x, y, r - 1, 0, Math.PI * 2, color);
        gameTimer.writeText(time, x, y, 0, 0);
    }

    function drawTimeElapsedCircle(timeElapsed) {
        var color = 'black';
        drawTimeElapsed(timeElapsed, timeElapsedX, timeElapsedY, timeElapsedRadius, color);
    }

    function drawTimeRemainingCircle(timeLeft) {
        if (typeof timeLeft === 'undefined') {
            clearTimeRemaining();
        } else {
            var percent = 1 - timeLeft / waitTime;
            var color = 'rgba('+Math.floor(255 * percent)+',0,0,1)';
            drawTimeElapsed(timeLeft, timeRemainingX, timeRemainingY, timeRemainingRadius, color);
        }
    }

    // So setInterval can't be used in public functions that reference private functions
    startTimeElapsedTimer = function() {
        timeStarted = Date.now();
        timerElapsedId = setInterval(timeElapsedTimer, 100);
    }

    startTimeRemainingTimer = function(onTimerExpiredCallback) {
        timeStopped = Date.now();

        function f() {
            var timeLeft = waitTime+timeStopped-Date.now();
            if (timeLeft < 0) {
                clearIntervals();
                drawTimeElapsedCircle(timeStopped-timeStarted);
                setTimeout(function() {
                    onTimerExpiredCallback({
                        timeStopped: timeStopped,
                        timeStarted: timeStarted
                    }); 
                }, 100);
                timeLeft = 0;
            }
            drawTimeRemainingCircle(timeLeft);
        }
        timerRemainingId = setInterval(f, 100);
    }

    restartTimeElapsedTimer = function() {
        timeStarted = Date.now() - timeStopped + timeStarted;
        timerElapsedId = setInterval(timeElapsedTimer, 100);
    }

    return {
        initialize: function() {
            gameTimer.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            context = gameTimer.getContext();
            context.styleText = function() {
                context.font = '10px Times';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
            }
            return gameTimer.getCanvas();
        },
        restart: function() {
            clearTimeElapsed();
            clearTimeRemaining();
            clearIntervals();
        },
        destroy: function() {
            clearIntervals();
        },
        startElapsedTimer: function() {startTimeElapsedTimer();},
        startRemainingTimer: function(onTimerExpiredCallback) {
            startTimeRemainingTimer(onTimerExpiredCallback);
        },
        restartElapsedTimer: function() {
            restartTimeElapsedTimer();
            clearTimeRemaining();
        },
        stopTimeRemainingTimer: function() {
            clearTimeRemaining();
            clearInterval(timerRemainingId);
            timerRemainingId = 0;
        },
        setStartTime: function() {
            timeStarted = Date.now();
        },
        setStoppedTime: function() {
            timeStopped = Date.now();
        }
    }
});