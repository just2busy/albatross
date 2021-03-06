var Preferences = (function() {
    var preferences = new CanvasNavigation();
    var canvasId = 'preferencesCanvas'
    var gameState = window.gameState;

    var defaultButtonStyles = { 
        fillStyle: 'rgba(0,0,0,1)',
        strokeStyle: 'rgba(0,0,0,1)'
    };
    var defaultTextStyles = {
        font: '30px Times',
        fillStyle: 'rgba(255,255,255,1)',
        strokeStyle: 'rgba(255,255,255,1)',
        textAlign: 'center',
        textBaseline: 'middle'
    };

    var buttonMethods = [];

    // should probably move these types of default settings into a config file/local storage
    var font = 'Comic Sans MS';
    var fontColor = 'rgba(255,0,0,1)';

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
            match_threshold: ['Match Limit', 1, 100],
            number_points: ['Match Points', 50, 2000]
        };
 
    function drawOptionButtons(type) {
        buttonMethods.forEach(function (buttonMethod) {
            buttonStyles = Object.assign({}, defaultButtonStyles);
            if (gameState.getOption(buttonMethod.optionType).name === buttonMethod.optionValue.name) {
                buttonStyles = Object.assign(buttonStyles,{
                    fillStyle: 'rgba(255,0,0,1)',
                    strokeStyle: 'rgba(255,0,0,1)'
                });
            }
            preferences.setButtonStyles(buttonStyles);

            if (typeof type === 'undefined' || type === buttonMethod.optionType) {
                buttonMethod.function();
            }
        });
        preferences.setButtonStyles(defaultButtonStyles);
    }

    function clearCenterArea() {
        CanvasRenderer.clearRectangle(preferences.getContext(), 225, 20, 250, 200);
    }

    function optionCallback(type, value) {
        return function() {
            clearCenterArea();
            gameState.setOption(type, value);
            drawOptionButtons(type);
        }
    }

    // set writing preferences
    // writing color, font 
    function drawChooseFontButton() {
        preferences.createButton('chooseFontEvent', function() {
            optionCallback('font', font)();
        }, 'Font', 50, 25, 150, 50);
    }

    function drawChooseFontColorButton() {
        preferences.createButton('chooseFontColorEvent', function() {
            optionCallback('fontColor', fontColor)();
            drawColorPicker();
        }, 'Font Color', 50, 100, 150, 50);
    }

    function drawColorPicker() {
    }

    // set tts voice
    function drawCustomVoiceButton() {
        preferences.createButton('customVoiceEvent', function() {
            optionCallback('voiceSettings', '')();
            
        }, 'Customize Voice', 50, 175, 150, 50);
    }

    // set difficulty preferences
    function drawEasyDifficultyButton() {
        preferences.createButton('easyDifficultyEvent', optionCallback('difficulty', easyDifficulty), 'Easy Difficulty', 500, 25, 150, 50);
    }

    function drawHardDifficultyButton() {
        preferences.createButton('hardDifficultyEvent', optionCallback('difficulty', hardDifficulty), 'Hard Difficulty', 500, 100, 150, 50);
    }

    function drawCustomDifficultyButton() {
        preferences.createButton('customDifficultyEvent', function() {
            optionCallback('difficulty', customDifficulty)();
            drawCustomDifficultySliders();
        }, 'Custom Difficulty', 500, 175, 150, 50);
    }

    // Fix the knob calculation so that it doesn't extend beyond the slider width
    function createSliderCallbackFunction(eventName, propertyName, leftBound, topBound, width, height) {
        var drawCustomSlider = function(x, y) {
            var property = difficultyRanges[propertyName];
            var textValue = property[0], minValue = property[1], maxValue = property[2];
            var value = Math.max(Math.ceil((x - leftBound) / width * (maxValue - minValue) + minValue), minValue);
            value = value > maxValue ? maxValue : value;
            customDifficulty[propertyName] = value;
            var knobX = value / maxValue * width + leftBound;
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
        var textStyles = Object.assign({}, defaultTextStyles);
        textStyles = Object.assign(textStyles, {
            font: '15px Comic Sans MS',
            fillStyle: 'rgba(0,0,0,1)',
            strokeStyle: 'rgba(0,0,0,1)',
            textBaseline: 'top'
        });
        preferences.createSlider(eventName, eventCallback, sliderText, knobX, x, y, width, height, textStyles, defaultButtonStyles);
    }

    function drawReturnMainMenuButton() {
        preferences.createButton('mainMenuEvent', window.router.getRoute('mainMenu'), 'Return to Main Menu', 250, 240, 200, 50);
    }

    // link device to account
    function drawLinkDeviceButton() {
        preferences.createButton('linkDeviceEvent', function() {
            clearCenterArea();
            // Make a call to link device to account
            displayLinkCode('PLACEHOLDER');
        }, 'Link Device', 50, 240, 150, 50);
    }

    function displayLinkCode(linkDeviceCode) {
        var textStyles = Object.assign({}, defaultTextStyles);
        textStyles = Object.assign(textStyles, {
            font: '30px Times',
            fillStyle: 'rgba(0,0,0,1)',
            strokeStyle: 'rgba(0,0,0,1)'
        });
        CanvasRenderer.writeText(preferences.getContext(), linkDeviceCode, gameState.containerWidth / 2, gameState.containerHeight / 2.25, textStyles);
    }

    return {
        initialize: function() {
            var canvas = preferences.init(gameState.containerId, canvasId, gameState.containerWidth, gameState.containerHeight);
            buttonMethods.push( { optionType: 'font', optionValue: font, function: drawChooseFontButton });
            buttonMethods.push( { optionType: 'fontColor', optionValue: fontColor, function: drawChooseFontColorButton });
            buttonMethods.push( { optionType: 'voiceSettings', optionValue: '', function: drawCustomVoiceButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: easyDifficulty, function: drawEasyDifficultyButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: hardDifficulty, function: drawHardDifficultyButton });
            buttonMethods.push( { optionType: 'difficulty', optionValue: customDifficulty, function: drawCustomDifficultyButton });

            drawOptionButtons();
            drawLinkDeviceButton();
            drawReturnMainMenuButton();
            return [ canvas ];
        }
    }
}());