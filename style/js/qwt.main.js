Z.$package('qwt.main', function(z){
    var $window,
        $wrapper,
        $toolbar,
        $content,
    
        $tips,
        $demoListWrap,
        $demoListIframe,
        $iframeWrap,
        $editorWrap,
        $visualToolWrap,
        $editor;
    
    var $currentIframe = null;
    var $selectedDemoItem = null;
    
    var demoListWin;

    var toolbarHeight = 40;
    var iframeFirstLoad = true;
    //ace
    var editor, CssMode;

    this.init = function(){
        $window = $(window);
        $wrapper = $('#wrapper');
        $toolbar = $('#toolbar');
        $content = $('#content');
        
        $tips = $('#tips');
        $demoListWrap = $('#demoListWrap');
        $iframeWrap = $('#iframeWrap');
        $editorWrap = $('#editorWrap');
        $visualToolWrap = $('#visualToolWrap');
        $editor = $('#editor');
        $demoListIframe = $('#demoListIframe');

        $demoListIframe.load(function(){
            demoListWin = $demoListIframe.get(0).contentWindow;
            selectDemoByHash(location.hash);
        });

        $window.resize(function(){
            var winHeight = $window.height();
            $content.height(winHeight - toolbarHeight);
        }).resize();

        $toolbar.click(function(e){
            var target = z.dom.getActionTarget(e, -1, 'cmd', this);
            if(target){
                e.preventDefault();
                var cmd = target.getAttribute('cmd');
                execCommand(cmd, e, target);
            }
        });
        $window.bind('hashchange', function(){
            selectDemoByHash(location.hash);
        });
    }

    var delayHideTips = function(){
        $tips.removeClass('tips-show');
    }
    
    var tips = function(msg, time){
        $tips.text(msg).addClass('tips-show');
        if(time === 0){
            z.util.clearDelay('tips');
            return;
        }
        if(typeof(time) == 'undefined'){
            time = 5000;
        }
        z.util.delay('tips', time, delayHideTips);
    }
    
    var execCommand = function(cmd, event, element){
        switch(cmd){
            case 'editCode':{
                if(!checkIframe()){
                    break;
                }
                var styleCode = getStyleCode();
                if(styleCode === null){
                    tips('the demo page don\t have style node!');
                    break;
                }
                updateCode(styleCode);
                $toolbar.removeClass('normal');
                $toolbar.addClass('edit-code');
                $demoListWrap.addClass('demo-list-wrap-collapse');
                $editorWrap.removeClass('editor-wrap-collapse')
                    .parent().addClass('left-column-stretch');
                
                break;
            }
            case 'saveEdit':{
                updateDemo();
                //execCommand('cancelEdit');
                break;
            }
            case 'cancelEdit':{
                $toolbar.removeClass('edit-code');
                $toolbar.addClass('normal');
                $editorWrap.addClass('editor-wrap-collapse')
                    .parent().removeClass('left-column-stretch');
                $demoListWrap.removeClass('demo-list-wrap-collapse');
                break;
            }
            case 'adjustControl': {
                if(!checkIframe()){
                    break;
                }
                var styleCode = getStyleCode();
                if(styleCode === null){
                    tips('the demo page don\t have style node!');
                    break;
                }
                $toolbar.removeClass('normal');
                $toolbar.addClass('adjust-control');
                $demoListWrap.addClass('demo-list-wrap-collapse')
                    .parent().addClass('left-column-stretch');
                $visualToolWrap.removeClass('visual-tool-wrap-collapse');
                qwt.editor.loadVisualEditor($currentIframe);
                break;
            }
            case 'cancelAdjust': {
                $toolbar.removeClass('adjust-control');
                $toolbar.addClass('normal');
                $demoListWrap.removeClass('demo-list-wrap-collapse')
                    .parent().removeClass('left-column-stretch');
                $visualToolWrap.addClass('visual-tool-wrap-collapse');
                qwt.editor.cancelVisualEditor();
                break;
            }
            case 'selectElement': {
                qwt.editor.loadVisualEditor($currentIframe);
                break;
            }
            case 'previewAdjust': {
                if($toolbar.hasClass('adjust-control')){
                    qwt.editor.previewAdjust();
                }
                break;
            }
            default:
                break;
        }
    }
    
    var checkIframe = function(){
        if(!$currentIframe){
            tips('select a demo first!');
            return false;
        }else if(!$currentIframe.data('isLoaded')){
            tips('please wait for the iframe loaded!');
            return false;
        }
        return true;
    }
    
    var iframeLoaded = function(){
        if($currentIframe.attr('src') === this.src){
            $currentIframe.data('isLoaded', 1);
        }
        // if(iframeFirstLoad){
        //     iframeFirstLoad = false;
        //     iframeFirstLoadCb();
        // }
    }
    var viewDemo = this.viewDemo = function(url){
        var $iframe = $('<iframe frameborder="0" class="content-iframe"></iframe>');
        $currentIframe = $iframe;
        $iframe.load(iframeLoaded);
        $iframe.attr('src', url);
        $iframeWrap.empty().append($iframe);
        var accessKey = getHashKeyFromDemoUrl(url);
        if(accessKey){
            _gaq.push(['_trackEvent', accessKey.replace(/\//g, '.'), 'click']);
            setHash(accessKey);
        }
    }
    
    var getEditor = function(){
        if(!CssMode){
            CssMode = require('ace/mode/css').Mode;
        }
        if(!editor){
            editor = ace.edit('editor');
            editor.setTheme('ace/theme/tumblr');
            var session = editor.getSession();
            session.setMode(new CssMode());
            session.setUseWrapMode(true);
        }
        return editor;
    }
    
    var getStyleCode = function(){
        var iframe = $currentIframe.get(0);
        var doc = iframe.contentWindow.document;
        //不用 document.styleSheets, 太麻烦
        //约定只取第一个
        var styleSheets = doc.getElementsByTagName('style');
        var value = null;
        if(styleSheets.length >= 1){
            var styleNode = styleSheets[0];
            value = styleNode.innerHTML;
        }
        return value;
    }
    
    var updateCode = function(code){
        getEditor().getSession().setValue(code);
    }
    
    var updateDemo = function(){
        var value = getEditor().getSession().getValue();
        var iframe = $currentIframe.get(0);
        var doc = iframe.contentWindow.document;
        var styleSheets = doc.getElementsByTagName('style');
        var styleNode  = styleSheets[styleSheets.length - 1];
        if(styleSheets.length === 1 || !(styleNode.getAttribute('edited-style')) ){
            styleNode = doc.createElement('style');
            styleNode.type = 'text/css';
            styleNode.setAttribute('edited-style', 1);
            doc.getElementsByTagName('head')[0].appendChild(styleNode);
        }else{
            //styleNode = styleSheets[1];
        }
        styleNode.innerHTML = value;
    }
    
    var hashKeyFromDemoUrlRegexp = /([^\/]+)\/([^\/]+)\/index\.html$/i;
    var getHashKeyFromDemoUrl = function(url){
        var m = url.match(hashKeyFromDemoUrlRegexp);
        if(m && m.length == 3){
            return m[1] + '/' + m[2];
        }else{
            return '';
        }
    }

    var setHash = function(hash){
        var current = location.hash;
        if(current === '#' + hash){//hash一样不变更
            return;
        }
        location.hash = hash;
    }

    var selectDemoByHash = function(hash){
        // console.log(hash);
        if(!demoListWin){
            return;
        }
        hash = hash.substring(1);
        if(hash){
            var m = hash.split('\/');
            if(m.length == 2){
                demoListWin.selectCategory(m[0]);
                demoListWin.selectDemo(m[0] + '-' + m[1]);
            }
        }
    }

    //**********************************************
    // for init
    //**********************************************
    

    if(location.href.indexOf('file:///') === 0){
        tips('place don\'t open this page directly!', 0);
    }
});
//end of package
