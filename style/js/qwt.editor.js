
Z.$package('qwt.editor', function(z){
    var $visualToolWrap,

        cssparser,
    
        editorView,

        visualEditor;

    this.init = function(){
        $visualToolWrap = $('#visualToolWrap');
    
        cssparser = new CSSParser();
    
        editorView = new qwt.ui.EditorView({
            container: $visualToolWrap
        });

        $visualToolWrap.click(function(e){
            var target = z.dom.getActionTarget(e, -1, 'cmd', this);
            if(target){
                e.preventDefault();
                var cmd = target.getAttribute('cmd');
                execCommand(cmd, e, target);
            }
        });
    
    }
    
/*****************************************************************************************************/ 
/**************   ElementPicker   ********************************************************************/   
/*****************************************************************************************************/    
    var ElementPickker = z.define('class', {
        init: function(doc, onTrigger){
            var $el = this.$el = $('<div></div>').css({
                'box-sizing': 'border-box',
                'pointer-events': 'none',
                'position': 'absolute',
                'display': 'none',
                'border': 'red dotted 2px',
                'color': 'red',
                'z-index': '2147483647'
            }).appendTo(doc.body);
            var $doc = this.$doc = $(doc);
            var context = this;
            this._onMouseover = function(e){
                var target = e.target;
                var rect = target.getBoundingClientRect();
                $el.css({
                    'width': rect.width + 4 + 'px',
                    'height': rect.height + 4 + 'px',
                    'top': rect.top + $doc.scrollTop() - 2 + 'px',
                    'left': rect.left + $doc.scrollLeft() - 2 + 'px',
                    'display': 'block'
                });
            }
        
            this._onClick = function(e){
                context.unbind();
                context.selectedElement = e.target;
                onTrigger(e.target);
            }
        },
        
        hide: function(){
            this.$el.hide();
        },
        
        show: function(){
            this.$el.show();
        },
        
        bind: function(){
            if(this.hasBind){
                return;
            }
            this.hasBind = true;
            this.$doc.bind('mouseover', this._onMouseover);
            this.$doc.bind('click', this._onClick);
        },
    
        unbind: function(){
            if(!this.hasBind){
                return;
            }
            this.hasBind = false;
            this.$doc.unbind('mouseover', this._onMouseover);
            this.$doc.unbind('click', this._onClick);
        }
    });
/*****************************************************************************************************/ 
/**************   VisualEditor  **********************************************************************/   
/*****************************************************************************************************/    
    var VisualEditor = z.define('class', {
        statics: {
            createUid: (function(){
                var seed = 1;
                return function(){
                    var uid = 'qwt-uid-' /*+ (+new Date) + ''*/ + (seed++);
                    return uid;
                }
            })()
        }
    }, {
        init: function($iframe){
            var doc = $iframe.get(0).contentWindow.document;
            this.doc = doc;
            this.$iframe = $iframe;
            var context = this;
            
            this._onElementSelected = function(el){
                if(!el.hasAttribute('id')){
                    el.setAttribute('id', VisualEditor.createUid());
                }
                $visualToolWrap.empty();
                context.execute(el);
                context._isSelected = true;
                context._selectedEl = el;
            }
            
            // var cssCode = getStyleCode(doc);
            // var jsStyleSheets = cssparser.parse(cssCode, false, false);
            // this.styleSheets = jsStyleSheets;
            this.cssRules = preprocessSheets(doc.styleSheets[0]); //取第一个
            // console.log(this.cssRules);
            this.ready();
        },
        
        ready: function(){
            this.isReady = true;
            if(!this.picker){
                this.picker = new ElementPickker(this.doc, this._onElementSelected);
            }
        },
        isSelected: function(){
            return this._isSelected == true;
        },
        execute: function(el){
            this.picker.unbind();
            var elStyles = this.translate(el);
            // console.log(elStyles);
            var vStyles = this.combine(el.getAttribute('id'), elStyles);
            this.currentElStyles = this.grouping(vStyles);
            this.render(this.currentElStyles);
        },
        
        translate: function(el){
            var result = [], selectorText;
            for(var i = 0, rule; rule = this.cssRules[i]; i++){
                // rule.selectorText = rule.selectorText();
                selectorText = clearSelector(rule.selectorText);
                if(matchesSelector(el, selectorText)){
                    result.push(rule);
                }
            }
            return result;
        },
        
        combine: function(elId, elStyles){
            var vStyles = {};
            for(var i = 0, rule; rule = elStyles[i]; i++){
                if(rule.selectorText.indexOf(':hover') > -1){
                    mergeStyles(vStyles, elId + ':hover', rule.style);
                }else if(rule.selectorText.indexOf(':active') > -1){
                    mergeStyles(vStyles, elId + ':active', rule.style);
                }else{
                    mergeStyles(vStyles, elId, rule.style);
                }
            }
            return vStyles;
        },
        
        grouping: function(vStyles){
            var gvStyles = {};
            for(var i in vStyles){
                gvStyles[i] = groupStyles(vStyles[i]);
            }
            return gvStyles;
        },
        
        render: function(styles){
            editorView.clear();
            editorView.render(styles);
        },
        
        stringify: function(styles){
            var cssText = '';
            var group, style, value;
            for(var i in styles){
                group = styles[i];
                cssText += '#' + i + '{ \n';
                for(var j in group){
                    style = group[j];
                    for(var k in style){
                        value = style[k];
                        if(!value){
                            continue;
                        }
                        cssText += '    ' + k + ': ' + value + ';\n';
                    }
                }
                cssText += '} \n';
            }
            return cssText;
        },
        
        preview: function(){
            console.log(this.currentElStyles);
            var styles = editorView.getStyle();
            styles = this.grouping(styles);
            var currentStyles = $.extend({}, this.currentElStyles, styles);
            var styleNode = getVisualStyleNode(this.doc);
            var cssText = this.stringify(currentStyles);
            styleNode.innerHTML = cssText;
        }
    });
    
/*****************************************************************************************************/ 
/**************   static  method  ********************************************************************/   
/*****************************************************************************************************/
    
    var getStyleCode = function(doc){
        //约定只取最后一个
        var styleSheets = doc.getElementsByTagName('style');
        var value = null;
        if(styleSheets.length >= 1){
            var styleNode = styleSheets[styleSheets.length - 1];
            value = styleNode.innerHTML;
        }
        return value;
    }
    
    var getVisualStyleNode = function(doc){
        var styleSheets = doc.getElementsByTagName('style');
        var styleNode  = styleSheets[styleSheets.length - 1];
        if(styleSheets.length === 1 || !(styleNode.getAttribute('visual-style')) ){
            styleNode = doc.createElement('style');
            styleNode.type = 'text/css';
            styleNode.setAttribute('visual-style', 1);
            doc.getElementsByTagName('head')[0].appendChild(styleNode);
        }
        return styleNode;
    }
    
    /**
     * @return {Array}, CssRuleList
     **/
    var preprocessSheets = function(styleSheets){
        var result = [], ret;
        for(var i = 0, rule; rule = styleSheets.cssRules[i]; i++){
            ret = {};
            ret.selectorText = rule.selectorText;
            ret.style = {};
            result.push(ret);
            for(var j = 0, declar; declar = rule.style[j]; j++){
                ret.style[declar] = rule.style[declar];
            }
        }
        return result;
    }
    
    /**
     * 合并相同样式
     **/
    var mergeStyles = function(result, id, style1, style2/*...*/){
        var args = [result[id] || {}];
        for(var i = 2; i < arguments.length; i++){
            args.push(arguments[i]);
        }
        result[id] = $.extend.apply($, args);
        return result;
    }
    
    var groupStyles = function(style){
        var result = {};
        var key, dec;
        for(var declar in style){
            //去掉无效的初始值
//            if(!isValueSet(style[declar])){
//                continue;
//            }
            //去掉私有css3前缀
            dec = clearPrivatePrefix(declar);
            key = qwt.config.GROUPING_CONFIG[dec] || dec;
            
            result[key] ? 1 : result[key] = {};
            result[key][dec] = style[declar];
        }
        return result;
    }
    
    var isValueSet = function(value){
        return value !== 'initial';
    }
    
    //清理选择器, 去掉伪类
    var clearSelector = (function(){
        var PROPERTY_SELECTOR_REGEX = /\[[^\[\]]*\]/g;
        var CLEAR_SELECTOR_REGEX = /(:[^,\/]+?)( |,|$)/g;
        var CLEAR_UNWANT_COMMA_REGEX = /(^,(\s*,)*)|((,\s*)*,\s*$)/g;
        var PROPERTY_SELECTOR_CACHE_REGEX = /{%(\d+?)%}/g;
        
        return function(selector){
            var count = 1, cache = {};
            selector = selector.trim().replace(PROPERTY_SELECTOR_REGEX, function(m){
                var id = count++;
                cache[id] = m;
                return '{%' + id + '%}';;
            });
            selector = selector.replace(CLEAR_SELECTOR_REGEX, '$2');
            selector = selector.replace(CLEAR_UNWANT_COMMA_REGEX, '');
            selector = selector.replace(PROPERTY_SELECTOR_CACHE_REGEX, function(m, s){
                return cache[s];
            });
            return selector.trim();
        }
    })();
    
    //清理部分css3私有属性的前缀
    var clearPrivatePrefix = (function(){
        var PREFIX_REGEX = /^-(webkit|moz|ms|o)-/i;
        var PROP_WHITE_LIST = [
            //TODO  暂无白名单
        ];
        return function(prop){
            return prop.replace(PREFIX_REGEX, '');
        }
    })();
    
    var matchesSelector = function(el, selector){
        if($.browser.webkit){
            return el.webkitMatchesSelector(selector);
        }else if($.browser.msie){
            return el.msMatchesSelector(selector);
        }else if($.browser.mozilla){
            return el.mozMatchesSelector(selector);
        }else{
            throw new Error('the browser don\'t support a matchesSelector method');
        }
    }
    
    var combineSeparateProperty = function(properArr){
        if(properArr[1] == properArr[3]){
            properArr.splice(3,1);
            if(properArr[0] == properArr[2]){
                properArr.splice(2,1);
                if(properArr[0] == properArr[1]){
                    properArr.splice(1,1);
                }
            }
        }
        return properArr.join(' ');
    }
    
    var deleaveCombineProperty = function(properArr){
        var result;
        if(properArr.length == 0){
            result = ['', '', '', ''];
        }else if(properArr.length == 1){
            result = [properArr[0], properArr[0], properArr[0], properArr[0]];
        }else if(properArr.length == 2){
            result = [properArr[0], properArr[1], properArr[0], properArr[1]];
        }else if(properArr.length == 3){
            result = [properArr[0], properArr[1], properArr[2], properArr[1]];
        }else{//more than 4
            result = [];
            for(var i = 0; i < 4; i++){
                result.push($.trim(properArr[i]));
            }
        }
        return result;
    }
    
    var execCommand = function(cmd, event, element){
        var $el = $(element);
        switch(cmd){
            case 'expandProperty':
                $el.parent().parent().toggleClass('collapse');
                break;
            default:
                break;
        }
    }
    
    var execBlurAction = function(cmd, event, element){
        var $el = $(element);
        var param = $el.attr('param');
        switch(cmd){
            case 'updateMergeProperty':
                var $li = $el.parents('li.' + param);
                var $separates = $li.find('input.' + param);
                var combine = $separates.splice(0, 1)[0];
                var propertyArr = [];
                for(var i = 0; i < $separates.length; i++){
                    propertyArr.push($separates.eq(i).val());
                }
                combine.value = combineSeparateProperty(propertyArr);
                break;
            case 'updateSeparateProperty':
                var $li = $el.parents('li.' + param);
                var $separates = $li.find('input.' + param);
                var combine = $separates.splice(0, 1)[0];
                var propertyArr = $.trim(combine.value).split(' ');
                if(propertyArr.length > 4){
//                    alert('属性值不合法');
//                    combine.focus();
                    return;
                }
                propertyArr = deleaveCombineProperty(propertyArr);
                for(var i = 0; i < $separates.length; i++){
                    $separates.eq(i).val(propertyArr[i]);
                }
                break;
            default:
                break;
        }
    }
    
    
    
/*****************************************************************************************************/ 
/**************   init  method  ********************************************************************/   
/*****************************************************************************************************/       
    
    this.loadVisualEditor = function($iframe){
        if(visualEditor && visualEditor.$iframe == $iframe){
            visualEditor.picker.show();
        }else{
            visualEditor = new VisualEditor($iframe);
            editorView.clear();
        }
        visualEditor.picker.bind();
    }
    
    this.cancelVisualEditor = function(){
        visualEditor.picker.unbind();
        visualEditor.picker.hide();
        // visualEditor = null;
    }
    
    this.previewAdjust = function(){
        if(visualEditor && visualEditor.isSelected()){
            visualEditor.preview();
        }
    }
    
    
    var onInputBlur = function(e){
        var target = e.target;
        if(target.tagName !== 'INPUT'){
            return;
        }
        var cmd = target.getAttribute('cmd');
        if(cmd){
            execBlurAction(cmd, e, target);
        }
    };
    /****TODO 先不做合并样式修改的功能, 逻辑太多了
     * //jq 封装的 blur 不支持捕捉
    if(document.addEventListener){
        $visualToolWrap[0].addEventListener('blur', onInputBlur, true);
    }else{
        $visualToolWrap[0].attachEvent('onfocusout', onInputBlur);
    }*/
    
});
//******* end of qwt.main
