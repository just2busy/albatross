var AppGI = (function() {
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

        destroy: function(elements) {
            elements.forEach(function(element) {
                document.getElementById(element.id).parentElement.removeChild(element);
                delete element;
            });
            return true;
        }
    }
}());