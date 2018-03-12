// TODO: figure out how to better handle different game modes
var GameDisplay = (function() {
    var canvasId = 'backgroundCanvas', canvas;
    var gameState = window.gameState;
    var page;
    var defaultTextStyles = [{property: 'font', value: '50px Comic Sans MS'},
        {property: 'fillStyle', value: 'black'},
        {property: 'textAlign', value: 'center'},
        {property: 'textBaseline', value: 'middle'}];
    var textStyles = defaultTextStyles;

    function getContext() {
        return canvas.getContext('2d');
    }

    // handle audio eventually -- probably pull this out into GameController
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
            CanvasRenderer.writeText(getContext(), page.question, canvas.width / 2, 25, textStyles);
        }
    }

    function renderAnswer(x, y, font) {
        if (page.answer) {
            CanvasRenderer.writeText(getContext(), page.answer, canvas.width / 2, canvas.height / 2, textStyles);
        }
    }

    function clearGameDisplay() {
        canvas.background = null;
        CanvasRenderer.clearRectangle(getContext(), 0, 0, canvas.width, canvas.height);
    }

    return {
        initialize: function() {
            canvas = CanvasRenderer.createCanvas(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
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