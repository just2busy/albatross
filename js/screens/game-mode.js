var GameMode = (function() {
    var gameMode = new CanvasNavigation();
    var canvasId = 'gameModeCanvas';
    var gameState = window.gameState;

    var defaultButtonStyles = [{property: 'fillStyle', value: 'black'}];
    var defaultTextStyles = [{property: 'font', value: '30px Comic Sans MS'},
        {property: 'fillStyle', value: 'black'},
        {property: 'textAlign', value: 'center'},
        {property: 'textBaseline', value: 'middle'}];
    var buttonStyles = defaultButtonStyles;
    var textStyles = defaultTextStyles;

    var buttonMethods = [];

    function drawSelectedPackageName() {
        CanvasRenderer.writeText(gameMode.getContext(), gameState.package.packageName, gameMode.getCanvas().width / 2, 25, textStyles);
    }

    function drawOptionButtons(type) {
        buttonMethods.forEach(function (buttonMethod) {
            buttonStyles = defaultButtonStyles;
            if (gameState.getOption(buttonMethod.optionType) === buttonMethod.optionValue) {
                buttonStyles = [{property: 'fillStyle', value: 'red'}];
            }
            gameMode.setButtonStyles(buttonStyles);

            if (typeof type === 'undefined' || type === buttonMethod.optionType) {
                buttonMethod.function();
            }
        });
        gameMode.setButtonStyles(defaultButtonStyles);
    }

    function optionCallback(type, value) {
        return function() {
            gameState.setOption(type, value);
            drawOptionButtons(type);
        }
    }

    // Make sure a mode and difficulty were picked
    function gameStartCallback() {
        var issues = gameState.validate();
        if (issues.length === 0) {
            window.router.getRoute('game')();
        } else {
            writeValidationMessages(issues);
        }
    }

    function writeValidationMessages(issues) {
        CanvasRenderer.clearRectangle(gameMode.getContext(), 475, 200, 200, 100);
        var textStyles = [{property: 'font', value: '10px Comic Sans MS'},
            {property: 'fillStyle', value: 'red'},
            {property: 'textAlign', value: 'left'},
            {property: 'textBaseline', value: 'middle'}];
        var y = 225;
        issues.forEach(function(issue) {
            CanvasRenderer.writeText(gameMode.getContext(), issue, 475, y, textStyles);
            y = y + 20;
        });
    }

    function drawPracticeModeButton() {
        gameMode.createButton('practiceModeEvent', optionCallback('gameMode', PracticeModeRenderer), 'Practice', 50, 50, 150, 50);
    }

    function drawTimedModeButton() {
        gameMode.createButton('timedModeEvent', optionCallback('gameMode', TimedModeRenderer), 'Timed', 50, 125, 150, 50);
    }

    function drawQuizModeButton() {
        gameMode.createButton('quizModeEvent', optionCallback('gameMode', QuizModeRenderer), 'Quiz', 275, 50, 150, 50);
    }

    function drawJeopardyModeButton() {
        gameMode.createButton('jeopardyModeEvent', optionCallback('gameMode', JeopardyModeRenderer), 'Jeopardy', 275, 125, 150, 50);
    }

    function drawRandomizePagesButton() {
        gameMode.createButton('randomizeEvent', optionCallback('randomize', !gameState.randomize), 'Randomize', 500, 50, 150, 50);
    }

    var calculateMaxPages = function(x, y) {
        var maxPages = Math.max(Math.ceil((x - 500) / 150 * gameState.package.pages.length),1);
        maxPages = maxPages > gameState.package.pages.length ? gameState.package.pages.length : maxPages;
        gameState.setOption('maxPages', maxPages);
        drawMaxPagesSlider();
    }

    function drawMaxPagesSlider() {
        var topLeftX = gameState.maxPages / gameState.package.pages.length * 150 + 490;

        var textStyles = [{property: 'font', value: '20px Comic Sans MS'},
            {property: 'fillStyle', value: 'black'},
            {property: 'textAlign', value: 'center'},
            {property: 'textBaseline', value: 'top'}];
        var text = 'Max Pages: ' + gameState.maxPages;
        gameMode.createSlider('maxPagesSliderEvent', calculateMaxPages, text, topLeftX, 500, 125, 150, 50, textStyles, defaultButtonStyles);
    }

    function drawSelectPackageButton() {
        gameMode.createButton('selectPackageEvent', window.router.getRoute('selectPackage'), 'Go Back', 50, 225, 150, 50);
    }

    function drawStartGameButton() {
        gameMode.createButton('startGameEvent', gameStartCallback, 'Start Game', 275, 225, 150, 50);
    }

    return {
        initialize: function() {
            gameMode.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            buttonMethods.push( { optionType: 'gameMode', optionValue: PracticeModeRenderer, function: drawPracticeModeButton });
            buttonMethods.push( { optionType: 'gameMode', optionValue: TimedModeRenderer, function: drawTimedModeButton });
            buttonMethods.push( { optionType: 'gameMode', optionValue: QuizModeRenderer, function: drawQuizModeButton });
            buttonMethods.push( { optionType: 'gameMode', optionValue: JeopardyModeRenderer, function: drawJeopardyModeButton });
            buttonMethods.push( { optionType: 'randomize', optionValue: true, function: drawRandomizePagesButton });
            buttonMethods.push( { optionType: 'maxPages', optionValue: gameState.package.pages.length, function: drawMaxPagesSlider });
    
            drawSelectedPackageName();
            drawOptionButtons();
            drawSelectPackageButton();
            drawStartGameButton();
            return [ gameMode.getCanvas() ];
        }
    }
}());