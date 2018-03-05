var CanvasNavigation = (function () {
    var navigation = new PointerEventsNavigation();
    var canvas, context;

    return {
        init: function(container, canvasId, width, height) {
            canvas = AppGI.createCanvas(container, canvasId, width, height);
            context = canvas.getContext('2d');
            this.setEventListeners();
            return canvas;
        },

        setEventListeners: function() {
            canvas.addEventListener('pointermove', navigation.onPointerMove, false);
            canvas.addEventListener('pointerdown', navigation.onPointerDown, false); 
            canvas.addEventListener('pointerup', navigation.onPointerUp, false); 
        },

        createButton: function(eventName, callbackFunction, buttonText, x, y, width, height, padding) {
            this.drawButton(x, y, width, height);
            if (padding) {
                this.writeMultilineText(buttonText, x, y, width, height, padding);
            } else {
                this.writeText(buttonText, x, y, width, height);
            }
            conditionFunction = navigation.regionHitConditionFunction(x, y, width, height);
            navigation.addCallback(eventName, callbackFunction, conditionFunction);
        },

        drawButton: function(x, y, width, height) {
            this.styleButton();
            context.beginPath();
            context.fillRect(x, y, width, height);
            context.closePath();
        },

        writeText: function(text, x, y, width, height) {
            this.styleText();
            context.beginPath();
            context.fillText(text, x + width / 2, y + height / 2);
            context.closePath();
        },

        // TODO: write a better multiline implementation
        // this implementation crams as many single words onto each line
        writeMultilineText: function(text, x, y, width, height, padding) {
            this.styleText();
            var textWidth = context.measureText(text).width;
            var lineTexts = [];
            var maxLines = Math.floor(height / (20 + padding));
            var words = text.split(' ');
            var begin = 0, end = 0;
            var maxWidth = width - (2 * padding);
            while (textWidth > maxWidth || end <= words.length) {
                do {
                    var newLine = words.slice(begin, ++end).join(' ').trim();
                    textWidth = context.measureText(newLine).width;
                } while(textWidth < maxWidth && end <= words.length);
                lineTexts.push(words.slice(begin, end - 1).join(' ').trim());
                begin = end - 1;
            }
            var avgHeight = Math.floor(height / lineTexts.length);
            for (var i = 0;i < lineTexts.length;i++) {
                this.writeText(lineTexts[i], x, y + i * avgHeight, width, avgHeight);
            };
        },

        styleButton: function() {
            context.fillStyle = 'black';
        },

        styleText: function() {
            context.font = '20px Times';
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
        },

        getCanvas: function() {
            return canvas;
        },
        
        getContext: function() {
            return context;
        }
    }
});