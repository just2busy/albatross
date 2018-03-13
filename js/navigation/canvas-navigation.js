var CanvasNavigation = (function () {
    var navigation = new PointerEventsNavigation();
    var canvas, context;

    var defaultButtonStyles = [{property: 'fillStyle', value: 'black'}];
    var defaultTextStyles = [{property: 'font', value: '20px Times'},
        {property: 'fillStyle', value: 'white'},
        {property: 'textAlign', value: 'center'},
        {property: 'textBaseline', value: 'middle'}];
    var buttonStyles = defaultButtonStyles;
    var textStyles = defaultTextStyles;

    return {
        init: function(container, canvasId, width, height) {
            canvas = CanvasRenderer.createCanvas(container, canvasId, width, height);
            context = canvas.getContext('2d');
            this.setEventListeners();
            return canvas;
        },

        setEventListeners: function() {
            canvas.addEventListener('pointermove', navigation.onPointerMove, false);
            canvas.addEventListener('pointerdown', navigation.onPointerDown, false); 
            canvas.addEventListener('pointerup', navigation.onPointerUp, false); 
        },

        createSlider: function(eventName, callbackFunction, sliderText, knobX, x, y, width, height, textStyles, sliderStyles) {
            CanvasRenderer.drawSlider(context, sliderText, knobX, x, y, width, height, textStyles, sliderStyles);
            conditionFunction = navigation.regionHitConditionFunction(x, y + height - 15, width, 15);
            navigation.addCallback(eventName, callbackFunction, conditionFunction, true);
        },

        createButton: function(eventName, callbackFunction, buttonText, x, y, width, height, textMargin) {
            CanvasRenderer.createButton(context, buttonText, x, y, width, height, buttonStyles, textStyles, textMargin);
            conditionFunction = navigation.regionHitConditionFunction(x, y, width, height);
            navigation.addCallback(eventName, callbackFunction, conditionFunction);
        },

        setButtonStyles: function(styles) {
            buttonStyles = styles;
        },

        setTextStyles: function(styles) {
            textStyles = styles;
        },

        getCanvas: function() {
            return canvas;
        },
        
        getContext: function() {
            return context;
        }
    }
});