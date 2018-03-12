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
        var textStyles = [{property: 'font', value: '20px Comic Sans MS'},
            {property: 'fillStyle', value: 'red'},
            {property: 'textAlign', value: 'left'},
            {property: 'textBaseline', value: 'middle'}];
        var y = 225;
        issues.forEach(function(issue) {
            CanvasRenderer.writeText(issue, 475, y, textStyles);
            y = y + 20;
        })
    }

    function drawPracticeModeButton() {
        gameMode.createButton('practiceModeEvent', optionCallback('gameMode', 'practiceMode'), 'Practice', 50, 50, 150, 50);
    }

    function drawTimedModeButton() {
        gameMode.createButton('timedModeEvent', optionCallback('gameMode', 'timedMode'), 'Timed', 50, 150, 150, 50);
    }

    function drawRandomizePagesButton() {
        gameMode.createButton('randomizeEvent', optionCallback('randomize', !gameState.randomize), 'Randomize', 275, 50, 150, 50);
    }

    function drawEasyDifficultyButton() {
        gameMode.createButton('easyDifficultyEvent', optionCallback('difficulty', 'easyDifficulty'), 'Easy Difficulty', 475, 50, 150, 50);
    }

    function drawHardDifficultyButton() {
        gameMode.createButton('hardDifficultyEvent', optionCallback('difficulty', 'hardDifficulty'), 'Hard Difficulty', 475, 150, 150, 50);
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
            buttonMethods.push( { optionType: 'gameMode', optionValue: 'practiceMode', function: drawPracticeModeButton });
            buttonMethods.push( { optionType: 'gameMode', optionValue: 'timedMode', function: drawTimedModeButton });
            buttonMethods.push( { optionType: 'randomize', optionValue: true, function: drawRandomizePagesButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: 'easyDifficulty', function: drawEasyDifficultyButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: 'hardDifficulty', function: drawHardDifficultyButton });
    
            drawSelectedPackageName();
            drawOptionButtons();
            drawSelectPackageButton();
            drawStartGameButton();
            return [ gameMode.getCanvas() ];
        }
    }
}());