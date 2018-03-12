var GameTimer = (function() {
    var gameTimer = new CanvasNavigation();
    var canvasId = 'gameTimerCanvas';
    var gameState = window.gameState;
    var timeStarted, waitTime = 5000, timeStopped, timerElapsedId, timerRemainingId;
    var timeElapsedX = 50, timeElapsedY = 50, timeElapsedRadius = 20;
    var timeRemainingX = 650, timeRemainingY = 50, timeRemainingRadius = 20;

    var defaultCircleStyles = [{property: 'fillStyle', value: 'black'}];
    var defaultTextStyles = [{property: 'font', value: '10px Comic Sans MS'},
        {property: 'fillStyle', value: 'white'},
        {property: 'textAlign', value: 'center'},
        {property: 'textBaseline', value: 'middle'}];
    var circleStyles = defaultCircleStyles;
    var textStyles = defaultTextStyles;

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

    function clearTimeElapsed() {
        timeStarted = null;
        CanvasRenderer.clearCircle(gameTimer.getContext(), timeElapsedX, timeElapsedY, timeElapsedRadius, circleStyles);
    }

    function clearTimeRemaining() {
        timeStopped = null;
        CanvasRenderer.clearCircle(gameTimer.getContext(), timeRemainingX, timeRemainingY, timeRemainingRadius, circleStyles);
    }

    function drawTimeElapsed(time, x, y, r, circleStyles) {
        time = time / 1000;
        time = time.toFixed(1);
        CanvasRenderer.drawCircle(gameTimer.getContext(), x, y, r - 1, 0, Math.PI * 2, circleStyles);
        CanvasRenderer.writeText(gameTimer.getContext(), time, x, y, textStyles);
    }

    function drawTimeElapsedCircle(timeElapsed) {
        drawTimeElapsed(timeElapsed, timeElapsedX, timeElapsedY, timeElapsedRadius, circleStyles);
    }

    function drawTimeRemainingCircle(timeLeft) {
        if (typeof timeLeft === 'undefined') {
            clearTimeRemaining();
        } else {
            var percent = 1 - timeLeft / waitTime;
            var circleStyles = [{property: 'fillStyle', value: 'rgba('+Math.floor(255 * percent)+',0,0,1)'}];
            drawTimeElapsed(timeLeft, timeRemainingX, timeRemainingY, timeRemainingRadius, circleStyles);
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