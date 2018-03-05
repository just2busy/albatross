var PauseGame = (function() {
    var pauseGame = new CanvasNavigation();
    var canvasId = 'pauseGameCanvas';
    var gameState = window.gameState;;

    function initialize() {
        var canvas = pauseGame.init(gameState.containerId, canvasId, gameState.containerWidth / 2, gameState.containerHeight / 1.5);
        canvas.classList.remove('canvasContainer');
        canvas.classList.add('pauseGameCanvas');
        drawBackground(gameState.containerWidth / 2, gameState.containerHeight / 1.5);
        return canvas;
    }

    function drawBackground(width, height) {
        var buttonStyle = pauseGame.styleButton;
        pauseGame.styleButton = function() { pauseGame.getContext().fillStyle = 'white' };
        pauseGame.drawButton(0, 0, width, height);
        pauseGame.styleButton = buttonStyle;
    }

    function drawPageResults() {

    }

    function drawNextPageButton() {
        if (!gameState.gameOver) {
            pauseGame.createButton('advanceGameEvent', window.router.getRoute('advanceGame'), 'Next Page', 75, 15, 200, 50);
        }
    }

    function drawResumeGameButton() {
        pauseGame.createButton('resumeGameEvent', window.router.getRoute('resumeGame'), 'Resume Game', 75, 15, 200, 50);
    }

    function drawRestartGameButton() {
        pauseGame.createButton('restartGameEvent', window.router.getRoute('restartGame'), 'Restart Game', 75, 75, 200, 50);

    }

    function drawReturnMainMenuButton() {
        pauseGame.createButton('mainMenuEvent', function() {
            gameState.resetState();
            window.router.getRoute('mainMenu')();
        }, 'Return Main Menu', 75, 135, 200, 50);
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