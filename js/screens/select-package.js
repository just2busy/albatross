var SelectPackage = (function () {
    var selectPackage = new CanvasNavigation();
    var canvasId = 'selectPackageCanvas';

    var gameState = window.gameState;
    var packagesLocation;
    var packages = [];
    var packagesLoaded = 0;
    var packagesPerRow = 3;
    var displayedRows = 2;

    // TODO: convert from local files to single server API call
    function renderPackages() {
        packagesLocation = packagesLocation || "data/packages.json";
        $.when($.getJSON(packagesLocation, function(data) {
            data.packages.forEach(function(packageLocation) {
                $.getJSON(packageLocation, function(package) {
                    packages.push(package);
                });
            });
        })).then(function() {
            for(var i = 0; i < packagesPerRow * displayedRows && i < packages.length; i++) {
                renderPackageButton(i);
            }
        });
    }

    function renderPackageButton(packageIndex) {
        var width = gameState.containerWidth / packagesPerRow - 15 * packagesPerRow;
        var height = gameState.containerHeight / displayedRows - 15 * displayedRows;

        var x = packageIndex % packagesPerRow * (width + 15) + 15;
        var y = Math.floor(packageIndex / packagesPerRow) * (height + 15) + 15;
        selectPackage.createButton('loadPackage' + packageIndex + 'Event', function () {
                gameState.package = packages[packageIndex];
                gameState.setOption('maxPages', gameState.package.pages.length);
                window.router.getRoute('gameMode')();
            },
        packages[packageIndex].packageName, x, y, width, height, 10);
    }

    return {
        // TODO: add swipe gesture navigation for scrolling
        initialize: function() {
            selectPackage.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            renderPackages();
            return [ selectPackage.getCanvas() ];
        },
        setPackagesLocation: function(packagesLocation) {
            this.packagesLocation = packagesLocation;
        }
    };
}());