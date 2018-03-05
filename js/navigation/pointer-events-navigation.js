var PointerEventsNavigation = (function() {
    var isActive, initialX, initialY;
    var callbackFunctions = [];

    function resetState() {
        isActive = false;
        initialX = null;
        initialY = null;
    }

    function executeCallbacks(currentX, currentY) {
        return callbackFunctions.some(function (callbackFunction) {
            if(callbackFunction.conditionFunction(currentX, currentY)) {
                callbackFunction.callbackFunction();
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
                executeCallbacks(event.offsetX, event.offsetY);
                resetState();
            }
        },

        onPointerDown: function(event) {
            isActive = true;
            initialX = event.offsetX;
            initialY = event.offsetY;
        },

        onPointerMove: function(event) {
            if (isActive) {
                if (executeCallbacks(event.offsetX, event.offsetY)) {
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
        // conditionFunction should take the currentX and currentY values to determine.
        addCallback: function(eventName, callbackFunction, conditionFunction) {
            // remove existing callback if exists
            this.removeCallback(eventName);
            return callbackFunctions.push({
                eventName: eventName,
                callbackFunction: callbackFunction,
                conditionFunction: conditionFunction
            });
        },

        removeCallback: function(eventName) {
            callbackFunctions = callbackFunctions.filter(function(callbackFunction) {
                return callbackFunction.eventName !== eventName;
            });
        }
    }
});