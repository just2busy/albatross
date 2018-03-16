function GameModeRenderer(page, layout) {
    this.gameState = window.gameState;
    this.canvasId = 'backgroundCanvas';
    this.canvas = CanvasRenderer.createCanvas(this.gameState.containerId, this.canvasId, this.gameState.containerWidth, this.gameState.containerHeight);
    this.context = this.canvas.getContext('2d');
    this.page = page;
    this.layout = layout;
    this.questionStyles = LayoutRenderer.getStyles(layout, 'question', 'textStyles');
    this.answerStyles = LayoutRenderer.getStyles(layout, 'answer', 'textStyles');
    this.times = {};
};

GameModeRenderer.prototype = {
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

    renderQuestion: function(questionStyles) {
        if (this.page.question) {
            var questionLayout = LayoutRenderer.getStyles(this.layout, null, 'question');
            CanvasRenderer.writeText(this.context, this.page.question, questionLayout.x, questionLayout.y, questionStyles,
                questionLayout.width, questionLayout.height);
        }
    },

    renderAnswer: function(answerStyles) {
        if (this.page.answer) {
            var answerLayout = LayoutRenderer.getStyles(this.layout, null, 'answer');
            CanvasRenderer.writeText(this.context, this.page.answer, answerLayout.x, answerLayout.y, answerStyles,
                answerLayout.width, answerLayout.height);
        }
    },

    // TODO: move timer display logic here;
    addTime: function(timeId, time) {
        this.times[timeId] = time;
    },

    clearTime: function(time) {
        CanvasRenderer.clearCircle(this.context, time.x, time.y, time.r + 1, time.circleStyles);
    },

    renderTimes: function() {
        Object.keys(this.times).forEach(function(timeId) {
            var time = this.times[timeId];
            if (time.display) {
                CanvasRenderer.drawCircle(this.context, time.x, time.y, time.r - 1, 0, Math.PI * 2, time.circleStyles);
                CanvasRenderer.writeText(this.context, time.time, time.x, time.y, time.textStyles);
            }
        }.bind(this));
    },

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

function PracticeModeRenderer(page, layout) {
    GameModeRenderer.call(this, page, layout);
};
PracticeModeRenderer.prototype = Object.create(GameModeRenderer.prototype);
PracticeModeRenderer.prototype.constructor = PracticeModeRenderer;
PracticeModeRenderer.prototype.render = function() {
    GameModeRenderer.prototype.render.call(this);
    this.renderQuestion(this.questionStyles);
    this.renderAnswer(this.answerStyles);
};

// What's the difference between Practice and Timed Mode if creating timers is delegated to game-controller?
function TimedModeRenderer(page, layout) {
    PracticeModeRenderer.call(this, page, layout);
};
TimedModeRenderer.prototype = Object.create(PracticeModeRenderer.prototype);
TimedModeRenderer.prototype.constructor = TimedModeRenderer;
TimedModeRenderer.prototype.render = function() {
    PracticeModeRenderer.prototype.render.call(this);
};

function QuizModeRenderer(page, layout) {
    GameModeRenderer.call(this, page, layout);
};
QuizModeRenderer.prototype = Object.create(GameModeRenderer.prototype);
QuizModeRenderer.prototype.constructor = QuizModeRenderer;
QuizModeRenderer.prototype.render = function() {
    GameModeRenderer.prototype.render.call(this);
    this.renderQuestion(this.questionStyles);
};

function JeopardyModeRenderer(page, layout) {
    GameModeRenderer.call(this, page, layout);
};
JeopardyModeRenderer.prototype = Object.create(GameModeRenderer.prototype);
JeopardyModeRenderer.prototype.constructor = JeopardyModeRenderer;
JeopardyModeRenderer.prototype.render = function() {
    GameModeRenderer.prototype.render.call(this);
    this.renderAnswer(this.questionStyles);
};