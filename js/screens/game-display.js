// TODO: figure out how to better handle different game modes
var GameDisplay = (function() {
    // Really need to move crap out of CanvasNavigation and put into AppGI
    var gameDisplay = new CanvasNavigation();
    var canvasId = 'backgroundCanvas';
    var gameState = window.gameState;
    var page;

    // handle audio eventually
    function renderAudio() {
        if (page.audio) {

        }
    }

    // handle background eventually
    function renderBackground() {
        if (page.background) {

        }
    }

    function renderQuestion(font) {
        if (page.question) {
            gameDisplay.styleText = function() { setTextStyle('30px ' + font); };
            gameDisplay.writeText(page.question, 0, 25, gameState.containerWidth, 50);
        }
    }

    function renderAnswer(x, y, font) {
        if (page.answer) {
            gameDisplay.styleText = function() { setTextStyle('50px Comic Sans MS'); };
            gameDisplay.writeText(page.answer, x, y, gameState.containerWidth, 50);
        }
    }

    function clearGameDisplay() {
        gameDisplay.getCanvas().background = null;
        context = gameDisplay.getContext();
        context.globalCompositeOperation = 'destination-out';
        context.fillRect(-10, -10, gameState.containerWidth + 20, gameState.containerHeight + 20, 'white');
        context.globalCompositeOperation = 'source-over';
    }

    function setTextStyle(font) {
        context = gameDisplay.getContext();
        context.font = font;
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    return {
        initialize: function() {
            gameDisplay.setEventListeners = function() {}
            canvas = gameDisplay.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            return canvas;
        },
        render: function(font) {
            clearGameDisplay();
            renderAudio();
            renderBackground();
            renderQuestion(font);
            if (gameState.gameMode === 'practiceMode') {
                renderAnswer(0, 150, font);
            }
        },    
        setPage: function(value) {
            page = value;
        }
    }
});