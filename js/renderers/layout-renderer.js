var LayoutRenderer = (function() {
    var defaultLayoutLocation = "data/default-layout.json";
    var defaultLayouts, defaultLayout;

    function findRendererLayout(rendererName){
        var layoutObject = defaultLayouts.find(function(layout) {
            return layout.renderer === rendererName;
        });
        return layoutObject ? layoutObject.layout ? layoutObject.layout : {} : {};
    }

    function buildFontProperty(styles) {
        if (styles.font) {
            styles.font = styles.font.fontSize + ' ' + styles.font.fontFamily;
        }
    }

    function getNestedProperty(layout, id, styleType) {
        var property = layout;
        if (id) {
            var path = id.split('.');
            for (var i = 0;i < path.length;i++) {
                property = property[path[i]];
            }
        }
        return property[styleType] ? property[styleType] : {};
    }

    $.when($.getJSON(defaultLayoutLocation, function(data) {
        defaultLayouts = data.gameModeRenderers;
    })).then(function() {
        defaultLayout = findRendererLayout('GameModeRenderer');
    });        

    return {
        buildLayout: function(rendererName, packageCustomRendererLayout) {
            // Copy the default layout into a new object
            var layout = Object.assign({}, JSON.parse(JSON.stringify(defaultLayout)));
            // Copy the default overriding laytout into a new object
            var overridingLayout = Object.assign({}, JSON.parse(JSON.stringify(findRendererLayout(rendererName))));
            // Override the default layout with the custom values
            return Object.assign(layout, overridingLayout, packageCustomRendererLayout);
        },

        getStyles: function(layout, id, styleType) {
            var styles = Object.assign({}, JSON.parse(JSON.stringify(getNestedProperty(layout, null, styleType))));
            styles = Object.assign(styles, JSON.parse(JSON.stringify(getNestedProperty(layout, id, styleType))));
            buildFontProperty(styles);
            return styles;
        }
    }
}());