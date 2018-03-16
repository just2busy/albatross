var PointerEventsNavigation = (function() {
    var isActive, initialX, initialY;
    var callbackFunctions = [], currentCallbackFunction;

    function resetState() {
        isActive = false;
        initialX = null;
        initialY = null;
        currentCallbackFunction = null;
    }

    function findCallbackFunction(currentX, currentY) {
        return callbackFunctions.some(function (callbackFunction) {
            if(callbackFunction.conditionFunction(currentX, currentY)) {
                currentCallbackFunction = callbackFunction;
                return true;
            }
        });
    }

    function swipeConditionFunction(minXChange, minYChange) {
        return function(currentX, currentY) {
            return isActive && (initialX - x > minXChange || initialY - y > minYChange);
        };
    }

    return {
        onPointerUp: function(event) {
            if (isActive) {
                var x = event.offsetX, y = event.offsetY;
                if(currentCallbackFunction.conditionFunction(x, y)) {
                    currentCallbackFunction.callbackFunction(x, y, false);
                }
                resetState();
            }
        },

        onPointerDown: function(event) {
            if (findCallbackFunction(event.offsetX, event.offsetY)) {
                isActive = true;
                initialX = event.offsetX;
                initialY = event.offsetY;
            }
        },

        onPointerMove: function(event) {
            if (isActive && currentCallbackFunction && currentCallbackFunction.callIfActive) {
                var x = event.offsetX, y = event.offsetY;
                if(currentCallbackFunction.conditionFunction(x, y)) {
                    currentCallbackFunction.callbackFunction(x, y, isActive);
                } else {
                    currentCallbackFunction.callbackFunction(x, y, false);
                    resetState();
                }
            }
        },

        regionHitConditionFunction: function(topLeftX, topLeftY, width, height) {
            return function(x, y) {
                return topLeftX <= x && x <= topLeftX + width && topLeftY <= y && y <= topLeftY + height;
            };
        },

        // Add a callback function to execute if a specific condition is met.
        // conditionFunction should take the initialX and initialY values to determine.
        addCallback: function(eventName, callbackFunction, conditionFunction, callIfActive) {
            // remove existing callback if exists
            this.removeCallback(eventName);
            callbackFunctions.push({
                eventName: eventName,
                callbackFunction: callbackFunction,
                conditionFunction: conditionFunction,
                callIfActive: callIfActive || false
            });
        },

        removeCallback: function(eventName) {
            callbackFunctions = callbackFunctions.filter(function(callbackFunction) {
                return callbackFunction.eventName !== eventName;
            });
        },

        resetState: resetState
    }
});