    
Z.$package('qwt.ui', function(z){
    var packageContext = this;
    
    var AdjusterInterface = z.define('interface', {
        name: 'AdjusterInterface'
    }, [
        'render',
        'clear',
        'destory'
    ]);
    
    var AdjusterBase = z.define('class', {
        name: 'AdjusterBase',
        'implements': [AdjusterInterface]
    }, {//prototype
        init: function(){
            this.items = [];
        },
        render: function(){
            throw new Error('render isn\'t implemented');
        },
        add: function(item){
            this.items.push(item);
        },
        clear: function(){
            if(this.$el){
                this.$el.empty();
                this.$el.remove();
            }
            if(this.items){
                var item;
                while(item = this.items.pop()){
                    item.destory();
                }
            }
        },
        destory: function(){
            this.clear();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    
    //*****************************************
    //** EditorView
    //*****************************************
    var EditorView = z.define('class', {
        name: 'EditorView',
        extend: AdjusterBase
    }, {//prototype
        init: function(option){
            this.$container = option.container;
            this.$el = option.element;
        },
        render: function(styles){
            var region, name;
            for(var i in styles){
//                if($.isEmptyObject(styles[i])){
//                    continue;
//                }
                name = i;//.replace(':.*', '');
                region = new StyleRegion({
                    container: this.$container,
                    name: name
                });
                region.render(styles[i]);
                this.add(region);
            }
        },
        getStyle: function(){
            var $inputs = this.$container.find('input');
            var result = {}, key, value;
            for(var i = 0, item; item = $inputs[i]; i++){
                key = item.getAttribute('key');
                value = item.value;
                key = key.split('|');
                result[key[0]] = result[key[0]] || {};
                result[key[0]][key[1]] = value;
            }
            return result;
        }
    });
    
    //*****************************************
    //** StyleRegion
    //*****************************************
    
    var StyleRegion = z.define('class', {
        name: 'StyleRegion',
        extend: AdjusterBase,
        statics: {
            getTitle: function(name){
                if(name.indexOf(':hover') > -1){
                    return 'hover';
                }else if(name.indexOf(':active') > -1){
                    return 'active';
                }else{
                    return 'normal';
                }
            },
            isSupport: function(prop){
                return qwt.config.ADJUSTER_SUPPORT.indexOf(prop) > -1;
            }
        
        }
    }, {//prototype
        init: function(option){
            this.name = option.name;
            this.$container = option.container;
            
        },
        render: function(gstyle){
            var title = StyleRegion.getTitle(this.name);
            var html = '<div class="region">' +
            '<h2>' + title + '</h2>' + 
            '</div>';
            var $region = $(html).appendTo(this.$container);
            this.$el = $region;
            var group;

            for(var type in gstyle){
                if(!StyleRegion.isSupport(type)){
                    continue;
                }
                group = new StyleGroup({
                    name: type,
                    key: this.name,
                    container: $region
                });
                group.render(gstyle[type]);
                this.add(group);
            }
            $region.append('<hr/>');
        }
        
    });
    
    //*****************************************
    //** StyleGroup
    //*****************************************
    var StyleGroup = z.define('class', {
        name: 'StyleGroup',
        extend: AdjusterBase,
        statics: {

        }
    }, {//prototype
        init: function(option){
            this.name = option.name;
            this.key = option.key;
            this.$container = option.container;
        },
        render: function(style){
            var $group = $('<div class="group ' + this.name + '"><h3>' +
                    this.name +
                    '</h3></div>').appendTo(this.$container);
            this.$el = $group;
            var adjuster = AdjusterFactory.createInstance(this.name, $group);
            adjuster.render(this.key, this.name, style);
            this.add(adjuster);
        }
    });
    //*****************************************
    //** AdjusterFactory
    //*****************************************
    var AdjusterFactory = z.define('class', {
        name: 'AdjusterFactory',
        statics: {
            createInstance: function(type, container){
                if(!this._instance){
                    this._instance = new AdjusterFactory();
                }
                return this._instance.createInstance(type, container);
            }
        }
    }, {//prototype
        init: function(option){
            
        },
        createInstance: function(type, container){
            switch(type){
                case 'border':
                case 'outline':
                    return new BorderAdjuster(container);
                case 'border-radius':
                    return new BorderRadiusAdjuster(container);
                case 'margin':
                case 'padding':
                    return new MarginAdjuster(container);
                case 'font':
                    return new FontAdjuster(container);
                case 'background':
                    return new BackgroundAdjuster(container);
                default:
                    return new NormalizedAdjuster(container);
            }
        }
    });
    
    //*****************************************
    //** BorderAdjuster
    //*****************************************
    var BorderAdjuster = z.define('class', {
        name: 'BorderAdjuster',
        extend: AdjusterBase
    }, {//prototype
        init: function(container){
            this.$container = container;
        },
        render: function(key, type, style){
            var $el = this.$el = $('<ul></ul>').appendTo(this.$container);
            var tmpl = z.dom.getTemplate('borderTmpl');
            var html = z.string.template(tmpl, {
                property: type,
                key: key,
                list: ['width', 'color', 'style'],
                position: ['top', 'right', 'bottom', 'left'],
                style: style
            });
            $el.append(html);
        }
    });
    //*****************************************
    //** MarginAdjuster
    //*****************************************
    var MarginAdjuster = z.define('class', {
        name: 'MarginAdjuster',
        extend: AdjusterBase
    }, {//prototype
        init: function(container){
            this.$container = container;
        },
        render: function(key, type, style){
            var $el = this.$el = $('<ul></ul>').appendTo(this.$container);
            var tmpl = z.dom.getTemplate('marginTmpl');
            var html = z.string.template(tmpl, {
                property: type,
                key: key,
                position: ['top', 'right', 'bottom', 'left'],
                style: style
            });
            $el.append(html);
        }
    });
    
    //*****************************************
    //** BorderRadiusAdjuster
    //*****************************************
    var BorderRadiusAdjuster = z.define('class', {
        name: 'BorderRadiusAdjuster',
        extend: AdjusterBase
    }, {//prototype
        init: function(container){
            this.$container = container;
        },
        render: function(key, type, style){
            var $el = this.$el = $('<ul></ul>').appendTo(this.$container);
            var tmpl = z.dom.getTemplate('borderRadiusTmpl');
            var html = z.string.template(tmpl, {
                property: type,
                key: key,
                position: ['top-left', 'top-right', 'bottom-right', 'bottom-left'],
                style: style
            });
            $el.append(html);
        }
    });
    
    //*****************************************
    //** NormalizedAdjuster
    //*****************************************
    var NormalizedAdjuster = z.define('class', {
        name: 'NormalizedAdjuster',
        extend: AdjusterBase
    }, {//prototype
        init: function(container){
            this.$container = container;
        },
        render: function(key, type, style){
            var $el = this.$el = $('<ul></ul>').appendTo(this.$container);
            var tmpl = z.dom.getTemplate('normalizedTmpl');
            var html = z.string.template(tmpl, {
                property: type,
                key: key,
                style: style
            });
            $el.append(html);
        }
    });
    
    //*****************************************
    //** FontAdjuster
    //*****************************************
    var FontAdjuster = z.define('class', {
        name: 'FontAdjuster',
        extend: AdjusterBase
    }, {//prototype
        init: function(container){
            this.$container = container;
        },
        render: function(key, type, style){
            var $el = this.$el = $('<ul></ul>').appendTo(this.$container);
            var tmpl = z.dom.getTemplate('samePrefixTmpl');
            var html = z.string.template(tmpl, {
                property: type,
                properties: ['family', 'size', 'weight', 'style'],
                key: key,
                style: style
            });
            $el.append(html);
        }
    });
    
    //*****************************************
    //** BackgroundAdjuster
    //*****************************************
    var BackgroundAdjuster = z.define('class', {
        name: 'BackgroundAdjuster',
        extend: AdjusterBase
    }, {//prototype
        init: function(container){
            this.$container = container;
        },
        render: function(key, type, style){
            var $el = this.$el = $('<ul></ul>').appendTo(this.$container);
            var tmpl = z.dom.getTemplate('samePrefixTmpl');
            var html = z.string.template(tmpl, {
                property: type,
                properties: [
                    'attachment',
                    'clip',
                    'color',
                    'image',
                    'origin',
                    'position-x',
                    'position-y',
                    'repeat-x',
                    'repeat-y'
                ],
                key: key,
                style: style
            });
            $el.append(html);
        }
    });
    
    
    
    
    
    var normalizeStyle = function(property, list, position, style){//TODO 
        var prop, i, pos, j, com, val, com1;
        for(i in list){ 
            prop = list[i];
            com = style[property + '-' + prop];
            if(!com){//没有合并的样式就加一个
                com = [];
                com1 = [];
                for(j in position){
                    pos = position[j];
                    val = style[property + '-' + pos + '-' + prop];
                    if(!!val){
                        com.push(val);
                    }else{
                        val = 'initial';
                    }
                    com1.push(val);
                }
                if(!(com + '')){
                    com = '';
                }else if(com.length == 4){
                    if(com[1] == com[3]){
                        com.splice(3,1);
                        if(com[0] == com[2]){
                            com.splice(2,1);
                            if(com[0] == com[1]){
                                com.splice(1,1);
                            }
                        }
                    }
                    com = com.join(' ');
                }else{
                    com = com1.join(' ');
                }
            }else{
                
            }
        }
    }
    
    this.EditorView = EditorView;
    this.StyleRegion = StyleRegion;
    this.StyleGroup = StyleGroup;
});
//******* end of qwt.ui
