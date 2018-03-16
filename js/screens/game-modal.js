var GameModal = (function() {
    var gameModal = new CanvasNavigation();
    var canvasId = 'gameModalCanvas';
    var gameState = window.gameState;;
    var width = gameState.containerWidth / 2, height = gameState.containerHeight / 1.5;

    function initialize() {
        var canvas = gameModal.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
        drawBackground();
        return canvas;
    }

    function drawBackground() {
        var styles = {
            fillStyle: 'rgba(255,255,255,1)',
            strokeStyle: 'rgba(0,0,0,1)'
        };
        var x = (gameModal.getCanvas().width - width) / 2;
        var y = (gameModal.getCanvas().height - height) / 2;
        CanvasRenderer.drawRectangle(gameModal.getContext(), x, y, width, height, styles);
    }

    function drawPageResults() {

    }

    function drawNextPageButton() {
        if (!gameState.gameOver) {
            var x = (gameModal.getCanvas().width - width) / 2 + 75;
            var y = (gameModal.getCanvas().height - height) / 2 + 15;
            gameModal.createButton('advanceGameEvent', window.router.getRoute('advanceGame'), 'Next Page', x, y, 200, 50);
        }
    }

    function drawResumeGameButton() {
        var x = (gameModal.getCanvas().width - width) / 2 + 75;
        var y = (gameModal.getCanvas().height - height) / 2 + 15;
        gameModal.createButton('resumeGameEvent', window.router.getRoute('resumeGame'), 'Resume Game', x, y, 200, 50);
    }

    function drawRestartGameButton() {
        var x = (gameModal.getCanvas().width - width) / 2 + 75;
        var y = (gameModal.getCanvas().height - height) / 2 + 75;
        gameModal.createButton('restartGameEvent', window.router.getRoute('restartGame'), 'Restart Game', x, y, 200, 50);
    }

    function drawReturnMainMenuButton() {
        var x = (gameModal.getCanvas().width - width) / 2 + 75;
        var y = (gameModal.getCanvas().height - height) / 2 + 135;
        gameModal.createButton('mainMenuEvent', function() {
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