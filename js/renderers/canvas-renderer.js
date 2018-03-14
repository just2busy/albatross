var CanvasRenderer = (function() {
    function setContextStyle(context, styles) {
        if (styles) {
            styles.forEach(function(style) {
                context[style.property] = style.value;
            });
        }
    }

    function determineX(x, width, textStyles, textMargin) {
        var align = textStyles.filter(function (style) {
            return style.property === 'textAlign';
        })[0].value;
        var newX;
        switch (align) {
            case 'left': newX = x + textMargin; break;
            case 'center': newX = x + width / 2;break;
            case 'right': newX = x + width - textMargin; break;
        }
        return newX;
    }

    function determineY(y, height, textStyles, textMargin) {
        var baseline = textStyles.filter(function (style) {
            return style.property === 'textBaseline';
        })[0].value;
        var newY;
        switch (baseline) {
            case 'top': newY = y + textMargin; break;
            case 'middle': newY = y + height / 2; break;
            case 'bottom': newY = y + height - textMargin; break;
        }
        return newY;
    }

    return {
        createElement: function(containerId, elementId, elementType) {
            var element = document.createElement(elementType);
            element.id = elementId;
            document.getElementById(containerId).appendChild(element);
            return element;
        },

        createCanvas: function(containerId, canvasId, width, height) {
            var canvas = this.createElement(containerId, canvasId, 'canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.classList.add('canvasContainer');
            return canvas;
        },

        createButton: function(context, buttonText, x, y, width, height, buttonStyles, textStyles, textMargin) {
            this.drawRectangle(context, x, y, width, height, buttonStyles);
            var lineTexts = this.createMultilineText(context, buttonText, width, textStyles, textMargin || 0);
            var avgHeight = Math.floor(height / lineTexts.length);
            var textX = determineX(x, width, textStyles, textMargin);
            var textY = determineY(y, avgHeight, textStyles, textMargin);
            for(var i = 0;i < lineTexts.length; i++) {
                this.writeText(context, lineTexts[i], textX, textY + i * avgHeight, textStyles);
            }
        },

        drawCircle: function(context, x, y, r, start, end, styles) {
            setContextStyle(context, styles);
            context.beginPath();
            context.arc(x, y, r, start, end);
            context.fill();
            context.closePath();
        },    

        drawRectangle: function(context, x, y, width, height, styles) {
            setContextStyle(context, styles);
            context.beginPath();
            context.fillRect(x, y, width, height);
            context.strokeRect(x, y, width, height);
            context.closePath();
        },

        drawSlider: function(context, text, knobX, x, y, width, height, textStyles, sliderStyles) {
            this.clearRectangle(context, x - 5, y - 5, width + 10, height + 10);
            var textX = determineX(x, width, textStyles, 0);
            var textY = determineY(y, height, textStyles, 0);
            this.writeText(context, text, textX, textY, textStyles);
            this.drawRectangle(context, x, y + height - 10, width, 5, sliderStyles);
            this.drawRectangle(context, knobX, y + height - 15, 5, 15, sliderStyles);
        },

        writeText: function(context, text, x, y, styles) {
            setContextStyle(context, styles);
            context.beginPath();
            context.fillText(text, x, y);
            context.closePath();
        },

        // TODO: write a better multiline implementation
        // this implementation crams as many single words onto each line
        createMultilineText: function(context, text, maxWidth, styles, textMargin) {
            setContextStyle(context, styles);
            var textWidth = context.measureText(text).width;
            var lineTexts = [];
            var words = text.split(' ');
            var begin = 0, end = 0;
            maxWidth = maxWidth - textMargin - textMargin;
            while (textWidth > maxWidth || end <= words.length) {
                do {
                    var newLine = words.slice(begin, ++end).join(' ').trim();
                    textWidth = context.measureText(newLine).width;
                } while(textWidth < maxWidth && end <= words.length);
                lineTexts.push(words.slice(begin, end - 1).join(' ').trim());
                begin = end - 1;
            }
            return lineTexts;
        },

        clearCircle: function(context, x, y, r, styles) {
            context.globalCompositeOperation = 'destination-out';
            this.drawCircle(context, x, y, r, 0, Math.PI * 2, styles);
            context.globalCompositeOperation = 'source-over';    
        },

        clearRectangle: function(context, x, y, width, height) {
            // context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.clearRect(x, y, width, height);
            context.closePath();
            // context.globalCompositeOperation = 'source-over';    
        },

        destroy: function(elements) {
            elements.forEach(function(element) {
                document.getElementById(element.id).parentElement.removeChild(element);
                delete element;
            });
            return true;
        }
    }
}());