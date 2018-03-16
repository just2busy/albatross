var StopWatch = function(startCallback, stopCallback) {
    var timerId;
    var start = startCallback, stop = stopCallback;
    var startTime, stopTime;
    var lapTimes = [];

    function startInterval(offset) {
        startTime = Date.now() + (offset || 0);
        stopTime = null;
        timerId = setInterval(function() {
            start(getTime());
        }, 100);
    }

    function stopInterval() {
        stopTime = Date.now();
        stop(getTime());
        clearInterval(timerId);
    }

    function getTime() {
        var time = stopTime ? stopTime - startTime : Date.now() - startTime;
        return time ? time : 0;
    }

    return {
        startTimer: function() {
            startInterval();
        },

        stopTimer: function() {
            stopInterval();
        },

        restartTimer: function() {
            var offset = startTime - stopTime;
            if (lapTimes.length) {
                offset = -lapTimes[lapTimes.length - 1];
            }
            startInterval(offset);
        },

        lapTimer: function() {
            lapTimes.push(this.getTime());
        },

        getLapTimes: function() {
            return lapTimes;
        },

        getTime: getTime,

        destroy: function() {
            startTime = null;
            stopTime = null;
            lapTimes.splice(0, lapTimes.length);
            clearInterval(timerId);
        }
    }
};