var MainMenu = (function() {
    var mainMenu = new CanvasNavigation();
    var canvasId = 'mainMenuCanvas';

    function drawSelectPackageButton() {
        mainMenu.createButton('selectPackageEvent', window.router.getRoute('selectPackage'), 'Select Package', 50, 50, 150, 50);
    }

    // TODO: create preferences menu
    function drawPreferencesButton() {
        mainMenu.createButton('setPreferencesEvent', window.router.getRoute('setPreferences'), 'Preferences', 50, 150, 150, 50);
    }

    return {
        initialize: function() {
            var gameState = window.gameState;
            var canvas = mainMenu.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            drawSelectPackageButton();
            drawPreferencesButton();
            return [ canvas ];
        }
    }
}());