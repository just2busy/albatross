var PauseGame = (function() {
    var pauseGame = new CanvasNavigation();
    var canvasId = 'pauseGameCanvas';
    var gameState = window.gameState;;
    var width = gameState.containerWidth / 2, height = gameState.containerHeight / 1.5;

    function initialize() {
        var canvas = pauseGame.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
        drawBackground();
        return canvas;
    }

    function drawBackground() {
        var styles = [{property: 'fillStyle', value: 'white'},
            {property: 'strokeStyle', value: 'black'}];
        var x = (pauseGame.getCanvas().width - width) / 2;
        var y = (pauseGame.getCanvas().height - height) / 2;
        CanvasRenderer.drawRectangle(pauseGame.getContext(), x, y, width, height, styles);
    }

    function drawPageResults() {

    }

    function drawNextPageButton() {
        if (!gameState.gameOver) {
            var x = (pauseGame.getCanvas().width - width) / 2 + 75;
            var y = (pauseGame.getCanvas().height - height) / 2 + 15;
            pauseGame.createButton('advanceGameEvent', window.router.getRoute('advanceGame'), 'Next Page', x, y, 200, 50);
        }
    }

    function drawResumeGameButton() {
        var x = (pauseGame.getCanvas().width - width) / 2 + 75;
        var y = (pauseGame.getCanvas().height - height) / 2 + 15;
    pauseGame.createButton('resumeGameEvent', window.router.getRoute('resumeGame'), 'Resume Game', x, y, 200, 50);
    }

    function drawRestartGameButton() {
        var x = (pauseGame.getCanvas().width - width) / 2 + 75;
        var y = (pauseGame.getCanvas().height - height) / 2 + 75;
        pauseGame.createButton('restartGameEvent', window.router.getRoute('restartGame'), 'Restart Game', x, y, 200, 50);
    }

    function drawReturnMainMenuButton() {
        var x = (pauseGame.getCanvas().width - width) / 2 + 75;
        var y = (pauseGame.getCanvas().height - height) / 2 + 135;
        pauseGame.createButton('mainMenuEvent', function() {
            gameState.resetState();
            window.router.getRoute('mainMenu')();
        }, 'Return to Main Menu', x, y, 200, 50);
    }

    return {
        pauseGame: function() {
            var canvas = initialize();
            drawResumeGameButton();
            drawRestartGameButton();
            drawReturnMainMenuButton();
            return [ canvas ];
        },
        scoreGame: function() {
            var canvas = initialize();
            drawPageResults();
            drawNextPageButton();
            drawRestartGameButton();
            drawReturnMainMenuButton();
            return [ canvas ];
        }
    }
}());