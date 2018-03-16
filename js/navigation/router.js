var Router = (function() {
    var routes = [];
    var currentZIndex = 0, breadCrumbs = [];
    var keyEventHandlers = {};

    document.addEventListener('keyup', onKeyUp, false);

    function onKeyUp(event) {
        console.log(this);
        var key = event.keyCode;
        var keyEventHandler = keyEventHandlers[window.router.getCurrentRoute()];
        if (keyEventHandler) {
            if (keyEventHandler[key]) {
                keyEventHandler[key]();
            }
        }
    }

    function cleanup() {
        var backtrack = false;
        do {
            var currentRoute = breadCrumbs.pop();
            backtrack = false;
            routes.some(function(route) {
                if (route.elements && route.routeName === currentRoute) {
                    if(route.hideOnExit) {
                        route.elements.forEach(function (element) {
                            element.style.display = 'none';
                        });
                    }
                    if (route.destroyOnExit && route.destroyOnExit(route.elements)) {
                        backtrack = true;
                        delete route.elements;
                    } else {
                        breadCrumbs.push(currentRoute);
                    }
                    return true;
                }
            });
        } while(breadCrumbs.length && backtrack);
    }

    function executeRoute(routeName) {
        var prebuilt = true;
        routes.some(function (route) {
            if (route.routeName === routeName) {
                if (breadCrumbs.length) {
                    cleanup();
                }
                if (!route.elements) {
                    prebuilt = false;
                    route.elements = route.callback();
                    if (!route.elements) {
                        return true;
                    }
                }
                breadCrumbs.push(routeName);
                route.elements.forEach(function (element) {
                    if (prebuilt) {
                        element.style.display = 'block';
                    }
                    element.style.zIndex = currentZIndex++;
                });
                return true;
            }
        });
    }

    return {
        addKeyEvents: function(route, key, callback) {
            if(!keyEventHandlers[route]) {
                keyEventHandlers[route] = {};
            }
            keyEventHandlers[route][key] = callback;
        },

        addRoute: function(routeName, callback, hideOnExit, destroyOnExit) {
            routes.push({
                routeName: routeName,
                callback: callback,
                hideOnExit: hideOnExit,
                destroyOnExit: destroyOnExit
            });
        },

        getRoute: function (routeName) {
            return function() {
                executeRoute(routeName);
            }
        },

        removeRoute: function(routeName) {
            routes = routes.filter(function (element) {
                return element.routeName !== routeName;
            });
        },

        getCurrentRoute: function() {
            return breadCrumbs[breadCrumbs.length - 1];
        },

        listBreadCrumbs: function() {
            console.log(breadCrumbs);
        }
    }
});

(function() {
    window.router = new Router();
})();