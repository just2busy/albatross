function GameModeRenderer(page) {
    this.gameState = window.gameState;
    this.canvasId = 'backgroundCanvas';
    this.canvas = CanvasRenderer.createCanvas(this.gameState.containerId, this.canvasId, this.gameState.containerWidth, this.gameState.containerHeight);
    this.context = this.canvas.getContext('2d');
    this.page = page;
    this.questionStyles = this.buildTextStyles();
    this.answerStyles = this.buildTextStyles();
    this.timerStyles = this.buildTextStyles();
};

GameModeRenderer.prototype = {
    buildTextStyles: function(fontSize, font, fontColor, align, baseline) {
        return [{property: 'font', value: (fontSize || '50') + 'px ' + (font || 'Comic Sans MS')},
            {property: 'fillStyle', value: fontColor || 'black'},
            {property: 'textAlign', value: align || 'center'},
            {property: 'textBaseline', value: baseline || 'middle'}];
    },

    renderAudio: function() {
        if (this.page.audio) {

        }
    },

    renderBackground: function() {
        if (this.page.background) {
            this.canvas.style.backgroundImage = 'url("' + this.page.background + '")';
            this.canvas.style.backgroundRepeat = 'no-repeat';
            this.canvas.style.backgroundSize = this.canvas.width + 'px ' + this.canvas.height + 'px';
        }
    },

    renderQuestion: function(x, y) {
        if (this.page.question) {
            CanvasRenderer.writeText(this.context, this.page.question, x, y, this.questionStyles);
        }
    },

    renderAnswer: function(x, y) {
        if (this.page.answer) {
            CanvasRenderer.writeText(this.context, this.page.answer, x, y, this.answerStyles);
        }
    },

    // TODO: move timer display logic here;
    renderElapsedTime: function() {
    },

    renderRemainingTime: function() {},

    render: function() {
        this.clearGameDisplay();
        this.renderAudio();
        this.renderBackground();
    },

    renderScore: function() {},

    clearGameDisplay: function() {
        delete this.canvas.style.backgroundImage;
        delete this.canvas.style.backgroundRepeat;
        delete this.canvas.style.backgroundSize;
        CanvasRenderer.clearRectangle(this.context, 0, 0, this.canvas.width, this.canvas.height);
    }
}

function PracticeModeRenderer(page) {
    GameModeRenderer.call(this, page);
};
PracticeModeRenderer.prototype = Object.create(GameModeRenderer.prototype);
PracticeModeRenderer.prototype.constructor = PracticeModeRenderer;
PracticeModeRenderer.prototype.render = function() {
    GameModeRenderer.prototype.render.call(this);
    this.renderQuestion(this.canvas.width / 2, 25);
    this.renderAnswer(this.canvas.width / 2, this.canvas.height / 2);
    this.renderElapsedTime();
};

function TimedModeRenderer(page) {
    PracticeModeRenderer.call(this, page);
};
TimedModeRenderer.prototype = Object.create(PracticeModeRenderer.prototype);
TimedModeRenderer.prototype.constructor = TimedModeRenderer;
TimedModeRenderer.prototype.render = function() {
    PracticeModeRenderer.prototype.render.call(this);
};

function QuizModeRenderer(page) {
    GameModeRenderer.call(this, page);
};
QuizModeRenderer.prototype = Object.create(GameModeRenderer.prototype);
QuizModeRenderer.prototype.constructor = QuizModeRenderer;
QuizModeRenderer.prototype.render = function() {
    GameModeRenderer.prototype.render.call(this);
    this.renderQuestion(this.canvas.width / 2, 25, this.questionStyles);
};

function JeopardyModeRenderer(page) {
    GameModeRenderer.call(this, page);
};
JeopardyModeRenderer.prototype = Object.create(GameModeRenderer.prototype);
JeopardyModeRenderer.prototype.constructor = JeopardyModeRenderer;
JeopardyModeRenderer.prototype.render = function() {
    GameModeRenderer.prototype.render.call(this);
    this.renderAnswer(this.canvas.width / 2, 25, this.questionStyles);
};