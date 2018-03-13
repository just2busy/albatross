var Preferences = (function() {
    var preferences = new CanvasNavigation();
    var canvasId = 'preferencesCanvas'
    var gameState = window.gameState;

    var defaultButtonStyles = [{property: 'fillStyle', value: 'black'}];
    var defaultTextStyles = [{property: 'font', value: '30px Comic Sans MS'},
        {property: 'fillStyle', value: 'black'},
        {property: 'textAlign', value: 'center'},
        {property: 'textBaseline', value: 'middle'}];
    var buttonStyles = defaultButtonStyles;
    var textStyles = defaultTextStyles;

    var buttonMethods = [];
    // temporary settings until right numbers are determined
    var easyDifficulty = { name: 'easy',
            blur_size: 3,
            lap_thres: 1,
            eigen_thres: 1,
            match_threshold: 40,
            number_points: 2000
        }, hardDifficulty = { name: 'hard',
            blur_size: 2,
            lap_thres: 10,
            eigen_thres: 10,
            match_threshold: 40,
            number_points: 2000
        }, customDifficulty = { name: 'custom',
            blur_size: 2,
            lap_thres: 10,
            eigen_thres: 10,
            match_threshold: 40,
            number_points: 2000
        };
    var difficultyRanges = { blur_size: ['Blur Size', 1, 9],
            lap_thres: ['Laplacian Limit', 1, 40],
            eigen_thres: ['Eigen Limit', 1, 40],
            match_threshold: ['Match Threshold', 1, 100],
            number_points: ['Match Points', 50, 2000]
        };
 
    function drawOptionButtons(type) {
        buttonMethods.forEach(function (buttonMethod) {
            buttonStyles = defaultButtonStyles;
            if (gameState.getOption(buttonMethod.optionType).name === buttonMethod.optionValue.name) {
                buttonStyles = [{property: 'fillStyle', value: 'red'}];
            }
            preferences.setButtonStyles(buttonStyles);

            if (typeof type === 'undefined' || type === buttonMethod.optionType) {
                buttonMethod.function();
            }
        });
        preferences.setButtonStyles(defaultButtonStyles);
    }

    function optionCallback(type, value) {
        return function() {
            gameState.setOption(type, value);
            drawOptionButtons(type);
        }
    }

    // set writing preferences
    // writing color, font 
    function drawColorPicker() {
    }

    // set tts voice
    
    // set difficulty preferences
    function drawEasyDifficultyButton() {
        preferences.createButton('easyDifficultyEvent', optionCallback('difficulty', easyDifficulty), 'Easy Difficulty', 500, 25, 150, 50);
    }

    function drawHardDifficultyButton() {
        preferences.createButton('hardDifficultyEvent', optionCallback('difficulty', hardDifficulty), 'Hard Difficulty', 500, 100, 150, 50);
    }

    function drawCustomDifficultyButton() {
        preferences.createButton('customDifficultyEvent', function() {
                drawCustomDifficultySliders();
                optionCallback('difficulty', customDifficulty)();
            }, 'Custom Difficulty', 500, 175, 150, 50);
    }

    function createSliderCallbackFunction(eventName, propertyName, leftBound, topBound, width, height) {
        var drawCustomSlider = function(x, y) {
            var property = difficultyRanges[propertyName];
            var textValue = property[0], minValue = property[1], maxValue = property[2];
            var value = Math.max(Math.ceil((x - leftBound) / width * (maxValue - minValue) + minValue), minValue);
            value = value > maxValue ? maxValue : value;
            customDifficulty[propertyName] = value;
            var knobX = value / maxValue * width + leftBound - 10;
            var sliderText = textValue + ': ' + value;
            drawSlider(eventName, drawCustomSlider, sliderText, knobX, leftBound, topBound, width, height);
        }
        return drawCustomSlider;
    }

    function drawCustomDifficultySliders() {
        createSliderCallbackFunction('blurSliderEvent', 'blur_size', 275, 25, 150, 30)(300, 25);
        createSliderCallbackFunction('lapThresSliderEvent', 'lap_thres', 275, 65, 150, 30)(300, 75);
        createSliderCallbackFunction('eigenThresSliderEvent', 'eigen_thres', 275, 105, 150, 30)(300, 125);
        createSliderCallbackFunction('matchThresSliderEvent', 'match_threshold', 275, 145, 150, 30)(300, 175);
        createSliderCallbackFunction('numPointsSliderEvent', 'number_points', 275, 185, 150, 30)(300, 225);
    }

    function drawSlider(eventName, eventCallback, sliderText, knobX, x, y, width, height) {
        var textStyles = [{property: 'font', value: '15px Comic Sans MS'},
            {property: 'fillStyle', value: 'black'},
            {property: 'textAlign', value: 'center'},
            {property: 'textBaseline', value: 'top'}];
        preferences.createSlider(eventName, eventCallback, sliderText, knobX, x, y, width, height, textStyles, defaultButtonStyles);
    }

    function drawReturnMainMenuButton() {
        preferences.createButton('mainMenuEvent', window.router.getRoute('mainMenu'), 'Return to Main Menu', 250, 240, 200, 50);
    }

    // link device to account
    function drawLinkDeviceButton() {}

    return {
        initialize: function() {
            var canvas = preferences.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            buttonMethods.push( { optionType: 'difficulty', optionValue: easyDifficulty, function: drawEasyDifficultyButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: hardDifficulty, function: drawHardDifficultyButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: customDifficulty, function: drawCustomDifficultyButton });

            drawOptionButtons();
            drawReturnMainMenuButton();
            return [ canvas ];
        }
    }
}());