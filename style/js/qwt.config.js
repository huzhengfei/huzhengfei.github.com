Z.$package('qwt.config', function(z){

    //样式分组映射
    var groupingMap = {       
        'background': [
            'background-attachment',
            'background-clip',
            'background-color',
            'background-image',
            'background-origin',
            'background-position-x',
            'background-position-y',
            'background-repeat-x',
            'background-repeat-y'
        ],
        'border': [
            'border-bottom-color',
            'border-bottom-style',
            'border-bottom-width',
            'border-left-color',
            'border-left-style',
            'border-left-width',
            'border-right-color',
            'border-right-style',
            'border-right-width',
            'border-top-color',
            'border-top-style',
            'border-top-width'
        ],
        'border-radius': [
            'border-bottom-left-radius',
            'border-bottom-right-radius',
            'border-top-left-radius',
            'border-top-right-radius'
        ],
        'font': [
            'font-family',
            'font-size',
            'font-style',
            'font-weight'
        ],
        'padding': [
            'padding-top',
            'padding-bottom',
            'padding-left',
            'padding-right'
        ],
        'margin': [
            'margin-top',
            'margin-bottom',
            'margin-left',
            'margin-right'
        ],
        'layout': [
            'position',
            'float',
            'display',
            'top',
            'bottom',
            'left',
            'right'
        ],
        'box': [
            'width',
            'height'
        ],
        'text': [
            'text-decoration',
            'text-shadow',
            'text-transform',
            'text-align',
            'white-space',
            'line-height',
            'vertical-align',
            'color'
        ],
        'transition': [
            'transition-delay',
            'transition-duration',
            'transition-property',
            'transition-timing-function'
        ],
        'tranform': [
            'tranform',
            'tranform-origin'
        ],
        'outline': [
            'outline-bottom-color',
            'outline-bottom-style',
            'outline-bottom-width',
            'outline-left-color',
            'outline-left-style',
            'outline-left-width',
            'outline-right-color',
            'outline-right-style',
            'outline-right-width',
            'outline-top-color',
            'outline-top-style',
            'outline-top-width'
        ]
    };
    
    this.GROUPING_CONFIG = (function(){
        var result = {};
        for(var i in groupingMap){
            for(var j in groupingMap[i]){
                result[groupingMap[i][j]] = i;
            }
        }
        return result;
    })();
    
    this.ADJUSTER_SUPPORT = [
        'border',
        'outline',
        'padding',
        'margin',
        'background',
        'border-radius',
        'font',
        'text',
        'layout',
        'box',
        'transition',
        'transform'
    ];
    
});
//end
