var GameMode = (function() {
    var gameMode = new CanvasNavigation();
    var canvasId = 'gameModeCanvas';
    var gameState = window.gameState;

    var buttonMethods = [];

    function drawSelectedPackageName() {
        var textStyle = gameMode.styleText;
        setTextStyle();
        gameMode.writeText(gameState.package.packageName, 0, 0, gameState.containerWidth, 50);
        gameMode.styleText = textStyle;
    }

    function setTextStyle(font, fill, align, baseline) {
        gameMode.styleText = function() {
            gameMode.getContext().font = font || '20px Times';
            gameMode.getContext().fillStyle = fill || 'black';
            gameMode.getContext().textAlign = align || 'center';
            gameMode.getContext().textBaseline = baseline || 'middle';
        }
    }

    function drawOptionButtons(option) {
        buttonMethods.forEach(function (buttonMethod) {
            var buttonStyle = gameMode.styleButton;

            if (gameState.getOption(buttonMethod.type) === buttonMethod.option) {
                gameMode.styleButton = function() {
                    gameMode.getContext().fillStyle = 'red';
                }
            }

            if (typeof option === 'undefined' || option === buttonMethod.option) {
                buttonMethod.function();
            }

            gameMode.styleButton = buttonStyle;            
        });
    }

    function optionCallback(option, value) {
        return function() {
            gameState.setOption(option, value);
            drawOptionButtons();
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
        gameMode.getContext().clearRect(475, 200, 200, 100);
        var textStyle = gameMode.styleText;
        setTextStyle('10px Times', 'red');
        var y = 225;
        issues.forEach(function(issue) {
            gameMode.writeText(issue, 475, y, 150, 20);
            y = y + 20;
        })
        gameMode.styleText = textStyle;
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
            buttonMethods.push( { type: 'gameMode', option: 'practiceMode', function: drawPracticeModeButton });
            buttonMethods.push( { type: 'gameMode', option: 'timedMode', function: drawTimedModeButton });
            buttonMethods.push( { type: 'randomize', option: true, function: drawRandomizePagesButton });
            buttonMethods.push( { type: 'difficulty', option: 'easyDifficulty', function: drawEasyDifficultyButton });
            buttonMethods.push( { type: 'difficulty', option: 'hardDifficulty', function: drawHardDifficultyButton });
    
            drawSelectedPackageName();
            drawOptionButtons();
            drawSelectPackageButton();
            drawStartGameButton();
            return [ gameMode.getCanvas() ];
        }
    }
}());