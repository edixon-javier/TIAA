/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Custom console.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    
    var Logger = function(){

        'use strict';
        
        var _s  = this;
        var prototype = Logger.prototype;
        
        _s.main_do = null;
        

        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setupScreen();
            window.onerror = _s.showError;
            _s.screen.style.zIndex = 100000009;

            setTimeout(_s.addConsoleToDom, 100);
            setInterval(_s.position, 100);
        };
        
        _s.position = function(){
            var scrollOffsets = FWDR3DCovUtils.getScrollOffsets();
            _s.setX(scrollOffsets.x);
            _s.setY(scrollOffsets.y);
        };
        
        _s.addConsoleToDom  = function(){
            if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1){
                document.getElementsByTagName("body")[0].appendChild(_s.screen);
            }else{
                document.documentElement.appendChild(_s.screen);
            }
        };
        

        /**
         * Setup screens.
         */
        _s.setupScreen = function(){
            _s.main_do = new FWDR3DCovDO("div", "absolute");
            _s.main_do.setOverflow("auto");
            _s.main_do.setWidth(200);
            _s.main_do.setHeight(300);
            _s.setWidth(200);
            _s.setHeight(300);
            _s.main_do.setBkColor("#FFFFFF");
            _s.main_do.style().color = '#000';
            _s.addChild(_s.main_do);
        };
        
        _s.showError = function(message, url, linenumber) {
            var currentInnerHTML = _s.main_do.getInnerHTML() + "<br>" + "JavaScript error: " + message + " on line " + linenumber + " for " + url;
            _s.main_do.setInnerHTML(currentInnerHTML);
            _s.main_do.screen.scrollTop = _s.main_do.screen.scrollHeight;
        };
        
        _s.log = function(message){
            var currentInnerHTML = _s.main_do.getInnerHTML() + "<br>" + message;
            _s.main_do.setInnerHTML(currentInnerHTML);  
            _s.main_do.getScreen().scrollTop = 10000;
        };
        
        _s.init();
    };
    
    /**
     * Set prototype.
     */
    Logger.setPrototype = function(){
        Logger.prototype = new FWDR3DCovDO("div", "absolute");
    };
    
    Logger.prototype = null;
    window.Logger = Logger;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Main class.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){

    var FWDR3DCov = function(props){

        'use strict';
        
        var _s = this;
        _s.instCountId = FWDR3DCov.cars.length;
        FWDR3DCov.cars.push(_s);
        _s.scale = 1;
        _s.listeners = {events_ar:[]};
        _s.orientationChangeComplete = true;
        _s.isMobile = FWDR3DCovUtils.isMobile;
        
        _s.mainFolderPath = props.mainFolderPath;
        if((_s.mainFolderPath.lastIndexOf("/") + 1) != _s.mainFolderPath.length){
            _s.mainFolderPath += "/";
        }
        
        _s.skinPath_str = props.skinPath;
        if((_s.skinPath_str.lastIndexOf("/") + 1) != _s.skinPath_str.length){
            _s.skinPath_str += "/";
        }
        
        _s.warningIconPath_str = _s.mainFolderPath + _s.skinPath_str + "warning.png";


        /**
         * Initialize.
         */
        _s.init = function(){
            FWDR3DCovUtils.checkIfHasTransofrms();
            FWDTweenLite.ticker.useRAF(true); 
            
            _s.props = props;

            if (!_s.props){
                alert("Royal 3D Coverflow properties object is undefined!");
                return;
            }

            _s.instName = _s.props.instanceName;
            if(!_s.instName){
                alert("Royal 3D Coverflow instance name is required in the settings parameters!");
                return;
            }
            window[_s.instName] = _s;
            
            if (!_s.props.displayType){
                alert("Display type is not specified!");
                return;
            }
        
            _s.displayType = props.displayType.toLowerCase();
            _s.body = document.getElementsByTagName("body")[0];
            
            if (!_s.props.coverflowHolderDivId){
                alert("Property coverflowHolderDivId is not defined in the Royal 3D Coverflow object settings!");
                return;
            }
            
            if (!FWDR3DCovUtils.getChildById(_s.props.coverflowHolderDivId)){
                alert("Royal 3D Coverflow holder div is not found, please make sure that the div exists and the id is correct! " + _s.props.coverflowHolderDivId);
                return;
            }
            
            if (!_s.props.coverflowWidth){
                alert("The coverflow width is not defined, plese make sure that the coverflowWidth property is definded in the Royal 3D Coverflow settings!");
                return;
            }
        
            _s.stageContainer = FWDR3DCovUtils.getChildById(_s.props.coverflowHolderDivId);
            
            _s.originalWidth = _s.props.coverflowWidth;

            _s.coverflowYRadius = _s.props.coverflowYRadius || 0;
            _s.coverflowOffsetHeight = _s.props.coverflowOffsetHeight;
            if(_s.coverflowYRadius ==  undefined) _s.coverflowOffsetHeight = 200

            _s.thumbnailResizeOffest = _s.props.thumbnailResizeOffest;
            if(_s.thumbnailResizeOffest == undefined) _s.thumbnailResizeOffest = 200

            _s.thumbWidth = _s.props.thumbnailWidth || 400;
            _s.thumbHeight = _s.props.thumbnailHeight || 266;
            _s.preloaderBackgroundColor = _s.props.preloaderBackgroundColor || "#000000";
            _s.preloaderFillColor = _s.props.preloaderFillColor || "#FFFFFF";

            _s.rootElement = FWDR3DCovUtils.getChildById(_s.props.coverflowDataListDivId);  
            if (!_s.rootElement){
                alert("Please make sure that the div with the id " + _s.props.coverflowDataListDivId + " exists, this represents the coverflow categories markup.");
                return;
            }
            
            _s.dataListAr = FWDR3DCovUtils.getChildrenFromAttribute(_s.rootElement, "data-cat");
            if (!_s.dataListAr){
                alert("At least one datalist ul tag with the attribute <font color='#FF0000'>data-cat</font> must be defined.");
                return;
            }

            _s.totalDataLists = _s.dataListAr.length;
            _s.startAtCategory = _s.props.startAtCategory || 1;
            if(isNaN(_s.startAtCategory)) _s.startAtCategory = 1;
            if(_s.startAtCategory <= 0) _s.startAtCategory = 1;
            if(_s.startAtCategory > _s.totalDataLists) _s.startAtCategory = _s.totalDataLists;
            _s.startAtCategory -= 1;
            
            _s.captionPosition = _s.props.captionPosition || 'out';
            _s.captionH = 0;
            _s.initializeOnlyWhenVisible_bl = _s.props.initializeOnlyWhenVisible; 
            _s.initializeOnlyWhenVisible_bl = _s.initializeOnlyWhenVisible_bl == "yes" ? true : false;
            if(_s.displayType == FWDR3DCov.FLUID_WIDTH) _s.initializeOnlyWhenVisible_bl = false;

            _s.bkImage = _s.props.backgroundImage;
            _s.bkImageRepeat = _s.props.backgroundImageRepeat || 'repeat'
            _s.bkImageSize = _s.props.backgroundImageSize || 'auto';
            _s.setupMainDO();
            
            if(_s.initializeOnlyWhenVisible_bl){
                window.addEventListener("scroll", _s.onInitlalizeScrollHandler);
                setTimeout(_s.onInitlalizeScrollHandler, 200);
            }else{
                _s.setupCarousel();
            }
        };
        
        _s.onInitlalizeScrollHandler = function(){      

            var scrollOffsets = FWDR3DCovUtils.getScrollOffsets();
            _s.pageXOffset = scrollOffsets.x;
            _s.pageYOffset = scrollOffsets.y;
            _s.ws = _s.vwSize = FWDR3DCovUtils.getViewportSize();
            if(_s.stageContainer.getBoundingClientRect().top < _s.ws.h){
                window.removeEventListener("scroll", _s.onInitlalizeScrollHandler);
                _s.setupCarousel();
            }
        };
        
        _s.setupCarousel = function(){
            if(_s.init_) return;
            _s.init_ = true;
            _s.setupData();
            _s.setupInfo();
            _s.startResizeHandler();    
        }


        /**
         * Setup main display object.
         */
        _s.setupMainDO = function(){
            _s.mainDO = new FWDR3DCovDO("div", "relative");
            _s.stageHeight = 100;
            _s.mainDO.screen.className = 'fwdr3dcov';
            if(!_s.isMobile) _s.mainDO.setSelectable(false);
            _s.mainDO.hasT3D = false;
            _s.mainDO.hasT2D =  false;


            if(_s.bkImage){
                _s.bkDO = new FWDR3DCovDO('div');
                _s.bkDO.style().width = '100%';
                _s.bkDO.style().height = '100%';
                _s.bkDO.setAlpha(0);
                _s.bkDO.style().backgroundPosition = 'center';
                _s.bkDO.style().backgroundImage = 'url("' + _s.bkImage + '")';
                _s.bkDO.style().backgroundRepeat = _s.bkImageRepeat;
                _s.bkDO.style().backgroundSize = _s.bkImageSize;
                
                
                _s.mainDO.addChild(_s.bkDO);

                var img =  new Image();
                img.src = _s.bkImage;
                img.onload = function(){
                    FWDAnimation.to(_s.bkDO, 1.5, {alpha:1});
                }

            }
            
            _s.mainDO.setBkColor(_s.props.backgroundColor);
            _s.mainDO.style().msTouchAction = "none";

            if(_s.displayType == FWDR3DCov.FLUID_WIDTH){    
                _s.mainDO.style().position = "absolute";
                
                document.body.appendChild(_s.mainDO.screen);
                if(_s.props.zIndex){
                    _s.mainDO.screen.style.zIndex = _s.props.zIndex;
                }
                
                _s.mainDO.screen.id = _s.props.coverflowHolderDivId + "-fluidwidth";
                
            }else{
                _s.stageContainer.appendChild(_s.mainDO.screen);
            }
        };

    
        /**
         * Get outside text height.
         */
        _s.getCaptionHeight = function(){
            var catId;
            var itemId;
            _s.captionH = 0;

            if(!_s.textDO){
                _s.textDO = new FWDR3DCovDO("div");
                _s.textDO.style().width = '100%';
                _s.textDO.setVisible(false);
                _s.textDO.setX(-10000);
                _s.textDO.screen.className = 'fwdr3dcov-caption out';
                _s.mainDO.addChild(_s.textDO);
            }
            
            if(_s.thumbsManagerDO){
                _s.curDataListAr = _s.thumbsManagerDO.curDataListAr;
                itemId = _s.thumbsManagerDO.curId;
            }else{
                _s.curDataListAr = _s._d.dataListAr[_s.startAtCategory];
                _s.totalThumbs = _s.curDataListAr.length;
                _s.startPos = _s._d.coverflowStartPosition;

                if (typeof(_s.startPos) == "number"){
                    _s.startPos = Math.floor(_s.startPos) - 1;
                    
                    if (_s.startPos < 0){
                        _s.startPos = Math.floor((_s.totalThumbs-1)/2);
                    }else if (_s.startPos > _s.totalThumbs-1){
                        _s.startPos = Math.floor((_s.totalThumbs-1)/2);
                    }
                    itemId = _s.startPos;
                }else{
                    switch (_s.startPos){
                        case "left":
                            itemId = 0;
                            break;
                        case "right":
                            itemId = _s.totalThumbs-1;
                            break;
                        case "random":
                            itemId = Math.floor(_s.totalThumbs * Math.random());
                            break;
                        default:
                            itemId = Math.floor((_s.totalThumbs-1)/2);
                    }
                }

                catId = _s.startAtCategory;
            }

            
            if(_s.curDataListAr[itemId] && _s.curDataListAr[itemId]['thumbText']){
                _s.caption = _s.curDataListAr[itemId]['thumbText'];
                _s.textDO.setInnerHTML(_s.caption);
                _s.captionH = _s.textDO.getHeight() - 5;
            }

        }
        
    
        /**
         * Setup info error window.
         */
        _s.setupInfo = function(){
            FWDR3DCovInfo.setPrototype();
            _s.infoDO = new FWDR3DCovInfo(_s, _s.warningIconPath_str);
        };

        _s.removeInfoDO = function(){
            if(_s.mainDO.contains(_s.infoDO)) _s.mainDO.removeChild(_s.infoDO);
        }   

        _s.showInfo = function(txt){
            _s.mainDO.addChild(_s.infoDO);
            _s.infoDO.showText(txt);
        }

        
        /**
         * Setup resize handler.
         */
        _s.startResizeHandler = function(){
            
            window.addEventListener("resize", _s.onResizeHandler);
            window.addEventListener("scroll", _s.onScrollHandler);
            window.addEventListener("orientationchange", _s.orientationChange);
            
            _s.resizeHandler();
            _s.resizeHandlerId_to = setTimeout(_s.scrollHandler, 50);
            
            if(_s.displayType == FWDR3DCov.FLUID_WIDTH){
                _s.ctY = Math.round(_s.stageContainer.getBoundingClientRect().top + _s.pageYOffset);
                _s.mainDO.setY(_s.ctY); 
                setTimeout(function(){
                    _s.ctY = Math.round(_s.stageContainer.getBoundingClientRect().top + _s.pageYOffset);
                    _s.mainDO.setY(_s.ctY); 
                }, 500);
            }
        };
        
        _s.stopResizeHandler = function(){  
            window.removeEventListener("resize", _s.onResizeHandler);
            window.removeEventListener("scroll", _s.onScrollHandler);
            window.removeEventListener("orientationchange", _s.orientationChange);
        };
        
        _s.onResizeHandler = function(e){
            _s.resizeHandler();
            _s.resizeHandlerId2 = setTimeout(_s.resizeHandler, 200);
        };
        
        _s.onScrollHandler = function(e){
            if (_s.displayType == FWDR3DCov.FLUID_WIDTH){
                _s.scrollHandler();
            }
            
            _s.rect = _s.mainDO.screen.getBoundingClientRect();
        };
        
        _s.orientationChange = function(){
            if (_s.displayType == FWDR3DCov.FLUID_WIDTH){
                _s.orientationChangeComplete = false;
                
                clearTimeout(_s.scrollEndId);
                clearTimeout(_s.resizeHandlerId2);
                clearTimeout(_s.orientationChangeId);
                
                _s.orientationChangeId = setTimeout(function(){
                    _s.orientationChangeComplete = true; 
                    _s.resizeHandler();
                }, 1000);
                
                _s.mainDO.setX(0);
                _s.mainDO.setWidth(0);
            }
        };
        

        /**
         * Resize and scroll.
         */
        _s.scrollHandler = function(){
            if (!_s.orientationChangeComplete)
                return;
            
            var scrollOffsets = FWDR3DCovUtils.getScrollOffsets();
        
            _s.pageXOffset = scrollOffsets.x;
            _s.pageYOffset = scrollOffsets.y;
            
            
            if (_s.displayType == FWDR3DCov.FLUID_WIDTH){   
                if (_s.isMobile){
                    clearTimeout(_s.scrollEndId);
                    _s.scrollEndId = setTimeout(_s.resizeHandler, 200);     
                }else{
                    _s.mainDO.setX(_s.pageXOffset);
                }
                
                _s.mainDO.setY(Math.round(_s.stageContainer.getBoundingClientRect().top + _s.pageYOffset));
            }
        };
        

        /**
         * Resize handler.
         */
        _s.resizeHandler = function(resizeCaption){
            if (!_s.orientationChangeComplete)
                return;
            
            var scrollOffsets = FWDR3DCovUtils.getScrollOffsets();
            var vwSize = _s.vwSize = FWDR3DCovUtils.getViewportSize();
            _s.ws = vwSize;
            _s.dW = 0;
            _s.dH = 0;
            
            _s.viewportWidth = parseInt(vwSize.w);
            _s.viewportHeight = parseInt(vwSize.h);
            _s.pageXOffset = parseInt(scrollOffsets.x);
            _s.pageYOffset = parseInt(scrollOffsets.y);
            
            if (_s.displayType == FWDR3DCov.FLUID_WIDTH){
                _s.stageWidth = vwSize.w;
                _s.stageHeight = Math.round(_s.scale * _s.thumbHeight) + (_s.coverflowOffsetHeight * 2);

                _s.scale = Math.min(_s.stageWidth/(_s.thumbWidth + _s.thumbnailResizeOffest * 2), 1);
                _s.stageHeight = Math.round(_s.scale * _s.thumbHeight) + (_s.coverflowOffsetHeight * 2);
                _s.stageContainer.style.height = _s.stageHeight + "px";
            
                _s.scrollHandler();
            }else if (_s.displayType == FWDR3DCov.RESPONSIVE){

                _s.stageContainer.style.width = "100%";
                _s.stageWidth = _s.stageContainer.offsetWidth;
                
                if(_s.stageWidth > _s.originalWidth){
                    _s.stageWidth = _s.originalWidth;
                    _s.stageContainer.style.width = _s.originalWidth + "px";
                }

                _s.scale = Math.min(_s.stageWidth/(_s.thumbWidth + _s.thumbnailResizeOffest * 2), 1);
                _s.stageHeight = Math.round(_s.scale * _s.thumbHeight) + (_s.coverflowOffsetHeight * 2);
                _s.stageContainer.style.height = _s.stageHeight + "px";
                
                _s.mainDO.setX(0);
                _s.mainDO.setY(0);
            }

            _s.mainDO.setWidth(_s.stageWidth);
            _s.mainDO.setHeight(_s.stageHeight);
            
            _s.rect = _s.mainDO.screen.getBoundingClientRect();
        
            _s.positionPreloader();
            
            if (_s.thumbsManagerDO){
                _s.thumbsManagerDO.resizeHandler(resizeCaption);
                
                if(!_s.thumbsManagerDO.allowToSwitchCat){
                    _s.disableDO.setWidth(_s.stageWidth);
                    _s.disableDO.setHeight(_s.stageHeight);
                }
            }
            
            if (_s.menuDO){
                _s.menuDO.position();
            }

            _s.addOffsetTextHeight();
            _s.dispatchEvent(FWDR3DCov.RESIZE);

            _s.prevSW = _s.stageWidth;
            _s.prevSH = _s.stageHeight;
        };

        _s.addOffsetTextHeight = function(anim){
            if(_s.captionPosition == 'in') return;
            
            _s.getCaptionHeight();
            var h = Math.round(_s.stageHeight + _s.captionH  );     
        
            if(anim){
                FWDAnimation.to(_s.mainDO, .8, {h:h, ease:Quint.easeOut});
                FWDAnimation.to(_s.stageContainer, .8, {css:{height:h + 'px'}, ease:Quint.easeOut});
            }else{
                FWDAnimation.killTweensOf(_s.mainDO);
                FWDAnimation.killTweensOf(_s.stageContainer);
                _s.stageContainer.style.height = h + "px";
                _s.mainDO.setHeight(h);
            }
        }


        /**
         * Setup context menu.
         */
        _s.setupContextMenu = function(){
            _s.customContextMenuDO = new FWDR3DCovContextMenu(_s.mainDO, _s._d.rightClickContextMenu);
        };


        /**
         * Setup data.
         */
        _s.setupData = function(){
            FWDR3DCovData.setPrototype();
            _s._d = new FWDR3DCovData(_s.props, _s);
            _s._d.addListener(FWDR3DCovData.PRELOADER_LOAD_DONE, _s.onPreloaderLoadDone);
            _s._d.addListener(FWDR3DCovData.LOAD_ERROR, _s.dataLoadError);
            _s._d.addListener(FWDR3DCovData.LOAD_DONE, _s.dataLoadComplete);
            
            _s._d.showCaptionUnderThumbnail_bl = _s.props.showCaptionUnderThumbnail;
            _s._d.showCaptionUnderThumbnail_bl = _s._d.showCaptionUnderThumbnail_bl == "yes" ? true : false;
        };

        _s.onPreloaderLoadDone = function(){
            _s.setupPreloader();
            _s.positionPreloader();
            
            if (!_s.isMobile){
                _s.setupContextMenu();
            }
            
            _s.preloaderLoaded = true;
            _s.resizeHandler();
        };

        _s.dataLoadError = function(e, text){
            _s.showInfo(e.text);
        };

        _s.dataLoadComplete = function(e){
            if (_s._d.showDisplay2DAlways){
                FWDR3DCovUtils.hasTransform3d = false;
            }

            _s.preloaderDO.hide(true);
            _s.setupLightBox();
            _s.setupThumbsManager();
            
            if (_s._d.showMenu){
                _s.setupMenu();
            }
            _s.setupDisable();
            _s.dispatchEvent(FWDR3DCov.DATA_LOADED);
        };


        /**
         * Setup preloader.
         */
        _s.setupPreloader = function(){
            FWDR3DCovPreloader.setPrototype();
            _s.preloaderDO = new FWDR3DCovPreloader(_s, 'center', 10, _s.preloaderBackgroundColor, _s.preloaderFillColor, 3, 0.8);
            _s.mainDO.addChild(_s.preloaderDO);
            _s.preloaderDO.show();
        };

        _s.positionPreloader = function(){
            if (_s.preloaderDO){
                var x = Math.round((_s.stageWidth - _s.preloaderDO.getWidth()) / 2);
                var y = Math.round((_s.stageHeight - _s.preloaderDO.getHeight() + _s.captionH) / 2);
                if(_s.thumbsManagerDO){
                    x = Math.round(_s.thumbsManagerDO.centerThumbX + (_s.thumbsManagerDO.centerThumbW - _s.preloaderDO.w)/2);
                    y = Math.round(_s.thumbsManagerDO.centerThumbY + (_s.thumbsManagerDO.centerThumbH - _s.preloaderDO.h)/2);
                }
                _s.preloaderDO.setX(x);
                _s.preloaderDO.setY(y);
            }
        };

        _s.showPreloader = function(){
            _s.mainDO.addChild(_s.preloaderDO);
            _s.preloaderDO.show();
            _s.positionPreloader();
        }


        /**
         * Setup thumbs manager.
         */
        _s.setupThumbsManager = function(){
            FWDR3DCovThumbsManager.setPrototype();
            
            _s.thumbsManagerDO = new FWDR3DCovThumbsManager(_s._d, _s);
            _s.thumbsManagerDO.addListener(FWDR3DCovThumbsManager.THUMB_CLICK, _s.onThumbsManagerThumbClick);
            _s.thumbsManagerDO.addListener(FWDR3DCovThumbsManager.LOAD_ERROR, _s.onThumbsManagerLoadError);
            _s.thumbsManagerDO.addListener(FWDR3DCovThumbsManager.THUMBS_INTRO_FINISH, _s.onThumbsManagerIntroFinish);
            _s.thumbsManagerDO.addListener(FWDR3DCovThumbsManager.THUMB_CHANGE, _s.onThumbsManagerThumbChange);
            _s.mainDO.addChild(_s.thumbsManagerDO);
            
            if (_s.stageWidth){
                _s.thumbsManagerDO.resizeHandler(_s.scale);
            }
            _s.dispatchEvent(FWDR3DCov.INTRO_START);
        };
        
        _s.onThumbsManagerThumbClick = function(e){
            if(!_s.rl) return;
            var rlObj = "fwdr3dcov" + e.playlistId + '_';

            window[rlObj] = _s._d.lightboxAr[e.playlistId];
            _s.rl.show(rlObj, e.thumbId);
        };

        _s.onThumbsManagerLoadError = function(e){
            _s.showInfo(e.text);
        };
        
        _s.onThumbsManagerIntroFinish = function(){
            _s.enableAll();
            _s.dispatchEvent(FWDR3DCov.INTRO_FINISH);
            
            _s.apiReady = true;
            
            if (!_s.apiReadyFirstTime){
                _s.apiReadyFirstTime = true;
                _s.dispatchEvent(FWDR3DCov.IS_API_READY);
            }
            
            _s.dispatchEvent(FWDR3DCov.CATEGORY_CHANGE, {id:_s.thumbsManagerDO.dataListId});
        };
        
        _s.onThumbsManagerThumbChange = function(e){
            _s.dispatchEvent(FWDR3DCov.THUMB_CHANGE, {id:e.id});
        };
        
        _s.update = function(e){
            _s.thumbsManagerDO.update(e);
        };
        

        /**
         * Setup menu.
         */
        _s.setupMenu = function(){
            FWDR3DCovMenu.setPrototype();
        
            _s.menuDO = new FWDR3DCovMenu(_s, {
                arrowNImg:_s._d.comboboxArrowIconN_img,
                arrowN_str:_s._d.comboboxArrowIconN_str,
                selectorLineColor:_s._d.selectorLineColor,
                categories_ar:_s._d.categoriesAr,
                selectorLabel:_s._d.selectLabel,
                position:_s._d.menuPosition,
                startAtCategory:_s.startAtCategory,
                comboBoxHorizontalMargins:_s._d.comboBoxHorizontalMargins,
                comboBoxVerticalMargins:_s._d.comboBoxVerticalMargins,
                comboBoxCornerRadius:_s._d.comboBoxCornerRadius,
                selectorBackgroundColor:_s._d.selectorBackgroundColor,
                selectorTextNormalColor:_s._d.selectorTextNormalColor,
                selectorTextSelectedColor:_s._d.selectorTextSelectedColor,
                buttonBackgroundColor:_s._d.buttonBackgroundColor,
                buttonTextNormalColor:_s._d.buttonTextNormalColor,
                buttonTextSelectedColor:_s._d.buttonTextSelectedColor,
                shadowColor:_s._d.comboBoxShadowColor
            });
            
            _s.menuDO.addListener(FWDR3DCovMenu.BUTTON_PRESSED, _s.onComboboxButtonPressHandler);
            _s.mainDO.addChild(_s.menuDO);
        };
        
        _s.onComboboxButtonPressHandler = function(e){
            if (_s.thumbsManagerDO.allowToSwitchCat){
                _s.disableAll();
                _s.thumbsManagerDO.showCurrentCat(e.id);
                _s.dispatchEvent(FWDR3DCov.INTRO_START);
                _s.apiReady = false;
            }
        };

        
        /**
         * Setup lightbox.
         */
        _s.setupLightBox = function(){
            if(!_s._d.useLightbox) return;

            var rlInst = FWDR3DCovUtils.getHashParam('rlinst');
            var isThisRL = rlInst ? rlInst.match(/fwdr3dcov/) : false;
            if(rlInst) rlInst = rlInst.match(/\d+/g)[1];
            var guid = FWDR3DCovUtils.getHashParam('rlguid');
            var isThisGuid = guid ? guid.match(/fwdr3dcov/) : false;

            if(rlInst){
                if(guid && rlInst == _s.instCountId && isThisRL){
                    _s.startAtCategory = guid.match(/\d+/g)[1];
                    window["fwdr3dcov" + _s.startAtCategory + '_'] = _s._d.lightboxAr[_s.startAtCategory];
                }
            }else if(guid){
                if(isThisGuid){
                    _s.startAtCategory = guid.match(/\d+/g)[1];
                    window["fwdr3dcov" + _s.startAtCategory + '_'] = _s._d.lightboxAr[_s.startAtCategory];
                }
            }

            if(!FWDR3DCov.hasLoadRL && !window['FWDRL']){
                var script = document.createElement('script');
                script.src = _s._d.mainFolderPath + 'rl/java/FWDRL.js';
                document.head.appendChild(script);
                script.onerror = _s.rlLoadError;
                script.onload = _s.rlLoadDone;
            }

            _s.rl_it = setInterval(function(){
                if(FWDR3DCov.hasRL || window['FWDRL']){
                    _s.initializeRL();
                    clearInterval(_s.rl_it);
                }
            }, 5);

            FWDR3DCov.hasLoadRL = true;
        };

        _s.rlLoadError = function(){
            clearInterval(_s.rl_it)
            _s.showInfo("Error loading Revolution Lightbox!")
        }

        _s.rlLoadDone = function(){
            FWDR3DCov.hasRL = true;
        }

        _s.initializeRL = function(){
        
            new FWDRL({ 
                // General settings.
                instanceName:_s.instName + '_rl',
                mainFolderPath:_s.mainFolderPath + "/rl/content",
                cls:"fwdr3dcov-rl",
                fontIcon:"fwdr3dcov-icon",
                rightClickContextMenu:_s._d.rightClickContextMenu,
                useDeepLinking:_s._d.rlUseDeepLinking,
                useVectorIcons:_s._d.useVectorIcons,
                buttonsAlignment:_s._d.rlButtonsAlignment,
                mediaLazyLoading:_s._d.rlMediaLazyLoading,
                useDrag:_s._d.rlUseDrag,
                useAsModal:_s._d.rlUseAsModal,
                showSlideShowButton:_s._d.rlShowSlideShowButton,
                showSlideShowAnimation:_s._d.rlShowSlideShowAnimation,
                slideShowAutoPlay:_s._d.rlSlideShowAutoPlay,
                slideShowAutoStop:_s._d.rlSlideShowAutoStop,
                slideShowDelay:_s._d.rlSlideShowDelay,
                slideShowBkColor:_s._d.rlSlideShowBkColor,
                slideShowFillColor:_s._d.rlSlideShowFillColor,
                useKeyboard:_s._d.rlUseKeyboard,
                useDoubleClick:_s._d.rlUseDoubleClick,
                showCloseButton:_s._d.rlShowCloseButton,
                showFullscreenButton:_s._d.rlShowFullscreenButton,
                showZoomButton:_s._d.rlShowZoomButton,
                showCounter:_s._d.rlShowCounter,
                showNextAndPrevBtns:_s._d.rlShowNextAndPrevBtns,
                maxZoom:_s._d.rlMaxZoom,
                buttonsHideDelay:_s._d.rlButtonsHideDelay,
                defaultItemWidth:_s._d.rlDefaultItemWidth,
                defaultItemHeight:_s._d.rlDefaultItemHeight,
                itemOffsetHeight:_s._d.rlItemOffsetHeight,
                itemOffsetHeightButtonsTop:_s._d.rlItemOffsetHeightButtonsTop,
                spaceBetweenBtns:_s._d.rlSpaceBetweenBtns,
                buttonsOffsetIn:_s._d.rlButtonsOffsetIn,
                buttonsOffsetOut:_s._d.rlButtonsOffsetOut,
                itemBorderSize:_s._d.rlItemBorderSize,
                itemBackgroundColor:_s._d.rlItemBackgroundColor,
                itemBorderColor:_s._d.rlItemBorderColor,
                preloaderBkColor:_s._d.rlPreloaderBkColor,
                preloaderFillColor:_s._d.rlPreloaderFillColor,
                backgroundColor:_s._d.rlBackgroundColor,
                shareButtons:_s._d.rlShareButtons,
                shareText:_s._d.rlShareText,
                sharedURL:_s._d.rlSharedURL,
                shareMainBackgroundColor:_s._d.rlShareMainBackgroundColor,
                shareBackgroundColor:_s._d.rlShareBackgroundColor,
                showThumbnails:_s._d.rlShowThumbnails,
                showThumbnailsIcon:_s._d.rlShowThumbnailsIcon,
                thumbnailsHeight:_s._d.rlThumbnailsHeight,
                thumbnailsOverlayColor:_s._d.rlThumbnailsOverlayColor,
                thumbnailsBorderSize:_s._d.rlThumbnailsBorderSize,
                thumbnailsBorderColor:_s._d.rlThumbnailsBorderColor,
                spaceBetweenThumbnailsAndItem:_s._d.rlSpaceBetweenThumbnailsAndItem,
                thumbnailsOffsetBottom:_s._d.rlThumbnailsOffsetBottom,
                spaceBetweenThumbnails:_s._d.rlSpaceBetweenThumbnails,
                caption:_s._d.rlShowCaption,
                captionPosition:_s._d.rlCaptionPosition,
                showCaptionOnSmallScreens:_s._d.rlShowCaptionOnSmallScreens,
                captionAnimationType:_s._d.rlCaptionAnimationType,
                useVideo:_s._d.rlUseVideo,
                fillEntireScreenWithPoster:_s._d.rlFillEntireScreenWithPoster,
                volume:_s._d.rlVolume,
                videoAutoPlay:_s._d.rlVideoAutoPlay,
                nextVideoAutoPlay:_s._d.rlNextVideoAutoPlay,
                videoAutoPlayText:_s._d.rlVideoAutoPlayText,
                showLogo:_s._d.rlShowLogo,
                logoPath:_s._d.rlLogoPath,
                logoLink:_s._d.rlLogoLink,
                showControllerWhenVideoIsStopped:_s._d.rlShowControllerWhenVideoIsStopped,
                showDefaultControllerForVimeo:_s._d.rlShowDefaultControllerForVimeo,
                showScrubberWhenControllerIsHidden:_s._d.rlShowScrubberWhenControllerIsHidden,
                showRewindButton:_s._d.rlShowRewindButton,
                showVolumeButton:_s._d.rlShowVolumeButton,
                showTime:_s._d.rlShowTime,
                timeColor:_s._d.rlTimeColor,
                showChromecastButton:_s._d.rlShowChromecastButton,
                showPlaybackRateButton:_s._d.rlShowPlaybackRateButton,
                showQualityButton:_s._d.rlShowQualityButton,
                showFullScreenButton:_s._d.rlShowFullScreenButton,
                showScrubberToolTipLabel:_s._d.rlShowScrubberToolTipLabel,
                youtubeQualityButtonNormalColor:_s._d.rlYoutubeQualityButtonNormalColor,
                youtubeQualityButtonSelectedColor:_s._d.rlYoutubeQualityButtonSelectedColor,
                scrubbersToolTipLabelBackgroundColor:_s._d.rlScrubbersToolTipLabelBackgroundColor,
                scrubbersToolTipLabelFontColor:_s._d.rlScrubbersToolTipLabelFontColor,
                audioVisualizerLinesColor:_s._d.rlAudioVisualizerLinesColor,
                audioVisualizerCircleColor:_s._d.rlAudioVisualizerCircleColor,
                thumbnailsPreviewWidth:_s._d.rlThumbnailsPreviewWidth,
                thumbnailsPreviewBackgroundColor:_s._d.rlThumbnailsPreviewBackgroundColor,
                thumbnailsPreviewBorderColor:_s._d.rlThumbnailsPreviewBorderColor,
                thumbnailsPreviewLabelBackgroundColor:_s._d.rlThumbnailsPreviewLabelBackgroundColor,
                thumbnailsPreviewLabelFontColor:_s._d.rlThumbnailsPreviewLabelFontColor,
                skipToVideoText:_s._d.rlSkipToVideoText,
                skipToVideoButtonText:_s._d.rlSkipToVideoButtonText
            });
            
            _s.rl = window[_s.instName + '_rl'];

            _s.rl.addListener(FWDRL.SHOW_START, function(){
                FWDR3DCov.rlShowed = true;
                _s.dispatchEvent(FWDR3DCov.RL_SHOW_START);
            });

            _s.rl.addListener(FWDRL.HIDE_COMPLETE, function(){
                FWDR3DCov.rlShowed = false;
                _s.dispatchEvent(FWDR3DCov.RL_HIDE_COMPLETE);
            });
        }


        /**
         * Setup disable.
         */
        _s.setupDisable = function(){
            _s.disableDO = new FWDR3DCovDO3D("div");
            
            _s.disableDO.setZ(300000);
            
            if (FWDR3DCovUtils.isIE){
                _s.disableDO.setBkColor("#000000");
                _s.disableDO.setAlpha(.001);
            }
            
            _s.mainDO.addChild(_s.disableDO);
            _s.disableAll();
        };
        
        _s.disableAll = function(){
            _s.disableDO.setWidth(_s.stageWidth);
            _s.disableDO.setHeight(_s.stageHeight);
        };
        
        _s.enableAll = function(){
            _s.disableDO.setWidth(0);
            _s.disableDO.setHeight(0);
        };

        
        /**
         * API.
         */
        _s.isAPIReady = function(){
            return _s.apiReady;
        };
        
        _s.getCurrentCategoryId = function(){
            if (_s.apiReady){
                return _s.thumbsManagerDO.dataListId;
            }
        };
        
        _s.switchCategory = function(id){
            if (_s.apiReady){
                if ((id >= 0) && (id < _s._d.dataListAr.length)){
                    _s.disableAll();
                    _s.thumbsManagerDO.showCurrentCat(id);
                    _s.dispatchEvent(FWDR3DCov.INTRO_START);
                    
                    if (_s.menuDO){
                        _s.menuDO.setValue(id);
                    }
                    
                    _s.apiReady = false;
                }
            }
        };
        
        _s.getCurrentThumbId = function(){
            if (_s.apiReady){
                return _s.thumbsManagerDO.curId;
            }
        };
        
        _s.goToThumb = function(id){
            if (_s.apiReady){
                if (_s.thumbsManagerDO.infiniteLoop){
                    _s.thumbsManagerDO.curId = id;
                    if (_s.thumbsManagerDO.curId < 0){
                        _s.thumbsManagerDO.curId = _s.thumbsManagerDO.totalThumbs-1;
                    }else if (_s.thumbsManagerDO.curId > _s.totalThumbs-1){
                        _s.thumbsManagerDO.curId = 0;
                    }
                    
                    _s.thumbsManagerDO.goToThumb();
                }else if ((id >= 0) && (id < _s.thumbsManagerDO.totalThumbs) && (id != _s.thumbsManagerDO.curId)){
                    _s.thumbsManagerDO.curId = id;
                    _s.thumbsManagerDO.goToThumb();
                }
            }
        };
        
        _s.isSlideshowPlaying = function(){
            return _s.thumbsManagerDO.isPlaying;
        };
        
        _s.startSlideshow = function(){
            if (_s.apiReady){
                _s.thumbsManagerDO.startSlideshow();
            }
        };
        
        _s.stopSlideshow = function(){
            if (_s.apiReady){
                _s.thumbsManagerDO.stopSlideshow();
            }
        };

        
        /**
         * Event dispatcher.
         */
        _s.addListener = function (type, listener){
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function.");
            
            
            var event = {};
            event.type = type;
            event.listener = listener;
            event.target = _s;
            _s.listeners.events_ar.push(event);
        };
        
        _s.dispatchEvent = function(type, props){
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            
            for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
                if(_s.listeners.events_ar[i].target === _s && _s.listeners.events_ar[i].type === type){     
                    if(props){
                        for(var prop in props){
                            _s.listeners.events_ar[i][prop] = props[prop];
                        }
                    }
                    _s.listeners.events_ar[i].listener.call(_s, _s.listeners.events_ar[i]);
                }
            }
        };
        
       _s.removeListener = function(type, listener){
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function." + type);
            
            for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
                if(_s.listeners.events_ar[i].target === _s 
                        && _s.listeners.events_ar[i].type === type
                        && _s.listeners.events_ar[i].listener ===  listener
                ){
                    _s.listeners.events_ar.splice(i,1);
                    break;
                }
            }  
        };

        _s.init();
    };

    FWDR3DCov.RESIZE = 'resize';
    FWDR3DCov.FLUID_WIDTH = "fluidwidth";
    FWDR3DCov.RESPONSIVE = "responsive";
    FWDR3DCov.IMAGE = 'image';
    FWDR3DCov.VIDEO = 'video';
    FWDR3DCov.YOUTUBE = 'youtube';
    FWDR3DCov.VIMEO = 'vimeo';
    FWDR3DCov.AUDIO = 'audio';
    FWDR3DCov.HTML = 'html';
    FWDR3DCov.IFRAME = 'iframe';
    FWDR3DCov.INTRO_START = "onsIntroStart";
    FWDR3DCov.INTRO_FINISH = "onsIntroFinish";
    FWDR3DCov.DATA_LOADED = "onDataLoaded";
    FWDR3DCov.IS_API_READY = "isAPIReady";
    FWDR3DCov.CATEGORY_CHANGE = "categoryChanged";
    FWDR3DCov.THUMB_CHANGE = "thumbChanged";
    FWDR3DCov.RL_SHOW_START = 'rlShowStart';
    FWDR3DCov.RL_HIDE_COMPLETE = 'rlHideComplete';
    FWDR3DCov.GO_FULLSCREEN = 'goFullScreen';
    FWDR3DCov.GO_NORMALSCREEN = 'goNormalScreen';
    
    FWDR3DCov.cars = [];
    
    window.FWDR3DCov = FWDR3DCov;

}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Bullet button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    
    var FWDR3DCovBullet = function(
        id,
        bulletsNormalColor, 
        bulletsSelectedColor, 
        bulletsNormalRadius, 
        bulletsSelectedRadius){
        
        'use strict';

        var _s = this;
        var prototype = FWDR3DCovBullet.prototype;
        
        _s.id = id;

        _s.normalColor = bulletsNormalColor;
        _s.selectedColor = bulletsSelectedColor;
        _s.normalWidth = bulletsNormalRadius * 2;
        _s.selectedWidth = bulletsSelectedRadius * 2;
        _s.totalWidthAndHeight = _s.totalHeight = Math.max(_s.normalWidth, _s.selectedWidth);
        
        _s.isShowed_bl = true;
        _s.isMobile_bl = FWDR3DCovUtils.isMobile;
        
        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setupMainContainers();
            _s.setWidth(_s.totalWidthAndHeight);
            _s.setHeight(_s.totalWidthAndHeight);
            _s.setButtonMode(true);
            _s.setNormalState();
        };
        
        
        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){
            _s.screen.id = 'fwdr3dcov_bullet_' + _s.id;
            _s.screen.className = 'fwdr3dcov-bullet';
            
            _s.n_sdo = new FWDR3DCovDO("div");
            _s.n_sdo.setWidth(_s.normalWidth);
            _s.n_sdo.setHeight(_s.normalWidth);
            _s.n_sdo.setBkColor(_s.normalColor);
            _s.n_sdo.style().borderRadius = '100%';
            _s.n_sdo.setX(parseInt((_s.totalWidthAndHeight - _s.normalWidth)/2));
            _s.n_sdo.setY(_s.n_sdo.x);
            _s.addChild(_s.n_sdo);
            
            _s.s_sdo = new FWDR3DCovDO("div");  
            _s.s_sdo.setWidth(_s.selectedWidth);
            _s.s_sdo.setHeight(_s.selectedWidth);
            _s.s_sdo.setX(parseInt((_s.totalWidthAndHeight - _s.selectedWidth)/2));
            _s.s_sdo.setY(_s.s_sdo.x);
            _s.s_sdo.style().borderRadius = '100%';
            _s.s_sdo.style().boxSizing = 'border-box';
            _s.s_sdo.style().border = 'solid 1px ' + _s.selectedColor;
            _s.addChild(_s.s_sdo);

            _s.dumy_do = new FWDR3DCovDO("div");
            _s.dumy_do.style().width = '100%';
            _s.dumy_do.style().height = '100%';
            _s.addChild(_s.dumy_do);
            
            _s.setWidth(_s.totalWidth);
            _s.setHeight(_s.totalHeight);
            _s.screen.style.yellowOverlayPointerEvents = "none";
            
            if(_s.isMobile_bl){
                if(_s.hasPointerEvent_bl){
                    _s.screen.addEventListener("pointerup", _s.onMouseUp);
                    _s.screen.addEventListener("pointerover", _s.onMouseOver);
                    _s.screen.addEventListener("pointerout", _s.onMouseOut);
                }else{
                    _s.screen.addEventListener("touchend", _s.onMouseUp);
                }
            }else{  
                _s.screen.addEventListener("mouseover", _s.onMouseOver);
                _s.screen.addEventListener("mouseout", _s.onMouseOut);
                _s.screen.addEventListener("mouseup", _s.onMouseUp);
            }
        };
        
        _s.onMouseOver = function(e){
            _s.dispatchEvent(FWDR3DCovBullet.SHOW_TOOLTIP, {e:e});
            if(_s.isDisabledForGood_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
                if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
                _s.dispatchEvent(FWDR3DCovBullet.MOUSE_OVER, {e:e, id:_s.id});
                _s.setSelectedState();
            }
        };
            
        _s.onMouseOut = function(e){
            if(_s.isDisabledForGood_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
                if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
                _s.dispatchEvent(FWDR3DCovBullet.MOUSE_OUT, {e:e});
                _s.setNormalState();
            }
        };
        
        _s.onMouseUp = function(e){
            if(_s.isDisabledForGood_bl) return;
            if(e.preventDefault) e.preventDefault();
            if(_s.isDisabled_bl || e.button == 2) return;
            _s.dispatchEvent(FWDR3DCovBullet.MOUSE_UP, {id:_s.id});
        };
        
    
        /**
         * Set select / deselect final.
         */
        _s.setSelected = function(){
            _s.isSelectedFinal_bl = true;
            if(!_s.s_sdo) return;
            FWDAnimation.killTweensOf(_s.s_sdo);
            FWDAnimation.to(_s.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
        };
        
        _s.setUnselected = function(){
            _s.isSelectedFinal_bl = false;
            if(!_s.s_sdo) return;
            FWDAnimation.to(_s.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
        };
        

        /**
         * Set normal / selected state.
         */
        _s.setNormalState = function(){
            if(!_s.s_sdo) return;
            FWDAnimation.killTweensOf(_s.s_sdo);
            FWDAnimation.killTweensOf(_s.n_sdo.screen);
            
            FWDAnimation.to(_s.n_sdo.screen, .6, {css:{backgroundColor:_s.normalColor}, ease:Expo.easeOut});    
            FWDAnimation.to(_s.s_sdo, .6, {alpha:0, ease:Expo.easeOut});    
        };
        
        _s.setSelectedState = function(){
            if(!_s.s_sdo) return;
            FWDAnimation.killTweensOf(_s.s_sdo);
            FWDAnimation.killTweensOf(_s.n_sdo.screen);

            FWDAnimation.to(_s.n_sdo.screen, .6, {css:{backgroundColor:_s.selectedColor}, ease:Expo.easeOut});
            FWDAnimation.to(_s.s_sdo, .6, {alpha:1, delay:.1, ease:Expo.easeOut});
        };
        
    
        /**
         * Disable/enable.
         */
        _s.setDisabledState = function(){
            if(_s.isSetToDisabledState_bl) return;
            _s.isSetToDisabledState_bl = true;
            if(_s.d_sdo) _s.d_sdo.setX(0);
        };
        
        _s.setEnabledState = function(){
            if(!_s.isSetToDisabledState_bl) return;
            _s.isSetToDisabledState_bl = false;
            if(_s.d_sdo) _s.d_sdo.setX(-100);
        };
        
        _s.disable = function(setNormalState){
            if(_s.isDisabledForGood_bl  || _s.isDisabled_bl) return;
            _s.isDisabled_bl = true;
            _s.setButtonMode(false);
            if(!setNormalState) _s.setNormalState();
        };
        
        _s.enable = function(){
            if(_s.isDisabledForGood_bl || !_s.isDisabled_bl) return;
            _s.isDisabled_bl = false;
            _s.setButtonMode(true);
        };
        
        _s.disableForGood = function(){
            _s.isDisabledForGood_bl = true;
            _s.setButtonMode(false);
        };
        
        _s.showDisabledState = function(){
            if(_s.d_sdo.x != 0) _s.d_sdo.setX(0);
        };
        
        _s.hideDisabledState = function(){
            if(_s.d_sdo.x != -100) _s.d_sdo.setX(-100);
        };
        
        
        /**
         * Show/hide.
         */
        _s.show = function(dl){
            if(_s.isShowed_bl) return;
            _s.isShowed_bl = true;
            
            
            FWDAnimation.killTweensOf(_s);
            if(!FWDR3DCovUtils.isIEAndLessThen9){
                _s.setAlpha(0);
                FWDAnimation.to(_s, .8, {alpha:1, delay:dl,  onStart:function(){_s.setVisible(true);}, ease:Expo.easeOut});
            }else if(FWDR3DCovUtils.isIEAndLessThen9){
                _s.setVisible(true);
            }
        };  
            
        _s.hide = function(animate){
            if(!_s.isShowed_bl) return;
            _s.isShowed_bl = false;
            FWDAnimation.killTweensOf(_s);
            FWDAnimation.killTweensOf(_s.n_sdo);
            
            if(animate){
                if(!FWDR3DCovUtils.isIEAndLessThen9){
                    FWDAnimation.to(_s, .8, {alpha:0, ease:Expo.easeOut});
                }else if(FWDR3DCovUtils.isIEAndLessThen9){
                    _s.setVisible(false);
                }
            }else{
                _s.setVisible(false);
            }
        };
        
        _s.destroy = function(){
            FWDAnimation.killTweensOf(_s.n_sdo);
            FWDAnimation.killTweensOf(_s);
            
            _s.setInnerHTML("");
            prototype.destroy();
            _s = null;
            prototype = null;
            FWDR3DCovBullet.prototype = null;
        };
        
        _s.init();
    };
    

    /**
     * Prototype.
     */
    FWDR3DCovBullet.setPrototype = function(hasTransform){
        FWDR3DCovBullet.prototype = null;
        if(hasTransform){
            FWDR3DCovBullet.prototype = new FWDR3DCovTransformDisplayObject("div");
        }else{
            FWDR3DCovBullet.prototype = new FWDR3DCovDO("div");
        }
    };
    
    FWDR3DCovBullet.CLICK = "onClick";
    FWDR3DCovBullet.MOUSE_OVER = "onMouseOver";
    FWDR3DCovBullet.SHOW_TOOLTIP = "showTooltip";
    FWDR3DCovBullet.MOUSE_OUT = "onMouseOut";
    FWDR3DCovBullet.MOUSE_UP = "onMouseDown";
    
    FWDR3DCovBullet.prototype = null;
    window.FWDR3DCovBullet = FWDR3DCovBullet;
}(window));/* FWDR3DCovBulletsNavigation */
(function(window) {
    var FWDR3DCovBulletsNavigation = function(data, totalItems, curItemId){
        var _s = this;
        var prototype = FWDR3DCovBulletsNavigation.prototype;
    
        _s.bulletsNormalColor = data.bulletsNormalColor;
        _s.bulletsSelectedColor = data.bulletsSelectedColor;
        _s.bulletsNormalRadius = data.bulletsNormalRadius * 2;
        _s.bulletsSelectedRadius = data.bulletsSelectedRadius * 2;
        
        _s.mainHolder_do;
        
        _s.totalItems = totalItems;
        _s.curItemId = curItemId;
        _s.prevCurItemId = 0;
        _s.totalWidth = 0;
        _s.totalHeight = Math.max(_s.bulletsNormalRadius, _s.bulletsSelectedRadius);
        
        _s.mouseX = 0;
        _s.mouseY = 0;
        _s.spaceBetweenBullets = data.spaceBetweenBullets;
        _s.bullets_ar;
        
        _s.isPressed = false;

        _s.isMobile = FWDR3DCovUtils.isMobile;
        _s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;

        // ##########################################//
        /* initialize _s */
        // ##########################################//
        _s.init = function(){
            _s.mainHolder_do = new FWDR3DCovDO("div", "absolute", "visible");
            _s.addChild(_s.mainHolder_do);
            _s.setHeight(_s.totalHeight);
            _s.setWidth(_s.totalWidth);
            _s.createBullets();
            if(data.infiniteLoop) _s.updateInininteBullets();
            
        };
        
        _s.resize = function(stageWidth){
            _s.stageWidth = stageWidth;
        };
        
        _s.updateBullets = function(id){
            _s.curItemId = id;
            var bullet;
            
            if(data.infiniteLoop) return;

            for(var i=0; i<_s.totalItems; i++){
                bullet = _s.bullets_ar[i];
                if(i == _s.curItemId){
                    bullet.disable();
                    bullet.setSelectedState(true);
                }else{
                    bullet.enable();
                    bullet.setNormalState(true);
                }
            }
    
            _s.prevCurItemId = _s.curItemId;
        };

        _s.updateInininteBullets = function(id){

            _s.curItemId = Math.round(_s.totalItems/2) - 1;
            if(id === undefined)  id = _s.curItemId;
            for(var i=0; i<_s.totalItems; i++){
                bullet = _s.bullets_ar[i];
                if(i == id){
                    bullet.setSelectedState(true);
                }else{
                    bullet.setNormalState(true);
                }
            }
        }
        
        _s.createBullets = function(){
            var bullet;
            _s.bullets_ar = [];
            _s.totalWidth = 0;

            if(data.infiniteLoop){
                _s.totalItems = data.nrThumbsToDisplay * 2 + 1;
            }

        
            for(var i=0; i<_s.totalItems; i++){
                FWDR3DCovBullet.setPrototype();
                bullet = new FWDR3DCovBullet(i, data.bulletsNormalColor, data.bulletsSelectedColor, data.bulletsNormalRadius, data.bulletsSelectedRadius);
                bullet.addListener(FWDR3DCovBullet.MOUSE_UP, _s.bulletMouseUpHanlder);
                
                if(data.infiniteLoop){
                    bullet.addListener(FWDR3DCovBullet.MOUSE_OVER, _s.bulletMouseOverHanlder);
                    bullet.addListener(FWDR3DCovBullet.MOUSE_OUT, _s.bulletMouseOutHanlder);
                }
                
                _s.totalWidth += bullet.w + _s.spaceBetweenBullets;
                bullet.setX((bullet.w + _s.spaceBetweenBullets) * i);
                bullet.hide();
                _s.mainHolder_do.addChild(bullet);
                _s.bullets_ar[i] = bullet;
            }
            
            
            _s.totalWidth -= _s.spaceBetweenBullets;
            _s.setWidth(_s.totalWidth);
            
            _s.updateBullets(_s.curItemId);
            
            clearTimeout(_s.showBulletsId_to);
            if(data.infiniteLoop) _s.updateInininteBullets();
            _s.showBulletsId_to = setTimeout(_s.show, 1000);
        };
        
        _s.bulletMouseUpHanlder = function(e){
            var id = e.id;
            if(data.infiniteLoop){
                _s.curItemId = Math.round(_s.totalItems/2) - 1;
                id = id - _s.curItemId;
            }
            
            _s.dispatchEvent(FWDR3DCovBulletsNavigation.BULLET_CLICK, {id:id});
        };

        _s.bulletMouseOverHanlder =  function(e){
            clearTimeout(_s.upd);
            _s.updateInininteBullets(e.id);
        }

        _s.bulletMouseOutHanlder = function(e){
            clearTimeout(_s.upd);
            _s.upd = setTimeout(_s.updateInininteBullets, 500);
        }
        
        _s.hideBullets = function(){
            clearTimeout(_s.showBulletsId_to);
            var bullet;
            for(var i=0; i<_s.totalItems; i++){
                bullet = _s.bullets_ar[i];
                bullet.hide(true);
            }
            clearTimeout(_s.hideBulletsId_to);
            _s.hideBulletsId_to = setTimeout(_s.destroyBullets, 800);
        };
        
        _s.destroyBullets = function(){
            clearTimeout(_s.showBulletsId_to);
            var bullet;
            for(var i=0; i<_s.totalItems; i++){
                bullet = _s.bullets_ar[i];
                _s.mainHolder_do.removeChild(bullet);
                bullet.destroy();
            }
        };
        
        _s.show = function(){
            var bullet;
            var delayRight = .1;
            var delayLeft = _s.curItemId/10;

            if(data.infiniteLoop){
                _s.curItemId = Math.round(_s.totalItems/2) - 1;
                delayLeft = _s.curItemId/10;
            } 

            var bullet = _s.bullets_ar[_s.curItemId];
            bullet.show(0);

            for(var i=_s.curItemId; i<_s.totalItems; i++){
                bullet = _s.bullets_ar[i];
                bullet.show(delayRight);
                delayRight += .1;
            }
            
            for(var i=0; i<_s.totalItems; i++){
                bullet = _s.bullets_ar[i];
                bullet.show(delayLeft);
                delayLeft -= .1;
            }
        };
        
        // ##############################//
        /* destroy */
        // ##############################//
        _s.destroy = function() {
            clearTimeout(_s.showBulletsId_to);
            clearTimeout(_s.hideBulletsId_to);
            
            _s.main_do.destroy();
            _s.main_do = null;
            
            _s.setInnerHTML("");
            prototype.destroy();
            _s = null;
            prototype = null;
            FWDR3DCovBulletsNavigation.prototype = null;
        };

        _s.init();
    };

    /* set prototype */
    FWDR3DCovBulletsNavigation.setPrototype = function(){
        FWDR3DCovBulletsNavigation.prototype = new FWDR3DCovDO("div");
    };

    FWDR3DCovBulletsNavigation.BULLET_CLICK = "bulletClick";

    FWDR3DCovBulletsNavigation.prototype = null;
    window.FWDR3DCovBulletsNavigation = FWDR3DCovBulletsNavigation;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Right click context menu.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
    var FWDR3DCovContextMenu = function(e, showMenu){

        'use strict';
        
        var _s = this;
        _s.prt = e;
        _s.url = "http://www.webdesign-flash.ro";
        _s.menu_do = null;
        _s.normalMenu_do = null;
        _s.selectedMenu_do = null;
        _s.over_do = null;
        _s.isDisabled_bl = false;
        

        /**
         * Initialize.
         */
        _s.init = function(){
            _s.updateParent(_s.prt);
        };
        

        /**
         * Update parent.
         */
        _s.updateParent = function(prt){
            if(_s.prt){
                if(_s.prt.screen.addEventListener){
                    _s.prt.screen.removeEventListener("contextmenu", _s.contextMenuHandler);
                }else{
                    _s.prt.screen.detachEvent("oncontextmenu", _s.contextMenuHandler);
                }
                
            }
            _s.prt = prt;
            
            if(_s.prt.screen.addEventListener){
                _s.prt.screen.addEventListener("contextmenu", _s.contextMenuHandler);
            }else{
                _s.prt.screen.attachEvent("oncontextmenu", _s.contextMenuHandler);
            }
        };
        
        _s.contextMenuHandler = function(e){
            if(_s.isDisabled_bl) return;
            if(showMenu =="disabled"){
                if(e.preventDefault){
                    e.preventDefault();
                    return;
                }else{
                    return false;
                }
            }else if(showMenu =="default"){
                return;
            }
            
            if(_s.url.indexOf("sh.r") == -1) return;
            _s.setupMenus();
            _s.prt.addChild(_s.menu_do);
            _s.menu_do.setVisible(true);
            _s.positionButtons(e);
            
            if(window.addEventListener){
                window.addEventListener("mousedown", _s.contextMenuWindowOnMouseDownHandler);
            }else{
                document.documentElement.attachEvent("onclick", _s.contextMenuWindowOnMouseDownHandler);
            }
            
            if(e.preventDefault){
                e.preventDefault();
            }else{
                return false;
            }
            
        };
        
        _s.contextMenuWindowOnMouseDownHandler = function(e){
            var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);
            var screenX = viewportMouseCoordinates.screenX;
            var screenY = viewportMouseCoordinates.screenY;
            
            if(!FWDR3DCovUtils.hitTest(_s.menu_do.screen, screenX, screenY)){
                if(window.removeEventListener){
                    window.removeEventListener("mousedown", _s.contextMenuWindowOnMouseDownHandler);
                }else{
                    document.documentElement.detachEvent("onclick", _s.contextMenuWindowOnMouseDownHandler);
                }
                _s.menu_do.setX(-500);
            }
        };
        
        
        /**
         * Setup menus.
         */
        _s.setupMenus = function(){
            if(_s.menu_do) return;
            _s.menu_do = new FWDR3DCovDO("div");
            _s.menu_do.setX(-500);
            _s.menu_do.style().width = "100%";
            
            _s.normalMenu_do = new FWDR3DCovDO("div");
            _s.normalMenu_do.style().fontFamily = "Arial, Helvetica, sans-serif";
            _s.normalMenu_do.style().padding = "4px";
            _s.normalMenu_do.style().fontSize = "12px";
            _s.normalMenu_do.style().color = "#000000";
            _s.normalMenu_do.setInnerHTML("&#0169; made by FWD");
            _s.normalMenu_do.setBkColor("#FFFFFF");
            
            _s.selectedMenu_do = new FWDR3DCovDO("div");
            _s.selectedMenu_do.style().fontFamily = "Arial, Helvetica, sans-serif";
            _s.selectedMenu_do.style().padding = "4px";
            _s.selectedMenu_do.style().fontSize = "12px";
            _s.selectedMenu_do.style().color = "#FFFFFF";
            _s.selectedMenu_do.setInnerHTML("&#0169; made by FWD");
            _s.selectedMenu_do.setBkColor("#000000");
            _s.selectedMenu_do.setAlpha(0);
            
            _s.over_do = new FWDR3DCovDO("div");
            _s.over_do.setBkColor("#FF0000");
            _s.over_do.setAlpha(0);
            
            _s.menu_do.addChild(_s.normalMenu_do);
            _s.menu_do.addChild(_s.selectedMenu_do);
            _s.menu_do.addChild(_s.over_do);
            _s.prt.addChild(_s.menu_do);
            _s.over_do.setWidth(_s.selectedMenu_do.getWidth());
            _s.menu_do.setWidth(_s.selectedMenu_do.getWidth());
            _s.over_do.setHeight(_s.selectedMenu_do.getHeight());
            _s.menu_do.setHeight(_s.selectedMenu_do.getHeight());
            _s.menu_do.setVisible(false);
            
            _s.menu_do.setButtonMode(true);
            _s.menu_do.screen.onmouseover = _s.mouseOverHandler;
            _s.menu_do.screen.onmouseout = _s.mouseOutHandler;
            _s.menu_do.screen.onclick = _s.onClickHandler;
        };
        
        _s.mouseOverHandler = function(){
            if(_s.url.indexOf("w.we") == -1) _s.menu_do.visible = false;
            FWDAnimation.to(_s.normalMenu_do, .8, {alpha:0, ease:Expo.easeOut});
            FWDAnimation.to(_s.selectedMenu_do, .8, {alpha:1, ease:Expo.easeOut});
        };
        
        _s.mouseOutHandler = function(){
            FWDAnimation.to(_s.normalMenu_do, .8, {alpha:1, ease:Expo.easeOut});
            FWDAnimation.to(_s.selectedMenu_do, .8, {alpha:0, ease:Expo.easeOut});
        };
        
        _s.onClickHandler = function(){
            window.open(_s.url, "_blank");
        };
        
        
        /**
         * Position buttons.
         */
        _s.positionButtons = function(e){
            var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);
            var localX = viewportMouseCoordinates.screenX - _s.prt.getGlobalX(); 
            var localY = viewportMouseCoordinates.screenY - _s.prt.getGlobalY();
            var finalX = localX + 2;
            var finalY = localY + 2;
            
            if(finalX > _s.prt.getWidth() - _s.menu_do.getWidth() - 2){
                finalX = localX - _s.menu_do.getWidth() - 2;
            }
            
            if(finalY > _s.prt.getHeight() - _s.menu_do.getHeight() - 2){
                finalY = localY - _s.menu_do.getHeight() - 2;
            }
            _s.menu_do.setX(finalX);
            _s.menu_do.setY(finalY);
        };
        
        
        /**
         * Enable/disable.
         */
        _s.disable = function(){
            _s.isDisabled_bl = true;
        };
        
        _s.enable = function(){
            _s.isDisabled_bl = false;
        };
        
        _s.init();
    };
    
    FWDR3DCovContextMenu.prototype = null;
    window.FWDR3DCovContextMenu = FWDR3DCovContextMenu;
    
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Data.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
    var FWDR3DCovData = function(props, prt){
        
        'use strict';

        var _s = this;
        var prototype = FWDR3DCovData.prototype;

        _s.props = props;
        _s.graphicsPathsAr = [];
        _s.imagesAr = [];
        _s.dataListAr = [];
        _s.categoriesAr = [];
        _s.lightboxAr = [];
        _s.countLoadedGraphics = 0;

        
        /**
         * Initalize.
         */
        _s.init = function(){
            _s.parseProperties();
        };


        /**
         * Set props.
         */
        _s.parseProperties = function(){
            var errorMessage;

            // Check for coverflowDataListDivId property.
            if (!_s.props.coverflowDataListDivId){
                errorMessage = "Carousel _d list id is not defined in FWDR3DCov constructor function!";
                _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text : errorMessage});
                return;
            };

            // Set the root element of the coverflow list.
            _s.rootElement = prt.rootElement;

            
            _s.mainFolderPath = _s.props.mainFolderPath;
            if(!_s.mainFolderPath){
                setTimeout(function(){
                    if(_s == null) return;
                    errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
                    _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:errorMessage_str});
                }, 50);
                return;
            }
            
            if((_s.mainFolderPath.lastIndexOf("/") + 1) != _s.mainFolderPath.length){
                _s.mainFolderPath += "/";
            }
            
            _s.skinPath_str = _s.props.skinPath;;
            if(!_s.skinPath_str){
                setTimeout(function(){
                    if(_s == null) return;
                    errorMessage_str = "The <font color='#FF0000'>skinPath</font> property is not defined in the constructor function!";
                    _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:errorMessage_str});
                }, 50);
                return;
            }
            
        
            if((_s.skinPath_str.lastIndexOf("/") + 1) != _s.skinPath_str.length){
                _s.skinPath_str += "/";
            }
            
            _s.lightboxSkinPath_str = _s.skinPath_str;
            _s.skinPath_str = _s.mainFolderPath + _s.skinPath_str;

            if(_s.skinPath_str.indexOf('white') != -1){
                _s.isSkinWhite = true;
            }
            
            _s.handIconPath_str = _s.skinPath_str + "/hand.cur";
            _s.grabIconPath_str = _s.skinPath_str + "/grab.cur";
            

            // Set main properties.
            _s.useDragAndSwipe_bl = _s.props.useDragAndSwipe;
            _s.useDragAndSwipe_bl = _s.useDragAndSwipe_bl == "yes" ? true : false;
            _s.backgroundColor = _s.props.backgroundColor || "transparent";
            _s.thumbXSpace3D = _s.props.thumbnailXSpace3D || 0;
            _s.thumbXOffset3D = _s.props.thumbnailXOffset3D || 0;
            _s.thumbZSpace3D = _s.props.thumbnailZSpace3D || 0;
            _s.thumbZOffset3D = _s.props.thumbnailZOffset3D || 0;
            _s.thumbYAngle3D = _s.props.thumbnailYAngle3D || 0;
            _s.thumbHoverOffset = _s.props.thumbnailHoverOffset || 0;
            _s.thumbnailOffsetY = _s.props.thumbnailOffsetY || 0;
            _s.coverflowXRotation = _s.props.coverflowXRotation || 0;
            _s.rightClickContextMenu = _s.props.rightClickContextMenu;
            _s.addKeyboardSupport = _s.props.addKeyboardSupport == "yes" ? true : false;
            _s.useVectorIcons = _s.props.useVectorIcons == "yes" ? true : false;
            _s.showGradient = _s.props.showThumbnailsGradient == "yes" ? true : false;
            _s.gradientColor1 = _s.props.thumbnailGradientColor1;
            _s.gradientColor2 = _s.props.thumbnailGradientColor2;
        
            
            // Thumbs properties.
            _s.thumbWidth = _s.props.thumbnailWidth || 400;
            _s.thumbHeight = _s.props.thumbnailHeight || 266;
            _s.thumbBorderSize = _s.props.thumbnailBorderSize || 0;
            if(_s.thumbMinAlpha == undefined) _s.thumbMinAlpha = .3;
            _s.thumbBackgroundColor = _s.props.thumbnailBackgroundColor || "transparent";
            _s.thumbBorderColor1 = _s.props.thumbnailBorderColor1 || "transparent";
            _s.thumbBorderColor2 = _s.props.thumbnailBorderColor2 || "transparent";
            _s.transparentImages = _s.props.transparentImages == "yes" ? true : false;
            _s.infiniteLoop = _s.props.infiniteLoop == "yes" ? true : false;
            _s.showGradient = _s.props.showThumbnailsGradient == "yes" ? true : false;
            _s.showCaption = _s.props.showCaption == "yes" ? true : false;
            _s.showCaptionOnTap = _s.props.showCaptionOnTap == "yes" ? true : false;
            _s.captionPosition = _s.props.captionPosition || 'out';
            _s.captionAnimationType = _s.props.captionAnimationType || 'opacity';
            _s.showFullCaption = _s.props.showFullCaption == "yes" ? true : false;
            _s.coverflowStartPosition = _s.props.coverflowStartPosition;

            if (_s.props.numberOfThumbnailsToDisplayLeftAndRight == "all"){
                _s.nrThumbsToDisplay = 0;
                _s.infiniteLoop = false;
            }else{
                _s.nrThumbsToDisplay = parseInt(_s.props.numberOfThumbnailsToDisplayLeftAndRight) || 0;
            }

            _s.useVideo = _s.props.useVideo == "yes" ? true : false;
            _s.videoAutoPlay = _s.props.videoAutoPlay == "yes" ? true : false;
            _s.nextVideoAutoPlay = _s.props.nextVideoAutoPlay == "yes" ? true : false;
            _s.videoAutoPlayText = _s.props.videoAutoPlayText || 'Click to unmute';
            _s.volume = _s.props.volume;
            if(_s.volume === undefined) _s.volume = 1;
            _s.showLogo = _s.props.showLogo == "yes" ? true : false;
            _s.logoPath = _s.props.logoPath || "content/rl/content/evp/skin/logo.png";
            _s.hideLogoWithController = _s.props.hideLogoWithController == "yes" ? true : false;
            _s.logoLink = _s.props.logoLink || '';
            _s.showDefaultControllerForVimeo = _s.props.showDefaultControllerForVimeo == "yes" ? true : false;
            _s.showScrubberWhenControllerIsHidden = _s.props.showScrubberWhenControllerIsHidden == "yes" ? true : false;
            _s.showVolumeButton = _s.props.showVolumeButton == "yes" ? true : false;
            _s.showScrubberToolTipLabel = _s.props.showScrubberToolTipLabel == "yes" ? true : false;
            _s.showTime = _s.props.showTime == "yes" ? true : false;
            _s.showRewindButton = _s.props.showRewindButton == "yes" ? true : false;
            _s.showQualityButton = _s.props.showQualityButton == "yes" ? true : false;
            _s.showChromecastButton = _s.props.showChromecastButton == "yes" ? true : false;
            _s.showFullScreenButton = _s.props.showFullScreenButton == "yes" ? true : false;
            _s.showScrubberToolTipLabel = _s.props.showScrubberToolTipLabel == "yes" ? true : false;
            _s.fillEntireVideoScreen = _s.props.fillEntireVideoScreen == "yes" ? true : false;
            _s.videoControllerHideDelay = _s.props.videoControllerHideDelay;
            if(_s.videoControllerHideDelay === undefined) _s.videoControllerHideDelay = 3000;
            _s.videoControllerHideDelay = _s.videoControllerHideDelay/1000;
            _s.timeColor = _s.props.timeColor || '#B9B9B9';
            _s.youtubeQualityButtonNormalColor = _s.props.youtubeQualityButtonNormalColor || '#B9B9B9';
            _s.youtubeQualityButtonSelectedColor = _s.props.youtubeQualityButtonSelectedColor || '#FFFFFF';
            _s.scrubbersToolTipLabelBackgroundColor = _s.props.scrubbersToolTipLabelBackgroundColor || '#FFFFFF';
            _s.scrubbersToolTipLabelFontColor = _s.props.scrubbersToolTipLabelFontColor || '#5a5a5a';
            _s.showPlaybackRateButton = _s.props.showPlaybackRateButton == "yes" ? true : false;
            _s.audioVisualizerLinesColor = _s.props.audioVisualizerLinesColor || '#570AB8';
            _s.audioVisualizerCircleColor = _s.props.audioVisualizerCircleColor || '#b9b9b9';
            _s.thumbnailsPreviewWidth = _s.props.thumbnailsPreviewWidth || 196;
            _s.thumbnailsPreviewBackgroundColor = _s.props.thumbnailsPreviewBackgroundColor || '#2e2e2e';
            _s.thumbnailsPreviewBorderColor = _s.props.thumbnailsPreviewBorderColor || '#414141';
            _s.thumbnailsPreviewLabelBackgroundColor = _s.props.thumbnailsPreviewLabelBackgroundColor || '#414141';
            _s.thumbnailsPreviewLabelFontColor = _s.props.thumbnailsPreviewLabelFontColor || '#CCCCCC';
            _s.skipToVideoText = _s.props.skipToVideoText || 'You can skip to video in: ';
            _s.skipToVideoButtonText = _s.props.skipToVideoButtonText || 'Skip Ad';
            _s.rlLogoLink = _s.props.rlLogoLink || '';
            _s.rlShowControllerWhenVideoIsStopped = _s.props.rlShowControllerWhenVideoIsStopped == "yes" ? true : false;
            _s.rlShowDefaultControllerForVimeo = _s.props.rlShowDefaultControllerForVimeo == "yes" ? true : false;
            _s.rlShowScrubberWhenControllerIsHidden = _s.props.rlShowScrubberWhenControllerIsHidden == "yes" ? true : false;
            _s.rlShowRewindButton = _s.props.rlShowRewindButton == "yes" ? true : false;
            _s.rlShowVolumeButton = _s.props.rlShowVolumeButton == "yes" ? true : false;
            _s.rlShowTime = _s.props.rlShowTime == "yes" ? true : false;
            _s.rlTimeColor = _s.props.rlTimeColor || "#B9B9B9";
            _s.rlShowChromecastButton = _s.props.rlShowChromecastButton == "yes" ? true : false;
            _s.rlShowPlaybackRateButton = _s.props.rlShowPlaybackRateButton == "yes" ? true : false;
            _s.rlShowQualityButton = _s.props.rlShowQualityButton == "yes" ? true : false;
            _s.rlShowFullScreenButton = _s.props.rlShowFullScreenButton == "yes" ? true : false;
            _s.rlShowScrubberToolTipLabel = _s.props.rlShowScrubberToolTipLabel == "yes" ? true : false;
            _s.rlYoutubeQualityButtonNormalColor = _s.props.rlYoutubeQualityButtonNormalColor || '#B9B9B9';
            _s.rlYoutubeQualityButtonSelectedColor = _s.props.rlYoutubeQualityButtonSelectedColor || '#FFFFFF';
            _s.rlScrubbersToolTipLabelBackgroundColor = _s.props.rlScrubbersToolTipLabelBackgroundColor || '#FFFFFF';
            _s.rlScrubbersToolTipLabelFontColor = _s.props.rlScrubbersToolTipLabelFontColor || '#5a5a5a';
            _s.rlAudioVisualizerLinesColor = _s.props.rlAudioVisualizerLinesColor || '#570AB8';
            _s.rlAudioVisualizerCircleColor = _s.props.rlAudioVisualizerCircleColor || '#b9b9b9';
            
            if (_s.transparentImages){
                _s.thumbBorderSize = 0;
            }
            _s.thumbWidth += _s.thumbBorderSize * 2;
            _s.thumbHeight += _s.thumbBorderSize * 2;

            
            // Controls properties.
            _s.showLargeNextAndPrevButtons = _s.props.showLargeNextAndPrevButtons == "yes" ? true : false;
            _s.largeNextAndPrevButtonsMaxWidthPos = _s.props.largeNextAndPrevButtonsMaxWidthPos || 0;
            _s.nextAndPrevButtonsOffsetX = _s.props.nextAndPrevButtonsOffsetX || 20;
            _s.showNextAndPrevButtonsOnMobile_str = _s.props.showNextAndPrevButtonsOnMobile;
            _s.showScrollbar = _s.props.showScrollbar == "yes" ? true : false;
            _s.showScrollbarOnMobile = _s.props.showScrollbarOnMobile == "yes" ? true : false;
            _s.showNextAndPrevButtonsOnMobile = _s.props.showNextAndPrevButtonsOnMobile == "yes" ? true : false;
            _s.enableMouseWheelScroll = _s.props.enableMouseWheelScroll == "yes" ? true : false;
            _s.controlsMaxWidth = _s.props.controlsMaxWidth || 800;
            _s.controlsOffset = parseInt(_s.props.controlsOffset);
            _s.handlerWidth = _s.props.scrollbarHandlerWidth || 300;
            _s.scrollbarTextColorNormal = _s.props.scrollbarTextColorNormal || "#777777";
            _s.scrollbarTextColorSelected = _s.props.scrollbarTextColorSelected || "#FF0000";
            _s.slideshowDelay = _s.props.slideshowDelay || 5;
            _s.slideshowDelay = _s.slideshowDelay * 1000;
            _s.slideshowPreloaderBackgroundColor = _s.props.slideshowPreloaderBackgroundColor || "#333333";
            _s.slideshowPreloaderFillColor = _s.props.slideshowPreloaderFillColor || "#FFFFFF";
            _s.slideshowAutoplay = _s.props.slideshowAutoplay == "yes" ? true : false;
            _s.showNextAndPrevButtons = _s.props.showNextAndPrevButtons == "yes" ? true : false;
            _s.showSlideshowButton = _s.props.showSlideshowButton == "yes" ? true : false;
            _s.slideshowTimerColor = _s.props.slideshowTimerColor || "#777777";
            _s.controlsPos = _s.props.controlsPosition == "top" ? true : false;

            _s.showBulletsNavigation = _s.props.showBulletsNavigation;
            _s.showBulletsNavigation = _s.showBulletsNavigation == "yes" ? true : false;
            if(_s.showBulletsNavigation){
                _s.showNextAndPrevButtons = false;
                _s.showScrollbar = false;
                _s.showNextAndPrevButtons = false;
                _s.showSlideshowButton = false;
            }

            _s.bulletsNormalColor = _s.props.bulletsNormalColor || "#333333";
            _s.bulletsSelectedColor = _s.props.bulletsSelectedColor || "#FFFFFF";
            _s.bulletsNormalRadius = _s.props.bulletsNormalRadius || 6;
            _s.bulletsSelectedRadius = _s.props.bulletsSelectedRadius || 6;
            _s.spaceBetweenBullets = _s.props.spaceBetweenBullets || 6;

            
            // Reflection.
            _s.showRefl = _s.props.showReflection == "yes" ? true : false;
            _s.reflHeight = _s.props.reflectionHeight || 100;
            _s.reflDist = _s.props.reflectionDistance || 0;
            _s.reflAlpha = _s.props.reflectionOpacity || .5;

            
            // Menu.
            _s.showMenu = _s.props.showMenu == "yes" ? true : false;
            _s.showAllCategories = _s.props.showAllCategories == "yes" ? true : false;
            _s.allCategoriesLabel = _s.props.allCategoriesLabel || null;
            _s.selectLabel = _s.props.selectLabel || "not defined!";
            _s.selectorLineColor = _s.props.selectorLineColor;
            _s.selectorBackgroundColor = _s.props.selectorBackgroundColor;
            _s.buttonBackgroundColor = _s.props.buttonBackgroundColor;
            _s.selectorTextNormalColor = _s.props.selectorTextNormalColor;
            _s.selectorTextSelectedColor = _s.props.selectorTextSelectedColor;
            _s.buttonBackgroundNormalColor1 = _s.props.buttonBackgroundNormalColor1;
            _s.buttonTextNormalColor = _s.props.buttonTextNormalColor;
            _s.buttonTextSelectedColor = _s.props.buttonTextSelectedColor;
            _s.comboBoxHorizontalMargins = _s.props.menuHorizontalMargins || 0;
            _s.comboBoxVerticalMargins = _s.props.menuVerticalMargins || 0;
            
            if ((_s.props.menuPosition == "topleft") || (_s.props.menuPosition == "topright")){
                _s.menuPosition = FWDR3DCovUtils.trim(_s.props.menuPosition).toLowerCase();
            }else{
                _s.menuPosition = "topleft";
            }

            
            // Lightbox.
            _s.useLightbox = _s.props.useLightbox == "yes" ? true : false;
            _s.rlUseDeepLinking = _s.props.rlUseDeepLinking == "yes" ? true : false;
            _s.rlButtonsAlignment = _s.props.rlButtonsAlignment;
            _s.rlMediaLazyLoading = _s.props.rlMediaLazyLoading == "yes" ? true : false;
            _s.rlUseDrag = _s.props.rlUseDrag == "yes" ? true : false;
            _s.rlUseAsModal = _s.props.rlUseAsModal == "yes" ? true : false;
            _s.rlShowSlideShowButton = _s.props.rlShowSlideShowButton == "yes" ? true : false;
            _s.rlShowSlideShowAnimation = _s.props.rlShowSlideShowAnimation == "yes" ? true : false;
            _s.rlSlideShowAutoPlay = _s.props.rlSlideShowAutoPlay == "yes" ? true : false;
            _s.rlSlideShowAutoStop = _s.props.rlSlideShowAutoStop == "yes" ? true : false;
            _s.rlSlideShowDelay = _s.props.rlSlideShowDelay || 6;
            _s.rlSlideShowBkColor = _s.props.rlSlideShowBkColor || '#2e2e2e';
            _s.rlSlideShowFillColor = _s.props.rlSlideShowFillColor || '#FFFFFF';
            _s.rlUseKeyboard = _s.props.rlUseKeyboard == "yes" ? true : false;
            _s.rlUseDoubleClick = _s.props.rlUseDoubleClick == "yes" ? true : false;
            _s.rlShowCloseButton = _s.props.rlShowCloseButton == "yes" ? true : false;
            _s.rlShowFullscreenButton = _s.props.rlShowFullscreenButton == "yes" ? true : false;
            _s.rlShowZoomButton = _s.props.rlShowZoomButton == "yes" ? true : false;
            _s.rlShowCounter = _s.props.rlShowCounter == "yes" ? true : false;
            _s.rlShowNextAndPrevBtns = _s.props.rlShowNextAndPrevBtns == "yes" ? true : false;
            _s.rlMaxZoom = _s.props.rlMaxZoom || 6;
            _s.rlButtonsHideDelay = _s.props.rlButtonsHideDelay || 5;
            _s.rlDefaultItemWidth = _s.props.rlDefaultItemWidth || 1527;
            _s.rlDefaultItemHeight = _s.props.rlDefaultItemHeight || 859;
            _s.rlItemOffsetHeight = _s.props.rlItemOffsetHeight || 37;
            _s.rlItemOffsetHeightButtonsTop = _s.props.rlItemOffsetHeightButtonsTop || 47;
            _s.rlSpaceBetweenBtns = _s.props.rlSpaceBetweenBtns || 8;
            _s.rlButtonsOffsetIn = _s.props.rlButtonsOffsetIn || 10;
            _s.rlButtonsOffsetOut = _s.props.rlButtonsOffsetOut || 10;
            _s.rlItemBorderSize = _s.props.rlItemBorderSize || 0;
            _s.rlItemBackgroundColor = _s.props.rlItemBackgroundColor || '#212121';
            _s.rlItemBorderColor = _s.props.rlItemBorderColor || '#FFFFFF';
            _s.rlPreloaderBkColor = _s.props.rlPreloaderBkColor || '#2e2e2e';
            _s.rlPreloaderFillColor = _s.props.rlPreloaderFillColor || '#FFFFFF';
            _s.rlBackgroundColor = _s.props.rlBackgroundColor || 'rgba(0,0,0,.99)';
            _s.rlShareButtons = _s.props.rlShareButtons || ['facebook', 'twitter', 'linkedin', 'tumblr', 'pinterest', 'reddit', 'buffer', 'digg','blogger'];
            _s.rlShareText = _s.props.rlShareText || 'Share on';
            _s.rlSharedURL = _s.props.rlSharedURL || 'deeplink';
            _s.rlShareMainBackgroundColor = _s.props.rlShareMainBackgroundColor || 'rgba(0,0,0,.4)';
            _s.rlShareBackgroundColor = _s.props.rlShareBackgroundColor || '#FFFFFF';
            _s.rlShowThumbnails = _s.props.rlShowThumbnails == "yes" ? true : false;
            _s.rlShowThumbnailsIcon = _s.props.rlShowThumbnailsIcon == "yes" ? true : false;
            _s.rlThumbnailsHeight = _s.props.rlThumbnailsHeight || 80;
            _s.rlThumbnailsOverlayColor = _s.props.rlThumbnailsOverlayColor || 'rgba(0,0,0,.4)';
            _s.rlThumbnailsBorderSize = _s.props.rlThumbnailsBorderSize;
            if(_s.rlThumbnailsBorderSize ==  undefined) _s.rlThumbnailsBorderSize = 2;
            _s.rlThumbnailsBorderColor = _s.props.rlThumbnailsBorderColor || '#FFFFFF';
            _s.rlSpaceBetweenThumbnailsAndItem = _s.props.rlSpaceBetweenThumbnailsAndItem;
            if(_s.rlSpaceBetweenThumbnailsAndItem ==  undefined) _s.rlSpaceBetweenThumbnailsAndItem = 10;
            _s.rlThumbnailsOffsetBottom = _s.props.rlThumbnailsOffsetBottom;
            if(_s.rlThumbnailsOffsetBottom ==  undefined) _s.rlThumbnailsOffsetBottom = 10;
            _s.rlSpaceBetweenThumbnails = _s.props.rlSpaceBetweenThumbnails;
            if(_s.rlSpaceBetweenThumbnails ==  undefined) _s.rlSpaceBetweenThumbnails = 5;
            _s.rlShowCaption = _s.props.rlShowCaption == "yes" ? true : false;
            _s.rlCaptionPosition = _s.props.rlCaptionPosition || 'bottomout';
            _s.rlShowCaptionOnSmallScreens = _s.props.rlShowCaptionOnSmallScreens == "yes" ? true : false;
            _s.rlCaptionAnimationType = _s.props.rlCaptionAnimationType || 'motion';
            _s.rlUseVideo = _s.props.rlUseVideo == "yes" ? true : false;
            _s.rlFillEntireScreenWithPoster = _s.props.rlFillEntireScreenWithPoster == "yes" ? true : false;
            _s.rlVolume = _s.props.rlVolume;
            if(_s.rlVolume === undefined) _s.rlVolume = 1;
            _s.rlVideoAutoPlay = _s.props.rlVideoAutoPlay == "yes" ? true : false;
            _s.rlNextVideoAutoPlay = _s.props.rlNextVideoAutoPlay == "yes" ? true : false;
            _s.rlVideoAutoPlayText = _s.props.rlVideoAutoPlayText || 'Click to unmute';
            _s.rlShowLogo = _s.props.rlShowLogo == "yes" ? true : false;
            _s.rlLogoPath = _s.props.rlLogoPath || "content/rl/content/evp/skin/logo.png";
            _s.rlThumbnailsPreviewWidth = _s.props.rlThumbnailsPreviewWidth || 196;
            _s.rlThumbnailsPreviewBackgroundColor = _s.props.rlThumbnailsPreviewBackgroundColor || "#2e2e2e";
            _s.rlThumbnailsPreviewBorderColor = _s.props.rlThumbnailsPreviewBorderColor || "#414141";
            _s.rlThumbnailsPreviewLabelBackgroundColor = _s.props.rlThumbnailsPreviewLabelBackgroundColor || "#414141";
            _s.rlThumbnailsPreviewLabelFontColor = _s.props.rlThumbnailsPreviewLabelFontColor || "#CCCCCC";
            _s.rlSkipToVideoText = _s.props.rlSkipToVideoText || "You can skip to video in: ",
            _s.rlSkipToVideoButtonText = _s.rlSkipToVideoButtonText || "Skip Ad";


            // Parse datalist.
            var dataListAr = prt.dataListAr;
            
            _s.totalDataLists = dataListAr.length;
            var allCatAr = [];
            var allMediaAr = [];
            var mediaAr;
            var dataAr;
            var childKidsAr;
            var curUlElem;
            var totalChildren;
            var totalInnerChildren;
            var dataListChildrenAr;
            var mediaKid;
            var attributeMissing;
            var dataListPositionError;
            var positionError;

            for (var i=0; i<_s.totalDataLists; i++){
                var lightboxParsedPlaylist_ar = [];
                curUlElem = dataListAr[i];
                dataAr = [];
                mediaAr = [];
                dataListChildrenAr = FWDR3DCovUtils.getChildren(curUlElem);
                totalChildren = dataListChildrenAr.length;

                for (var j=0; j<totalChildren; j++){
                    var obj = {};
                    var child = dataListChildrenAr[j];
                    var childKidsAr = FWDR3DCovUtils.getChildren(child);
                    
                    dataListPositionError = i + 1;
                    positionError = j + 1;
                    
                    totalInnerChildren = childKidsAr.length;
            
                    // check for data-thumb-src attribute.
                    var hasError = true;
                    for(var k=0; k<totalInnerChildren; k++){
                        attributeMissing = "data-thumb-src";
                        if (FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-thumb-src")){
                            hasError = false;
                            obj.thumbSrc = FWDR3DCovUtils.trim(FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-src"));
                            break;
                        }
                    }

                    obj.thumbVideoSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-video-src");
                    obj.password = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-password");
                    obj.subtitleSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-subtitle-src");
                    obj.thumbPreviewSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-preview-src");
                    obj.thumbVastSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-vast-src");

                    if (hasError){
                        errorMessage = "Element with attribute <font color='#FF0000'>" + attributeMissing + "</font> is not defined in the datalist number - <font color='#FF0000'>" + dataListPositionError + "</font> at position - <font color='#FF0000'>" + positionError + "</font> in the datalist ul element.";
                        _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:errorMessage});
                        return;
                    }
                    
                    if(_s.showCaption){
                        for (var k=0; k<totalInnerChildren; k++){
                            if (FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-thumb-caption")){
                                obj.thumbText = childKidsAr[k].innerHTML;
                                mediaKid = childKidsAr[k];
                                break;
                            }
                        }
                        
                        obj.captionOffset = 0;
                        if(mediaKid){
                            if(FWDR3DCovUtils.getAttributeValue(mediaKid, "data-thumb-caption-offset")){
                                obj.captionOffset = parseInt(FWDR3DCovUtils.trim(FWDR3DCovUtils.getAttributeValue(mediaKid, "data-thumb-caption-offset")));
                            }
                        }
                    }
                    
                    // Set arrays for lightbox.
                    obj.type = "none";

                    var rlKid;
                    for (var k=0; k<totalInnerChildren; k++){
                        rlKid = undefined;
                        if (FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-rl-src")){
                            rlKid = childKidsAr[k];
                            break;
                        }
                    }

                    var secondObj = undefined;
                    if(rlKid){

                        secondObj = {};
                        secondObj.type = 'none';
                        secondObj.src = String(FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-src"));
                        secondObj.thumbSrc = obj.thumbSrc;

                        var soTarget = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-target");
                        if(soTarget){
                             secondObj.target = soTarget;
                        }else{
                             secondObj.target = '_blank';
                        }
                    
                        var soPosterSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-poster-src");
                        if(soPosterSrc) secondObj.posterSrc = soPosterSrc;

                        var soPassword = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-password");
                        if(soPassword) secondObj.password = soPassword;

                        var soSubtitleSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-subtitle-src");
                        if(soSubtitleSrc) secondObj.subtitleSrc = soSubtitleSrc;

                        var soThumbnailsPreviewSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-preview-src");
                        if(soThumbnailsPreviewSrc) secondObj.thumbnailsPreviewSrc = soThumbnailsPreviewSrc;

                        var soVastSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-vast-src");
                        if(soVastSrc) secondObj.vastSrc = soVastSrc

                        var soWidth = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-width");
                        if(soWidth) secondObj.width = soWidth

                        var soHeight = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-height");
                        if(soHeight) secondObj.height = soHeight
                        
                        // Check for rl caption.
                        for (var k=0; k<totalInnerChildren; k++){
                            if(FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-rl-caption")){
                                secondObj.caption = childKidsAr[k].innerHTML;
                                break;
                            }
                        }
                        
                        if(/link:/i.test(secondObj.src)){
                            secondObj.src = secondObj.src.substr(5);
                            secondObj.type = "link";
                            obj.type = "link";
                        }else if(/none/i.test(secondObj.src)){
                            secondObj.src = secondObj.src.substr(5);
                            secondObj.type = "none";
                            obj.type = "none";
                        }
                        obj.secondObj = secondObj;

                    }

                    _s.setItemType(obj, obj.thumbVideoSrc);
                    if(secondObj && secondObj.type != 'link'){
                        _s.setItemType(secondObj, secondObj.src);
                    }
                    
                    if(secondObj && secondObj.type != "link" && secondObj.type != "none" && !obj.thumbVideoSrc){
                        lightboxParsedPlaylist_ar.push(secondObj);
                    }
                    
                    dataAr[j] = obj;
                    allCatAr.push(obj);
                }
                
                _s.categoriesAr[i] = FWDR3DCovUtils.getAttributeValue(curUlElem, "data-cat") || "not defined!";
                _s.dataListAr[i] = dataAr;
                _s.lightboxAr[i] = {playlistItems:lightboxParsedPlaylist_ar};
            }

            if (_s.showAllCategories){
                _s.categoriesAr.unshift(_s.allCategoriesLabel);
                _s.dataListAr.unshift(allCatAr);
                
                _s.totalDataLists++;
            }

            if(_s.totalDataLists <=1) _s.showMenu = false;
            
            if (!_s.skinPath_str){
                _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:"Carousel graphics skin path is not defined in FWDR3DCov constructor function!"});
                return;
            }
            
            _s.skinPaths_ar = [
                {img:_s.largePlayNImg = new Image(), src:_s.skinPath_str + "large-play.png"},
                {img:_s.prevButtonNImg = new Image(), src:_s.skinPath_str + "prev-button.png"},
                {img:_s.comboboxArrowIconN_img = new Image(), src:_s.skinPath_str + "menuIcon.png"},
                {img:_s.nextButtonNImg = new Image(), src:_s.skinPath_str + "next-button.png"},
                {img:_s.pauseButtonImg = new Image(), src:_s.skinPath_str + "pause-button.png"},
                {img:_s.playButtonNImg = new Image(), src:_s.skinPath_str + "play-button.png"},
                {img:_s.largeNextButton_img = new Image(), src:_s.skinPath_str + "next-button-large-normal.png"},
                {img:_s.largePrevButton_img = new Image(), src:_s.skinPath_str + "prev-button-large-normal.png"},
                {img:_s.handlerLeftNImg = new Image(), src:_s.skinPath_str + "handler-left-normal.png"},
                {img:_s.handlerLeftSImg = new Image(), src:_s.skinPath_str + "handler-left-selected.png"},
                {img:_s.handlerRightNImg = new Image(), src:_s.skinPath_str + "handler-right-normal.png"},
                {img:_s.handlerRightSImg = new Image(), src:_s.skinPath_str + "handler-right-selected.png"},
                {img:_s.trackLeftImg = new Image(), src:_s.skinPath_str + "trackLeft.png"},
                {img:_s.trackCenterImg = new Image(), src:_s.skinPath_str + "trackCenter.png"},
                {img:_s.trackRightImg = new Image(), src:_s.skinPath_str + "trackRight.png"}
            ];
            
            
            // set images
            _s.largePlaySPath = _s.skinPath_str + "large-play-over.png";
            _s.playButtonSPath = _s.skinPath_str + "play-button-over.png";
            _s.nextButtonSPath =  _s.skinPath_str + "next-button-over.png";
            _s.prevButtonSPath =  _s.skinPath_str + "prev-button-over.png";
            _s.circleBK = _s.skinPath_str + "slideshow-background.png";
            _s.preloaderPath = _s.skinPath_str + "preloader.png"
            _s.mainPreloaderImg = new Image();
            _s.largeNextButtonSPath_str = _s.skinPath_str + "next-button-large-selected.png";
            _s.largePrevButtonSPath_str = _s.skinPath_str + "prev-button-large-selected.png";
            _s.comboboxArrowIconN_str = _s.skinPath_str + "menuIcon.png";
            _s.handlerCenterNPath = _s.skinPath_str + "handler-center-normal.png";
            _s.handlerCenterSPath = _s.skinPath_str + "handler-center-selected.png";
            _s.trackCenterPath = _s.skinPath_str + "/trackCenter.png";
            _s.thumbGradientLeftPath = _s.skinPath_str + "gradientLeft.png";
            _s.thumbGradientRightPath = _s.skinPath_str + "gradientRight.png";
            _s.thumbTitleGradientPath = _s.skinPath_str + "textGradient.png";

            
            _s.totalGraphics = _s.skinPaths_ar.length;
            _s.countLoadedSkinImages = 0;
            
            setTimeout(function(){
                _s.dispatchEvent(FWDR3DCovData.PRELOADER_LOAD_DONE);
                if(_s.useVectorIcons){
                    if(_s.useVideo){
                        _s.loadVideoPlayer();
                    }else{
                        _s.doneLoading();
                    }
                }else{
                    _s.loadSkin();
                }
            }, 50);
        };

        _s.setItemType = function(obj, str){
            if(/\.jpg|\.jpeg|.webp|\.png|\.bmp|\.gif|\.tif|\.tiff|\.jfi|\.jfif|\.exif|\.svg/i.test(str)){
                obj.type = FWDR3DCov.IMAGE;
            }else if(/\.mp4|\.m3u8|\.mpd/i.test(str)){
                obj.type = FWDR3DCov.VIDEO;
            }else if(/youtube\./i.test(str)){
                obj.type = FWDR3DCov.YOUTUBE;
            }else if(/vimeo\./i.test(str)){
                obj.type = FWDR3DCov.VIMEO;
            }else if(/\.mp3/i.test(str)){
                obj.type = FWDR3DCov.AUDIO;
            }else if(/https:|http:|\.pdf/i.test(str)){
                obj.type = FWDR3DCov.IFRAME;
            }else if(document.getElementById(str)){
                obj.type = FWDR3DCov.HTML;
            }
        }


        /**
          * Load buttons png icons.
          */
        _s.loadSkin = function(){
            var img;
            var src;
            
            for(var i=0; i<_s.totalGraphics; i++){
                img = _s.skinPaths_ar[i].img;
                src = _s.skinPaths_ar[i].src;
                img.onload = _s.onSkinLoadHandler;
                img.onerror = _s.onSkinLoadErrorHandler;
                img.src = src;
            }
        };
        
        _s.onSkinLoadHandler = function(e){
            _s.countLoadedSkinImages++;
        
            if(_s.countLoadedSkinImages == _s.totalGraphics){
                if(_s.useVideo){
                    _s.loadVideoPlayer();
                }else{
                    _s.doneLoading();
                }
            }
        };

        _s.doneLoading = function(){
            _s.dispatchEvent(FWDR3DCovData.LOAD_DONE);
        }
        
        _s.onSkinLoadErrorHandler = function(e){
            if (FWDR3DCovUtils.isIEAndLessThen9){
                var message = "Graphics image not found!";
            }else{
                var message = "The skin icon with label <font color='#ff0000'>" + e.target.src + "</font> can't be loaded, check path!";
            }
            
            if(window.console) console.log(e);
            var err = {text:message};
            setTimeout(function(){
                if(_s) _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, err);
            }, 50);
        };


        /**
         * Load video player.
         */
        _s.loadVideoPlayer = function(){
            if(!FWDR3DCov.hasLoadEVP && !window['FWDEVPlayer']){
                var script = document.createElement('script');
                script.src = _s.mainFolderPath + 'rl/content/evp/java/FWDEVPlayer.js';
                document.head.appendChild(script);
                script.onload = _s.videoLoadDone;
                script.onerror = _s.onVidLoadError;
            }

            _s.evp_it = setInterval(function(){
                if(FWDR3DCov.hasEVP || window['FWDEVPlayer']){
                    _s.doneLoading();
                    clearInterval(_s.evp_it);
                }
            }, 5);

            FWDR3DCov.hasLoadEVP = true;
        }

        _s.onVidLoadError = function(){
            clearInterval(_s.evp_it);
            var error = "Error loading video player!";
            _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:error});
        }

        _s.videoLoadDone = function(){
            FWDR3DCov.hasEVP = true;    
        }


        /**
          * Check if element with and attribute exists or throw error.
          */
        _s.checkForAttribute = function(e, attr){
            var test = FWDR3DCovUtils.getChildFromNodeListFromAttribute(e, attr);
            
            test = test ? FWDR3DCovUtils.trim(FWDR3DCovUtils.getAttributeValue(test, attr)) : undefined;
            
            if (!test)
            {
                _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:"Element  with attribute <font color='#FF0000'>" + attr + "</font> is not defined."});
                return;
            }
            
            return test;
        };

        _s.init();
    };

    /**
     * Prototype.
     */
    FWDR3DCovData.setPrototype = function(){
        FWDR3DCovData.prototype = new FWDR3DCovEventDispatcher();
    };

    FWDR3DCovData.prototype = null;
    FWDR3DCovData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
    FWDR3DCovData.LOAD_DONE = "onLoadDone";
    FWDR3DCovData.LOAD_ERROR = "onLoadError";

    window.FWDR3DCovData = FWDR3DCovData;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Display object.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    /*
     * @ type values: div, img.
     * @ positon values: relative, absolute.
     * @ positon values: hidden.
     * @ display values: block, inline-block, _s applies only if the position is relative.
     */
    var FWDR3DCovDO = function(type, position, overflow, display){
        
        'use strict';

        var _s = this;
        _s.listeners = {events_ar:[]};
        
        if(type == "div" || type == "img" || type == "canvas"){
            _s.type = type; 
        }else{
            throw Error("Type is not valid! " + type);
        }
    
        _s.children_ar = [];
        _s.position = position || "absolute";
        _s.overflow = overflow || "hidden";
        _s.display = display || "inline-block";
        _s.visible = true;
        _s.buttonMode;
        _s.x = 0;
        _s.y = 0;
        _s.w = 0;
        _s.h = 0;
        _s.rect;
        _s.alpha = 1;
        
    
        _s.hasT3D =  FWDR3DCovUtils.hasTransform3d;
        _s.hasT2D =  FWDR3DCovUtils.hasTransform2d;
        if(FWDR3DCovUtils.isIE || (FWDR3DCovUtils.isIE11 && !FWDR3DCovUtils.isMobile)){
            _s.hasT3D = false;
            _s.hasT2D = false;
        } 
        _s.hasBeenSetSelectable_bl = false;


        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setScreen();
        };  
        
        
        /**
         * Check if it supports transforms.
         */
        _s.getTransform = function() {
            var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
            var p;
            while (p = properties.shift()) {
               if (typeof _s.screen.style[p] !== 'undefined') {
                    return p;
               }
            }
            return false;
        };
        
        
        /**
         * Setup main screen.
         */
        _s.setScreen = function(element){
            if(_s.type == "img" && element){
                _s.screen = element;
                _s.setMainProperties();
            }else{
                _s.screen = document.createElement(_s.type);
                _s.setMainProperties();
            }
        };
        
        
        /**
         * Set main properties.
         */
        _s.setMainProperties = function(){
            
            _s.transform = _s.getTransform();
            _s.setPosition(_s.position);
            _s.setOverflow(_s.overflow);
            
            _s.isHtml5_bl = true;
            _s.screen.style.left = "0px";
            _s.screen.style.top = "0px";
            _s.screen.style.margin = "0px";
            _s.screen.style.padding = "0px";
            _s.screen.style.maxWidth = "none";
            _s.screen.style.maxHeight = "none";
            _s.screen.style.border = "none";
            _s.screen.style.lineHeight = "1";
            _s.screen.style.backgroundColor = "transparent";
            _s.screen.style.transition = "none";
            
            if(type == "img"){
                _s.setWidth(_s.screen.width);
                _s.setHeight(_s.screen.height);
            }
        };
            
        _s.setBackfaceVisibility =  function(){
            _s.screen.style.backfaceVisibility = "visible";
            _s.screen.style.webkitBackfaceVisibility = "visible";
            _s.screen.style.MozBackfaceVisibility = "visible";      
        };
        
    
        /**
         * Set/get various peoperties.
         */
        _s.getGlobalX = function(){
            return _s.getRect().left;
        };
        
        _s.getGlobalY = function(){
            return _s.getRect().top;
        };
        
        _s.setSelectable = function(val){
            if(!val){
                _s.screen.style.userSelect = "none";
                _s.screen.style.MozUserSelect = "none";
                _s.screen.style.webkitUserSelect = "none";
                _s.screen.style.khtmlUserSelect = "none";
                _s.screen.style.oUserSelect = "none";
                _s.screen.style.msUserSelect = "none";
                _s.screen.msUserSelect = "none";
                _s.screen.ondragstart = function(e){return false;};
                _s.screen.onselectstart = function(){return false;};
                _s.screen.ontouchstart = function(){return false;};
                _s.screen.style.webkitTouchCallout='none';
                _s.hasBeenSetSelectable_bl = true;
            }
        };
        
        _s.getScreen = function(){
            return _s.screen;
        };
        
        _s.setVisible = function(val){
            _s.visible = val;
            if(_s.visible == true){
                _s.screen.style.visibility = "visible";
            }else{
                _s.screen.style.visibility = "hidden";
            }
        };
        
        _s.getVisible = function(){
            return _s.visible;
        };
            
        _s.setResizableSizeAfterParent = function(){
            _s.screen.style.width = "100%";
            _s.screen.style.height = "100%";
        };
        
        _s.style = function(){
            return _s.screen.style;
        };
        
        _s.setOverflow = function(val){
            _s.overflow = val;
            _s.screen.style.overflow = _s.overflow;
        };
        
        _s.setPosition = function(val){
            _s.position = val;
            _s.screen.style.position = _s.position;
        };
        
        _s.setDisplay = function(val){
            _s.display = val;
            _s.screen.style.display = _s.display;
        };
        
        _s.setButtonMode = function(val){
            _s.buttonMode = val;
            if(_s.buttonMode ==  true){
                _s.screen.style.cursor = "pointer";
            }else{
                _s.screen.style.cursor = "default";
            }
        };
        
        _s.setBkColor = function(val){
            _s.screen.style.backgroundColor = val;
        };
        
        _s.setInnerHTML = function(val){
            _s.innerHTML = val;
            _s.screen.innerHTML = _s.innerHTML;
        };
        
        _s.getInnerHTML = function(){
            return _s.innerHTML;
        };
        
        _s.getRect = function(){
            return _s.screen.getBoundingClientRect();
        };
        
        _s.setAlpha = function(val){
            _s.alpha = val;
            _s.screen.style.opacity = _s.alpha;
        };
        
        _s.getAlpha = function(){
            return _s.alpha;
        };
        
        _s.getRect = function(){
            return _s.screen.getBoundingClientRect();
        };
        
        _s.getGlobalX = function(){
            return _s.getRect().left;
        };
        
        _s.getGlobalY = function(){
            return _s.getRect().top;
        };
        
        _s.setX = function(val){
            _s.x = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0)';
            }else if(_s.hasT2D){
                _s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px)';
            }else{
                _s.screen.style.left = _s.x + "px";
            }
        };
        
        _s.getX = function(){
            return  _s.x;
        };
        
        _s.setY = function(val){
            _s.y = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = 'translate3d(' + _s.x + 'px,' + _s.y + 'px,0)'; 
            }else if(_s.hasT2D){
                _s.screen.style[_s.transform] = 'translate(' + _s.x + 'px,' + _s.y + 'px)';
            }else{
                _s.screen.style.top = _s.y + "px";
            }
        };
        
        _s.getY = function(){
            return  _s.y;
        };
        
        _s.setWidth = function(val){
            _s.w = val;
            if(_s.type == "img"){
                _s.screen.width = _s.w;
            }
            _s.screen.style.width = _s.w + "px";
        };
        
        _s.getWidth = function(){
            if(_s.type == "div"){
                if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
                return _s.w;
            }else if(_s.type == "img"){
                if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
                if(_s.screen.width != 0) return  _s.screen.width;
                return _s._w;
            }else if( _s.type == "canvas"){
                if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
                return _s.w;
            }
        };
        
        _s.setHeight = function(val){
            _s.h = val;
            if(_s.type == "img"){
                _s.screen.height = _s.h;
            }
            _s.screen.style.height = _s.h + "px";
            
        };
        
        _s.getHeight = function(){
            if(_s.type == "div"){
                if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
                return _s.h;
            }else if(_s.type == "img"){
                if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
                if(_s.screen.height != 0) return  _s.screen.height;
                return _s.h;
            }else if(_s.type == "canvas"){
                if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
                return _s.h;
            }
        };

        _s.setCSSGradient = function(color1, color2, dir){
            if (FWDR3DCovUtils.isIEAndLessThen10){
                _s.setBkColor(color1);
            }else if(dir){
                _s.screen.style.backgroundImage = "-webkit-linear-gradient(" + dir + ", " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-moz-linear-gradient(" + dir + ", " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-ms-linear-gradient(" + dir + ", " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-o-linear-gradient(" + dir + ", " + color1 + ", " + color2 + ")";
            }else{

                _s.screen.style.backgroundImage = "-webkit-linear-gradient(top, " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-moz-linear-gradient(top, " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-ms-linear-gradient(top, " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-o-linear-gradient(top, " + color1 + ", " + color2 + ")";
            }
        };
        
    
        /**
         * DOM list.
         */
        _s.addChild = function(e){
            if(_s.contains(e)){ 
                _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }else{
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }
        };
        
        _s.removeChild = function(e){
            if(_s.contains(e)){
                _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);
                _s.screen.removeChild(e.screen);
            }else{
                throw Error("##removeChild()## Child dose't exist, it can't be removed!");
            };
        };
        
        _s.contains = function(e){
            if(FWDR3DCovUtils.indexOfArray(_s.children_ar, e) == -1){
                return false;
            }else{
                return true;
            }
        };
        
        _s.addChildAt = function(e, index){
            if(_s.getNumChildren() == 0){
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }else if(index == 1){
                _s.screen.insertBefore(e.screen, _s.children_ar[0].screen);
                _s.screen.insertBefore(_s.children_ar[0].screen, e.screen); 
                if(_s.contains(e)){
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1, e);
                }else{
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 0, e);
                }
            }else{
                if(index < 0  || index > _s.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
                
                _s.screen.insertBefore(e.screen, _s.children_ar[index].screen);
                if(_s.contains(e)){
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1, e);
                }else{
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 0, e);
                }
            }
        };
        
        _s.getChildAt = function(index){
            if(index < 0  || index > _s.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
            if(_s.getNumChildren() == 0) throw Errror("##getChildAt## Child dose not exist!");
            return _s.children_ar[index];
        };
        
        _s.removeChildAtZero = function(){
            _s.screen.removeChild(_s.children_ar[0].screen);
            _s.children_ar.shift();
        };
        
        _s.getNumChildren = function(){
            return _s.children_ar.length;
        };
        
        
        /**
         * Event dispatcher.
         */
        this.addListener = function (type, listener){
            
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function.");
            
            
            var event = {};
            event.type = type;
            event.listener = listener;
            event.target = this;
            this.listeners.events_ar.push(event);
        };
        
        this.dispatchEvent = function(type, props){
            if(this.listeners == null) return;
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            
            for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
                if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){       
                    if(props){
                        for(var prop in props){
                            this.listeners.events_ar[i][prop] = props[prop];
                        }
                    }
                    this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
                }
            }
        };
        
        this.removeListener = function(type, listener){
            
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function." + type);
            
            for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
                if(this.listeners.events_ar[i].target === this 
                        && this.listeners.events_ar[i].type === type
                        && this.listeners.events_ar[i].listener ===  listener
                ){
                    this.listeners.events_ar.splice(i,1);
                    break;
                }
            }  
        };
        
       
        /**
         * Destroy methods.
         */
        _s.disposeImage = function(){
            if(_s.type == "img") _s.screen.src = '';
        };
        
        _s.destroy = function(){
            
            try{_s.screen.parentNode.removeChild(_s.screen);}catch(e){};
            
            if(_s.hasBeenSetSelectable_bl){
                _s.screen.ondragstart = null;
                _s.screen.onselectstart = null;
                _s.screen.ontouchstart = null;
            };
            
            _s.screen.removeAttribute("style");
            _s.listeners = null;
            _s.listeners = null;
            _s.children_ar = null;
            _s.children_ar = null;
            _s.style = null;
            _s.screen = null;
            _s.transform = null;
            _s.position = null;
            _s.overflow = null;
            _s.display = null;
            _s.visible = null;
            _s.buttonMode = null;
            _s.x = null;
            _s.y = null;
            _s.w = null;
            _s.h = null;
            _s.rect = null;
            _s.alpha = null;
            _s.innerHTML = null;
            _s.isHtml5_bl = null;
        
            _s.hasT3D = null;
            _s.hasT2D = null;
            _s = null;
        };
        _s.init();
    };
    
    window.FWDR3DCovDO = FWDR3DCovDO;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Display 3D Object.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    /*
     * @ type values: div, img.
     * @ positon values: relative, absolute.
     * @ positon values: hidden.
     * @ display values: block, inline-block, _s applies only if the position is relative.
     */
    var FWDR3DCovDO3D = function(type, position, overflow, display){

        'use strict';
    
        var _s = this;
        _s.listeners = {events_ar:[]};
        
        if(type == "div" || type == "img" || type == "canvas"){
            _s.type = type; 
        }else{
            throw Error("Type is not valid! " + type);
        }
    
        _s.children_ar = [];
        _s.position = position || "absolute";
        _s.overflow = overflow || "hidden";
        _s.display = display || "block";
        _s.visible = true;
        _s.x = 0;
        _s.y = 0;
        _s.z = 0;
        _s.angleX = 0;
        _s.angleY = 0;
        _s.angleZ = 0;
        _s.perspective = 0;
        _s.zIndex = 0;
        _s.scale = 1;
        _s.w = 0;
        _s.h = 0;
        _s.rect;
        _s.alpha = 1;
        _s.innerHTML = "";
        _s.isHtml5_bl = false;
        
        _s.hasT3D = FWDR3DCovUtils.hasTransform3d;
        _s.hasT2D = FWDR3DCovUtils.hasTransform2d;
        
        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setScreen();
        };  
        

        /**
         * Check if it supports transforms.
         */
        _s.getTransform = function() {
            var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
            var p;
            while (p = properties.shift()) {
               if (typeof _s.screen.style[p] !== 'undefined') {
                    return p;
               }
            }
            return false;
        };
        
        
        /**
         * Check if it supports transforms.
         */
        _s.setScreen = function(element){
            if(_s.type == "img" && element){
                _s.screen = element;
                _s.setMainProperties();
            }else{
                _s.screen = document.createElement(_s.type);
                _s.setMainProperties();
            }
        };
        
    
        /**
         * Set main properties.
         */
        _s.setMainProperties = function(){
            
            _s.transform = _s.getTransform();
            _s.setPosition(_s.position);
            _s.setDisplay(_s.display);
            _s.setOverflow(_s.overflow);
            
            _s.screen.style.left = "0px";
            _s.screen.style.top = "0px";
            _s.screen.style.margin = "0px";
            _s.screen.style.padding = "0px";
            _s.screen.style.maxWidth = "none";
            _s.screen.style.maxHeight = "none";
            _s.screen.style.border = "none";
            _s.screen.style.lineHeight = "1";
            
            if(type == "img"){
                _s.setWidth(_s.screen.width);
                _s.setHeight(_s.screen.height);
                _s.screen.onmousedown = function(e){return false;};
            }
        };
        
        _s.setBackfaceVisibility =  function(){
            _s.screen.style.backfaceVisibility = "visible";
            _s.screen.style.webkitBackfaceVisibility = "visible";
            _s.screen.style.MozBackfaceVisibility = "visible";      
        };
        
        _s.removeBackfaceVisibility =  function(){
            _s.screen.style.backfaceVisibility = "hidden";
            _s.screen.style.webkitBackfaceVisibility = "hidden";
            _s.screen.style.MozBackfaceVisibility = "hidden";       
        };
        
        
        /**
         * Set / get various peoperties.
         */
        _s.setSelectable = function(val){
            if(!val){
                try{_s.screen.style.userSelect = "none";}catch(e){};
                try{_s.screen.style.MozUserSelect = "none";}catch(e){};
                try{_s.screen.style.webkitUserSelect = "none";}catch(e){};
                try{_s.screen.style.khtmlUserSelect = "none";}catch(e){};
                try{_s.screen.style.oUserSelect = "none";}catch(e){};
                try{_s.screen.style.msUserSelect = "none";}catch(e){};
                try{_s.screen.msUserSelect = "none";}catch(e){};
                _s.screen.ondragstart = function(e){return  false;};
                _s.screen.onselectstart = function(){return false;};
                _s.screen.style.webkitTouchCallout='none';
            }
        };
        
        _s.getScreen = function(){
            return _s.screen;
        };
        
        _s.setVisible = function(val){
            _s.visible = val;
            if(_s.visible == true){
                _s.screen.style.visibility = "visible";
            }else{
                _s.screen.style.visibility = "hidden";
            }
        };
        
        _s.getVisible = function(){
            return _s.visible;
        };
            
        _s.setResizableSizeAfterParent = function(){
            _s.screen.style.width = "100%";
            _s.screen.style.height = "100%";
        };
        
        _s.style = function(){
            return _s.screen.style;
        };
        
        _s.setOverflow = function(val){
            _s.overflow = val;
            _s.screen.style.overflow = _s.overflow;
        };
        
        _s.setPosition = function(val){
            _s.position = val;
            _s.screen.style.position = _s.position;
        };
        
        _s.setDisplay = function(val){
            _s.display = val;
            _s.screen.style.display = _s.display;
        };
        
        _s.setButtonMode = function(val){
            _s.buttonMode = val;
            if(_s.buttonMode ==  true){
                _s.screen.style.cursor = "pointer";
            }else{
                _s.screen.style.cursor = "default";
            }
        };
        
        _s.setBkColor = function(val){
            _s.screen.style.backgroundColor = val;
        };
        
        _s.setInnerHTML = function(val){
            _s.innerHTML = val;
            _s.screen.innerHTML = _s.innerHTML;
        };
        
        _s.getInnerHTML = function(){
            return _s.innerHTML;
        };
        
        _s.getRect = function(){
            return _s.screen.getBoundingClientRect();
        };
        
        _s.setAlpha = function(val){
            _s.alpha = val;
            _s.screen.style.opacity = _s.alpha;
        };
        
        _s.getAlpha = function(){
            return _s.alpha;
        };
        
        _s.getRect = function(){
            return _s.screen.getBoundingClientRect();
        };
        
        _s.getGlobalX = function(){
            return _s.getRect().left;
        };
        
        _s.getGlobalY = function(){
            return _s.getRect().top;
        };
        
        _s.setX = function(val){
            _s.x = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }else if(_s.hasT2D){
                _s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
            }else{
                _s.screen.style.left = _s.x + "px";
            }
        };
        
        _s.getX = function(){
            return  _s.x;
        };
        
        _s.setY = function(val){
            _s.y = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }else if(_s.hasT2D){
                _s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
            }else{
                _s.screen.style.top = _s.y + "px";
            }
        };
        
        _s.getY = function(){
            return  _s.y;
        };
        
        _s.setZ = function(val){
            _s.z = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }
        };
        
        _s.getZ = function(){
            return  _s.z;
        };
        
        _s.setAngleX = function(val){
            _s.angleX = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }
        };
        
        _s.getAngleX = function(){
            return  _s.angleX;
        };
        
        _s.setAngleY = function(val){
            _s.angleY = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }
        };
        
        _s.getAngleY = function(){
            return  _s.angleY;
        };
        
        _s.setAngleZ = function(val){
            _s.angleZ = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }
        };
        
        _s.getAngleZ = function(){
            return  _s.angleZ;
        };
        
        _s.setScale2 = function(val){
            _s.scale = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) scale(" + _s.scale + ", " + _s.scale + ")";
            }else if(_s.hasT2D){
                _s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
            }
        };
        
        _s.setScale3D = function(val){
            _s.scale = val;
            if(_s.hasT3D){
                _s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
            }else if(_s.hasT2D){
                _s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
            }
        };
        
        _s.getScale = function(){
            return  _s.scale;
        };
        
        _s.setPerspective = function(val){
            _s.perspective = val;
            _s.screen.style.perspective = _s.perspective + "px";
            _s.screen.style.WebkitPerspective = _s.perspective + "px";
            _s.screen.style.MozPerspective = _s.perspective + "px";
            _s.screen.style.msPerspective = _s.perspective + "px";
            _s.screen.style.OPerspective = _s.perspective + "px";
        };
        
        _s.setPreserve3D = function(){
            _s.screen.style.transformStyle = "preserve-3d";
            _s.screen.style.WebkitTransformStyle = "preserve-3d";
            _s.screen.style.MozTransformStyle = "preserve-3d";
            _s.screen.style.msTransformStyle = "preserve-3d";
            _s.screen.style.OTransformStyle = "preserve-3d";
        };
        
        _s.setZIndex = function(val){
            _s.zIndex = val;
            _s.screen.style.zIndex = _s.zIndex;
        };
        
        _s.getZIndex = function(){
            return _s.zIndex;
        };
        
        _s.setWidth = function(val){
            _s.w = val;
            if(_s.type == "img"){
                _s.screen.width = _s.w;
            }
            _s.screen.style.width = _s.w + "px";    
        };
        
        _s.getWidth = function(){
            if(_s.type == "div"){
                if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
                return _s.w;
            }else if(_s.type == "img"){
                if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
                if(_s.screen.width != 0) return  _s.screen.width;
                return _s._w;
            }else if( _s.type == "canvas"){
                if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
                return _s.w;
            }
        };
        
        _s.setHeight = function(val){
            _s.h = val;
            if(_s.type == "img"){
                _s.screen.height = _s.h;
            }
            _s.screen.style.height = _s.h + "px";
        };
        
        _s.getHeight = function(){
            if(_s.type == "div"){
                if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
                return _s.h;
            }else if(_s.type == "img"){
                if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
                if(_s.screen.height != 0) return  _s.screen.height;
                return _s.h;
            }else if(_s.type == "canvas"){
                if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
                return _s.h;
            }
        };
        
        _s.getNumChildren = function(){
            return _s.children_ar.length;
        };
        
        _s.setCSSGradient = function(color1, color2){
            if (FWDR3DCovUtils.isIEAndLessThen10){
                _s.setBkColor(color1);
            }else{
                _s.screen.style.backgroundImage = "-webkit-linear-gradient(top, " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-moz-linear-gradient(top, " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-ms-linear-gradient(top, " + color1 + ", " + color2 + ")";
                _s.screen.style.backgroundImage = "-o-linear-gradient(top, " + color1 + ", " + color2 + ")";
            }
        };
        
        
        /**
         * DOM list.
         */
        _s.addChild = function(e){
            if(_s.contains(e)){ 
                _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }else{
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }
        };
        
        _s.removeChild = function(e){
            if(_s.contains(e)){
                _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);
                _s.screen.removeChild(e.screen);
            }else{
                throw Error("##removeChild()## Child doesn't exist, it can't be removed!");
            };
        };
        
        _s.contains = function(e){
            if(FWDR3DCovUtils.indexOfArray(_s.children_ar, e) == -1){
                return false;
            }else{
                return true;
            }
        };
        
        _s.addChildAtZero = function(e){
            if(_s.numChildren == 0){
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }else{
                _s.screen.insertBefore(e.screen, _s.children_ar[0].screen);
                if(_s.contains(e)){_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);}   
                _s.children_ar.unshift(e);
            }
        };

        _s.addChildAt = function(e, index){
            if(_s.getNumChildren() == 0){
                _s.children_ar.push(e);
                _s.screen.appendChild(e.screen);
            }else if(index == 1){
                _s.screen.insertBefore(e.screen, _s.children_ar[0].screen);
                _s.screen.insertBefore(_s.children_ar[0].screen, e.screen); 
                if(_s.contains(e)){
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1, e);
                }else{
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 0, e);
                }
            }else{
                if(index < 0  || index > _s.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
                
                _s.screen.insertBefore(e.screen, _s.children_ar[index].screen);
                if(_s.contains(e)){
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1, e);
                }else{
                    _s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 0, e);
                }
            }
        };
        
        _s.getChildAt = function(index){
            if(index < 0  || index > _s.numChildren -1) throw Error("##getChildAt()## Index out of bounds!");
            if(_s.numChildren == 0) throw Errror("##getChildAt## Child dose not exist!");
            return _s.children_ar[index];
        };
        
        _s.removeChildAtZero = function(){
            _s.screen.removeChild(_s.children_ar[0].screen);
            _s.children_ar.shift();
        };
        
        
        /**
         * Event dispatcher.
         */
        _s.addListener = function (type, listener){
            
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function.");
            
            var event = {};
            event.type = type;
            event.listener = listener;
            event.target = _s;
            _s.listeners.events_ar.push(event);
        };
        
        _s.dispatchEvent = function(type, props){
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            
            for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
                if(_s.listeners.events_ar[i].target === _s && _s.listeners.events_ar[i].type === type){
                    
                    if(props){
                        for(var prop in props){
                            _s.listeners.events_ar[i][prop] = props[prop];
                        }
                    }
                    _s.listeners.events_ar[i].listener.call(_s, _s.listeners.events_ar[i]);
                    break;
                }
            }
        };
        
       _s.removeListener = function(type, listener){
            
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function." + type);
            
            for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
                if(_s.listeners.events_ar[i].target === _s 
                        && _s.listeners.events_ar[i].type === type
                        && _s.listeners.events_ar[i].listener ===  listener
                ){
                    _s.listeners.events_ar.splice(i,1);
                    break;
                }
            }  
        };
        
      
        /**
         * Destroy.
         */
        _s.disposeImage = function(){
            if(_s.type == "img") _s.screen.src = "";
        };
        
        
        _s.destroy = function(){
            
            try{_s.screen.parentNode.removeChild(_s.screen);}catch(e){};
            
            _s.screen.onselectstart = null;
            _s.screen.ondragstart = null;
            _s.screen.ontouchstart = null;
            _s.screen.ontouchmove = null;
            _s.screen.ontouchend = null;
            _s.screen.onmouseover = null;
            _s.screen.onmouseout = null;
            _s.screen.onmouseup = null;
            _s.screen.onmousedown = null;
            _s.screen.onmousemove = null;
            _s.screen.onclick = null;

            _s.children_ar = null;
            _s.style = null;
            _s.screen = null;
            _s.numChildren = null;
            _s.transform = null;
            _s.position = null;
            _s.overflow = null;
            _s.display= null;
            _s.visible= null;
            _s.buttonMode = null;
            _s.globalX = null;
            _s.globalY = null;
            _s.x = null;
            _s.y = null;
            _s.w = null;;
            _s.h = null;;
            _s.rect = null;
            _s.alpha = null;
            _s.innerHTML = null;
            _s.isHtml5_bl = null;
            _s.hasT3D = null;
            _s.hasT2D = null;
            _s = null;
        };
        
        /* init */
        _s.init();
    };
    
    window.FWDR3DCovDO3D = FWDR3DCovDO3D;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Event dispatcher.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
    var FWDR3DCovEventDispatcher = function (){

        'use strict';
        
        this.listeners = {events_ar:[]};
         
        this.addListener = function (type, listener){
            
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function.");
            
            var event = {};
            event.type = type;
            event.listener = listener;
            event.target = this;
            this.listeners.events_ar.push(event);
        };
        
        this.dispatchEvent = function(type, props){
            if(this.listeners == null) return;
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            
            for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
                if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){       
                    if(props){
                        for(var prop in props){
                            this.listeners.events_ar[i][prop] = props[prop];
                        }
                    }
                    this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
                }
            }
        };
        
       this.removeListener = function(type, listener){
            
            if(type == undefined) throw Error("type is required.");
            if(typeof type === "object") throw Error("type must be of type String.");
            if(typeof listener != "function") throw Error("listener must be of type Function." + type);
            
            for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
                if(this.listeners.events_ar[i].target === this 
                        && this.listeners.events_ar[i].type === type
                        && this.listeners.events_ar[i].listener ===  listener
                ){
                    this.listeners.events_ar.splice(i,1);
                    break;
                }
            }  
        };
        
       /**
         * Destory.
         */
        this.destroy = function(){
            this.listeners = null;
            
            this.addListener = null;
            this.dispatchEvent = null;
            this.removeListener = null;
        };
        
    };  
    
    window.FWDR3DCovEventDispatcher = FWDR3DCovEventDispatcher;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Info window.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    var FWDR3DCovInfo = function(prt, warningIconPath){

        'use strict';
        
        var _s = this;
        _s.allowToRemove_bl = true;

        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setResizableSizeAfterParent();
            _s.style().width = "80%";
            _s.screen.className = 'fwdr3dcov-info-window';
        
            _s.textHolder_do = new FWDR3DCovDO("div");
            if(!FWDR3DCovUtils.isIEAndLessThen9) _s.textHolder_do.style().font = "Arial";
            _s.textHolder_do.style().wordWrap = "break-word";
            _s.textHolder_do.style().padding = "10px";
            _s.textHolder_do.style().paddingLeft = "42px";
            _s.textHolder_do.style().lineHeight = "18px";
            _s.textHolder_do.setBkColor("#EEEEEE");
            
            var img_img = new Image();
            img_img.src = warningIconPath;
            _s.img_do = new FWDR3DCovDO("img");
            _s.img_do.setScreen(img_img);
            _s.img_do.setWidth(28);
            _s.img_do.setHeight(28);
            
            _s.addChild(_s.textHolder_do);
            _s.addChild(_s.img_do);
        };
        
        _s.showText = function(txt){
            if(!_s.isShowedOnce_bl){
                _s.screen.addEventListener("mousedown", _s.closeWindow);
                _s.isShowedOnce_bl = true;
            }

            _s.textHolder_do.setInnerHTML(txt);
            
            clearTimeout(_s.show_to);
            _s.show();
        };
        
        _s.show = function(){
            _s.isShowed = true;
            _s.setVisible(true);
            setTimeout(function(){
                _s.positionAndResize();
            }, 60);
        };
        
        _s.positionAndResize = function(){      
            _s.setHeight(_s.textHolder_do.getHeight());
            _s.img_do.setX(6);
            _s.img_do.setY(parseInt((_s.h - _s.img_do.h)/2));
    
        };
        
        _s.closeWindow = function(){
            if(!_s.allowToRemove_bl) return;
            _s.isShowed = false;
            clearTimeout(_s.show_to);
            try{prt.main_do.removeChild(_s);}catch(e){}
        };
        
        _s.init();
    };
    
        
    /**
     * Set prototype.
     */
    FWDR3DCovInfo.setPrototype = function(){
        FWDR3DCovInfo.prototype = new FWDR3DCovDO("div", "relative");
    };
    
    FWDR3DCovInfo.prototype = null;
    window.FWDR3DCovInfo = FWDR3DCovInfo;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Menu.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    var FWDR3DCovMenu = function(prt, props_obj){

        'use strict';
        
        var _s = this;
        var prototype = FWDR3DCovMenu.prototype;
        
        _s.categories_ar = props_obj.categories_ar;
        _s.buttons_ar = [];

        _s.grabC = 'url(' + prt._d.grabIconPath_str + '), default';
        _s.handC = 'url(' + prt._d.handIconPath_str + '), default';
        _s.arrowNImg = props_obj.arrowNImg;
        
        _s.arrowN_str = props_obj.arrowN_str;
        _s.selectorLineColor = props_obj.selectorLineColor;
        
        _s.selectorLabel_str = props_obj.selectorLabel;
        _s.selectorBkColorN_str1 = props_obj.selectorBackgroundColor;
        _s.selectorTextColorN_str = props_obj.selectorTextNormalColor;
        _s.selectorTextColorS_str = props_obj.selectorTextSelectedColor;
        _s.itemBkColorN_str1 = props_obj.buttonBackgroundColor;
        _s.itemTextColorN_str = props_obj.buttonTextNormalColor;
        _s.itemTextColorS_str = props_obj.buttonTextSelectedColor;
        _s.position_str = props_obj.position;
        
        _s.finalY;
        _s.tt = _s.categories_ar.length;
        if(_s.tt > 5) _s.hasScroll = true;
        _s.curId = props_obj.startAtCategory;
        _s.horizontalMargins = props_obj.comboBoxHorizontalMargins;
        _s.verticalMargins = props_obj.comboBoxVerticalMargins;
        _s.buttonsHolderWidth = 0;
        _s.buttonsHolderHeight = 0;
        _s.totalWidth = 0;
        _s.buttonH = 32;
        _s.selectorH;
        _s.totalButtonsHeight = 0;
        _s.sapaceBetweenButtons = 0;
        _s.curId = prt.startAtCategory;
    
        _s.hideMenuTimeOutId_to;
        _s.getMaxWidthResizeAndPositionId_to;
        _s.friction = .9;
        
        _s.isShowed_bl = false;
        _s.isOpened_bl = false;
        _s.hasPointerEvent_bl = FWDR3DCovUtils.hasPointerEvent;
        _s.isMobile_bl = FWDR3DCovUtils.isMobile;
        
        _s.init = function(){
            _s.setVisible(false);
            
            _s.setZ(9999999999);
            _s.setupMainContainers();
            _s.getMaxWidthResizeAndPositionId_to = setTimeout(
                    function(){
                        _s.getMaxWidthResizeAndPosition();
                        _s.setButtonsState();
                        _s.position();
                        }
                        , 200);
            _s.screen.className = 'fwdr3dcov-menu';
        };
        
    
        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){
            var button_do;
            
            _s.mainHolder_do = new FWDR3DCovDO("div");
            _s.mainHolder_do.setOverflow("visible");
            _s.addChild(_s.mainHolder_do);
            
            _s.mainButtonsHolder_do = new FWDR3DCovDO("div");
            _s.mainButtonsHolder_do.setBkColor(_s.itemBkColorN_str1)
            _s.mainHolder_do.addChild(_s.mainButtonsHolder_do);
            
            _s.buttonsHolder_do = new FWDR3DCovDO("div");
            _s.buttonsHolder_do.setBkColor(_s.itemBkColorN_str1)
            _s.mainButtonsHolder_do.addChild(_s.buttonsHolder_do);
            
            var selLabel = _s.categories_ar[_s.curId];

            var cls;
            if(prt._d.useVectorIcons){
                cls = '<span class="fwdr3dcov-icon fwdr3dcov-icon-menu-icon"></span>';
            }
            
            FWDR3DCovMenuSelector.setPrototype();
            _s.selector_do = new FWDR3DCovMenuSelector(
                    _s.arrowNImg,
                    _s.arrowN_str,
                    _s.selectorLineColor,
                    selLabel,
                    _s.selectorBkColorN_str1,
                    _s.selectorTextColorN_str,
                    _s.selectorTextColorS_str,
                    cls,
                    prt._d.isSkinWhite);
            _s.mainHolder_do.addChild(_s.selector_do);
            _s.selector_do.setNormalState(false);
            _s.selector_do.addListener(FWDR3DCovMenuSelector.CLICK, _s.openMenuHandler);


            for(var i=0; i<_s.tt; i++){
                FWDR3DCovMenuButton.setPrototype();
                button_do = new FWDR3DCovMenuButton(
                        _s.categories_ar[i],
                        _s.itemBkColorN_str1,
                        _s.itemTextColorN_str,
                        _s.itemTextColorS_str,
                        i,
                        _s.buttonH);
                _s.buttons_ar[i] = button_do;
                button_do.addListener(FWDR3DCovMenuButton.CLICK, _s.buttonOnMouseDownHandler);
                _s.buttonsHolder_do.addChild(button_do);
            }
            
            if(_s.borderRadius != 0){
                button_do.bk_sdo.style().borderBottomLeftRadius = _s.borderRadius + "px";
                button_do.bk_sdo.style().borderBottomRightRadius = _s.borderRadius + "px";
            }

            _s.grabbed_do = new FWDR3DCovDO('div');
            _s.grabbed_do.style().width = '100%';
            _s.grabbed_do.style().cursor = _s.grabC;
            _s.mainButtonsHolder_do.addChild(_s.grabbed_do);
        };
        
        _s.buttonOnMouseDownHandler = function(e){
            _s.curId = e.target.id;
            _s.setButtonsState();
            
            clearTimeout(_s.hideMenuTimeOutId_to);
            
            _s.hide(true);
            
            _s.selector_do.enable(); 
            _s.setValue(_s.curId);
            if(_s.isMobile_bl){
                if(_s.hasPointerEvent_bl){
                    window.removeEventListener("MSPointerDown", _s.checkOpenedMenu);
                }else{
                    window.removeEventListener("touchstart", _s.checkOpenedMenu);
                }
            }else{
                window.removeEventListener("mousemove", _s.checkOpenedMenu);
            }
            
            _s.dispatchEvent(FWDR3DCovMenu.BUTTON_PRESSED, {id:_s.curId});
        };
        
        _s.openMenuHandler = function(){
            if(_s.isShowed_bl) return;
            _s.selector_do.disable();
            _s.show(true);
            _s.startToCheckOpenedMenu();
            
            _s.dispatchEvent(FWDR3DCovMenu.OPEN);
        };

        _s.setValue = function(id){
            _s.curId = id;
            _s.selector_do.setText(_s.categories_ar[_s.curId]);
            _s.setButtonsState();
        };
        
        
        /**
         * Start to check if mouse is over menu.
         */
        _s.startToCheckOpenedMenu = function(e){
            if(_s.isMobile_bl){
                if(_s.hasPointerEvent_bl){
                    window.addEventListener("MSPointerDown", _s.checkOpenedMenu);
                }else{
                    window.addEventListener("touchstart", _s.checkOpenedMenu);
                }
            }else{
                window.addEventListener("mousemove", _s.checkOpenedMenu);
                window.addEventListener("mousedown", _s.checkOpenedMenuOnMD);
            }
        };

        _s.checkOpenedMenuOnMD = function(e){
            _s.checkOpenedMenu(e, true);
        }
        
        _s.checkOpenedMenu = function(e, md){
            if(_s.isDragging) return;
            
            var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);       
            
            if(!FWDR3DCovUtils.hitTest(_s.screen, viewportMouseCoordinates.screenX, viewportMouseCoordinates.screenY)){
                
                if(_s.isMobile_bl || md){
                    _s.hide(true);
                    _s.selector_do.enable();
                    window.removeEventListener("mousedown", _s.checkOpenedMenuOnMD);
                }else{
                    clearTimeout(_s.hideMenuTimeOutId_to);
                    _s.hideMenuTimeOutId_to = setTimeout(function(){
                        _s.hide(true);
                        _s.selector_do.enable();}, 
                        1000);
                }
                
                if(_s.isMobile_bl){
                    if(_s.hasPointerEvent_bl){
                        window.removeEventListener("MSPointerDown", _s.checkOpenedMenu);
                    }else{
                        window.removeEventListener("touchstart", _s.checkOpenedMenu);
                    }
                }else{
                    window.removeEventListener("mousemove", _s.checkOpenedMenu);
                }
            }else{
                clearTimeout(_s.hideMenuTimeOutId_to);
            }
        };
        
        
        /**
         * Get and sent max size.
         */
        _s.getMaxWidthResizeAndPosition = function(){
            
            var button_do;
            var finalX;
            var finalY;
            _s.selectorH = _s.selector_do.getMaxHeight();

            _s.totalWidth = 0;
            _s.totalButtonsHeight = 0;
            _s.totalButtonsScroll = 0;

            _s.totalWidth = _s.selector_do.getMaxWidth();

        
            for(var i=0; i<_s.tt; i++){
                button_do = _s.buttons_ar[i];
                if(button_do.getMaxWidth() > _s.totalWidth) _s.totalWidth = button_do.getMaxWidth();
            };

            _s.buttons_ar[0].text_sdo.screen.className =  'fwdr3dcov-menu-button first-button';
            _s.buttons_ar[_s.tt - 1].text_sdo.screen.className =  'fwdr3dcov-menu-button last-button';
            
            for(var i=0; i<_s.tt; i++){
                button_do = _s.buttons_ar[i];

                button_do.setWidth(_s.totalWidth);
                button_do.setHeight(button_do.getMaxHeight());
                if(!_s.prevButton){
                    button_do.setY(0);
                }else{
                    button_do.setY(_s.prevButton.y + _s.prevButton.h)
                }
                button_do.totalWidth =  _s.totalWidth;
                _s.prevButton = button_do;
                
                if(_s.hasScroll){
                    if(i < 5){
                        if(i < 4){
                            _s.totalButtonsHeight += button_do.h;
                        }else{
                            button_do = _s.buttons_ar[_s.tt - 1];
                            button_do.setHeight(button_do.getMaxHeight());
                            _s.totalButtonsHeight += button_do.h;
                        }
                    }
                }else{
                    _s.totalButtonsHeight += button_do.h;
                }

                if(_s.hasScroll) _s.activateScroll();
                if(_s.hasScroll){
                    if(i == _s.tt - 1){
                        button_do = _s.buttons_ar[1];
                        _s.totalButtonsScroll += button_do.h;
                    }else{
                        _s.totalButtonsScroll += button_do.h;
                    }
                }else{
                    _s.totalButtonsScroll += button_do.h;
                }
                
            }
            
            _s.setWidth(_s.totalWidth);
            _s.mainButtonsHolder_do.setWidth(_s.totalWidth);
            _s.selector_do.totalWidth =  _s.totalWidth;
            _s.selector_do.setWidth(_s.totalWidth);
            _s.selector_do.setHeight(_s.selectorH);

            _s.buttonsHolder_do.setWidth(_s.totalWidth);
            _s.buttonsHolder_do.setHeight(_s.totalButtonsScroll);
            _s.hide(false, true);
        };


        /**
         * Scroll.
         */
        _s.activateScroll = function(){
            _s.buttonsHolder_do.screen.addEventListener("mousedown", _s.onMaxScrollStart);
            window.addEventListener("mouseup", _s.onMaxScrollEnd);
            _s.buttonsHolder_do.screen.addEventListener("touchstart", _s.onMaxScrollStart);
            window.addEventListener("touchend", _s.onMaxScrollEnd);
        }

        _s.removeMaxItemScroll = function(){
            _s.buttonsHolder_do.screen.removeEventListener("mousedown", _s.onMaxScrollStart);
            window.removeEventListener("mouseup", _s.onMaxScrollEnd);
            window.removeEventListener("mousemove", _s.onMaxScrollMove);
            _s.buttonsHolder_do.screen.removeEventListener("touchstart", _s.onMaxScrollStart);
            window.removeEventListener("touchend", _s.onMaxScrollEnd);  
            window.removeEventListener("touchmove", _s.onMaxScrollMove);
            _s.isDragging = false;
            cancelAnimationFrame(_s.updateMax_af);
        };

        _s.onMaxScrollStart =  function(e){
            if(e.button && e.button == 2) return;
            _s.setButtonsState(true);
            var vc = FWDR3DCovUtils.getViewportMouseCoordinates(e); 
            
            window.addEventListener("mousemove", _s.onMaxScrollMove);
            window.addEventListener("touchmove", _s.onMaxScrollMove, { passive:false});
            
            _s.isDragging = true;   
            _s.maxItemY = _s.lastFinalY = _s.buttonsHolder_do.y;
            _s.lastPresedY = vc.screenY;
            _s.startToUpdateDrag();
        };

        _s.onMaxScrollEnd = function(e){
        
            window.removeEventListener("mousemove", _s.onMaxScrollMove);
            window.removeEventListener("touchmove", _s.onMaxScrollMove);
            _s.grabId_to = setTimeout(function(){
                _s.grabbed_do.style().height = '0%';
                _s.isGrabbed = false;
            }, 50);
            _s.setButtonsState();
            
            _s.isDragging = false;
        };


        _s.onMaxScrollMove = function(e){
            if(e.preventDefault) e.preventDefault();
            var vc = FWDR3DCovUtils.getViewportMouseCoordinates(e); 
            
            var toAddY = vc.screenY - _s.lastPresedY;
            _s.maxItemY += toAddY;
            _s.maxItemY =  Math.round(_s.maxItemY);
            _s.lastPresedY = vc.screenY;
            _s.buttonsHolder_do.setY(_s.maxItemY);
            
            if(Math.abs(toAddY) >= 1){
                _s.grabbed_do.style().height = '100%';
                _s.isGrabbed = true;
            }
            
        };

        _s.stopToUpdateDrag = function(){
            cancelAnimationFrame(_s.updateMax_af);
        }

        _s.startToUpdateDrag = function(){
            _s.stopToUpdateDrag();
            _s.updateMax();
        }

        _s.updateMax = function(){      
            _s.updateMax_af = requestAnimationFrame(_s.updateMax);
            _s.stageH = _s.totalButtonsHeight;
            
            if(_s.isDragging){
                _s.vy = _s.maxItemY - _s.lastFinalY;
                _s.lastFinalY = _s.maxItemY;    
            }else{
                _s.vy *= _s.friction;       
                _s.maxItemY += _s.vy;
                if(_s.stageH <= _s.buttonsHolder_do.h){
                    if(_s.maxItemY >= 0){
                        _s.vy2 = (0 - _s.maxItemY) * .3;
                        _s.vy *= _s.friction;
                        _s.maxItemY += _s.vy2;
                    }else if(_s.maxItemY <= _s.stageH - _s.buttonsHolder_do.h){
                        _s.vy2 = (_s.stageH - _s.buttonsHolder_do.h - _s.maxItemY) * .3;
                        _s.vy *= _s.friction;
                        _s.maxItemY += _s.vy2;
                    }
                }else{
                    _s.vy2 =((_s.stageH - _s.buttonsHolder_do.h)/2 - _s.maxItemY) * .3;
                    _s.vy *= _s.friction;
                    _s.maxItemY += _s.vy2;
                }

                _s.maxItemY = parseFloat(_s.maxItemY.toFixed(2));
            
                if(_s.prevMaxItemY == _s.maxItemY){
                    _s.stopToUpdateDrag();
                    _s.maxItemY = Math.round(_s.maxItemY);
                }
                
                _s.buttonsHolder_do.setY(_s.maxItemY);
                _s.prevMaxItemY = _s.maxItemY;
            }
        };


        /**
         * Set buttons state.
         */
        _s.setButtonsState =  function(drag){
            for(var i=0; i<_s.tt; i++){
                var btn = _s.buttons_ar[i];
                if(i == _s.curId){
                    btn.isDisabled_bl = true;
                    btn.setButtonMode(false);
                    btn.setSelectedState(true);
                }else{
                    btn.isDisabled_bl = false;
                    btn.setButtonMode(true);
                    btn.setNormalState(true);
                }

                if(_s.hasScroll){
                    if(drag){
                        btn.style().cursor = _s.grabC;
                    }else{
                        btn.style().cursor = _s.handC;
                    }
                    
                }
            }
        }


        /**
         * Position.
         */
        _s.position = function(){
            if(_s.position_str == "topleft"){
                _s.finalX = Math.max((prt.stageWidth - prt.originalWidth)/2 + _s.horizontalMargins, _s.horizontalMargins);
                _s.finalY = _s.verticalMargins + 1;
            }else if(_s.position_str == "topright"){
                _s.finalX = Math.min((prt.originalWidth - prt.stageWidth)/2 + prt.stageWidth - _s.totalWidth - _s.horizontalMargins, prt.stageWidth - _s.totalWidth - _s.horizontalMargins);
                _s.finalY = _s.verticalMargins + 1;
            }
            
            _s.setX(Math.floor(_s.finalX));
            _s.setY(Math.floor(_s.finalY));
            if(prt.thumbsManagerDO && prt.thumbsManagerDO.isEvpFS) _s.setY(-500);
        };
        
        
        /**
         * Hide/show.
         */
        _s.showFirstTime = function(){
            if(_s.showFirstTimeDone) return;
            _s.showFirstTimeDone = true;
            _s.setVisible(true);
            _s.setAlpha(0);
            _s.mainButtonsHolder_do.setY(_s.selectorH);
            if(_s.position_str == "topleft" || _s.position_str == "topright"){
                _s.setY( -(_s.finalY + _s.selectorH/2));
            }
            FWDAnimation.to(_s, .8, {y:_s.finalY, alpha:1, ease:Expo.easeInOut});   

        };
        
        _s.hide = function(animate, overwrite){
            if(!_s.isShowed_bl && !overwrite) return;
            
        
            _s.isShowed_bl = false;
            
            if(animate){
                FWDAnimation.to(_s.mainButtonsHolder_do, .6, {h:0, ease:Expo.easeInOut});   
                FWDAnimation.to(_s, .6, {h:_s.selectorH, ease:Expo.easeInOut}); 
            }else{
                FWDAnimation.killTweensOf(_s);
                FWDAnimation.killTweensOf(_s.buttonsHolder_do);
                FWDAnimation.killTweensOf(_s.mainButtonsHolder_do);
                _s.buttonsHolder_do.setY(_s.selectorH - _s.totalButtonsHeight);
                _s.mainButtonsHolder_do.setHeight(0);
                _s.setHeight(_s.selectorH);
            }
        };

        _s.show = function(animate, overwrite){
            if(_s.isShowed_bl && !overwrite) return;
            
            _s.isShowed_bl = true;
            clearTimeout(_s.hideMenuTimeOutId_to);
            
            if(animate){    
                if(!FWDAnimation.isTweening(_s)){
                    _s.buttonsHolder_do.setY(-_s.selectorH);
                }
                FWDAnimation.to(_s.buttonsHolder_do, .6, {y:0, ease:Expo.easeInOut});
                FWDAnimation.to(_s.mainButtonsHolder_do, .6, {h:_s.totalButtonsHeight + _s.selectorH, ease:Expo.easeInOut});    
                FWDAnimation.to(_s, .6, {h:_s.totalButtonsHeight + _s.selectorH, ease:Expo.easeInOut}); 
            }else{
                FWDAnimation.killTweensOf(_s);
                FWDAnimation.killTweensOf(_s.mainButtonsHolder_do);
                FWDAnimation.killTweensOf(_s.buttonsHolder_do);
                _s.mainButtonsHolder_do.setHeight(_s.selectorH + _s._s.selectorH);
                _s.buttonsHolder_do.setY(0);
                _s.setHeight(_s.selectorH);
            }
        };
        
        _s.init();
    };

    
    /**
     * Prototype.
     */
    FWDR3DCovMenu.setPrototype =  function(){
        FWDR3DCovMenu.prototype = new FWDR3DCovDO3D("div");
    };

    FWDR3DCovMenu.OPEN = "open";
    FWDR3DCovMenu.HIDE_COMPLETE = "infoWindowHideComplete";
    FWDR3DCovMenu.BUTTON_PRESSED = "buttonPressed";

    FWDR3DCovMenu.prototype = null;
    window.FWDR3DCovMenu = FWDR3DCovMenu;
    
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Menu button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){   
    var FWDR3DCovMenuButton = function(
            label1, 
            backgroundNormalColor1,
            textNormalColor,
            textSelectedColor,
            id
        ){

        'use strict';
        
        var _s = this;
        var prototype = FWDR3DCovMenuButton.prototype;
                
        _s.label1_str = label1;
        _s.backgroundNormalColor_str1 = backgroundNormalColor1;
        _s.textNormalColor_str = textNormalColor;
        _s.textSelectedColor_str = textSelectedColor;
        
        _s.totalWidth = 400;
        _s.id = id;
        
        _s.hasPointerEvent_bl = FWDR3DCovUtils.hasPointerEvent;
        _s.isMobile_bl = FWDR3DCovUtils.isMobile;
        _s.isDisabled_bl = false;
        
    
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setBackfaceVisibility();
            _s.setupMainContainers();
        };
        
        
        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){
            
            _s.bk_sdo = new FWDR3DCovDO("div");
            _s.bk_sdo.style().width = '100%';
            _s.bk_sdo.style().height = '100%';
            _s.bk_sdo.setBkColor(_s.backgroundNormalColor_str1);
            _s.addChild(_s.bk_sdo);
            
            _s.text_sdo = new FWDR3DCovDO("div");
            _s.text_sdo.screen.className = 'fwdr3dcov-menu-button';
            _s.text_sdo.style().whiteSpace = "nowrap";
            _s.text_sdo.setBackfaceVisibility();
            _s.text_sdo.setDisplay("inline-block");
            _s.text_sdo.style().boxSizing = 'border-box';
            _s.text_sdo.style().color = _s.normalColor_str;
            _s.text_sdo.setInnerHTML(_s.label1_str);
            _s.addChild(_s.text_sdo);

            _s.dumy_sdo = new FWDR3DCovDO("div");
            if(FWDR3DCovUtils.isIE){
                _s.dumy_sdo.setBkColor("#FF0000");
                _s.dumy_sdo.setAlpha(0);
            };
            _s.dumy_sdo.style().width = '100%';
            _s.dumy_sdo.style().height = '100%';
            _s.addChild(_s.dumy_sdo);
            
            if(_s.isMobile_bl){
                if(_s.hasPointerEvent_bl){
                    _s.screen.addEventListener("MSPointerOver", _s.onMouseOver);
                    _s.screen.addEventListener("MSPointerOut", _s.onMouseOut);
                    _s.screen.addEventListener("MSPointerDown", _s.onMouseDown);
                    _s.screen.addEventListener("MSPointerUp", _s.onClick);
                }else{
                    _s.screen.addEventListener("click", _s.onClick);
                }
            }else if(_s.screen.addEventListener){
                _s.screen.addEventListener("mouseover", _s.onMouseOver);
                _s.screen.addEventListener("mouseout", _s.onMouseOut);
                _s.screen.addEventListener("click", _s.onClick);
            }
        };
        
        _s.onMouseOver = function(e){
            if(_s.isDisabled_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
                FWDAnimation.killTweensOf(_s.text_sdo);
                _s.setSelectedState(true);
                _s.dispatchEvent(FWDR3DCovMenuButton.MOUSE_OVER);
            }
        };
            
        _s.onMouseOut = function(e){
            if(_s.isDisabled_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
                FWDAnimation.killTweensOf(_s.text_sdo);
                _s.setNormalState(true);
                _s.dispatchEvent(FWDR3DCovMenuButton.MOUSE_OUT);
            }
        };
        
        _s.onClick = function(e){
            if(_s.isDisabled_bl) return;
            if(e.preventDefault) e.preventDefault();
            _s.dispatchEvent(FWDR3DCovMenuButton.CLICK, {e:e});
        };
    

        /**
         * Set selected / normal state.
         */
        _s.setSelectedState = function(animate){
            if(animate){
                FWDAnimation.to(_s.text_sdo.screen, .6, {css:{color:_s.textSelectedColor_str}, ease:Quart.easeOut});
            }else{
                _s.bk_sdo.setCSSGradient(_s.backgroundSelectedColor_str, _s.backgroundNormalColor_str);
                _s.text_sdo.style().color = _s.textSelectedColor_str;
            }
        };
        
        _s.setNormalState = function(animate){
            if(animate){
                FWDAnimation.to(_s.text_sdo.screen, .6, {css:{color:_s.textNormalColor_str}, ease:Quart.easeOut});
            }else{
                _s.bk_sdo.setCSSGradient(_s.backgroundNormalColor_str, _s.backgroundSelectedColor_str);
                _s.text_sdo.style().color = _s.textNormalColor_str;
            }
        };
        
    
        /**
         * Get max text width/height.
         */
        _s.getMaxWidth = function(){
            return _s.text_sdo.getWidth();
        };

        _s.getMaxHeight = function(){
            return _s.text_sdo.getHeight();
        }
        
        _s.init();
    };
    
    /**
     * Prototype.
     */
    FWDR3DCovMenuButton.setPrototype = function(){
        FWDR3DCovMenuButton.prototype = new FWDR3DCovDO("div");
    };
    
    FWDR3DCovMenuButton.FIRST_BUTTON_CLICK = "onFirstClick";
    FWDR3DCovMenuButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
    FWDR3DCovMenuButton.MOUSE_OVER = "onMouseOver";
    FWDR3DCovMenuButton.MOUSE_OUT = "onMouseOut";
    FWDR3DCovMenuButton.MOUSE_DOWN = "onMouseDown";
    FWDR3DCovMenuButton.CLICK = "onClick";
    
    FWDR3DCovMenuButton.prototype = null;
    window.FWDR3DCovMenuButton = FWDR3DCovMenuButton;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Menu selector.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
    var FWDR3DCovMenuSelector = function(
            arrowNImg,
            arrowN_str,
            selectorLineColor,
            label1, 
            backgroundNormalColor1,
            textNormalColor,
            textSelectedColor,
            cls,
            white
        ){

        'use strict';
    
        var _s = this;
        var prototype = FWDR3DCovMenuSelector.prototype;
        
        _s.arrowN_str = arrowN_str;
        _s.selectorLineColor = selectorLineColor;
        
        _s.label1_str = label1;
        _s.backgroundNormalColor_str1 = backgroundNormalColor1;
        _s.textNormalColor_str = textNormalColor;
        _s.textSelectedColor_str = textSelectedColor;
        
        _s.totalWidth = 400;
        if(!cls){
            _s.arrowWidth = arrowNImg.width;
            _s.arrowHeight = arrowNImg.height;
        }
        
        _s.hasPointerEvent_bl = FWDR3DCovUtils.hasPointerEvent;
        _s.isMobile_bl = FWDR3DCovUtils.isMobile;
        _s.isDisabled_bl = false;

        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setBackfaceVisibility();
            _s.setButtonMode(true);
            _s.setupMainContainers();
            _s.setWidth(_s.totalWidth);
        };
    
        
        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){
            
            _s.bk_sdo = new FWDR3DCovDO("div");
            _s.bk_sdo.setBkColor(_s.backgroundNormalColor_str1);
            _s.bk_sdo.style().width = '100%';
            _s.bk_sdo.style().height = '100%';
            _s.addChild(_s.bk_sdo);
            
            _s.text_sdo = new FWDR3DCovDO("div");
            _s.text_sdo.screen.className = 'fwdr3dcov-menu-selector';
            _s.text_sdo.style().whiteSpace = "nowrap";
            _s.text_sdo.setBackfaceVisibility();
            _s.text_sdo.setOverflow("visible");
            _s.text_sdo.setDisplay("inline-block");
            _s.text_sdo.style().color = _s.normalColor_str;
        
            _s.setText(_s.label1_str);
            _s.addChild(_s.text_sdo);
        
            _s.arrowN_sdo = new FWDR3DCovDO("div");
            _s.addChild(_s.arrowN_sdo);         
            _s.arrowN_sdo.setAlpha(.5);
        
            if(cls){
                _s.arrowN_sdo.screen.className = 'fwdr3dcov-menu-icon vector';
                if(white){
                    _s.arrowN_sdo.screen.className = 'fwdr3dcov-menu-icon white vector';
                }
                _s.arrowN_sdo.setInnerHTML(cls);
                setTimeout(function(){
                    _s.arrowWidth = parseInt(getComputedStyle(_s.arrowN_sdo.screen).getPropertyValue("height"));
                    _s.arrowHeight = parseInt(getComputedStyle(_s.arrowN_sdo.screen).getPropertyValue("width"));
                }, 5);
            }else{
                _s.arrowN_sdo.screen.className = 'fwdr3dcov-menu-icon';
                if(white){
                    _s.arrowN_sdo.screen.className = 'fwdr3dcov-menu-icon white';
                }
                _s.arrowN_sdo.screen.style.backgroundImage = "url(" + _s.arrowN_str + ")";
            }

            setTimeout(function(){
                _s.arrowN_sdo.setWidth(_s.arrowWidth);
                _s.arrowN_sdo.setHeight(_s.arrowHeight);
                _s.arrowN_sdo.setY(Math.round((_s.h - _s.arrowN_sdo.h)/2) - 1);
            }, 350);

            _s.line_do =  new FWDR3DCovDO('div');
            _s.line_do.screen.className = 'fwdr3dcov-menu-line';
            _s.line_do.style().background = _s.selectorLineColor;
            _s.line_do.setAlpha(0);
            _s.addChild(_s.line_do);
            
            _s.dumy_sdo = new FWDR3DCovDO("div");
            _s.dumy_sdo.style().width = '100%';
            _s.dumy_sdo.style().height = '100%';
            if(FWDR3DCovUtils.isIE){
                _s.dumy_sdo.setBkColor("#FF0000");
                _s.dumy_sdo.setAlpha(0);
            };
            _s.addChild(_s.dumy_sdo);
        
            _s.screen.addEventListener("mouseover", _s.onMouseOver);
            _s.screen.addEventListener("mouseout", _s.onMouseOut);
            _s.screen.addEventListener("click", _s.onClick);
            
        };
        
        _s.onMouseOver = function(e){
            if(_s.isDisabled_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
                FWDAnimation.killTweensOf(_s.text_sdo);
                _s.setSelectedState(true);
                _s.dispatchEvent(FWDR3DCovMenuSelector.MOUSE_OVER);
            }
        };
            
        _s.onMouseOut = function(e){
            if(_s.isDisabled_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
                FWDAnimation.killTweensOf(_s.text_sdo);
                _s.setNormalState(true);
                _s.dispatchEvent(FWDR3DCovMenuSelector.MOUSE_OUT);
            }
        };
        
        _s.onClick = function(e){
            if(_s.isDisabled_bl) return;
            _s.dispatchEvent(FWDR3DCovMenuSelector.CLICK);
        };
    
        
        /**
         * Set selected / normal state.
         */
        _s.setSelectedState = function(animate){
            if(animate){
                FWDAnimation.to(_s.text_sdo.screen, .6, {css:{color:_s.textSelectedColor_str}, ease:Quart.easeOut});
                FWDAnimation.to(_s.arrowN_sdo, .6, {alpha:1, ease:Quart.easeOut});
            }else{
                _s.bk_sdo.setCSSGradient(_s.backgroundSelectedColor_str, _s.backgroundNormalColor_str);
                _s.text_sdo.style().color = _s.textSelectedColor_str;
                _s.arrowN_sdo.alpha = 1;
            }
        };
        
        _s.setNormalState = function(animate){
            if(animate){
                FWDAnimation.to(_s.text_sdo.screen, .6, {css:{color:_s.textNormalColor_str}, ease:Quart.easeOut});
                FWDAnimation.to(_s.arrowN_sdo, .6, {alpha:.4, ease:Quart.easeOut});
            }else{
                _s.bk_sdo.setCSSGradient(_s.backgroundNormalColor_str, _s.backgroundSelectedColor_str);
                _s.text_sdo.style().color = _s.textNormalColor_str;
                _s.arrowN_sdo.alpha = .4;
            }
        };
        

        /**
         * Get max text width/height.
         */
        _s.getMaxWidth = function(){
            return _s.text_sdo.getWidth();
        };

        _s.getMaxHeight = function(){
            return _s.text_sdo.getHeight();
        }
        
        
        /**
         * Disable/enable.
         */
        _s.disable = function(){
            _s.isDisabled_bl = true;
            _s.setSelectedState(true);
            _s.setButtonMode(false);
            FWDAnimation.to(_s.line_do, .6, {alpha:1, ease:Quart.easeOut});
        };
        
        _s.enable = function(){
            _s.isDisabled_bl = false;
            _s.setNormalState(true);
            _s.setButtonMode(true);
            FWDAnimation.to(_s.line_do, .6, {alpha:0, ease:Quart.easeOut});
        };
        
        _s.setText = function(text){
            _s.text_sdo.setInnerHTML(text);
        };
    
        _s.init();
    };
    
    
    /**
     * Prototype.
     */
    FWDR3DCovMenuSelector.setPrototype = function(){
        FWDR3DCovMenuSelector.prototype = new FWDR3DCovDO("div");
    };
    
    FWDR3DCovMenuSelector.FIRST_BUTTON_CLICK = "onFirstClick";
    FWDR3DCovMenuSelector.SECOND_BUTTON_CLICK = "secondButtonOnClick";
    FWDR3DCovMenuSelector.MOUSE_OVER = "onMouseOver";
    FWDR3DCovMenuSelector.MOUSE_OUT = "onMouseOut";
    FWDR3DCovMenuSelector.MOUSE_DOWN = "onMouseDown";
    FWDR3DCovMenuSelector.CLICK = "onClick";
    
    FWDR3DCovMenuSelector.prototype = null;
    window.FWDR3DCovMenuSelector = FWDR3DCovMenuSelector;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Preloader.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    
    var FWDR3DCovPreloader = function(prt, preloaderPostion, radius, backgroundColor, fillColor, strokeSize, animDur){

        'use strict';
        
        var _s  = this;
        var prototype = FWDR3DCovPreloader.prototype;
        _s.main_do;
        _s.preloaderPostion = preloaderPostion;
        _s.backgroundColor = backgroundColor;
        _s.fillColor = fillColor;
        _s.radius = radius;
        _s.strokeSize = strokeSize;
        _s.animDur = animDur || 300;
        _s.strtAngle = 270;
        _s.isShowed_bl = true;
        _s.angle = {n:0};
        
        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.mm_do =  new FWDR3DCovDO("div");
            _s.mm_do.setOverflow('visible');
            

            _s.main_do = new FWDR3DCovDO("div");
            _s.main_do.setOverflow("visible");
            _s.main_do.setWidth(_s.radius * 2 + _s.strokeSize);
            _s.main_do.setHeight(_s.radius * 2 + _s.strokeSize);
            
            _s.setOverflow('visible');
            _s.setWidth((_s.radius * 2) + _s.strokeSize);
            _s.setHeight((_s.radius * 2) + _s.strokeSize);
            _s.mm_do.setWidth(_s.w);
            _s.mm_do.setHeight(_s.h);
            _s.bkCanvas =  new FWDR3DCovDO("canvas");
            _s.bkCanvasContext = _s.bkCanvas.screen.getContext('2d');
            _s.fillCircleCanvas = new FWDR3DCovDO("canvas");
            _s.fillCtx = _s.fillCircleCanvas.screen.getContext('2d');
            _s.main_do.screen.style.transformOrigin = "50% 50%";
            
            _s.main_do.addChild(_s.bkCanvas);
            _s.main_do.addChild(_s.fillCircleCanvas);
            _s.mm_do.addChild(_s.main_do);
            _s.addChild(_s.mm_do);
            _s.drawBackground();
            _s.drawFill();
            _s.hide();
        };

        _s.setFWidth = function(w, h){
            _s.main_do.setX(Math.round(w-_s.w)/2);
            _s.main_do.setY(Math.round(h-_s.h)/2);
            _s.setWidth(w);
            _s.setHeight(h);

        }


        /**
         * Postion and resize.
         */
        _s.positionAndResize = function(){

            if(_s.preloaderPostion == 'bottomleft'){
                _s.setX(prt.offsetPreloader);
                _s.setY(prt.sH - _s.h - prt.offsetPreloader);
            }else if(_s.preloaderPostion == 'bottomright'){
                _s.setX(prt.sW - _s.w - prt.offsetPreloader);
                _s.setY(prt.sH - _s.h - prt.offsetPreloader);
            }else if(_s.preloaderPostion == 'topright'){
                _s.setX(prt.sW - _s.w - prt.offsetPreloader);
                _s.setY(prt.offsetPreloader);
            }else if(_s.preloaderPostion == 'topleft'){
                _s.setX(prt.offsetPreloader);
                _s.setY(prt.offsetPreloader);
            }else if(_s.preloaderPostion == 'center'){
                _s.setX(Math.round(prt.sW - _s.w)/2);
                _s.setY(Math.round(Math.min(prt.sH, prt.viewportSize.h) - _s.h)/2);
            }
        }   

        
        /**
         * Draw background.
         */
        _s.drawBackground = function(){
            _s.bkCanvas.screen.width = (_s.radius * 2) + _s.strokeSize * 2;
            _s.bkCanvas.screen.height = (_s.radius * 2) + _s.strokeSize * 2;
            _s.bkCanvasContext.lineWidth = _s.thicknessSize;
            _s.bkCanvasContext.translate(_s.strokeSize/2, _s.strokeSize/2);
            _s.bkCanvasContext.shadowColor = '#333333';
            _s.bkCanvasContext.shadowBlur = 1;
           
            _s.bkCanvasContext.lineWidth=_s.strokeSize;
            _s.bkCanvasContext.strokeStyle = _s.backgroundColor;
            _s.bkCanvasContext.beginPath();
            _s.bkCanvasContext.arc(_s.radius, _s.radius,  _s.radius, (Math.PI/180) * 0, (Math.PI/180) * 360, false);
            _s.bkCanvasContext.stroke();
            _s.bkCanvasContext.closePath();
        };
        
        
        /**
         * Draw fill.
         */
        _s.drawFill = function(p){  
            if(p) _s.angle.n = Math.round(p * 360); 
            _s.fillCircleCanvas.screen.width = (_s.radius * 2) + _s.strokeSize * 2;
            _s.fillCircleCanvas.screen.height = (_s.radius * 2) + _s.strokeSize * 2;
            _s.fillCtx.lineWidth = _s.thicknessSize;
            _s.fillCtx.translate(_s.strokeSize/2, _s.strokeSize/2);
            _s.fillCtx.lineWidth=_s.strokeSize;
            _s.fillCtx.strokeStyle = _s.fillColor;
            _s.fillCtx.beginPath();
            _s.fillCtx.arc(_s.radius, _s.radius,  _s.radius, (Math.PI/180) * _s.strtAngle, (Math.PI/180) * (_s.strtAngle +  _s.angle.n), false);
            _s.fillCtx.stroke();
            _s.fillCtx.closePath()
        };
        
        
        /**
         * Start/stop preloader animation.
         */
        _s.startSlideshow = function(){
            if(_s == null || self.isSlideShowRun) return;
            self.isSlideShowRun = true;
            FWDAnimation.killTweensOf(_s.angle);
            FWDAnimation.to(_s.angle, _s.animDur, {n:360, onUpdate:_s.drawFill, onComplete:_s.stopSlideshow});
        };
        
        _s.stopSlideshow = function(o){
            if(!self.isSlideShowRun && !o) return;
            self.isSlideShowRun = false;
            FWDAnimation.killTweensOf(_s.angle);
            FWDAnimation.to(_s.angle, .8, {n:0, onUpdate:_s.drawFill, ease:Expo.easeInOut});
        };

        _s.resetSlideshow = function(){
            FWDAnimation.killTweensOf(_s.angle);
            _s.angle.n = 0;
            _s.drawFill();
        }
        
        _s.startPreloader = function(){
            _s.stopPreloader();
            _s.angle = {n:0};
            FWDAnimation.to(_s.angle, _s.animDur, {n:360, onUpdate:_s.drawFill, repeat:100, yoyo:true, ease:Expo.easeInOut});
            FWDAnimation.to(_s.main_do.screen, _s.animDur, {rotation:360,  repeat:100});
        }

        _s.stopPreloader = function(){
            FWDAnimation.killTweensOf(_s.angle);
            FWDAnimation.killTweensOf(_s.main_do.screen);
            FWDAnimation.to(_s.main_do.screen, 0.00001, {rotation:0});
        }
        
    
        /**
         * Show/hide preloader animation.
         */
        _s.show = function(){
            if(_s.isShowed_bl) return;
            _s.setVisible(true);
            FWDAnimation.killTweensOf(_s.mm_do);
            FWDAnimation.to(_s.mm_do, 1, {alpha:1, delay:.2});
            _s.stopPreloader();
            _s.startPreloader();
            _s.isShowed_bl = true;
        };
        
        _s.hide = function(animate){
            if(!_s.isShowed_bl) return;
            
            FWDAnimation.killTweensOf(_s.mm_do);
            if(animate){
                FWDAnimation.to(_s.mm_do, .2, {alpha:0, onComplete:_s.onHideComplete});
            }else{
                _s.setVisible(false);
                _s.mm_do.setAlpha(0);
            }
            _s.isShowed_bl = false;
        };

        _s.show2 = function(){
            if(_s.isShowed_bl) return;
            _s.isShowed_bl = true;
            _s.setVisible(true);
            FWDAnimation.killTweensOf(_s.mm_do);
            FWDAnimation.to(_s.mm_do, 1, {alpha:1, ease:Expo.easeOut});
        }

        _s.hide2 = function(){
            if(!_s.isShowed_bl) return;
            _s.isShowed_bl = false;
            FWDAnimation.killTweensOf(_s.mm_do);
            FWDAnimation.to(_s.mm_do, 1, {alpha:0, onComplete:_s.onHideComplete, ease:Expo.easeOut});
        }
        
        _s.onHideComplete = function(){
            _s.setVisible(false);
            _s.stopPreloader();
            _s.dispatchEvent(FWDR3DCovPreloader.HIDE_COMPLETE);
        };
        
        _s.init();
    };
    
    
    /**
     * Set prototype.
     */
    FWDR3DCovPreloader.setPrototype = function(){
        FWDR3DCovPreloader.prototype = new FWDR3DCovDO("div");
    };
    
    FWDR3DCovPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDR3DCovPreloader.prototype = null;
    window.FWDR3DCovPreloader = FWDR3DCovPreloader;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Scrollbar.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
    var FWDR3DCovScrollbar = function(_d, totalItems, curItemId, prt){

        'use strict';

        var _s = this;
        var prototype = FWDR3DCovScrollbar.prototype;
        
        _s.handlerLeftNImg = _d.handlerLeftNImg;
        _s.handlerLeftSImg = _d.handlerLeftSImg;
        _s.handlerRightNImg = _d.handlerRightNImg;
        _s.handlerRightSImg = _d.handlerRightSImg;
        
        _s.trackLeftImg = _d.trackLeftImg;
        _s.trackCenterImg = _d.trackCenterImg;
        _s.trackRightImg = _d.trackRightImg;
        
        _s.textColorNormal = _d.scrollbarTextColorNormal;
        _s.textColorSelected = _d.scrollbarTextColorSelected;
        
        _s.scrollbarMaxWidth = _d.controlsMaxWidth;
        _s.handlerWidth = _d.handlerWidth;
        _s.trackWidth = _d.controlsMaxWidth;
        
        _s.scrollbarHeight = 0;
        if(!_d.useVectorIcons){
            _s.scrollbarHeight = _d.trackLeftImg.height;
            _s.trackLeftWidth = _d.trackLeftImg.width;
            _s.handlerLeftWidth = _d.handlerLeftNImg.width;
            _s.handlerLeftSWidth = _d.handlerLeftSImg.width;
        }
        
        _s.totalItems = totalItems;
        _s.curItemId = curItemId;
        _s.prevCurItemId;
        
        _s.mouseX = 0;
        _s.mouseY = 0;
        _s.offset = 0;

        if(_d.showSlideshowButton){
            _s.offset = _d.playButtonNImg.width;
        }
        
        _s.isPressed = false;

        _s.isMobile = FWDR3DCovUtils.isMobile;
        _s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;

        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.screen.className = 'fwdr3dcov-scrollbar';
            if(_d.isSkinWhite){
                _s.screen.className = 'fwdr3dcov-scrollbar white';
            }
            _s.style().backgroundColor = '#FF0000'
            _s.setupMainContainers();
        };

        
        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){
            _s.setWidth(_s.scrollbarMaxWidth);
            
            _s.setTrack();
            _s.setHandler();
            
            if(prt.totalThumbs > 1){
                if (_s.isMobile){
                    if (_s.hasPointerEvent){
                        _s.scrollbarHandlerOverDO.screen.addEventListener("MSPointerOver", _s.onScrollMouseOver);
                        _s.scrollbarHandlerOverDO.screen.addEventListener("MSPointerOut", _s.onScrollMouseOut);
                        _s.scrollbarHandlerOverDO.screen.addEventListener("MSPointerDown", _s.onScrollMouseDown);
                    }else{
                        _s.scrollbarHandlerOverDO.screen.addEventListener("touchstart", _s.onScrollMouseDown);
                    }
                }else{
                    _s.scrollbarHandlerOverDO.setButtonMode(true);
                    
                    if (_s.screen.addEventListener){
                        _s.scrollbarHandlerOverDO.screen.addEventListener("mouseover", _s.onScrollMouseOver);
                        _s.scrollbarHandlerOverDO.screen.addEventListener("mouseout", _s.onScrollMouseOut);
                        _s.scrollbarHandlerOverDO.screen.addEventListener("mousedown", _s.onScrollMouseDown);
                        window.addEventListener("mouseup", _s.onScrollMouseUp);
                    }
                }
            }
        };
        
        _s.setTrack = function(){
            _s.scrollbarTrackDO = new FWDR3DCovDO("div");
            _s.addChild(_s.scrollbarTrackDO);
            
            if(_d.useVectorIcons){
                _s.scrollbarTrackDO.screen.className = 'fwdr3dcov-scrollbar-track';
                if(_d.isSkinWhite){
                    _s.scrollbarTrackDO.screen.className = 'fwdr3dcov-scrollbar-track white';
                }
                setTimeout(function(){
                    _s.scrollbarHeight = parseInt(getComputedStyle(_s.screen).getPropertyValue("height"));
                }, 5);
                
            }else{
                _s.scrollbarTrackDO.screen.className = 'fwdr3dcov-scrollbar-track-'
                if(_d.isSkinWhite){
                    _s.scrollbarTrackDO.screen.className = 'fwdr3dcov-scrollbar-track- white';
                }
                _s.scrollbarTrackDO.setWidth(_s.trackWidth);
                _s.scrollbarTrackDO.setHeight(_s.scrollbarHeight);
                
                _s.scrollbarTrackLeftDO = new FWDR3DCovDO("img");
                _s.scrollbarTrackLeftDO.setScreen(_s.trackLeftImg);
                _s.scrollbarTrackDO.addChild(_s.scrollbarTrackLeftDO);
                
                _s.scrollbarTrackCenterDO = new FWDR3DCovDO("div");
                _s.scrollbarTrackCenterDO.screen.style.backgroundImage = "url(" + _d.trackCenterPath + ")";
                _s.scrollbarTrackCenterDO.screen.style.backgroundRepeat = "repeat-x";
                _s.scrollbarTrackDO.addChild(_s.scrollbarTrackCenterDO);
                
                _s.scrollbarTrackCenterDO.setWidth(_s.trackWidth - 2 * _s.trackLeftWidth);
                _s.scrollbarTrackCenterDO.setHeight(_s.scrollbarHeight);
                _s.scrollbarTrackCenterDO.setX(_s.trackLeftWidth);
                
                _s.scrollbarTrackRightDO = new FWDR3DCovDO("img");
                _s.scrollbarTrackRightDO.setScreen(_s.trackRightImg);
                _s.scrollbarTrackDO.addChild(_s.scrollbarTrackRightDO);
                
                _s.scrollbarTrackRightDO.setX(_s.trackWidth - _s.trackLeftWidth);
            }
            
        };
        
        _s.setHandler = function(){
            _s.scrollbarHandlerDO = new FWDR3DCovDO("div");
            _s.addChild(_s.scrollbarHandlerDO);
        
            if(_d.useVectorIcons){
                _s.handlerClass = 'fwdr3dcov-scrollbar-handler'
                if(_d.isSkinWhite){
                    _s.handlerClass += ' white';
                }
                _s.scrollbarHandlerDO.screen.className = _s.handlerClass;
            }else{
                _s.scrollbarHandlerDO.screen.className = 'fwdr3dcov-scrollbar-handler-';
                _s.scrollbarHandlerLeftNDO = new FWDR3DCovDO("img");
                _s.scrollbarHandlerLeftNDO.setScreen(_s.handlerLeftNImg);
                _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerLeftNDO);

                _s.scrollbarHandlerCenterNDO = new FWDR3DCovDO("div");
                _s.scrollbarHandlerCenterNDO.screen.style.backgroundImage = "url(" + _d.handlerCenterNPath + ")";
                _s.scrollbarHandlerCenterNDO.screen.style.backgroundRepeat = "repeat-x";
                _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerCenterNDO);
                _s.scrollbarHandlerCenterNDO.setWidth(_s.handlerWidth - 2 * _s.handlerLeftWidth + 2);
                _s.scrollbarHandlerCenterNDO.setHeight(_s.scrollbarHeight);
                _s.scrollbarHandlerCenterNDO.setX(_s.handlerLeftWidth - 1);
                
                _s.scrollbarHandlerRightNDO = new FWDR3DCovDO("img");
                _s.scrollbarHandlerRightNDO.setScreen(_s.handlerRightNImg);
                _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerRightNDO);
                _s.scrollbarHandlerRightNDO.setX(_s.handlerWidth - _s.handlerLeftWidth);

                _s.scrollbarHandlerLeftSDO = new FWDR3DCovDO("img");
                _s.scrollbarHandlerLeftSDO.setScreen(_s.handlerLeftSImg);
                _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerLeftSDO);
                _s.scrollbarHandlerLeftSDO.setAlpha(0);
                    
                _s.scrollbarHandlerCenterSDO = new FWDR3DCovDO("div");
                _s.scrollbarHandlerCenterSDO.screen.style.backgroundImage = "url(" + _d.handlerCenterSPath + ")";
                _s.scrollbarHandlerCenterSDO.screen.style.backgroundRepeat = "repeat-x";
                _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerCenterSDO);
                    
                _s.scrollbarHandlerCenterSDO.setWidth(_s.handlerWidth - 2 * _s.handlerLeftSWidth);
                _s.scrollbarHandlerCenterSDO.setHeight(_s.scrollbarHeight);
                _s.scrollbarHandlerCenterSDO.setX(_s.handlerLeftSWidth);
                _s.scrollbarHandlerCenterSDO.setAlpha(0);
            
                _s.scrollbarHandlerRightSDO = new FWDR3DCovDO("img");
                _s.scrollbarHandlerRightSDO.setScreen(_s.handlerRightSImg);
                _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerRightSDO);
                _s.scrollbarHandlerRightSDO.setX(_s.handlerWidth - _s.handlerLeftSWidth);
                _s.scrollbarHandlerRightSDO.setAlpha(0);
            }
                
            _s.scrollbarHandlerTextDO = new FWDR3DCovDO("div");
            _s.scrollbarHandlerTextDO.screen.className = 'fwdr3dcov-scrollbar-text';
            _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerTextDO);
            _s.scrollbarHandlerTextDO.style().fontFamily = "Arial, Helvetica, sans-serif";
            _s.scrollbarHandlerTextDO.style().fontSize = "10px";
            _s.scrollbarHandlerTextDO.style().color = _s.textColorNormal;
            _s.scrollbarHandlerTextDO.setInnerHTML((_s.curItemId+1) + "/" + _s.totalItems);
            
            _s.scrollbarHandlerOverDO = new FWDR3DCovDO("div");
            _s.scrollbarHandlerDO.addChild(_s.scrollbarHandlerOverDO);
            
            _s.setTextPositionId = setTimeout(function(){
                _s.offset = prt.slideshowButtonDO.w;
                if(!_d.showSlideshowButton) _s.offset = 0;
                _s.setHeight(_s.scrollbarHeight);
                _s.scrollbarHandlerDO.setWidth(_s.handlerWidth);
                _s.scrollbarHandlerDO.setHeight(_s.scrollbarHeight);
                _s.scrollbarHandlerOverDO.setWidth(_s.handlerWidth);
                _s.scrollbarHandlerOverDO.setHeight(_s.scrollbarHeight);
                _s.setTextPosition();
                _s.resize(prt.stageWidth)
                _s.resize(prt.stageWidth - prt.nextAndPrevButtonsOffsetX * 2, prt.controlsWidth);
            },11);
            
            
            if (FWDR3DCovUtils.isIE){
                _s.scrollbarHandlerOverDO.setBkColor("#000000");
                _s.scrollbarHandlerOverDO.setAlpha(.001);
            }
        };
        
        _s.setTextPosition = function(){
            _s.scrollbarHandlerTextDO.setX(Math.floor((_s.handlerWidth - _s.scrollbarHandlerTextDO.getWidth())/2));
            _s.scrollbarHandlerTextDO.setY(Math.floor((_s.scrollbarHeight - _s.scrollbarHandlerTextDO.getHeight())/2) + 1);
        };
        
        _s.resize = function(stageWidth, controlsWidth){
            if (stageWidth < (controlsWidth + _s.scrollbarMaxWidth)){
                if ((stageWidth * .8 - controlsWidth) < _s.handlerWidth){
                    _s.resizeTrack(0);
                    _s.scrollbarHandlerDO.setY(500);
                }else{
                    _s.resizeTrack(Math.floor(stageWidth - controlsWidth));
                    _s.scrollbarHandlerDO.setY(0);
                }
            }else if (_s.getWidth() < _s.scrollbarMaxWidth){
                _s.resizeTrack(Math.floor(_s.scrollbarMaxWidth));
                _s.scrollbarHandlerDO.setY(0);
            }
        
            if(_s.prevStageW != stageWidth){
                _s.scrollbarHandlerDO.setX(Math.floor(_s.curItemId * (_s.trackWidth - _s.offset - _s.handlerWidth) / (_s.totalItems - 1)));
            }
            _s.scrollbarHandlerTextDO.setInnerHTML((_s.curItemId+1) + "/" + _s.totalItems);

            _s.prevStageW = stageWidth;
        };
        
        _s.resize2 = function(){
            _s.resizeTrack(Math.floor(_s.scrollbarMaxWidth));
        };
        
        _s.resizeTrack = function(newWidth){
            _s.trackWidth = newWidth;
            _s.setWidth(_s.trackWidth);
            _s.scrollbarTrackDO.setWidth(_s.trackWidth);

            if(!_d.useVectorIcons){ 
                _s.scrollbarTrackCenterDO.setWidth(Math.floor(_s.trackWidth - 2 * _s.trackLeftWidth));
                _s.scrollbarTrackCenterDO.setX(Math.floor(_s.trackLeftWidth));
                _s.scrollbarTrackRightDO.setX(Math.floor(_s.trackWidth - _s.trackLeftWidth));
            }
        };
        
        _s.onScrollMouseOver = function(){
            _s.scrollbarOver = true;
            if(_d.useVectorIcons){
                _s.scrollbarHandlerDO.screen.className = _s.handlerClass + ' selected';
            }else{
                FWDAnimation.to(_s.scrollbarHandlerLeftSDO, .8, {alpha:1, ease : Expo.easeOut});
                FWDAnimation.to(_s.scrollbarHandlerCenterSDO, .8, {alpha:1, ease : Expo.easeOut});
                FWDAnimation.to(_s.scrollbarHandlerRightSDO, .8, {alpha:1, ease : Expo.easeOut});
            }
            FWDAnimation.to(_s.scrollbarHandlerTextDO.screen, .8, {css : {color : _s.textColorSelected}, ease : Expo.easeOut});
        };
        
        _s.onScrollMouseOut = function(){
            _s.scrollbarOver = false;
            
            if (_s.isPressed)
                return;

            if(_d.useVectorIcons){
                _s.scrollbarHandlerDO.screen.className = _s.handlerClass;
            }else{
                FWDAnimation.to(_s.scrollbarHandlerLeftSDO, .8, {alpha:0, ease : Expo.easeOut});
                FWDAnimation.to(_s.scrollbarHandlerCenterSDO, .8, {alpha:0, ease : Expo.easeOut});
                FWDAnimation.to(_s.scrollbarHandlerRightSDO, .8, {alpha:0, ease : Expo.easeOut});
            }
            FWDAnimation.to(_s.scrollbarHandlerTextDO.screen, .8, {css : {color : _s.textColorNormal}, ease : Expo.easeOut});
        };
        
        _s.onScrollMouseDown = function(e){
            if(prt.isLoading) return;
            if(e.preventDefault) e.preventDefault();
            
            var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);

            _s.mouseX = viewportMouseCoordinates.screenX;
            _s.mouseY = viewportMouseCoordinates.screenY;
            
            _s.curScrollX = _s.scrollbarHandlerDO.getX();
            _s.lastPressedX = _s.mouseX;
            
            _s.isPressed = true;
            
            FWDAnimation.killTweensOf(_s.scrollbarHandlerDO);
                
            if (_s.isMobile){
                if (_s.hasPointerEvent){
                    window.addEventListener("MSPointerMove", _s.onScrollMove);
                    window.addEventListener("MSPointerUp", _s.onScrollMouseUp);
                }else{
                    window.addEventListener("touchmove", _s.onScrollMove, {passive:false});
                    window.addEventListener("touchend", _s.onScrollMouseUp);
                }
            }else{
                if (_s.screen.addEventListener)
                    window.addEventListener("mousemove", _s.onScrollMove);
                else
                    document.attachEvent("onmousemove", _s.onScrollMove);
            }
        };
        
        _s.onScrollMove = function(e){
            var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);

            _s.mouseX = viewportMouseCoordinates.screenX;
            _s.mouseY = viewportMouseCoordinates.screenY;
            
            var dx = _s.mouseX - _s.lastPressedX;
            var newX = _s.curScrollX + dx;
            
            newX = Math.max(newX, 0);
            newX = Math.min(_s.trackWidth - _s.offset - _s.handlerWidth, newX);
            
            _s.scrollbarHandlerDO.setX(Math.floor(newX));
            
            _s.curItemId = Math.floor(newX / (_s.trackWidth - _s.offset - _s.handlerWidth) * _s.totalItems);
            
            if (_s.curItemId == _s.totalItems)
                _s.curItemId--;
            
            if (_s.prevCurItemId != _s.curItemId){
                _s.dispatchEvent(FWDR3DCovScrollbar.MOVE, {id:_s.curItemId});
            
                _s.scrollbarHandlerTextDO.setInnerHTML((_s.curItemId+1) + "/" + _s.totalItems);
            }
            
            _s.prevCurItemId = _s.curItemId;
        };
        
        _s.onScrollMouseUp = function(){
            _s.isPressed = false;
            
            if (_s.isMobile){
                if (_s.hasPointerEvent){
                    window.removeEventListener("MSPointerUp", _s.onScrollMouseUp);
                    window.removeEventListener("MSPointerMove", _s.onScrollMove);
                }else{
                    window.removeEventListener("touchend", _s.onScrollMouseUp);
                    window.removeEventListener("touchmove", _s.onScrollMove);
                }
            }else{
                if (_s.screen.addEventListener)
                    window.removeEventListener("mousemove", _s.onScrollMove);
                else
                    document.detachEvent("onmousemove", _s.onScrollMove);
            }
            
            if (!_s.scrollbarOver && !_s.isMobile)
                _s.onScrollMouseOut();
            
            _s.gotoItem2();
        };
        
        _s.gotoItem = function(id, animate){
            _s.curItemId = id;
            
            if (_s.prevCurItemId != _s.curItemId){
                if (animate){
                    FWDAnimation.killTweensOf(_s.scrollbarHandlerDO);
                    FWDAnimation.to(_s.scrollbarHandlerDO, .8, {x : Math.floor(_s.curItemId * (_s.trackWidth - _s.offset - _s.handlerWidth) / (_s.totalItems - 1)), ease : Expo.easeOut});
                }else{
                    _s.scrollbarHandlerDO.setX(Math.floor(_s.curItemId * (_s.trackWidth  - _s.offset - _s.handlerWidth) / (_s.totalItems - 1)));
                }
                
                _s.scrollbarHandlerTextDO.setInnerHTML((_s.curItemId+1) + "/" + _s.totalItems);
            }
            
            _s.prevCurItemId = _s.curItemId;
        };
        
        _s.gotoItem2 = function()
        {
            FWDAnimation.killTweensOf(_s.scrollbarHandlerDO);
            FWDAnimation.to(_s.scrollbarHandlerDO, .8, {x : Math.floor(_s.curItemId * (_s.trackWidth  - _s.offset - _s.handlerWidth) / (_s.totalItems - 1)), ease : Expo.easeOut});
                
            _s.scrollbarHandlerTextDO.setInnerHTML((_s.curItemId+1) + "/" + _s.totalItems);
        };

        _s.init();
    };

    
    /**
     * Prototype.
     */
    FWDR3DCovScrollbar.setPrototype = function(){
        FWDR3DCovScrollbar.prototype = new FWDR3DCovDO("div");
    };

    FWDR3DCovScrollbar.MOVE = "onMove";

    FWDR3DCovScrollbar.prototype = null;
    window.FWDR3DCovScrollbar = FWDR3DCovScrollbar;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Simple button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
    var FWDR3DCovSimpleButton = function(nImg, sPath, html, nClass, sClass){

        'use strict';
        
        var _s = this;
        var prototype = FWDR3DCovSimpleButton.prototype;
        
        _s.nImg = nImg;
        _s.sPath = sPath;
        _s.inst;
        _s.html = html;
        _s.nClass = nClass;
        _s.sClass = sClass;
    
        if(_s.nImg){
            _s.totalWidth = _s.nImg.width;
            _s.totalHeight = _s.nImg.height;
        }
        
        _s.isShowed = true;
        _s.isMbl = FWDR3DCovUtils.isMbl;
        _s.hasPointerEvent_bl = FWDR3DCovUtils.hasPointerEvent;
        
    
        /**
         * Initiolize.
         */
        _s.init = function(){
            _s.setupMainContainers();
        };

        
        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){

            if(_s.html){
                _s.n_do = new FWDR3DCovDO("div");   
                _s.n_do.setInnerHTML(_s.html);
                _s.setNormalState();
                _s.addChild(_s.n_do);

                setTimeout(function(){
                    _s.setWidth(parseInt(getComputedStyle(_s.n_do.screen).getPropertyValue("width")));
                    _s.setHeight(parseInt(getComputedStyle(_s.n_do.screen).getPropertyValue("height")));
                }, 5);
        
            }else{
                _s.buttonsHolder_do = new FWDR3DCovDO("div");
                
                _s.n_do = new FWDR3DCovDO("img");   
                _s.n_do.setScreen(_s.nImg);
                _s.buttonsHolder_do.addChild(_s.n_do);
                
                var img1 = new Image();
                img1.src = _s.sPath;
                _s.s_do = new FWDR3DCovDO("img");
                _s.s_do.setScreen(img1);
                _s.s_do.setWidth(_s.totalWidth);
                _s.s_do.setHeight(_s.totalHeight);
                _s.s_do.setAlpha(0);
                _s.buttonsHolder_do.addChild(_s.s_do);
                _s.setWidth(_s.totalWidth);
                _s.setHeight(_s.totalHeight);
                _s.buttonsHolder_do.setWidth(_s.totalWidth);
                _s.buttonsHolder_do.setHeight(_s.totalHeight);
            
                _s.screen.style.yellowOverlayPointerEvents = "none";
                _s.addChild(_s.buttonsHolder_do);
            }
            
            _s.setButtonMode(true);

            if(_s.isMbl){
                if(_s.hasPointerEvent_bl){
                    _s.screen.addEventListener("pointerup", _s.onMouseUp);
                    _s.screen.addEventListener("pointerover", _s.onMouseOver);
                    _s.screen.addEventListener("pointerout", _s.onMouseOut);
                }else{
                    _s.screen.addEventListener("touchend", _s.onMouseUp);
                }
            }else{  
                _s.screen.addEventListener("mouseover", _s.onMouseOver);
                _s.screen.addEventListener("mouseout", _s.onMouseOut);
                _s.screen.addEventListener("mouseup", _s.onMouseUp);
            }
        };
        
        _s.onMouseOver = function(e){
            _s.dispatchEvent(FWDR3DCovSimpleButton.SHOW_TOOLTIP, {e:e});
            if(_s.isDisabledForGood_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
                if(_s.isDisabled_bl || _s.isSelectedFinal_bl) return;
                _s.dispatchEvent(FWDR3DCovSimpleButton.MOUSE_OVER, {e:e});
                _s.setSelectedState(true);
            }
        };
            
        _s.onMouseOut = function(e){
            if(_s.isDisabledForGood_bl) return;
            if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
                if(_s.isDisabled_bl || _s.isSelectedFinal_bl || _s.isDisabled2) return;
                _s.dispatchEvent(FWDR3DCovSimpleButton.MOUSE_OUT, {e:e});
                _s.setNormalState(true);
            }
        };
        
        _s.onMouseUp = function(e){
            if(_s.isDisabledForGood_bl) return;
            if(e.preventDefault) e.preventDefault();
            if(_s.isDisabled_bl || e.button == 2) return;
            _s.dispatchEvent(FWDR3DCovSimpleButton.CLICK, {e:e, inst:_s.inst});
        };
    

        /**
         * Set normal/selected state.
         */
        _s.setNormalState = function(anim){
            if(_s.html){
                _s.n_do.screen.className = _s.nClass;
            }else{
                FWDAnimation.killTweensOf(_s.s_do);
                FWDAnimation.to(_s.s_do, .5, {alpha:0, ease:Expo.easeOut}); 
            }
        };
        
        _s.setSelectedState = function(anim){
            if(_s.html){
                _s.n_do.screen.className = _s.nClass + ' ' + _s.sClass;
            }else{
                FWDAnimation.killTweensOf(_s.s_do);
                FWDAnimation.to(_s.s_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
            }
        };
        
        /**
         * Disable/enable.
         */
         _s.setDisabledState = function(){
            if(_s.isSetToDisabledState_bl) return;
            _s.isSetToDisabledState_bl = true;
            if(_s.d_sdo) _s.d_sdo.setX(0);
        };
        
        _s.setEnabledState = function(){
            if(!_s.isSetToDisabledState_bl) return;
            _s.isSetToDisabledState_bl = false;
            if(_s.d_sdo) _s.d_sdo.setX(-100);
        }
        
        _s.disable = function(setNormalState){
            if(_s.isDisabledForGood_bl  || _s.isDisabled_bl) return;
            _s.isDisabled_bl = true;
            _s.setButtonMode(false);
            FWDAnimation.to(_s, .6, {alpha:.4});
            if(!setNormalState) _s.setNormalState();
        };
        
        _s.enable = function(){
            if(_s.isDisabledForGood_bl || !_s.isDisabled_bl) return;
            _s.isDisabled_bl = false;
            _s.setButtonMode(true);
            FWDAnimation.to(_s, .6, {alpha:1});
        };
        
        _s.disableForGood = function(){
            _s.isDisabledForGood_bl = true;
            _s.setButtonMode(false);
        };
        
        _s.disable2 = function(setNormalState){
            if(_s.isDisabled2) return;
            _s.isDisabled2 = true;
            FWDAnimation.to(_s, .6, {alpha:.4});
            if(!setNormalState) _s.setNormalState();
        };
        
        _s.enable2 = function(){
            if(!_s.isDisabled2) return;
            _s.isDisabled2 = false;
            FWDAnimation.to(_s, .6, {alpha:1});
        };

    
        /**
         * Show/hide.
         */
        _s.show = function(dl){
            if(_s.isShowed_bl) return;
            _s.isShowed_bl = true;
            FWDAnimation.killTweensOf(_s);
            _s.setScale2(0);
            if(dl === undefined) dl = .4;

            if(dl == 0){
                _s.setScale2(1);
                _s.setVisible(true);
            }else{
                FWDAnimation.to(_s, .8, {scale:1, delay:dl, onStart:function(){_s.setVisible(true);}, ease:Elastic.easeOut});
            }
            
        };  
            
        _s.hide = function(overwrite){
            if(!_s.isShowed_bl && !overwrite) return;
            _s.isShowed_bl = false;
            FWDAnimation.killTweensOf(_s);
            _s.setVisible(false);
            _s.setScale2(0);
        };

        /**
         * Set opacitiy when item is dragged.
         * @param {String} inst
         */
         _s.setHideDrag = function(hide){
            FWDAnimation.killTweensOf(_s.n_do);
            if(!hide){
                FWDAnimation.to(_s.n_do, .4, {alpha:1});
            }else{
                FWDAnimation.to(_s.n_do, .4, {alpha:.3, delay:.4});
            }
         }

        _s.init();
    };
    
    /**
     * Set prototype.
     */
    FWDR3DCovSimpleButton.setPrototype = function(hasTransform){
        if(hasTransform){
            FWDR3DCovSimpleButton.prototype = new FWDR3DCovDO3D("div");     
        }else{
            FWDR3DCovSimpleButton.prototype = new FWDR3DCovDO("div");   
        }
    };
    
    FWDR3DCovSimpleButton.CLICK = "onClick";
    FWDR3DCovSimpleButton.MOUSE_OVER = "onMouseOver";
    FWDR3DCovSimpleButton.SHOW_TOOLTIP = "showTooltip";
    FWDR3DCovSimpleButton.MOUSE_OUT = "onMouseOut";
    FWDR3DCovSimpleButton.CLICK = "onMouseDown";
    
    FWDR3DCovSimpleButton.prototype = null;
    window.FWDR3DCovSimpleButton = FWDR3DCovSimpleButton;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Slideshow button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
    var FWDR3DCovSlideshowButton = function(prt, _d){
        
        'use strict';

        var _s = this;
        var prototype = FWDR3DCovSlideshowButton.prototype;

        _s.playButtonNImg = _d.playButtonNImg;
        _s.playButtonSPath = _d.playButtonSPath;
        _s.pauseButtonImg = _d.pauseButtonImg;

        _s.playButtonDO;
        _s.playButtonNDO;
        _s.playButtonSDO;
        
        _s.pauseButtonDO;
    
        _s.delay = _d.slideshowDelay;
        _s.autoplay = _d.autoplay;
        
        _s.isStopped = true;
        
        if(!_d.useVectorIcons){
            _s.btnWidth = _s.playButtonNImg.width;
            _s.btnHeight = _s.playButtonNImg.height;
        }

        _s.isMobile = FWDR3DCovUtils.isMobile;
        _s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;
        
        
        _s.animDelayId_to;
        _s.timeoutId;
        _s.timerIntervalId;


        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setupMainContainers();
        };


        /**
         * Setup main containers.
         */
        _s.setupMainContainers = function(){
            _s.setButtonMode(true);

            if(_d.useVectorIcons){
                var cls = 'fwdr3dcov-slideshow-button';
                if(_d.isSkinWhite){
                    cls += ' white';
                }
                _s.screen.className = cls;
                setTimeout(function(){
                    _s.btnHeight = parseInt(getComputedStyle(_s.screen).getPropertyValue("height"));
                    _s.btnWidth = parseInt(getComputedStyle(_s.screen).getPropertyValue("width"));
                    _s.initAll();
                }, 5);
            }else{
                _s.initAll();
                _s.screen.className = 'fwdr3dcov-slideshow-button-';
            }
        };

        _s.initAll = function(){
            _s.setWidth(_s.btnWidth);
            _s.setHeight(_s.btnHeight);
            
            _s.setPauseButton();
            _s.setTimerButton();
            _s.setPlayButton();

            if (_s.isMobile){
                if (_s.hasPointerEvent){
                    _s.screen.addEventListener("MSPointerOver", _s.onMouseOver);
                    _s.screen.addEventListener("MSPointerOut", _s.onMouseOut);
                    _s.screen.addEventListener("MSPointerUp", _s.onClick);
                }else{
                    _s.screen.addEventListener("touchend", _s.onClick);
                }
            }else{
                _s.screen.addEventListener("mouseover", _s.onMouseOver);
                _s.screen.addEventListener("mouseout", _s.onMouseOut);
                _s.screen.addEventListener("click", _s.onClick);
            }
        }

        _s.setTimerButton = function(){
            
            if(_d.useVectorIcons){
                var cls = 'fwdr3dcov-slideshow-button-bk';
                if(_d.isSkinWhite){
                    cls += ' white';
                }
                _s.slpBk_do =  new FWDR3DCovDO("div");
                _s.slpBk_do.screen.className = cls;
            }else{
                _s.slpBk_do =  new FWDR3DCovDO("img");
                var img = new Image();
                img.src = _d.circleBK;
                _s.slpBk_do.setScreen(img);
            }
            
            _s.slpBk_do.setWidth(_s.btnWidth);
            _s.slpBk_do.setHeight(_s.btnHeight);
            _s.slpBk_do.setAlpha(0);
            _s.addChild(_s.slpBk_do); 

            FWDR3DCovPreloader.setPrototype();
            _s.slp_do = new FWDR3DCovPreloader(_s, 'none', 8, _d.slideshowPreloaderBackgroundColor, _d.slideshowPreloaderFillColor, 2.5, (_s.delay)/1000);
            _s.slp_do.setX(Math.round((_s.w - _s.slp_do.w)/2));
            _s.slp_do.setY(Math.round((_s.h - _s.slp_do.h)/2));
            _s.addChild(_s.slp_do);
        };
        
    
        _s.setPauseButton = function(){
            if(_d.useVectorIcons){
                var cls = 'fwdr3dcov-slideshow-pause-button';
                if(_d.isSkinWhite){
                    cls += ' white';
                }
                _s.pauseButtonDO = new FWDR3DCovDO("div");
                _s.pauseButtonDO.setInnerHTML('<span class="fwdr3dcov-icon fwdr3dcov-icon-pause"></span>'),
                _s.pauseButtonDO.screen.className = cls;
            }else{
                _s.pauseButtonDO = new FWDR3DCovDO("img");
                _s.pauseButtonDO.setScreen(_s.pauseButtonImg);
            }
            _s.pauseButtonDO.setAlpha(0);
            _s.addChild(_s.pauseButtonDO);
            
            _s.pauseButtonDO.setWidth(_s.btnWidth);
            _s.pauseButtonDO.setHeight(_s.btnHeight);
        };
        
        _s.setPlayButton = function(){
            _s.playButtonDO = new FWDR3DCovDO("div");

            _s.playButtonClass = 'fwdr3dcov-slideshow-play-button'
            if(_d.isSkinWhite){
                _s.playButtonClass += ' white';
            }
        
            if(_d.useVectorIcons){
                var cls = 'fwdr3dcov-slideshow-play-button';
                if(_d.isSkinWhite){
                    cls += ' white';
                }
                _s.playButtonDO.setInnerHTML('<span class="fwdr3dcov-icon fwdr3dcov-icon-play-fill"></span>'),
                _s.playButtonDO.screen.className = cls;
            }else{
                _s.playButtonNDO = new FWDR3DCovDO("img");
                _s.playButtonNDO.setScreen(_s.playButtonNImg);
                _s.playButtonDO.addChild(_s.playButtonNDO);

                _s.playButtonSDO = new FWDR3DCovDO("img");
                var img = new Image();
                img.src = _s.playButtonSPath;
                _s.playButtonSDO.setScreen(img);
                _s.playButtonSDO.setWidth(_s.playButtonNDO.w);
                _s.playButtonSDO.setHeight(_s.playButtonNDO.h);
                _s.playButtonSDO.setAlpha(0);
                _s.playButtonDO.addChild(_s.playButtonSDO);
            }
            
            _s.addChild(_s.playButtonDO);
            _s.playButtonDO.setWidth(_s.btnWidth);
            _s.playButtonDO.setHeight(_s.btnHeight);
        };

        _s.onMouseOver = function(){    
            if(_s.isStopped){
                _s.slp_do.hide2();
                if(_d.useVectorIcons){
                    _s.playButtonDO.screen.className = _s.playButtonClass + ' selected';
                }else{
                    FWDAnimation.to(_s.playButtonSDO, .8, {alpha:1, ease:Expo.easeOut});
                }
            }else{
                _s.slp_do.hide2();
                FWDAnimation.to(_s.slpBk_do, .8, {alpha:0, ease:Expo.easeOut});
            }
        };

        _s.onMouseOut = function(){
            if(_s.isStopped){
                _s.slp_do.hide2();
                _s.pauseButtonDO.setAlpha(0);
                FWDAnimation.to(_s.slpBk_do, .8, {alpha:0, ease:Expo.easeOut});
                if(_d.useVectorIcons){
                    _s.playButtonDO.screen.className = _s.playButtonClass;
                }else{
                    FWDAnimation.to(_s.playButtonSDO, .8, {alpha:0, ease : Expo.easeOut});
                }
            }else{
                _s.slp_do.show2();
                FWDAnimation.to(_s.slpBk_do, .8, {alpha:1, ease:Expo.easeOut});
            }
        };

        _s.onClick = function(e){
            if(_s.isStopped){
                _s.slp_do.resetSlideshow();
                _s.start();
                _s.pauseButtonDO.setAlpha(1);
                _s.dispatchEvent(FWDR3DCovSlideshowButton.PLAY_CLICK);
            }else{
                _s.stop();
                _s.pauseButtonDO.setAlpha(0);
                _s.dispatchEvent(FWDR3DCovSlideshowButton.PAUSE_CLICK);
            }
            
            if (!_s.isMobile){
                _s.onMouseOver();
            }
        };
        
        _s.start = function(){
            if(!_s.isStopped) return;
            
            _s.isStopped = false;
            _s.playButtonDO.setAlpha(0);
            
            clearTimeout(_s.timeoutId); 
            if(!prt.videoStarted){
                _s.timeoutId = setTimeout(_s.onTimeHandler, _s.delay);
                _s.startSlideshow();
            }
        };
        
        _s.stop = function(){
            _s.isStopped = true;
            _s.playButtonDO.setAlpha(1);
            _s.stopSlideshow();
            _s.onMouseOut();
            clearTimeout(_s.timeoutId);
        };

        _s.pause = function(){
            if(_s.isStopped) return;
            clearTimeout(_s.timeoutId);
            _s.stopSlideshow();
        };

        _s.resume = function(dl){
            if(_s.isStopped) return;
            if(!prt.videoStarted){
                 _s.startSlideshow();
                clearTimeout(_s.timeoutId);
                _s.timeoutId = setTimeout(function(){
                    _s.onTimeHandler();
                }, _s.delay);
            }
        };
    
        _s.onTimeHandler = function(){
            clearTimeout(_s.timeoutId);
            _s.stopSlideshow();
            _s.dispatchEvent(FWDR3DCovSlideshowButton.TIME);
        };


        _s.hideSlideshow = function(){
        
            FWDAnimation.killTweensOf(_s.playButtonSDO);
            FWDAnimation.to(_s.playButtonSDO, .8, {alpha:0, ease : Expo.easeOut});

            FWDAnimation.killTweensOf(_s.slpBk_do);
            FWDAnimation.to(_s.slpBk_do, .8, {alpha:0, ease : Expo.easeOut});

            FWDAnimation.killTweensOf(_s.pauseButtonDO);
            FWDAnimation.to(_s.pauseButtonDO, .8, {alpha:0, ease : Expo.easeOut});
            
            _s.slp_do.hide2();
            
        }

        _s.startSlideshow = function(){
            _s.slp_do.startSlideshow();
        }

        _s.stopSlideshow = function(o){
            _s.slp_do.stopSlideshow(o);
        }

        _s.init();
    };

    
    /**
     * Prototype.
     */
    FWDR3DCovSlideshowButton.setPrototype = function()
    {
        FWDR3DCovSlideshowButton.prototype = new FWDR3DCovDO("div");
    };

    FWDR3DCovSlideshowButton.PLAY_CLICK = "onPlayClick";
    FWDR3DCovSlideshowButton.PAUSE_CLICK = "onPauseClick";
    FWDR3DCovSlideshowButton.TIME = "onTime";

    FWDR3DCovSlideshowButton.prototype = null;
    window.FWDR3DCovSlideshowButton = FWDR3DCovSlideshowButton;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Thumbnail.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
    var FWDR3DCovThumb = function(id, _d, prt){
        
        'use strict';

        var _s = this;
        var prototype = FWDR3DCovThumb.prototype;

        _s.id = id;
        _s.gradPos = 0;
        _s.borderSize = _d.thumbBorderSize;
        _s.backgroundColor = _d.thumbBackgroundColor;
        _s.borderColor1 = _d.thumbBorderColor1;
        _s.borderColor2 = _d.thumbBorderColor2;

        _s.thumbWidth = _d.thumbWidth;
        _s.thumbHeight = _d.thumbHeight;
        
        _s.thumbScale = 1;

        _s.isEnabled = true;
        _s.isMobile = FWDR3DCovUtils.isMobile;
        _s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;


        /**
          * Init.
          */
        _s.init = function(){
            _s.setupScreen();
        };


        /**
          * Setup screen.
          */
        _s.setupScreen = function(){
            _s.screen.className = 'fwdr3dcov-thumbnail';
            _s.screen.id = 'fwdr3dcov_thumbnail_' + _s.id;
        
            if (FWDR3DCovUtils.isIOS){
                _s.mainDO = new FWDR3DCovDO3D("div", "absolute", "visible");
                _s.addChild(_s.mainDO);
                _s.mainDO.setZ(1);
            }else{
                _s.mainDO = new FWDR3DCovDO("div", "absolute", "visible");
                _s.addChild(_s.mainDO);
            }
            _s.mainDO.setWidth(_s.thumbWidth);
            _s.mainDO.setHeight(_s.thumbHeight);
            
            _s.setWidth(_s.thumbWidth);
            _s.setHeight(_s.thumbHeight);
            
            if (!_d.transparentImages){
                _s.borderDO = new FWDR3DCovDO("div");
                _s.borderDO.screen.className = 'fwdr3dcov-thumbnail-border';

                _s.bgDO = new FWDR3DCovDO("div");
                _s.bgDO.screen.className = 'fwdr3dcov-thumbnail-background';
                
                if(_s.borderSize){
                    _s.mainDO.addChild(_s.borderDO);
                }
                
                _s.mainDO.addChild(_s.bgDO);
                
                _s.borderDO.setWidth(_s.thumbWidth);
                _s.borderDO.setHeight(_s.thumbHeight);
                
                _s.bgDO.setWidth(_s.thumbWidth - _s.borderSize * 2);
                _s.bgDO.setHeight(_s.thumbHeight - _s.borderSize * 2);
                
                _s.bgDO.setX(_s.borderSize);
                _s.bgDO.setY(_s.borderSize);

                _s.borderDO.setCSSGradient(_s.borderColor2, _s.borderColor1);
                _s.borderDO.setBackfaceVisibility();

                _s.bgDO.setBkColor(_s.backgroundColor);
                
                if (FWDR3DCovUtils.isAndroid){
                    _s.borderDO.setBackfaceVisibility();
                    _s.bgDO.setBackfaceVisibility();
                }
            }else{
                _s.borderSize = 0;
            }
            
            _s.imageHolderDO = new FWDR3DCovDO("div");
            _s.imageHolderDO.hasT3D = false;
            
            _s.imageHolderDO.screen.className = 'fwdr3dcov-image';
            _s.mainDO.addChild(_s.imageHolderDO);
            
            _s.curDataListAr = prt.curDataListAr;

            _s.setupGradient();
            
            _s.updateButtonMode();
            
            if (FWDR3DCovUtils.isAndroid){
                _s.setBackfaceVisibility();
                _s.mainDO.setBackfaceVisibility();
                _s.imageHolderDO.setBackfaceVisibility();
            }

            _s.setAlpha(0);
            
            _s.mainDO.screen.addEventListener("mouseover", _s.onMouseOverHandler);
            _s.mainDO.screen.addEventListener("mouseout", _s.onMouseOutHandler);
            _s.mainDO.screen.addEventListener("click", _s.onMouseClickHandler); 
        };
        
        _s.updateButtonMode = function(){
        
            var thumbVideoSrc = prt.curDataListAr[_s.id].thumbVideoSrc;
            var secondObjType = 'none';
            if(prt.curDataListAr[_s.id].secondObj) secondObjType = prt.curDataListAr[_s.id].secondObj.type;
        
            if(!prt._d.useVideo) thumbVideoSrc = false;
            if(_s.id != prt.curId){
                if(!prt.useDrag) _s.mainDO.setButtonMode(true);
            }else if((_s.curDataListAr[_s.id].type != "none" || secondObjType != 'none') && !thumbVideoSrc){
                if(!prt.useDrag) _s.mainDO.setButtonMode(true);
            }else{
                _s.mainDO.style().cursor = null;
            }
        };


        /**
          * Setup gradient.
          */
        _s.setupGradient = function(){
            if (!prt.showGradient) return;
            
            _s.gradientDO = new FWDR3DCovDO("div");
            _s.mainDO.addChild(_s.gradientDO);
            
            _s.gradientDO.setWidth(_s.thumbWidth);          
            _s.gradientLeftDO = new FWDR3DCovDO("div");
            _s.gradientDO.addChild(_s.gradientLeftDO);
            _s.gradientLeftDO.setWidth(_s.thumbWidth);
            _s.gradientLeftDO.setCSSGradient( prt.gradientColor1, prt.gradientColor2, "left");

            _s.gradientRightDO = new FWDR3DCovDO("div");
            _s.gradientDO.addChild(_s.gradientRightDO);
            _s.gradientRightDO.setWidth(_s.thumbWidth);
            _s.gradientRightDO.setCSSGradient(prt.gradientColor2, prt.gradientColor1, "left");
            
            _s.gradientLeftDO.setAlpha(0);
            _s.gradientRightDO.setAlpha(0);
            _s.updateGradientSize();
        };

        _s.updateGradientSize = function(){
            if (!prt.showGradient) return;

            if (prt.showRefl){
                _s.gradientDO.setHeight(_s.thumbHeight + prt.reflDist + prt.reflHeight);
            }else{
                _s.gradientDO.setHeight(_s.thumbHeight);
            }

            if (prt.showRefl){
                _s.gradientLeftDO.setHeight(_s.thumbHeight + prt.reflDist + prt.reflHeight);
            }else{
                _s.gradientLeftDO.setHeight(_s.thumbHeight);
            }

            if (prt.showRefl){
                _s.gradientRightDO.setHeight(_s.thumbHeight + prt.reflDist + prt.reflHeight);
            }else{
                _s.gradientRightDO.setHeight(_s.thumbHeight);
            }
        }

        _s.setGradient = function(pos){
            if (_s.gradPos == pos)
                return;

            _s.gradPos = pos;
            
            if(prt.showGradient){
                FWDAnimation.killTweensOf(_s.gradientLeftDO);
                FWDAnimation.killTweensOf(_s.gradientRightDO);

                switch (_s.gradPos){
                    
                    case 0:
                        FWDAnimation.to(_s.gradientLeftDO, .8, {alpha:0});
                        FWDAnimation.to(_s.gradientRightDO, .8, {alpha:0, onComplete:_s.hideGrad});
                        break;
                    case 1:
                        _s.gradientDO.setY(0);
                        FWDAnimation.to(_s.gradientLeftDO, .8, {alpha:0});
                        FWDAnimation.to(_s.gradientRightDO, .8, {alpha:1});
                        break;
                    case -1:
                        _s.gradientDO.setY(0);
                        FWDAnimation.to(_s.gradientLeftDO, .8, {alpha:1});
                        FWDAnimation.to(_s.gradientRightDO, .8, {alpha:0});
                        break;
                }
            }
        };
        
        _s.hideGrad = function(){
            _s.gradientDO.setY(2000);
        };

        _s.setGradient2 = function(pos){
        
            if (prt.showGradient){
                FWDAnimation.killTweensOf(_s.gradientLeftDO);
                FWDAnimation.killTweensOf(_s.gradientRightDO);
            
                switch (pos){
                    case 0:
                        FWDAnimation.to(_s.gradientLeftDO, .8, {alpha:0});
                        FWDAnimation.to(_s.gradientRightDO, .8, {alpha:0});
                        break;
                    case 1:
                        _s.gradientDO.setY(0);
                        FWDAnimation.to(_s.gradientLeftDO, .8, {alpha:0});
                        FWDAnimation.to(_s.gradientRightDO, .8, {alpha:1});
                        break;
                    case -1:
                        _s.gradientDO.setY(0);
                        FWDAnimation.to(_s.gradientLeftDO, .8, {alpha:1});
                        FWDAnimation.to(_s.gradientRightDO, .8, {alpha:0});
                        break;
                }
            }
        };


        /**
          * Add reflection.
          */
        _s.addReflection = function(){
            if (!_s.imageDO) return;
                
            var imgW = _s.thumbWidth - _s.borderSize * 2;
            var imgH = _s.thumbHeight - _s.borderSize * 2;
            
            _s.reflCanvasDO = new FWDR3DCovDO3D("canvas");
            _s.addChildAt(_s.reflCanvasDO, 0);
            
            _s.reflCanvasDO.screen.width = prt.thumbWidth;
            _s.reflCanvasDO.screen.height = prt.reflHeight;
            
            var context = _s.reflCanvasDO.screen.getContext("2d");
           
            context.save();
                    
            context.translate(0, _s.thumbHeight);
            context.scale(1, -1);
            
            if(!_d.transparentImages){
                context.fillStyle = _s.borderColor1;
                context.fillRect(0, 0, _s.thumbWidth, _s.thumbHeight);
            }
            
            context.drawImage(_s.imageDO.screen, _s.borderSize, _s.borderSize, imgW, imgH);
            context.restore();
            
            context.globalCompositeOperation = "destination-out";
            var gradient = context.createLinearGradient(0, 0, 0, prt.reflHeight);
            
            gradient.addColorStop(0, "rgba(255, 255, 255, " + (1-prt.reflAlpha) + ")");
            gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");

            context.fillStyle = gradient;
            context.fillRect(0, 0, _s.thumbWidth, prt.reflHeight + 2);
            
            _s.setWidth(_s.thumbWidth);
            _s.reflCanvasDO.setY(_s.thumbHeight + prt.reflDist);
        };

        _s.addImage = function(image){
            _s.imageDO = new FWDR3DCovDO("img");
            _s.imageDO.setScreen(image);
            _s.imageHolderDO.addChild(_s.imageDO);
            
            _s.imageDO.screen.ontouchstart = null;
            
            if (FWDR3DCovUtils.isAndroid){
                _s.imageDO.setBackfaceVisibility();
            }
            
            _s.imageDO.setWidth(_s.thumbWidth - _s.borderSize * 2);
            _s.imageDO.setHeight(_s.thumbHeight - _s.borderSize * 2);
            
            _s.imageHolderDO.setX(_s.borderSize);
            _s.imageHolderDO.setY(_s.borderSize);
            
            _s.imageHolderDO.setWidth(_s.thumbWidth - _s.borderSize * 2);
            _s.imageHolderDO.setHeight(_s.thumbHeight - _s.borderSize * 2);
            
            if (prt.showRefl){
                _s.addReflection();
            }
        };
        
        
        _s.updateText = function(){
            if (_s.curDataListAr[_s.id].emptyText)
                return;
        
            _s.textOffset = _s.curDataListAr[_s.id].textOffset;
            
            if (prt.showCaptionUnderThumbnail_bl){
                _s.textGradientDO.setBkColor("transprt");
            }
            
            prt.textHolderDO.setAlpha(0);

            _s.setTextHeightId = setTimeout(_s.setTextHeight, 10);
        };
        
        _s.setTextHeight = function(){
            
            _s.textHeight = _s.textDO.getHeight();
            
            if (_d.showFullCaption){
                if(!prt.showCaptionUnderThumbnail_bl){
                    _s.textGradientDO.setY(_s.thumbHeight - _s.borderSize * 2  - _s.textHeight - _s.textDescriptionOffsetBottom);
                    _s.textDO.setY(_s.thumbHeight - _s.borderSize * 2 - _s.textHeight - _s.textDescriptionOffsetBottom);
                }
            }else{
                if(!prt.showCaptionUnderThumbnail_bl){
                    _s.textGradientDO.setY(_s.thumbHeight - _s.borderSize * 2 - _s.textOffset);
                    _s.textDO.setY(_s.thumbHeight - _s.borderSize * 2 - _s.textOffset);
                }
            }
            
            FWDAnimation.to(_s.textHolderDO, .8, {alpha:1, ease:Expo.easeOut});
            
        
            _s.hasText = true;
            
            _s.checkThumbOver();
        };
        
        _s.removeText = function(){
            if (_s.textHolderDO){
                FWDAnimation.to(_s.textHolderDO, .6, {alpha:0, ease:Expo.easeOut, onComplete:_s.removeTextFinish});
            }
        };
        
        _s.removeTextFinish = function(){
            FWDAnimation.killTweensOf(_s.textHolderDO);
            FWDAnimation.killTweensOf(_s.textGradientDO);
            FWDAnimation.killTweensOf(_s.textDO);
            
            if(prt.showCaptionUnderThumbnail_bl){
                prt.removeChild(_s.textHolderDO);
            }else{
                _s.mainDO.removeChild(_s.textHolderDO);
            }
            
            
            _s.textHolderDO = null;
            _s.textGradientDO = null;
            _s.textDO = null;
            
            _s.isOver = false;
            _s.hasText = false;
        };
        
        
        
        _s.showThumb3D = function(){
            var imgW = _s.thumbWidth - _s.borderSize * 2;
            var imgH = _s.thumbHeight - _s.borderSize * 2;
            
            if (_d.transparentImages){
                _s.imageDO.setAlpha(0);
                FWDAnimation.to(_s.imageDO, .8, {alpha:1, ease:Quart.easeOut});
            }else{
                _s.imageHolderDO.setX(parseInt(_s.thumbWidth/2));
                _s.imageHolderDO.setY(parseInt(_s.thumbHeight/2));
                
                _s.imageHolderDO.setWidth(0);
                _s.imageHolderDO.setHeight(0);
                
                FWDAnimation.to(_s.imageHolderDO, .8, {x:_s.borderSize, y:_s.borderSize, w:imgW, h:imgH, ease:Expo.easeInOut});
                
                _s.imageDO.setWidth(imgW + 1);
                _s.imageDO.setHeight(imgH + 1);
                
                _s.imageDO.setX(-parseInt(imgW/2));
                _s.imageDO.setY(-parseInt(imgH/2));
                
                FWDAnimation.to(_s.imageDO, .8, {x:0, y:0, ease:Expo.easeInOut});
            }
            
            if (_s.reflCanvasDO){
                _s.reflCanvasDO.setAlpha(0);
                FWDAnimation.to(_s.reflCanvasDO, .8, {alpha:1, ease:Expo.easeInOut});
            }
            
        };
        
    
        _s.update = function(){
            if (prt.showRefl){
                if (!_s.reflCanvasDO){
                    _s.addReflection();
                }else{
                    _s.reflCanvasDO.setAlpha(1);
                    _s.reflCanvasDO.setY(_s.thumbHeight + prt.reflDist);
                }
            }else{
                if (_s.reflCanvasDO){
                    _s.reflCanvasDO.setAlpha(0);
                }
            }
            _s.updateGradientSize();
        };

        _s.hide = function(del){
            var imgW = _s.thumbWidth - _s.borderSize * 2;
            var imgH = _s.thumbHeight - _s.borderSize * 2;
            
            FWDAnimation.to(_s.imageHolderDO, .8, {x:parseInt(_s.thumbWidth/2), y:parseInt(_s.thumbHeight/2), w:0, h:0, delay:del, ease:Expo.easeInOut});
            
            if(_s.imageDO){
                FWDAnimation.to(_s.imageDO, .8, {x:-parseInt(imgW/2), y:-parseInt(imgH/2), delay:del, ease:Expo.easeInOut});
                
                if (_s.reflCanvasDO){
                    FWDAnimation.to(_s.reflCanvasDO, .8, {alpha:0, delay:del, ease:Expo.easeInOut});
                }
            }
        };

        _s.onMouseOverHandler = function(e){
            if(prt.disableThumbClick) return;
            if ((_s.id != prt.curId)){
                _s.isOver2 = true;

                if(prt.showGradient && _s.gradientDO){
                    _s.setGradient2(0);
                }
                FWDAnimation.to(_s, .7, {z:_s.curZ + prt.thumbHoverOffset, ease:Expo.easeOut, overwrite:false});
            }
        };

        _s.onMouseOutHandler = function(){
            if (_s.id != prt.curId){
                _s.isOver2 = false;
                
                if (prt.showGradient && _s.gradientDO){
                    _s.setGradient2(_s.gradPos);
                }
                
                FWDAnimation.to(_s, .7, {z:_s.curZ, ease:Expo.easeOut, overwrite:false});
            }
        };

        _s.onMouseClickHandler = function(){
            _s.dispatchEvent(FWDR3DCovThumb.CLICK, {id:_s.id});
        };
        
        _s.onMouseTouchHandler = function(e){
            _s.dispatchEvent(FWDR3DCovThumb.CLICK, {id:_s.id});
        };

        _s.enable = function(){
            if (_s.isEnabled)   return;
            _s.isEnabled = true;
            
            _s.mainDO.style().pointerEvents = 'auto';
            
            clearTimeout(_s.disableId);
            _s.setVisible(true);
        };

        _s.disable = function(){
            if (!_s.isEnabled) return;
            _s.isEnabled = false;
            
            _s.mainDO.style().pointerEvents = 'none';

            clearTimeout(_s.disableId);
            _s.disableId = setTimeout(_s.disableFinish, 800);
        };

        _s.disableFinish = function(){
            _s.setVisible(false);
        };

        
        /**
          * Destroy.
          */
        _s.destroy = function(){
            FWDAnimation.killTweensOf(_s);
            FWDAnimation.killTweensOf(_s.mainDO);
            FWDAnimation.killTweensOf(_s.imageHolderDO);
            
            
            _s.mainDO.screen.removeEventListener("mouseover", _s.onMouseOverHandler);
            _s.mainDO.screen.removeEventListener("mouseout", _s.onMouseOutHandler);
            _s.mainDO.screen.removeEventListener("click", _s.onMouseClickHandler);
            
            clearTimeout(_s.setTextHeightId);
            
            if (_s.imageDO){
                FWDAnimation.killTweensOf(_s.imageDO);
                _s.imageDO.disposeImage();
                _s.imageDO.screen.onload = null;
                _s.imageDO.screen.onerror = null;
                _s.imageDO.destroy();
            }
            
            if (_s.htmlContentDO){
                FWDAnimation.killTweensOf(_s.htmlContentDO);
                _s.htmlContentDO.destroy();
                _s.htmlContentDO = null;
            }

            if (_s.bgDO){
                FWDAnimation.killTweensOf(_s.bgDO);
                _s.bgDO.destroy();
                _s.bgDO = null;
            }
            
            if (_s.borderDO){
                FWDAnimation.killTweensOf(_s.borderDO);
                _s.borderDO.destroy();
                _s.borderDO = null;
            }
            
            if (_s.htmlContentDO){
                FWDAnimation.killTweensOf(_s.htmlContentDO);
                _s.htmlContentDO.destroy();
            }
            
            if (_s.textGradientDO){
                FWDAnimation.killTweensOf(_s.textGradientDO);
                _s.textGradientDO = null;
            }
            
            if (_s.textDO){
                FWDAnimation.killTweensOf(_s.textDO);
                _s.textDO = null;
            }
            
            if (_s.textHolderDO){
                FWDAnimation.killTweensOf(_s.textHolderDO);
                _s.textHolderDO = null
            }

            _s.imageHolderDO.destroy();
            _s.mainDO.destroy();

            _s.imageHolderDO = null;
            _s.imageDO = null;
            _s.htmlContentDO = null;
            
            _s.mainDO = null;
            _s.borderDO = null;
            _s.bgDO = null;
            _s.imageHolderDO = null;
            _s.imageDO = null;
            _s.htmlContentDO = null;
            _s.textHolderDO = null;
            _s.textGradientDO = null;
            _s.textDO = null;
            
            _s.id = null;
            _s._d = null;
            _s.prt = null;
            _s.backgroundColor = null;
            _s.borderColor = null;
            
            _s.screen.innerHTML = "";
            prototype.destroy();
            prototype = null;
            _s = null;
            FWDR3DCovThumb.prototype = null;
        };

        _s.init();
    };

    /* set prototype */
    FWDR3DCovThumb.setPrototype = function(){
        FWDR3DCovThumb.prototype = new FWDR3DCovDO3D("div", "absolute", "visible");
    };

    FWDR3DCovThumb.CLICK = "click";

    FWDR3DCovThumb.prototype = null;
    window.FWDR3DCovThumb = FWDR3DCovThumb;
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Thumbnails manager.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
    var FWDR3DCovThumbsManager = function(_d, prt){
        
        /*'use strict';*/

        var _s = this;
        var prototype = FWDR3DCovThumbsManager.prototype;

        _s._d = _d;
        _s.prt = prt;
        
        _s.stageWidth = prt.stageWidth;
        _s.stageHeight = prt.stageHeight;
        _s.scale = 1;
        _s.thumbsAr = [];
        _s.defaultC = 'default';
        _s.grabC = 'url(' + prt._d.grabIconPath_str + '), default';
        _s.handC = 'url(' + prt._d.handIconPath_str + '), default';
        _s.dataListId = prt.startAtCategory;
        _s.topologiesAr = ["ring", "normal","star"];        
        _s.startPos = _d.coverflowStartPosition;

        _s.showGradient = _d.showGradient;
        _s.gradientColor1 = _d.gradientColor1;
        _s.gradientColor2 = _d.gradientColor2;

        _s.thumbWidth = _d.thumbWidth;
        _s.thumbHeight = _d.thumbHeight;
        _s.borderSize = _d.thumbBorderSize;
        _s.perspective = _s.thumbWidth * 4;
        _s.xRot = - _d.coverflowXRotation;
        _s.thumbnailYAngle3D = _d.thumbnailYAngle3D;
        _s.thumbnailOffsetY = _d.thumbnailOffsetY;
        _s.focalLength = 250;
        _s.thumbMinAlpha = _d.thumbMinAlpha;
        _s.infiniteLoop = _d.infiniteLoop;
        
        _s.nrThumbsToDisplay = _d.nrThumbsToDisplay;
        _s.showGradient = _d.showGradient;
        _s.controlsHeight = 0;
        if(!_d.useVectorIcons){
            _s.controlsHeight = _s._d.trackLeftImg.height;
        }
        _s.controlsOffset = _d.controlsOffset;
        _s.showCaption_bl = _d.showCaption;
        _s.thumbXSpace3D = _d.thumbXSpace3D;
        _s.thumbXOffset3D = _d.thumbXOffset3D;
        _s.thumbZSpace3D = _d.thumbZSpace3D;
        _s.thumbZOffset3D = _d.thumbZOffset3D;

        _s.thumbYAngle3D = _d.thumbYAngle3D;
        _s.thumbXSpace2D = _d.thumbXSpace2D;
        _s.thumbHoverOffset = _d.thumbHoverOffset;
        _s.thumbXOffset2D = _d.thumbXOffset2D;
        _s.useDrag = _d.useDragAndSwipe_bl;
        _s.largeNextAndPrevButtonsMaxWidthPos = _d.largeNextAndPrevButtonsMaxWidthPos;
        _s.showBulletsNavigation = _d.showBulletsNavigation;
        _s.topology = _d.coverflowTopology;
        _s.showRefl = _d.showRefl;
        _s.reflHeight = _d.reflHeight;
        _s.reflDist = _d.reflDist;
        _s.reflAlpha = _d.reflAlpha;
        _s.grabIconPath_str = _d.grabIconPath_str;
        _s.handIconPath_str = _d.handIconPath_str;
        _s.showSlideshowButton = _d.showSlideshowButton;
        _s.captionPosition = _d.captionPosition;
        _s.nextAndPrevButtonsOffsetX = _d.nextAndPrevButtonsOffsetX;
        _s.volume = _d.volume;
        _s.videoAutoPlay = _d.videoAutoPlay;
        _s.nextVideoAutoPlay = _d.nextVideoAutoPlay;
        
        _s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;
        _s.isMobile = FWDR3DCovUtils.isMobile;
    
        _s.showCaptionUnderThumbnail_bl = _d.showCaptionUnderThumbnail_bl;
        _s.showLargeNextAndPrevButtons_bl = _d.showLargeNextAndPrevButtons;
        _s.areLargeNextAndPrevButtonsShowed = true;

        
        /**
         * Initialize.
         */
        _s.init = function(){
            _s.setOverflow('visible');
            _s.hasT3D = false;
            _s.hasT2D =  false;

            _s.holderDO = new FWDR3DCovDO3D("div", "absolute", "visible");
            _s.addChild(_s.holderDO);
            
            _s.holderDO.setWidth(_s.stageWidth);
            _s.holderDO.setOverflow('visible');
            
            _s.thumbsHolderDO = new FWDR3DCovDO3D("div", "absolute", "visible");
            _s.holderDO.addChild(_s.thumbsHolderDO);
            
            // Bug fix for old safari version...
            if(FWDR3DCovUtils.isSafari){
                _s.thumbsHolderDO.setZ(1000000);
            }

            _s.thumbsHolderDO.setAngleX(_s.xRot);       
            _s.thumbsHolderDO.setPreserve3D();
            
            if(!_s.isMobile){
                window.addEventListener("mousemove", _s.onThumbMove);
            }
            
            if(_s.hasPointerEvent){
                window.addEventListener("MSPointerMove", _s.onThumbMove);
            }

            window.addEventListener('click', _s.thumbClickHandler);
            
            _s.showScrollbar = _d.showScrollbar;
            _s.showNextButton = _d.showNextButton;
            _s.showNextAndPrevButtons = _d.showNextAndPrevButtons;
            
            if (_s.isMobile){
                if (_d.showScrollbarOnMobile){
                    _s.showScrollbar = false;
                }
                
                if (_d.showNextAndPrevButtonsOnMobile){
                    _s.showNextAndPrevButtons = false;
                }   
            }
        
            if (_s.showCaption_bl){
                _s.setupCaption();
            }

            _s.setupVideo();
            _s.showCurrentCat(-1);
            _s.setupControls();
            _s.hideControls();
            
            if(!_s.isMobile){
                _s.addDragScreen();
                setTimeout(function(){
                    _s.setupDisableDragScreen();
                }, 50)
                
            }
        };
        
        _s.addDragScreen = function(){
            if(_s.useDrag){
                _s.style().cursor = _s.handC;
                prt.mainDO.style().cursor = _s.handC;
            }
        };
        
        _s.removeDragScreen = function(){
            _s.style().cursor = null;
            prt.mainDO.style().cursor = null;
        };


        /**
         * Resize handler.
         */
        _s.resizeHandler = function(resizeCaption, ovrt){
            if(_s.prevStageW == prt.stageWidth && _s.prevStageH == prt.stageHeight && !ovrt) return;
            _s.stageWidth = prt.stageWidth;
            _s.stageHeight = prt.stageHeight;

            _s.prevStageW = _s.stageWidth;
            _s.prevStageH = _s.stageHeight;
            
            _s.holderDO.setWidth(_s.stageWidth);
            _s.holderDO.setHeight(_s.stageHeight);
            
            _s.scale = prt.scale;
            
            _s.thumbsHolderDO.setScale3D(_s.scale);
            
        
            if(_s.isEvpFS){
                _s.thumbsHolderDO.setY(-5000);
            }
            _s.thumbsHolderDO.setX(Math.floor(_s.stageWidth/2));
            _s.thumbsHolderDO.setY(Math.floor(_s.stageHeight/2) + _s.thumbnailOffsetY);
            
            _s.positionControls();
            _s.postionNextAndPrevLargeButtons();
            
            if(!resizeCaption){
                _s.positionCaptionHolder();
                setTimeout(_s.positionCaptionHolder, 50);
            }

            _s.positionVideo();
            
        };

                
        /**
         * Setup disable drag screen.
         */
        _s.setupDisableDragScreen = function(){
            if(!_s.dsb_do){
                _s.dsb_do = new FWDR3DCovDO3D("div");
                _s.dsb_do.setZ(999999999999)
                if(FWDR3DCovUtils.isIE){
                    _s.dsb_do.setBkColor("#00FF00");
                    _s.dsb_do.setAlpha(.0000001);
                }
                
                prt.mainDO.addChild(_s.dsb_do);
                _s.dsb_do.style().cursor = _s.grabC;
            }
            _s.hideDsb();
        };
        
        _s.showDsb = function(){
            if(_s.isDsbShowed_bl || !_s.dsb_do || !_s.useDrag) return;
            clearTimeout(_s.hideDSBId_to);
            _s.isDsbShowed_bl = true;
            _s.dsb_do.setVisible(true);
            _s.dsb_do.setWidth(_s.stageWidth);
            _s.dsb_do.setHeight(_s.stageHeight);
            
        };
        
        _s.hideDsb = function(){
            if(!_s.isDsbShowed_bl || !_s.dsb_do) return;
            clearTimeout(_s.hideDSBId_to);
            _s.isDsbShowed_bl = false;
            _s.dsb_do.setVisible(false);
            _s.dsb_do.setWidth(0);
            _s.dsb_do.setHeight(0);
        };
        
        _s.onThumbMove = function(e){
            if (!_s.textHolderDO)
                return;
            
            if (_s.disableThumbClick || !_s.hasCaption)
                return;
            
            var vmc = FWDR3DCovUtils.getViewportMouseCoordinates(e);
            
            _s.vmcX = vmc.screenX;
            _s.vmcY = vmc.screenY;
            
            if (_s.isTextSet){
                _s.checkThumbOver();
            }
        };

        
        /**
         * Show current category.
         */
        _s.showCurrentCat = function(id){
            _s.showCaptionFirstTime = true;
            _s.hieVideoOnFrstTween = true;
            if ((id != _s.dataListId) && (id >= 0)){
                if(_s.showBulletsNavigation && _s.bulletsNavigationDO){
                    _s.bulletsNavigationDO.hideBullets();
                }
                _s.allowToSwitchCat = false;
                _s.hideCurrentCat();
                _s.dataListId = id;
                
                return;
            }
            
            _s.thumbsAr = [];
            _s.curDataListAr = _s._d.dataListAr[_s.dataListId];
            _s.totalThumbs = _s.curDataListAr.length;
            _s.prevCaptionId = -1;

            if (_s.totalThumbs == 0){
                var message = "This category doesn't contain any thumbnails!";
                _s.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : message});
                return;
            }

            switch (_s.startPos){
                case "left":
                    _s.curId = 0;
                    break;
                case "right":
                    _s.curId = _s.totalThumbs-1;
                    break;
                default:
                    _s.curId = Math.floor((_s.totalThumbs-1)/2);
            }

            if(_s.startPos.match(/^\d+$/)){
            
                _s.startPos = Math.floor(_s.startPos) - 1;
            
                if (_s.startPos < 0){
                    _s.startPos = Math.floor((_s.totalThumbs-1)/2);
                }else if (_s.startPos > _s.totalThumbs-1){
                    _s.startPos = Math.floor((_s.totalThumbs-1)/2);
                }

                _s.curId = _s.startPos;
            }
        
            if (_s.showScrollbar && _s.scrollbarDO){
                _s.scrollbarDO.totalItems = _s.totalThumbs;
                _s.scrollbarDO.curItemId = _s.curId;
                _s.scrollbarDO.gotoItem2();
            }
            
            if(_s.showBulletsNavigation && _s.bulletsNavigationDO){
                _s.bulletsNavigationDO.totalItems = _s.totalThumbs;
                _s.bulletsNavigationDO.curItemId = _s.curId;
                _s.bulletsNavigationDO.createBullets();
                setTimeout(function(){
                    _s.positionControls();
                }, 400);
            }

            if(_d.useVectorIcons){
                setTimeout(function(){
                    _s.positionControls();
                }, 400);
            }

            if(_s.showLargeNextAndPrevButtons_bl){  
                setTimeout(function(){
                    _s.showLargeNextAndPrevButtons(true);
                }, 1000);
            }

            // Set perspective and ratio.
            var thumbWSum = 0;
            for (var i=0; i<_s.totalThumbs; i++){
                thumbWSum += _s.thumbWidth;
            }
        
            _s.avgThumbWidth = thumbWSum / _s.totalThumbs;  
            _s.perspective = _s.avgThumbWidth * 4;
            _s.sizeRatio = _s.avgThumbWidth / 200;
            _s.thumbsHolderDO.setPerspective(_s.perspective);
        
            _s.setupThumbs();
            _s.mainThumbDO = _s.thumbsAr[_s.curId];
            
            _s.prevCurId = _s.curId;
            _s.startIntro();
        };

    
        /**
         * Hide current category.
         */
        _s.hideCurrentCat = function(){
            
            _s.isAnim = true;
            _s.disableThumbClick = true;
            clearTimeout(_s.loadWithDelayIdLeft);
            clearTimeout(_s.loadWithDelayIdRight);
            clearTimeout(_s.textTimeoutId);
            clearTimeout(_s.thumbsTweenDone_to);
            clearInterval(_s.zSortingId);
            clearTimeout(_s.hideThumbsFinishedId);
            clearTimeout(_s.loadImagesId);
    
            clearTimeout(_s.setIntroFinishedId);
            clearTimeout(_s.showControlsId);
            prt.removeInfoDO();
            _s.stopSlideshow();
            if(_s.evp) _s.evp.stop();
            _s.hidePlayButton(true);
            
            if(_s.image){
                _s.image.onload = null;
                _s.image.onerror = null;
            }
            
            if(_s.imageLeft){
                _s.imageLeft.onload = null;
                _s.imageLeft.onerror = null;
            }
            
            if(_s.imageRight){
                _s.imageRight.onload = null;
                _s.imageRight.onerror = null;
            }
            
            _s.hideThumbs();
            _s.hideLargeNextAndPrevButtons();
            _s.hideControls(true);
        };
        
        _s.hideThumbs = function(){
            var delay;
            var delayDelta;
            var newX = -_s.thumbWidth/2;
            var maxNrOfSideThumbs = Math.max(_s.totalThumbs - _s.curId, _s.curId);
            
            if (_s.nrThumbsToDisplay > 0){
                delayDelta = Math.floor(1000/_s.nrThumbsToDisplay);
            }else{
                delayDelta = Math.floor(1000/maxNrOfSideThumbs);
            }
            
            for (var i=0; i<_s.totalThumbs; i++){
                thumb = _s.thumbsAr[i];
                
                if (i == _s.curId){
                    _s.hideThumbsFinishedId = setTimeout(_s.hideThumbsFinished, 1000 + 500);
                }else if (_s.infiniteLoop){
                    if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                        delay = Math.abs(_s.nrThumbsToDisplay - Math.abs(i - _s.curId) + 1) * delayDelta;
                        FWDAnimation.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
                        thumb.hide((delay - 250)/1000);
                    }else if (Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) <= _s.nrThumbsToDisplay){
                        delay = Math.abs(_s.nrThumbsToDisplay - Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) + 1) * delayDelta;
                        FWDAnimation.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
                        thumb.hide((delay - 250)/1000);
                    }
                }else if ((_s.nrThumbsToDisplay > 0) && (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay)){
                    delay = Math.abs(_s.nrThumbsToDisplay - Math.abs(i - _s.curId) + 1) * delayDelta;
                    FWDAnimation.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
                    thumb.hide((delay - 250)/1000);
                }else{
                    delay = Math.abs(maxNrOfSideThumbs - Math.abs(i - _s.curId) + 1) * delayDelta;
                    FWDAnimation.to(thumb, .5, {x:Math.floor(newX), delay:delay/1000, ease:Expo.easeIn});
                    thumb.hide((delay - 250)/1000);
                }
            }
        };
        
        _s.hideThumbsFinished = function(){
            if(_s.captionPosition == 'out'){
                _s.hideCaption(true);
            }else{
                _s.hideCaption(true, true);
            }
            for (var i=0; i<_s.totalThumbs; i++){
                var thumb = _s.thumbsAr[i];
                
                if (i == _s.curId){
                    thumb.hide(0);
                    FWDAnimation.to(thumb, .6, {alpha:0, delay:.2, onComplete:_s.allThumbsAreTweened});
                }else{
                    thumb.setAlpha(0);
                }
            }
        };
        
        _s.allThumbsAreTweened = function(){
            _s.destroyCurrentCat();
            _s.showCurrentCat();
        };
        
        _s.destroyCurrentCat = function(){
            var thumb;
            
            for (var i=0; i<_s.totalThumbs; i++){
                thumb = _s.thumbsAr[i];
                FWDAnimation.killTweensOf(thumb);
                _s.thumbsHolderDO.removeChild(thumb);
                thumb.destroy();
                thumb = null;
            }
        };
        
        _s.startIntro = function(){
            _s.disableThumbClick = true;
            
            var thumb = _s.thumbsAr[_s.curId];
            
            var newX = -Math.floor(_s.thumbWidth/2);
            var newY = -Math.floor(_s.thumbHeight/2);

            thumb.setGradient(0);
            
            thumb.setX(Math.floor(newX));
            thumb.setY(Math.floor(newY));
            
            thumb.setAlpha(0);
            FWDAnimation.to(thumb, .8, {alpha:1});
            
            _s.thumbsHolderDO.addChild(thumb);
            
            _s.loadCenterImage();
            _s.loadImagesId = setTimeout(function(){
                _s.loadImages();
            }, 600);
    
        };
        
        
        /**
          * Setup thumbs.
          */
        _s.setupThumbs = function(){
            var thumb;
            
            for (var i=0; i<_s.totalThumbs; i++){
                FWDR3DCovThumb.setPrototype();
                thumb = new FWDR3DCovThumb(i, _s._d, _s);
                _s.thumbsAr.push(thumb);
                thumb.addListener(FWDR3DCovThumb.CLICK, _s.onThumbClick);
            }

            _s.dumyThumbDO =  new FWDR3DCovDO3D("div");
            _s.dumyThumbDO.setWidth(_s.thumbWidth);
            _s.dumyThumbDO.setHeight(_s.thumbHeight);
            _s.dumyThumbDO.setVisible(false);
            _s.dumyThumbDO.setX(Math.floor((-_s.dumyThumbDO.w/2)));
            _s.positionDumyCaption();
            _s.dumyThumbDO.setZ(0)
            _s.thumbsHolderDO.addChild(_s.dumyThumbDO);
        };

        _s.positionDumyCaption =  function(){
            var y = - Math.floor(_s.thumbHeight/2);
            _s.dumyThumbDO.setY(y);
        }

        
        _s.onThumbClick = function(e){
            if (_s.disableThumbClick || _s.isLoading)
                return;
            
            _s.curId = e.id;

            
            if (_s.curId != _s.prevCurId){
                _s.showDsb();
                _s.goToThumb();

                setTimeout(function(){
                    _s.hideDsb();
                }, 200);
            }
        };
        

        /**
         * Thumb click.
         */
        _s.thumbClickHandler = function(e){
            var vmc = FWDR3DCovUtils.getViewportMouseCoordinates(e);
            _s.vmcX = vmc.screenX;
            _s.vmcY = vmc.screenY;

            if(FWDR3DCov.rlShowed) return;

            if(_s.disableThumbClick || FWDAnimation.isTweening(_s.mainThumbDO))
                return;

            if(prt.menuDO && FWDR3DCovUtils.hitTest(prt.menuDO.screen, _s.vmcX, _s.vmcY))
                return;

            if(!_s.mainThumbDO || !FWDR3DCovUtils.hitTest(_s.mainThumbDO.screen, _s.vmcX, _s.vmcY))
                return;


            if(_s.captionPosition == 'in' && _s.hasCaption){
                if(!_s.isOver && _d.showCaptionOnTap && !_d.showFullCaption){
                    _s.onThumbOverHandler(true);
                    return;
                }

                // Check for a inside title.
                var aAr = _s.textHolderDO.screen.querySelectorAll('.fwdr3dcov-title')[0];
                if(aAr){
                    aAr = aAr.children;
                    for(var i=0; i<aAr.length; i++){
                        var chl = aAr[i];
                        if(chl.tagName == 'A'){
                            if(FWDR3DCovUtils.hitTest(chl, _s.vmcX, _s.vmcY))
                            return;
                        }
                    }
                }

                // Check for a inside description.
                aAr = _s.textHolderDO.screen.querySelectorAll('.fwdr3dcov-desc')[0];
                if(aAr){
                    aAr = aAr.children;
                    for(var i=0; i<aAr.length; i++){
                        var chl = aAr[i];
                        if(chl.tagName == 'A'){
                            if(FWDR3DCovUtils.hitTest(chl, _s.vmcX, _s.vmcY))
                            return;
                        }
                    }
                }
            }

            var type = 'none';
            if(_s.curDataListAr[_s.curId].secondObj) type = _s.curDataListAr[_s.curId].secondObj.type;
            var tempId = _s.curId;

            if (type == "none") return;
            
            for (var i=0; i<_s.totalThumbs; i++){
                var sType = 'none';
                if(_s.curDataListAr[i].secondObj) sType = _s.curDataListAr[i].secondObj.type;
                var hasThumbVid = _s.curDataListAr[i].thumbVideoSrc;

                if ((i < _s.curId) && (sType == 'link' || sType == 'none' || hasThumbVid)){
                    tempId -= 1;
                }
            };

            _s.stopSlideshow();
            if (type == "link"){
                window.open(_s.curDataListAr[_s.curId].secondObj.src, _s.curDataListAr[_s.curId].secondObj.target);
            }else{
                hasThumbVid = _s.curDataListAr[_s.curId].thumbVideoSrc;
                if(hasThumbVid){
                    _s.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : 'Please set use video to yes to play video/audio in the coverflow thumbnails.'});
                    return;
                }

                if(!_d.useLightbox){
                    _s.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : 'Please set use lightbox to yes to use the lightbox.'});
                    return;
                }
                
                _s.dispatchEvent(FWDR3DCovThumbsManager.THUMB_CLICK, {playlistId:_s.dataListId, thumbId:tempId});
            }               
        };


        /**
          * Thumb hover.
          */
        _s.checkThumbOver = function(){

            if(!_s.hasCaption || _d.showFullCaption || !_s.mainThumbDO || (_s.mainThumbDO && !_s.mainThumbDO.screen))
                return;

            if(FWDR3DCovUtils.hitTest(_s.mainThumbDO.screen, _s.vmcX, _s.vmcY)){
                _s.onThumbOverHandler(true);
            }else{
                _s.onThumbOutHandler(true);
            }
        };
        
        _s.onThumbOverHandler = function(anim){ 

            if(_s.isAnim) return;
            if(!_s.isOver){
                _s.isOver = true;
                
                if(_s.captionPosition == 'in'){
                    FWDAnimation.killTweensOf(_s.textDO);
                    if(anim){
                        FWDAnimation.to(_s.textDO, .7, {y:_s.textHolderDO.h -_s.textDO.getHeight(), ease:Expo.easeInOut});
                    }else{
                        _s.textDO.setY(- _s.textDO.getHeight());
                    }
                }
            }
        };

        _s.onThumbOutHandler = function(anim, owrt){
            if(_s.isAnim) return;
            if(_s.isOver || owrt){
                var y;
                _s.isOver = false;

                if(_s.captionPosition == 'in'){
                    FWDAnimation.killTweensOf(_s.textDO);
                    if(_d.showFullCaption){

                        y = _s.textHolderDO.h - _s.textDO.getHeight();
                    }else{
                        y = _s.textHolderDO.h - _s.captionOffset;
                    }

                    if(anim){
                        FWDAnimation.to(_s.textDO, .7, {y:y, ease:Expo.easeInOut});
                    }else{
                        _s.textDO.setY(y);
                    }
                }
            }
        };

    
        /**
         * Setup caption.
         */
        _s.setupCaption = function(){
            if(FWDR3DCovUtils.isMAC){
                _s.textHolderDO = new FWDR3DCovDO3D("div");
                _s.textHolderDO.setZ(100000008);
            }else{
                _s.textHolderDO = new FWDR3DCovDO("div");
            }
            
            _s.addChild(_s.textHolderDO);
            
            _s.textDO = new FWDR3DCovDO("div");
            _s.textDO.style().width = '100%';
            _s.textDO.screen.className = 'fwdr3dcov-caption dark in';
            if(_d.isSkinWhite){
                _s.textDO.screen.className = 'fwdr3dcov-caption white in';
            }
            _s.textHolderDO.addChild(_s.textDO);

            if(_s.captionPosition == 'out'){
                _s.textDO.screen.className = 'fwdr3dcov-caption dark out';
                if(_d.isSkinWhite){
                    _s.textDO.screen.className = 'fwdr3dcov-caption white out';
                }
                _s.textDO.style().position = 'relative';
                _s.textDO.style().margin = 'auto';
                _s.textHolderDO.style().width = '100%';
            }
        };

        _s.setCaption = function(){
            if(_s.prevCaptionId == _s.curId) return;
            _s.isTextSet = true;
            var curThumb = _s.thumbsAr[_s.curId];
            var text = _s.curDataListAr[_s.curId].thumbText;
            _s.hasCaption = text;

            _s.captionOffset = _s.curDataListAr[_s.curId].captionOffset;

            _s.textDO.setInnerHTML(text);
            prt.getCaptionHeight();

            if(_s.captionPosition == 'in'){
                if(_s.curDataListAr[_s.curId].type != "none" && !_s.useDrag){
                    _s.textHolderDO.setButtonMode(true);
                }else{
                    if(_s.useDrag){
                        _s.textHolderDO.style().cursor = _s.handC;
                    }else{
                        _s.textHolderDO.setButtonMode(false);
                    }
                }
                prt.resizeHandler(true);
            }

            _s.positionCaptionHolder();
            
            curThumb = _s.curDataListAr[_s.curId];
            if(_s.showCaptionFirstTime || !_s.hadPrevCaption){
                _s.hideCaption();
                setTimeout(function(){
                    _s.showCaption(true, true);
                }, 50)
                
            }else{
                _s.showCaption(true);
            }
            
            
            _s.checkThumbOver();
            if(!_s.hasCaption){
                _s.textHolderDO.setVisible(false);
            }else{
                _s.textHolderDO.setVisible(true);
            }

            prt.addOffsetTextHeight(true);
            _s.positionControls(true);
            _s.hadPrevCaption = _s.hasCaption;
            _s.prevCaptionId = _s.curId;
        };

        _s.hideCaption = function(anim, intro){
            if(!_s.hasCaption) return;
            FWDAnimation.killTweensOf(_s.textHolderDO);
            _s.captionShowed = false;
            
            if(_s.captionPosition == 'in'){
                if(anim){
                    if(_d.captionAnimationType == 'motion'){
                        FWDAnimation.to(_s.textHolderDO, .25, {alpha:0, ease:Quint.easeOut});
                    }else{
                        var t = .25;
                        if(intro) t = .8;
                        FWDAnimation.to(_s.textHolderDO, t, {alpha:0, ease:Quint.easeOut});
                    }
                }else{
                    if(_d.captionAnimationType == 'motion'){
                        _s.textDO.setY(_s.textHolderDO.getHeight() + 1);
                    }else{
                        _s.textHolderDO.setAlpha(0);
                    }
                }
            }else{
                FWDAnimation.killTweensOf(_s.textDO);
                if(anim){
                    if(_d.captionAnimationType == 'motion'){
                        FWDAnimation.to(_s.textDO, .8, {y:-prt.captionH - 6, ease:Expo.easeInOut});
                    }else{
                        FWDAnimation.to(_s.textHolderDO, .8, {alpha:0, ease:Quint.easeOut});
                    }
                }else{
                    if(_d.captionAnimationType == 'motion'){
                        _s.textDO.setY(-prt.captionH - 6);
                    }else{
                        _s.textHolderDO.setAlpha(0);
                    }
                }
            }
        }
        
        _s.showCaption = function(anim, intro){
            if(!_s.hasCaption || _s.captionShowed) return;
        
            var y;
            FWDAnimation.killTweensOf(_s.textHolderDO);

            _s.captionShowed = true;

            if(_s.captionPosition == 'in'){
                if(_d.showFullCaption){
                    y = _s.textHolderDO.h - _s.textDO.getHeight();
                }else{
                    y = _s.textHolderDO.h - _s.captionOffset;
                }
                if(anim){
                    if(_d.captionAnimationType == 'motion'){
                        _s.textHolderDO.setAlpha(1);
                        _s.textDO.setY(_s.textHolderDO.h + 1);
                        FWDAnimation.to(_s.textDO, .8, {y:y, ease:Expo.easeInOut});
                    }else{
                        var dl = 0;
                        if(intro) dl = .3;
                        FWDAnimation.to(_s.textHolderDO, .8, {alpha:1, delay:dl, ease:Quint.easeOut});
                    }
                }else{
                    if(_d.captionAnimationType == 'motion'){
                        _s.textDO.setY(y);
                        _s.textHolderDO.setAlpha(1);
                    }else{
                        _s.textHolderDO.setAlpha(1);
                    }
                }
            }else{
                FWDAnimation.killTweensOf(_s.textDO);
                if(anim){
                    if(_d.captionAnimationType == 'motion'){
                        FWDAnimation.to(_s.textDO, .8, {y:0, ease:Expo.easeInOut});
                    }else{
                        FWDAnimation.to(_s.textHolderDO, .8, {alpha:1, ease:Quint.easeOut});
                    }
                }else{
                    if(_d.captionAnimationType == 'motion'){
                        _s.textDO.setY(0);
                    }else{
                        _s.textHolderDO.setAlpha(1);
                    }
                }
            }
            _s.showCaptionFirstTime = false;
        }

        _s.positionCaptionHolder = function(){
            if(_s.textHolderDO && _s.dumyThumbDO){
                if(_s.captionPosition == 'in'){
                    var w = parseFloat(_s.mainThumbDO.getRect().width).toFixed(3);
                    var h = parseFloat(_s.mainThumbDO.getRect().height).toFixed(3);
                    var x = (_s.mainThumbDO.getRect().x || _s.mainThumbDO.getRect().left) - prt.mainDO.getGlobalX();
                    var y = (_s.mainThumbDO.getRect().y || _s.mainThumbDO.getRect().top) - prt.mainDO.getGlobalY();
                
                    _s.textHolderDO.setX(x + _s.borderSize * _s.scale);
                    _s.textHolderDO.setY(Math.round(y + _s.borderSize * _s.scale));
                    
                    _s.textHolderDO.setWidth(w - ((_s.borderSize * _s.scale) * 2));
                    var w2 = parseFloat(_s.textHolderDO.getRect().width).toFixed(3);
                    var w3 = parseFloat(w).toFixed(3);
                    if(w3 < w2){
                        w += 1;
                    }
                    _s.textHolderDO.setWidth(w - ((_s.borderSize * _s.scale) * 2));

                    _s.textHolderDO.setHeight(h - ((_s.borderSize * _s.scale) * 2));
                    var h2 = parseFloat(_s.textHolderDO.getRect().height).toFixed(3);
                    var h3 = parseFloat(h).toFixed(3);
                    if(h3 < h2){
                        h += 1;
                    }
                    _s.textHolderDO.setHeight(h - ((_s.borderSize * _s.scale) * 2));
    
                    _s.onThumbOutHandler(false, true);
                
                    if(_s.thumbWidth * prt.scale < 200){
                        _s.textHolderDO.setVisible(false);
                    }else{
                        _s.textHolderDO.setVisible(true);
                    }
                }else{
                    var y = Math.round(_s.dumyThumbDO.getRect().top - prt.mainDO.getGlobalY() + _s.dumyThumbDO.getRect().height);
                    _s.textHolderDO.setY(y);
                    _s.textHolderDO.setHeight(300);
                }
            }
        }

    
        /**
         * Load images.
         */
        _s.loadImages = function(){
            
            _s.setupIntro3D();
        
            _s.countLoadedThumbsLeft = _s.curId - 1;
            _s.loadWithDelayIdLeft = setTimeout(_s.loadThumbImageLeft, 100);
            
            _s.countLoadedThumbsRight = _s.curId + 1;
            _s.loadWithDelayIdRight = setTimeout(_s.loadThumbImageRight, 100);
        };
        
        _s.loadCenterImage = function(){
            _s.imagePath = _s.curDataListAr[_s.curId].thumbSrc;

            _s.image = new Image();
            _s.image.onerror = _s.onImageLoadErrorHandler;
            _s.image.onload = _s.onImageLoadHandlerCenter;
            _s.image.src = _s.imagePath;
        };
        
        _s.onImageLoadHandlerCenter = function(e){
            var thumb = _s.thumbsAr[_s.curId];
            
            thumb.addImage(_s.image);
            thumb.showThumb3D();
                    
            if (_s.showCaption_bl){
                _s.isTextSet = true;
                clearTimeout(_s.textTimeoutId);
                _s.textTimeoutId = setTimeout(function(){
                    _s.thumbsTweenDone();
                }, 800);

                _s.setCaption();
            }
        };

        _s.loadThumbImageLeft = function(){
            if (_s.countLoadedThumbsLeft < 0)
                    return;
            
            _s.imagePath = _s.curDataListAr[_s.countLoadedThumbsLeft].thumbSrc;

            _s.imageLeft = new Image();
            _s.imageLeft.onerror = _s.onImageLoadErrorHandler;
            _s.imageLeft.onload = _s.onImageLoadHandlerLeft;
            _s.imageLeft.src = _s.imagePath;
        };

        _s.onImageLoadHandlerLeft = function(e){
            var thumb = _s.thumbsAr[_s.countLoadedThumbsLeft];

            thumb.addImage(_s.imageLeft);       
            thumb.showThumb3D();

            _s.countLoadedThumbsLeft--;
            _s.loadWithDelayIdLeft = setTimeout(_s.loadThumbImageLeft, 200);
        };
        
        _s.loadThumbImageRight = function(){
            if (_s.countLoadedThumbsRight > _s.totalThumbs-1)
                return;
            
            _s.imagePath = _s.curDataListAr[_s.countLoadedThumbsRight].thumbSrc;

            _s.imageRight = new Image();
            _s.imageRight.onerror = _s.onImageLoadErrorHandler;
            _s.imageRight.onload = _s.onImageLoadHandlerRight;
            _s.imageRight.src = _s.imagePath;
        };

        _s.onImageLoadHandlerRight = function(e){
            var thumb = _s.thumbsAr[_s.countLoadedThumbsRight];

            thumb.addImage(_s.imageRight);
            thumb.showThumb3D();

            _s.countLoadedThumbsRight++;            
            _s.loadWithDelayIdRight = setTimeout(_s.loadThumbImageRight, 200);
        };

        _s.onImageLoadErrorHandler = function(e){
            if (!_s || !_s._d)
                return;

            var message = "Thumb can't be loaded, probably the path is incorrect <font color='#FF0000'>" + _s.imagePath + "</font>";

            _s.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : message});
        };
        
        
        /**
          * 3D intro.
          */
        _s.setupIntro3D = function(){
            var newX;
            var newY;
            var newZ;
            
            var newAngleX;
            var newAngleY;
            var newAlpha;

            var delay;
            
            for (var i=0; i<_s.totalThumbs; i++){
                var thumb = _s.thumbsAr[i];
                
                newX = 0;
                newY = 0;
                newZ = 0;
                
                newAngleX = .1;
                newAngleY = 0;
                
                newAlpha = 1;
                
                if (i != _s.curId){
                    newX = -Math.floor(_s.thumbWidth/2);
                    newY = -Math.floor(_s.thumbHeight/2);
                    thumb.setX(Math.floor(newX));
                    thumb.setY(Math.floor(newY));
                }
                
                var sgn = 0;
                
                if (i < _s.curId){
                    sgn = -1;
                }else if (i > _s.curId){
                    sgn = 1;
                }
            
                if (i != _s.curId){
                    if (_s.infiniteLoop){
                        if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                            newX = (_s.thumbXSpace3D * Math.abs(i - _s.curId) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * Math.abs(i - _s.curId) + _s.thumbZOffset3D);
                            newAngleY = -_s.thumbYAngle3D * sgn;
                        }else if (Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) <= _s.nrThumbsToDisplay){
                            sgn *= -1;
                            newX = (_s.thumbXSpace3D * Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) + _s.thumbZOffset3D);
                            newAngleY = -_s.thumbYAngle3D * sgn;
                        }else{
                            sgn = -_s.getDir(i);
                            newX = (_s.thumbXSpace3D * (_s.nrThumbsToDisplay + 1) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * (_s.nrThumbsToDisplay + 1) + _s.thumbZOffset3D);
                            newAngleY = -_s.thumbYAngle3D * sgn;
                            newAlpha = 0;
                        }
                    }else{
                        if (_s.nrThumbsToDisplay > 0){
                            if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                                newX = (_s.thumbXSpace3D * Math.abs(i - _s.curId) + _s.thumbXOffset3D) * sgn;
                                newZ = -((_s.thumbZSpace3D + 1) * Math.abs(i - _s.curId) + _s.thumbZOffset3D);
                                newAngleY = -_s.thumbYAngle3D * sgn;
                            }else{
                                newX = (_s.thumbXSpace3D * (_s.nrThumbsToDisplay + 1) + _s.thumbXOffset3D) * sgn;
                                newZ = -((_s.thumbZSpace3D + 1) * (_s.nrThumbsToDisplay + 1) + _s.thumbZOffset3D);
                                newAngleY = -_s.thumbYAngle3D * sgn;
                                newAlpha = 0;
                            }
                        }else{
                            newX = (_s.thumbXSpace3D * Math.abs(i - _s.curId) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * Math.abs(i - _s.curId) + _s.thumbZOffset3D);
                            newAngleY = -_s.thumbYAngle3D * sgn;
                            newAlpha = 1;

                            thumb.enable();   
                        }
                    }
                }
                
                
                newX *= _s.sizeRatio;
                newZ *= _s.sizeRatio;
                
                newY = 0;
                newX = Math.floor(newX) - Math.floor(_s.thumbWidth/2);
                newY = Math.floor(newY) - Math.floor(_s.thumbHeight/2);
            
                thumb.screen.style.zIndex = newZ;
                thumb.setZ(Math.floor(newZ));
                
                if (_s.infiniteLoop){
                    if (Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) <= _s.nrThumbsToDisplay){
                        delay = Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) * Math.floor(1000/(_s.totalThumbs/2));
                    }else{
                        delay = Math.abs(i - _s.curId) * Math.floor(1000/(_s.totalThumbs/2));
                    }
                }else{
                    delay = Math.abs(i - _s.curId) * Math.floor(1000/(_s.totalThumbs/2));
                }
                
                FWDAnimation.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleX:newAngleX, angleY:newAngleY, alpha:newAlpha, delay:delay/1000, ease:Quart.easeOut});
                
                if (_s.infiniteLoop){
                    if (newAlpha == 0){
                        thumb.disable();
                    }else{
                        thumb.enable();
                    }
                }else{
                    if (_s.nrThumbsToDisplay > 0){
                        if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                            thumb.enable();
                        }else{
                            thumb.disable();
                        }
                    }
                }
                
                thumb.setGradient(sgn); 
                thumb.curZ = Math.floor(newZ);  
                _s.thumbsHolderDO.addChild(thumb);
            }
            
            if (FWDR3DCovUtils.isIE){
                _s.sortZ();
            }

            _s.setIntroFinishedId = setTimeout(_s.setIntroFinished, delay + 800);
            _s.showControls(true);
            if(prt.menuDO) prt.menuDO.showFirstTime();
            
        };
        
        _s.setIntroFinished = function(){
            _s.introFinished = true;
            _s.allowToSwitchCat = true;
            _s.disableThumbClick = false;
            
            _s.addNavigation();
            
            if (FWDR3DCovUtils.isIE){
                _s.zSortingId = setInterval(_s.sortZ, 16);
            }
            
            if (_s._d.slideshowAutoplay){
                if (_s.slideshowButtonDO){
                    _s.slideshowButtonDO.onClick();
                    _s.slideshowButtonDO.onMouseOut();
                }
            }

            _s.dispatchEvent(FWDR3DCovThumbsManager.THUMBS_INTRO_FINISH);
        };
        
        _s.removeNavigation = function(){
            _s.removeMobileDrag();
        };
        
        _s.addNavigation = function(){
            _s.removeNavigation();
            if (_s.isMobile || _s.useDrag){
                _s.setupMobileDrag();
            }
        };

        _s.sortZ = function(){
            var minX = 10000;
            var centerId;
            var zIndex;
            
            for (var i=0; i<_s.totalThumbs; i++){
                thumb = _s.thumbsAr[i];
                
                var tx = thumb.getX() + Math.floor(_s.curDataListAr[i].thumbWidth/2);
                
                if (Math.abs(tx) < minX)
                {
                    minX = Math.abs(tx);
                    centerId = i;
                }
            }
            
            var x1 = _s.thumbsAr[0].curX;
            var x2 = _s.thumbsAr[_s.totalThumbs-1].curX;
            
            var s = 0;
            
            for (var i=1; i<_s.totalThumbs-1; i++){
                thumb = _s.thumbsAr[i];
                
                if ((thumb.curX == x1) || (thumb.curX == x2)){
                    s++;
                }
            }
            
            if ((s > _s.totalThumbs/2) && FWDRLS3DUtils.hasTransform3d){
                for (var i=0; i<_s.totalThumbs; i++){
                    thumb = _s.thumbsAr[i];
                    
                    zIndex = Math.floor(thumb.getZ());
                    
                    if (zIndex != thumb.getZIndex()){
                        thumb.setZIndex(zIndex);
                    }
                }
            }else{
                for (var i=0; i<_s.totalThumbs; i++){
                    thumb = _s.thumbsAr[i];
                    
                    if (_s.infiniteLoop){
                        if(Math.abs(i - centerId) <= _s.nrThumbsToDisplay){
                            zIndex = _s.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
                        }else if(Math.abs(Math.abs(i - centerId) - _s.totalThumbs) <= _s.nrThumbsToDisplay){
                            zIndex = _s.nrThumbsToDisplay + 1 - Math.abs(Math.abs(i - centerId) - _s.totalThumbs);
                        }else{
                            zIndex = 0;
                        }
                    }else{
                        if (_s.nrThumbsToDisplay > 0){
                            if (Math.abs(i - centerId) <= _s.nrThumbsToDisplay){
                                zIndex = _s.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
                            }else{
                                zIndex = 0;
                            }
                        }else{
                            zIndex = Math.floor(_s.totalThumbs/2) - Math.abs(i - centerId);
                        }
                    }
                    
                    if (zIndex != thumb.getZIndex()){
                        thumb.setZIndex(zIndex);
                    }
                }
            }
        };
        

        /**
          * Go to thumb.
          */
        _s.goToThumb = function(){
            if (!_s.introFinished)
                return;

            _s.isAnim = true;
            prt.removeInfoDO();
            _s.hideVideo();

            if (_s.showScrollbar && !_s.scrollbarDO.isPressed){
                _s.scrollbarDO.gotoItem(_s.curId, true);
            }

            if (_s.isPlaying){
                _s.slideshowButtonDO.stopSlideshow(true);   

                clearTimeout(_s.slideshowTimeoutId);
                _s.slideshowTimeoutId = setTimeout(_s.startTimeAgain, 800);
            }

            _s.mainThumbDO = _s.thumbsAr[_s.curId];
            if(_s.mainThumbDO){
                if (_s.showCaption_bl){
                    if (_s.isTextSet){
                        _s.isTextSet = false;   
                        if(_s.captionPosition == 'in'){
                            _s.hideCaption(true);   
                            clearTimeout(_s.textTimeoutId);
                            _s.textTimeoutId = setTimeout(_s.setCaption, 850);  
                        }else{
                            _s.setCaption();
                        }
                        
                    }else{
                        if(_s.captionPosition == 'in'){
                            clearTimeout(_s.textTimeoutId);
                            _s.textTimeoutId = setTimeout(_s.setCaption, 850);
                        }else{
                            _s.setCaption();
                        }
                    }
                }
            }

            clearTimeout(_s.thumbsTweenDone_to);
            _s.thumbsTweenDone_to = setTimeout(_s.thumbsTweenDone, 850);
            
            _s.gotoThumb3D();

            _s.isOver = false;
            _s.prevCurId = _s.curId;
            
            if(_s.showBulletsNavigation){
                _s.bulletsNavigationDO.updateBullets(_s.curId);
            }
            
            _s.dispatchEvent(FWDR3DCovThumbsManager.THUMB_CHANGE, {id:_s.curId});
        };
        
        _s.normAngle = function(angle){
            while (angle < 0)
                angle += 360;
            
            return angle;
        };
        
        _s.gotoThumb3D = function(){

            var newX;
            var newY;
            var newZ;
            
            var newAngleX;
            var newAngleY;
            var newAlpha;
            var tweenThumb;
            
            for (var i=0; i<_s.totalThumbs; i++){
                thumb = _s.thumbsAr[i];
                thumb.updateButtonMode();
                
                newX = 0;
                newY = 0;
                newZ = 0;
                
                newAngleX = .1;
                newAngleY = 0;
                newAlpha = 1;
                
                tweenThumb = true;
                
                var sgn = 0;
                
                if (i < _s.curId){
                    sgn = -1;
                }else if (i > _s.curId){
                    sgn = 1;
                }
            
                if (i != _s.curId){
                    if (_s.infiniteLoop){
                        
                        if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                            newX = (_s.thumbXSpace3D * Math.abs(i - _s.curId) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * Math.abs(i - _s.curId) + _s.thumbZOffset3D);
                            
                            newAngleY = -_s.thumbYAngle3D * sgn;
                            
                            if (thumb.curAlpha == 0){
                                var tempSgn = -_s.getDir(i);

                                var tempNewX = (_s.thumbXSpace3D * (_s.nrThumbsToDisplay + 1) + _s.thumbXOffset3D) * tempSgn;
                                var tempNewZ = -((_s.thumbZSpace3D + 1) * (_s.nrThumbsToDisplay + 1) + _s.thumbZOffset3D);
                                
                                var tempNewAngleY = -_s.thumbYAngle3D * tempSgn;
                                
                                tempNewX *= _s.sizeRatio;
                                tempNewZ *= _s.sizeRatio;
                            
                                tempNewX = Math.floor(tempNewX) - Math.floor(_s.thumbWidth/2);

                                
                                thumb.setX(tempNewX);
                                thumb.setZ(tempNewZ);
                                thumb.setAngleY(tempNewAngleY);
                            }
                        }else if (Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) <= _s.nrThumbsToDisplay){
                            sgn *= -1;
                        
                            newX = (_s.thumbXSpace3D * Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * Math.abs(Math.abs(i - _s.curId) - _s.totalThumbs) + _s.thumbZOffset3D);
                            
                            newAngleY = -_s.thumbYAngle3D * sgn;
                            
                            if (thumb.curAlpha == 0){
                                var tempSgn = -_s.getDir(i);
                                
                                var tempNewX = (_s.thumbXSpace3D * (_s.nrThumbsToDisplay + 1) + _s.thumbXOffset3D) * tempSgn;
                                var tempNewZ = -((_s.thumbZSpace3D + 1) * (_s.nrThumbsToDisplay + 1) + _s.thumbZOffset3D);
                                
                                var tempNewAngleY = -_s.thumbYAngle3D * tempSgn;
                                
                                tempNewX *= _s.sizeRatio;
                                tempNewZ *= _s.sizeRatio;
                            
                                tempNewX = Math.floor(tempNewX) - Math.floor(_s.thumbWidth/2);
                                
                                thumb.setX(tempNewX);
                                thumb.setZ(tempNewZ);
                                thumb.setAngleY(tempNewAngleY);
                            }
                        }else{
                            sgn = -_s.getDir(i);
                            
                            newX = (_s.thumbXSpace3D * (_s.nrThumbsToDisplay + 1) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * (_s.nrThumbsToDisplay + 1) + _s.thumbZOffset3D);
                            
                            newAngleY = -_s.thumbYAngle3D * sgn;
                            
                            newAlpha = 0;
                            
                            if (thumb.curAlpha == 0){
                                tweenThumb = false;
                            }
                        }
                    }else{
                        if (_s.nrThumbsToDisplay > 0){
                            if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                                newX = (_s.thumbXSpace3D * Math.abs(i - _s.curId) + _s.thumbXOffset3D) * sgn;
                                newZ = -((_s.thumbZSpace3D + 1) * Math.abs(i - _s.curId) + _s.thumbZOffset3D);
                            
                                newAngleY = -_s.thumbYAngle3D * sgn;
                            }else
                            {
                                newX = (_s.thumbXSpace3D * (_s.nrThumbsToDisplay + 1) + _s.thumbXOffset3D) * sgn;
                                newZ = -((_s.thumbZSpace3D + 1) * (_s.nrThumbsToDisplay + 1) + _s.thumbZOffset3D);
                                
                                newAngleY = -_s.thumbYAngle3D * sgn;
                                
                                newAlpha = 0;
                            }
                        }else{
                            newX = (_s.thumbXSpace3D * Math.abs(i - _s.curId) + _s.thumbXOffset3D) * sgn;
                            newZ = -((_s.thumbZSpace3D + 1) * Math.abs(i - _s.curId) + _s.thumbZOffset3D);
                                
                            newAngleY = -_s.thumbYAngle3D * sgn;
                            newAlpha = 1;
                            thumb.enable();
                        }
                    }
                }
        
                
                newX *= _s.sizeRatio;
                newZ *= _s.sizeRatio;
                newX = Math.floor(newX) - Math.floor(_s.thumbWidth/2);
                newY = Math.floor(newY) - Math.floor(_s.thumbHeight/2);

                if(tweenThumb){ 
                    FWDAnimation.killTweensOf(thumb);
                    FWDAnimation.to(thumb, .8, {x:Math.floor(newX), y:Math.floor(newY), z:Math.floor(newZ), angleX:newAngleX, angleY:newAngleY, alpha:newAlpha, ease:Quart.easeOut});
                }
                
                if (_s.infiniteLoop){
                    if (newAlpha == 0){
                        thumb.disable();
                    }else{
                        thumb.enable();
                    }
                }else{
                    if (_s.nrThumbsToDisplay > 0){
                        if (Math.abs(i - _s.curId) <= _s.nrThumbsToDisplay){
                            thumb.enable();
                        }else{
                            thumb.disable();
                        }
                    }
                }
                
                thumb.curX = Math.floor(newX);
                thumb.curZ = Math.floor(newZ);
                thumb.curAlpha = newAlpha;
                thumb.screen.style.zIndex = newZ;
                thumb.setGradient(sgn);
            }
        };

        _s.getDir = function(id){
            var dir;
            
            if (id < _s.curId){
                if (_s.curId - id <= Math.floor(_s.totalThumbs/2)){
                    dir = 1;
                }else{
                    dir = -1;
                }
            }else{
                if (id - _s.curId <= Math.floor(_s.totalThumbs/2)){
                    dir = -1;
                }else{
                    dir = 1;
                }
            }
            
            return dir;
        };
        

        /**
          * Sort Z for old IE browser.
          */
        _s.sortZ = function(){
            var minX = 10000;
            var centerId;
            var zIndex;
            
            for (var i=0; i<_s.totalThumbs; i++){
                thumb = _s.thumbsAr[i];
                
                var tx = thumb.getX() + Math.floor(_s.thumbWidth/2);
                
                if (Math.abs(tx) < minX){
                    minX = Math.abs(tx);
                    centerId = i;
                }
            }
            
            var x1 = _s.thumbsAr[0].curX;
            var x2 = _s.thumbsAr[_s.totalThumbs-1].curX;
            
            var s = 0;
            
            for (var i=1; i<_s.totalThumbs-1; i++){
                thumb = _s.thumbsAr[i];
                
                if ((thumb.curX == x1) || (thumb.curX == x2)){
                    s++;
                }
            }
            
            for (var i=0; i<_s.totalThumbs; i++){
                thumb = _s.thumbsAr[i];
                
                if (_s.infiniteLoop){
                    if (Math.abs(i - centerId) <= _s.nrThumbsToDisplay){
                        zIndex = _s.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
                    }else if (Math.abs(Math.abs(i - centerId) - _s.totalThumbs) <= _s.nrThumbsToDisplay){
                        zIndex = _s.nrThumbsToDisplay + 1 - Math.abs(Math.abs(i - centerId) - _s.totalThumbs);
                    }else{
                        zIndex = 0;
                    }
                }else{
                    if (_s.nrThumbsToDisplay > 0){
                        if (Math.abs(i - centerId) <= _s.nrThumbsToDisplay){
                            zIndex = _s.nrThumbsToDisplay + 1 - Math.abs(i - centerId);
                        }else{
                            zIndex = 0;
                        }
                    }else{
                        zIndex = Math.floor(_s.totalThumbs/2) - Math.abs(i - centerId);
                    }
                }
                
                if (zIndex != thumb.getZIndex()){
                    thumb.setZIndex(zIndex);
                }
            }
            
        };

        _s.thumbsTweenDone = function(){

            var thumb = _s.thumbsAr[_s.curId];
            if(!thumb) return;
            thumb.setX(Math.round(thumb.x));
            thumb.setY(Math.round(thumb.y));
            thumb.setZ(Math.round(thumb.z));
            
            _s.positionDumyCaption();
            if(_s.hieVideoOnFrstTween) _s.hideVideo();
            if(_s.evp) _s.evp.stop();
            _s.positionVideo();
            _s.isAnim = false;

            _s.curItemData = _s.curDataListAr[_s.curId];
            _s.password = _s.curItemData.password;
            _s.subtitleSrc = _s.curItemData.subtitleSrc;
            _s.thumbPreviewSrc = _s.curItemData.thumbPreviewSrc;
            _s.thumbVastSrc = _s.curItemData.thumbVastSrc;
            
            _s.updateVideoTo = setTimeout(function(){
                _s.updateVideo();
            }, 100);
        }


        /**
         * Setup EVP.
         */
        _s.setupVideo = function(){
            if(!_d.useVideo) return;
            _s.vidHld_do = new FWDR3DCovDO3D("div");
            
            if(FWDR3DCovUtils.isMAC){
                _s.vidHld_do.setZ(100000008);
            }else{
                _s.vidHld_do.hasT3D = false;
                _s.vidHld_do.hasT2D = false;
            }

            
            _s.vidHld_do.screen.setAttribute('id', prt.instName + '_evp_div')
            _s.vidHld_do.setOverflow('visible');
            _s.vidHld_do.setWidth(_s.thumbWidth);
            _s.vidHld_do.setHeight(_s.thumbHeight);
            _s.addChild(_s.vidHld_do);

            FWDR3DCovSimpleButton.setPrototype(true);
            if(_d.useVectorIcons){
                _s.playBtnDO = new FWDR3DCovSimpleButton(0, 0,
                                "<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button fwdr3dcov-icon fwdr3dcov-icon-play'></span></div>",
                                 'EVPLargePlayButtonNormalState',
                                 'selected');
            
            }else{
                _s.playBtnDO = new FWDR3DCovSimpleButton(_s._d.largePlayNImg, _s._d.largePlaySPath);
            }

            if(FWDR3DCovUtils.isMAC){
                _s.playBtnDO.setZ(100000009);
            }
            
            _s.playBtnDO.addListener(FWDEVPSimpleButton.MOUSE_UP, _s.playBtnOnClick);
            _s.hidePlayButton(true);
            _s.playBtnDO.setX(-5000);
            _s.addChild(_s.playBtnDO);

            // Check if use has interacted with the viewport.
            window.addEventListener('touchstart', onClick, {passive: false});
            window.addEventListener('mousedown', onClick);

            function onClick(e){
                _s.clicked = true;
                window.removeEventListener('touchstart', onClick);
                window.removeEventListener('mousedown', onClick);
            }
        }

        _s.hidePlayButton = function(d){
            if(_s.playBtnDO) _s.playBtnDO.hide(d);
        }


        _s.playBtnOnClick = function(){
            _s.videoStarted = true;
            _s.positionVideo();
            _s.evp.largePlayButtonUpHandler();
        }

        _s.hideVideo = function(){  
            prt.preloaderDO.hide();
            _s.videoStarted = false;

            if(_s.curDataListAr[_s.curId]){
                _s.thumbVideoSrc = _s.curDataListAr[_s.curId].thumbVideoSrc;
            }

            if(!_s.curDataListAr[_s.curId] || !_d.useVideo){
                return;
            }
            
            clearTimeout(_s.updateVideoTo);
            _s.hidePassWindow();
            _s.hidePlayButton(true);
            _s.hieVideoOnFrstTween = false;
            _s.type = _s.curDataListAr[_s.curId].type;
            _s.showControllerWhenVideoIsStopped = _d.showControllerWhenVideoIsStopped;
            if(_s.evp){
                _s.evp.notShowPlayBtnExternal = true;
                _s.evp._d.autoPlay_bl = false;
                _s.evp.pause();
                if(!_s.thumbVideoSrc) _s.evp.goNormalScreen();
            } 

            _s.positionVideo(true);
        }

        _s.positionVideo = function(hide){
            if(!_d.useVideo) return;
            if(!_s.thumbVideoSrc || hide){
                _s.playBtnDO.setX(-5000);
                _s.vidHld_do.setX(-5000);
                return;
            }

            pos();
            setTimeout(function(){
                if(FWDAnimation.isTweening(_s.mainThumbDO)) return;
                pos();
            }, 50);
            setTimeout(function(){
                if(FWDAnimation.isTweening(_s.mainThumbDO)) return;
                pos();
            }, 200);

            function pos(){
                var w = parseFloat(_s.mainThumbDO.getRect().width).toFixed(3);
                var h = parseFloat(_s.mainThumbDO.getRect().height).toFixed(3);

                _s.vidHld_do.setWidth(w - ((_s.borderSize * _s.scale) * 2) +1);
                var w2 = parseFloat(_s.vidHld_do.getRect().width).toFixed(3);
                var w3 = parseFloat(w).toFixed(3);
                if(w3 < w2){
                    w += 1;
                }
                _s.vidHld_do.setWidth(Math.round(w - ((_s.borderSize * _s.scale) * 2)));
                _s.vidHld_do.setHeight(h - ((_s.borderSize * _s.scale) * 2));
                var h2 = parseFloat(_s.vidHld_do.getRect().height).toFixed(3);
                var h3 = parseFloat(h).toFixed(3);
                if(h3 < h2){
                    h += 1;
                }

                _s.centerThumbW = w;
                _s.centerThumbH = h;
                _s.vidHld_do.setHeight(Math.round(h - ((_s.borderSize * _s.scale) * 2)) +1);


                _s.centerThumbX = (_s.mainThumbDO.getRect().x || _s.mainThumbDO.getRect().left) - prt.mainDO.getGlobalX();
                _s.centerThumbY = (_s.mainThumbDO.getRect().y || _s.mainThumbDO.getRect().top) - prt.mainDO.getGlobalY();
                if(_s.videoStarted){
                    _s.vidHld_do.setX(Math.round(_s.centerThumbX + _s.borderSize * _s.scale));
                    _s.vidHld_do.setY(Math.round(_s.centerThumbY + _s.borderSize * _s.scale));
                }else{
                    _s.vidHld_do.setX(-5000);
                }

                if(_s.isEvpFS){
                    _s.playBtnDO.setX(Math.round((prt.vwSize.w - _s.playBtnDO.w)/2));
                    _s.playBtnDO.setY(Math.round((prt.vwSize.h - _s.playBtnDO.w)/2));
                }else{
                    _s.playBtnDO.setX(Math.round(_s.centerThumbX + (_s.vidHld_do.w - _s.playBtnDO.w)/2));
                    _s.playBtnDO.setY(Math.round(_s.centerThumbY + (_s.vidHld_do.h - _s.playBtnDO.h)/2));
                }
            }
        }

        _s.updateVideo = function(){
            if(!_d.useVideo && _s.thumbVideoSrc){
                _s.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text : 'Please set use video to yes to play video/audio in the coverflow thumbnails.'});
                return;
            }
        
            if(!_d.useVideo || !_s.thumbVideoSrc) return;

            if(!_s.evpInst){
                _s.isLoading = true;
                _s.evpInst = true;
                FWDEVPUtils.hasTransform3d = FWDR3DCovUtils.hasTransform3d;
                FWDEVPUtils.hasTransform2d = FWDR3DCovUtils.hasTransform2d;

                var isPrivate = _s.password ? 'yes' : 'no';
                var spaceBetweenButtons = _d.useVectorIcons ? 8 : 12;
                var startSpaceBetweenButtons = _d.useVectorIcons ? 6 : 11;
                var pushBtns = _d.useVectorIcons ? 0 : 0;

                new FWDEVPlayer({       
                    // Main settings.
                    instanceName:prt.instName + '_evp',
                    parentId:prt.instName + '_evp_div',
                    fontIcon:'fwdr3dcov-icon',
                    mainFolderPath:_s._d.mainFolderPath + 'rl/content/evp/',
                    skinPath:'skin',
                    displayType:'afterparent',
                    playsinline:'yes',
                    fillEntireVideoScreen:_d.fillEntireVideoScreen ? 'yes' : 'no',
                    useVectorIcons: _d.useVectorIcons ? 'yes' : 'no',
                    privateVideoPassword:_s.password,
                    preloaderBackgroundColor: prt.preloaderBackgroundColor,
                    preloaderFillColor: prt.preloaderFillColor,
                    startAtVideoSource:0,
                    videoSource:[{source:_s.thumbVideoSrc, label:"small version", isPrivate:isPrivate}],
                    showErrorInfo:'no',
                    addKeyboardSupport:_d.addKeyboardSupport ? 'yes' : 'no',
                    autoPlay:_s.videoAutoPlay ? 'yes' : 'no',
                    autoPlayText:_d.videoAutoPlayText,
                    volume:_s.volume,
                    backgroundColor:'#000000',
                    // Logo.
                    showLogo:_d.showLogo ? 'yes' : 'no',
                    logoPath:_d.logoPath,
                    hideLogoWithController:'yes',
                    logoPosition:'topRight',
                    logoLink:_d.logoLink,
                    logoMargins:5,
                    // Controller.
                    pushBtns:pushBtns,
                    showControllerWhenVideoIsStopped:'no',
                    showDefaultControllerForVimeo:_d.showDefaultControllerForVimeo ? 'yes' : 'no',
                    showScrubberWhenControllerIsHidden:_d.showScrubberWhenControllerIsHidden ? 'yes' : 'no',
                    showVolumeButton:_d.showVolumeButton ? 'yes' : 'no',
                    showVolumeScrubber:_d.showVolumeButton ? 'yes' : 'no',
                    showTime:_d.showTime ? 'yes' : 'no',
                    showRewindButton:_d.showRewindButton ? 'yes' : 'no',
                    showShareButton:"no",
                    showEmbedButton:"no",
                    showQualityButton:_d.showQualityButton ? 'yes' : 'no',
                    showChromecastButton:_d.showChromecastButton ? 'yes' : 'no',
                    showFullScreenButton:_d.showFullScreenButton ? 'yes' : 'no',
                    showMainScrubberToolTipLabel:_d.showScrubberToolTipLabel ? 'yes' : 'no',
                    controllerHeight:42,
                    controllerHideDelay:3,
                    startSpaceBetweenButtons:startSpaceBetweenButtons,
                    spaceBetweenButtons:spaceBetweenButtons,
                    mainScrubberOffestTop:13,
                    scrubbersOffsetWidth:3,
                    timeOffsetLeftWidth:3,
                    timeOffsetRightWidth:2,
                    volumeScrubberWidth:70,
                    volumeScrubberOffsetRightWidth:0,
                    timeColor:_d.timeColor,
                    youtubeQualityButtonNormalColor:_d.youtubeQualityButtonNormalColor,
                    youtubeQualityButtonSelectedColor:_d.youtubeQualityButtonSelectedColor,
                    scrubbersToolTipLabelBackgroundColor:_d.scrubbersToolTipLabelBackgroundColor,
                    scrubbersToolTipLabelFontColor:_d.scrubbersToolTipLabelFontColor,
                    // Subtitles.
                    showSubtitleButton:'no',
                    startAtSubtitle:1,
                    subtitlesSource:[{subtitlePath:_s.subtitleSrc, subtileLabel:"test"}],
                    // Playback rate/speed.
                    showPlaybackRateButton:_d.showPlaybackRateButton ? 'yes' : 'no',
                    defaultPlaybackRate:'1', //0.25, 0.5, 1, 1.25, 1.5, 2
                    // Audio visualizer
                    audioVisualizerLinesColor:_d.audioVisualizerLinesColor,
                    audioVisualizerCircleColor:_d.audioVisualizerCircleColor,
                    // Thumbnails preview.
                    thumbnailsPreview:'auto',
                    thumbnailsPreviewWidth:_d.thumbnailsPreviewWidth,
                    thumbnailsPreviewBackgroundColor:_d.thumbnailsPreviewBackgroundColor,
                    thumbnailsPreviewBorderColor:_d.thumbnailsPreviewBorderColor,
                    thumbnailsPreviewLabelBackgroundColor:_d.thumbnailsPreviewLabelBackgroundColor,
                    thumbnailsPreviewLabelFontColor:_d.thumbnailsPreviewLabelFontColor,
                    // Ads.
                    vastSource:_s.thumbVastSrc,
                    openNewPageAtTheEndOfTheAds:'no',
                    adsButtonsPosition:'right',
                    skipToVideoText:_d.skipToVideoText,
                    skipToVideoButtonText:_d.skipToVideoButtonText,
                    adsTextNormalColor:'#B9B9B9',
                    adsTextSelectedColor:'#FFFFFF',
                    adsBorderNormalColor:'#2e2e2e',
                    adsBorderSelectedColor:'#FFFFFF',
                    // Context menu.
                    contextMenuType:'disabled',
                    // Password window.
                    embedWindowCloseButtonMargins:15,
                    borderColor:"#333333",
                    mainLabelsColor:"#FFFFFF",
                    secondaryLabelsColor:"#a1a1a1",
                    shareAndEmbedTextColor:"#5a5a5a",
                    inputBackgroundColor:"#000000",
                    inputColor:"#FFFFFF"
                });

                setTimeout(function(){
                    _s.evp._d.thumbnailsPreview = _s.thumbPreviewSrc;
                }, 200);

                // Register API.
                var api_it;
                registerAPI();
                function registerAPI(){
                    clearTimeout(api_it);
                    _s.evp = window[prt.instName + '_evp'];
                    _s.evp.notShowLargePlayButton_bl = true;
                    if(_s.evp){
                        _s.evp.addListener(FWDEVPlayer.READY, _s.evpReady);
                        _s.evp.addListener(FWDEVPlayer.FRAMEWORK_LOAD, _s.evpFrLoad);
                        _s.evp.addListener(FWDEVPlayer.FRAMEWORK_DONE, _s.evpFrDone);
                        _s.evp.addListener(FWDEVPlayer.SHOW_PLAY_BUTTON, _s.showLargePlayButton);
                        _s.evp.addListener(FWDEVPlayer.HIDE_PLAY_BUTTON, _s.hideLargePlayButton);
                        _s.evp.addListener(FWDEVPlayer.ERROR, _s.evpError);
                        _s.evp.addListener(FWDEVPlayer.HIDER_SHOW, _s.evpShowCursor);
                        _s.evp.addListener(FWDEVPlayer.SHOW_CURSOR, _s.evpShowCursor);
                        _s.evp.addListener(FWDEVPlayer.VOLUME_SET, _s.evpVolume);
                        _s.evp.addListener(FWDEVPlayer.STOP, _s.evpStop);
                        _s.evp.addListener(FWDEVPlayer.PAUSE, _s.evpPause);
                        _s.evp.addListener(FWDEVPlayer.PLAY, _s.evpPlay);
                        _s.evp.addListener(FWDEVPlayer.PLAY_START, _s.evpPlayStart);
                        _s.evp.addListener(FWDEVPlayer.PLAY_COMPLETE, _s.evpPlayComplete);
                        _s.evp.addListener(FWDEVPlayer.UPDATE, _s.evpUpdate);
                        _s.evp.addListener(FWDEVPlayer.GO_FULLSCREEN, _s.evpFS);
                        _s.evp.addListener(FWDEVPlayer.GO_NORMALSCREEN, _s.evpNS);
                    }else{
                        api_it = clearTimeout(api_it, 50);
                    }
                };

            }else{

                _s.evp.notShowPlayBtnExternal = false;
                _s.evp.controller_do.hide(false, true);
                _s.evp._d.showControllerWhenVideoIsStopped_bl = _s.showControllerWhenVideoIsStopped;
                _s.evp.controller_do.showControllerWhenVideoIsStopped_bl = _s.showControllerWhenVideoIsStopped;

                _s.evp.prevVideoSource_str = '';
                if(_d.addKeyboardSupport){
                    _s.evp.addKeyboardSupport();
                }else{
                    _s.evp.removeKeyboardSupport();
                }

                _s.evp._d.autoPlay_bl = _s.videoAutoPlay || _s.nextVideoAutoPlay;
                if(_s.clicked && !_s.nextVideoAutoPlay){
                    _s.evp._d.autoPlay_bl = false;
                }

                // Set subtitle.
                _s.evp._d.subtitles_ar[0]["source"] = _s.subtitleSrc;
                _s.evp._d.thumbnailsPreview = _s.thumbPreviewSrc || undefined;
                _s.evp.setVolume(_s.volume);

                // Set source.
                _s.evp._d.privateVideoPassword_str = _s.password;
                _s.evp.setVideoSource(_s.thumbVideoSrc, '', '','', _s.thumbVastSrc, Boolean(_s.password));

                if(_s.nextVideoAutoPlay){
                     _s.playAudio();
                     if(_s.type != FWDR3DCov.AUDIO){
                        _s.slideshowButtonDO.pause();
                        _s.videoStarted = true;
                     }
                }
            }
        }

        _s.evpReady = function(){
            _s.isLoading = false;
        }

        _s.evpFrLoad = function(){
            prt.showPreloader();
            _s.isLoading = true;
        }

        _s.evpFrDone = function(){
            _s.isLoading = false;
        }

        _s.showLargePlayButton =  function(){
            prt.preloaderDO.hide();
            if(!_s.videoStarted){
                _s.playBtnDO.show(.15); 
            }else{
                _s.playBtnDO.show();
            }
        }

        _s.hideLargePlayButton =  function(){
            _s.hidePlayButton(true);
        }


        _s.evpError = function(e){
            _s.isLoading = false;
            prt.preloaderDO.hide();
            _s.dispatchEvent(FWDR3DCovThumbsManager.LOAD_ERROR, {text:e.error});
        }

        _s.evpPlayStart = function(){
            _s.slideshowButtonDO.pause();
            prt.preloaderDO.hide();
            _s.evp.notShowLargePlayButton_bl = false;
            _s.videoStarted = true;
            _s.positionVideo();
        }

        _s.playAudio = function(){
            if(_s.evp && _s.type == FWDR3DCov.AUDIO && _s.clicked){
                if(FWDR3DCovUtils.isIOS && !_s.audioPlayed) return;
                _s.slideshowButtonDO.pause();
                _s.evp.play();
                _s.videoStarted = true;
            }
        }

        _s.evpVolume = function(e){
            if(!_s.isAnim && !_s.evp._d.autoPlay_bl){
                _s.volume = e.volume;
                if(_s.type == FWDR3DCov.YOUTUBE){
                    _s.youtubePlayed = true;
                }else if(_s.type == FWDR3DCov.VIDEO){
                    _s.videoPlayed = true;
                }else if(_s.type == FWDR3DCov.AUDIO){
                    _s.audioPlayed = true;
                }
            }
        }

        _s.evpPlay = function(){
            if(_s.isAnim){
                _s.evp.notShowPlayBtnExternal = true;
                _s.evp.pause();
                return;
            }
            
            if(_s.clicked){
                if((FWDR3DCovUtils.isMAC && (_s.type == FWDR3DCov.VIDEO && !_s.videoPlayed))){
                   // Do not change volume, MAC dose not allow it unless the media has played once / THANK YOU APPLE!!!
                   _s.evp.setupAPT();
                }else if((FWDR3DCovUtils.isIOS
                    && (_s.type == FWDR3DCov.VIDEO && !_s.videoPlayed 
                        || _s.type == FWDR3DCov.VIMEO && !_s.vimeoPlayed
                        || _s.type == FWDR3DCov.YOUTUBE && !_s.youtubePlayed))
                    || (_s.isMobile && !_s.videoPlayed)
                   ){
                   // Do not change volume, IOS dose not allow it unless the media has played once / THANK YOU APPLE!!!
                   _s.evp.setupAPT();
                }else{
                    setTimeout(function(){
                        _s.evp.setVolume(_s.volume, true);
                    }, 10);
                }
            }

            if(!FWDR3DCovUtils.isIOS){
                _s.audioPlayed = true;
                _s.videoPlayed = true;
            }
        };

        _s.evpPlayComplete = function(){
            _s.videoStarted = false;
            if(_s.nextVideoAutoPlay || !_s.slideshowButtonDO.isStopped){
                _s.curId += 1;
                if(_s.curId < 0){
                    _s.curId = _s.totalThumbs - 1;
                }else if(_s.curId > _s.totalThumbs - 1){
                    _s.curId = 0;
                }
                var type = _s.curDataListAr[_s.curId].type;
            
                if(type == FWDR3DCov.VIDEO
                || type == FWDR3DCov.YOUTUBE
                || type == FWDR3DCov.VIMEO
                || type == FWDR3DCov.AUDIO){
                    _s.goToThumb();
                }else if(!_s.slideshowButtonDO.isStopped){
                    _s.goToThumb();
                }
            }
        }

        _s.evpStop = function(){
            _s.videoStarted = false;
            _s.hidePlayButton();
            _s.positionVideo();
            if(_s.captionPosition == 'in' && !_s.isAnim){
                _s.hideCaption();
                _s.onThumbOutHandler(true, true);
            }
        }

        _s.evpPause = function(){
            _s.evp.showLargePlayButton(0);
        }

        _s.evpFS = function(){
            _s.so = FWDR3DCovUtils.getScrollOffsets();
            _s.fsX = _s.so.x;
            _s.fsY = _s.so.y;
            _s.isEvpFS = _s.isEvpFSDL = _s.isFullScreen = _s.evp.isFullScreen_bl;

            if(FWDR3DCovUtils.isMAC){
                _s.textHolderDO.setVisible(false);
                _s.textHolderDO.style().pointerEvents = 'none';
                _s.thumbsHolderDO.setAlpha(0);
                _s.thumbsHolderDO.style().pointerEvents = 'none';
            }

            if(!_s.evp.isPlaying_bl) _s.evp.showLargePlayButton(0);
            _s.slideshowButtonDO.pause();
            _s.evp.main_do.addChild(_s.playBtnDO);
            _s.updateEVPCursor(false);
            _s.positionVideo();
            _s.resizeHandler(false, true);
            prt.dispatchEvent(FWDR3DCov.GO_FULLSCREEN);
        };

        _s.evpNS = function(e){
            _s.so = FWDR3DCovUtils.getScrollOffsets();
            _s.isEvpFS = _s.evp.isFullScreen_bl;
            if(e){
                setTimeout(function(){
                    _s.isEvpFSDL = _s.evp.isFullScreen_bl;
                }, 200);
            }

            if(FWDR3DCovUtils.isMAC){
                _s.textHolderDO.setVisible(true);
                _s.textHolderDO.style().pointerEvents = 'auto';
                _s.thumbsHolderDO.setAlpha(1);
                _s.thumbsHolderDO.style().pointerEvents = 'auto';
            }

            _s.addChild(_s.playBtnDO);
            _s.updateEVPCursor();
            _s.resizeHandler(false, true);
            if(prt.menuDO) prt.menuDO.position();

            if(FWDR3DCovUtils.isMAC){
                setTimeout(function(){
                    _s.resizeHandler(false, true);
                    if(prt.menuDO) prt.menuDO.position();
                }, 800);
            }
            prt.dispatchEvent(FWDR3DCov.GO_NORMALSCREEN);
        };

        _s.evpShowCursor = function(){
            _s.updateEVPCursor();
        }

        _s.updateEVPCursor = function(c){
            if(_s.evp){
                if(_s.useDrag && !_s.isEvpFS && !_s.evp.isFullScreen_bl){
                    if(!c) c = _s.handC;
                    if(_s.evp.dClk_do) _s.evp.dClk_do.style().cursor = c;
                }else{
                    if(_s.evp.dClk_do) _s.evp.dClk_do.style().cursor = _s.defaultC;
                }
            }
        }

        _s.hidePassWindow = function(){
            if(_s.evp && _s.evp.passWindow_do){
                _s.evp.passWindow_do.hide(true);
            }
        }

        _s.evpUpdate = function(e){
            if(_s.videoStarted){
                _s.slideshowButtonDO.slp_do.drawFill(e.percent);
            }
        }


        /**
         * Setup controls.
         */
        _s.setupControls = function(){
            _s.controlsDO = new FWDR3DCovDO3D("div");
            _s.addChild(_s.controlsDO);
            
            _s.controlsDO.setZ(200000);
            
            _s.controlsWidth = _s._d.prevButtonNImg.width;  
            
            if (_s._d.enableMouseWheelScroll){
                _s.addMouseWheelSupport();
            }
            
            if (_s._d.addKeyboardSupport){
                _s.addKeyboardSupport();
            }

            _s.setupScrollbar();
            _s.setupPrevButton();
            _s.setupNextButton();
            _s.setupSlideshowButton();
            _s.setupBulletsNavigation();
            _s.setupLargeNextButton();
            _s.setupLargePrevButton();
            
            setTimeout(function(){
                _s.controlsHeight = _s.nextButtonDO.h;
                _s.controlsDO.setHeight(_s.controlsHeight);
                _s.resizeHandler();
            }, 10);
            
        };
        
        _s.showControls = function(){
            _s.hideControls()
            _s.isControlsShowed = true;
            FWDAnimation.to(_s.controlsDO, .8, {alpha:1, y:_s.controlsY, ease : Expo.easeInOut});
        };

        _s.hideControls = function(anim){
            if(!_s.controlsDO) return;
            _s.isControlsShowed = false;
            var y = _s.controlsY + _s.controlsDO.h;
            if(_s.showBulletsNavigation){
                _s.controlsDO = _s.bulletsNavigationDO;
                y = _s.controlsY;
            }
            FWDAnimation.killTweensOf(_s.controlsDO);
            if(anim){
                FWDAnimation.to(_s.controlsDO, .8, {alpha:0, y:y, ease:Expo.easeOut});
            }else{
                _s.controlsDO.setAlpha(0);
                _s.controlsDO.setY(y)
            }
        }
        
        _s.positionControls = function(anim){
            _s.controlsWidth = 0;
            var newX;
            if(_s.isControlsShowed){
                FWDAnimation.killTweensOf(_s.controlsDO);
                _s.controlsDO.setAlpha(1);
            }
            
            if(_s.showNextAndPrevButtons){
                _s.controlsWidth = _s.prevButtonDO.w + _s.nextButtonDO.w + _s.nextAndPrevButtonsOffsetX * 2;
            }else if(_s.showSlideshowButton){
                _s.controlsWidth = _s.slideshowButtonDO.w;
            }

            if(_s.showScrollbar){
                _s.scrollbarDO.resize(_s.stageWidth - _s.nextAndPrevButtonsOffsetX * 2, _s.controlsWidth);
                
                if(_s.showScrollbar && _s.scrollbarDO.trackWidth){
                    if(_s.showNextAndPrevButtons){
                        _s.scrollbarDO.setX(_s.prevButtonDO.w + _s.nextAndPrevButtonsOffsetX);
                    }
                    newX = _s.scrollbarDO.x + _s.scrollbarDO.getWidth() + _s.nextAndPrevButtonsOffsetX;
                }else{
                    newX = 0;
                }
            }else{
                _s.scrollbarDO.setX(-1000);
                if(_s.showNextAndPrevButtons){
                    newX = _s.nextButtonDO.w + _s.nextAndPrevButtonsOffsetX;
                }else{
                    newX = 0;
                }
            }

            if(_s.showNextAndPrevButtons){
                if(!_s.showScrollbar || !_s.scrollbarDO.trackWidth){
                    if(_s.showSlideshowButton){
                        _s.controlsWidth += _s.slideshowButtonDO.w ;
                    }
                    newX = _s.controlsWidth - _s.nextButtonDO.w;
                }
                _s.nextButtonDO.setX(newX);
            }else{
                _s.nextButtonDO.setX(-200);
                _s.prevButtonDO.setX(-200);
            }

            if (_d.showSlideshowButton){
                if(_s.showScrollbar && _s.scrollbarDO.trackWidth){
                    newX -= _s.slideshowButtonDO.w + _s.nextAndPrevButtonsOffsetX;
                }else if(!_s.showScrollbar || !_s.scrollbarDO.trackWidth){
                    newX = Math.round((_s.controlsWidth - _s.slideshowButtonDO.w)/2);
                }
                _s.slideshowButtonDO.setX(newX);
            }else{
                _s.slideshowButtonDO.setX(-200);
            }

            if(_s.showScrollbar){
                _s.controlsDO.setX(Math.floor((_s.stageWidth - (_s.controlsWidth + _s.scrollbarDO.getWidth()))/2));
                _s.controlsDO.setWidth(_s.controlsWidth + _s.scrollbarDO.getWidth());
            }else{
                _s.controlsDO.setX(Math.floor((_s.stageWidth - _s.controlsWidth)/2));
                _s.controlsDO.setWidth(_s.controlsWidth);
            }
            
            var y;
            if(_s.showBulletsNavigation){
                _s.bulletsNavigationDO.setX(Math.floor((_s.stageWidth - _s.bulletsNavigationDO.w)/2));
                _s.controlsDO.setWidth(_s.controlsDO.totalWidth);
                _s.controlsDO.setHeight(_s.controlsDO.totalHeight);
                _s.controlsDO = _s.bulletsNavigationDO;
                _s.controlsHeight = _s.bulletsNavigationDO.totalHeight;
                
                _s.controlsDO.setX(Math.floor((_s.stageWidth - _s.controlsDO.w)/2));
            }else{
                _s.bulletsNavigationDO.setX(-10000);
                
            }

            y = _s.stageHeight - _s.controlsHeight + _s.controlsOffset;
            if(_s.captionPosition == 'out'){
                y += prt.captionH;
            }
            y -= Math.round((prt.coverflowOffsetHeight - _s.controlsHeight - _s.borderSize)/2);
            if(_s.isEvpFS) y = -500;
            _s.controlsY = y;



            FWDAnimation.killTweensOf(_s.controlsDO);
            if(anim){
                FWDAnimation.to(_s.controlsDO, .8, {y:_s.controlsY, ease:Quint.easeOut});
            }else{
                _s.controlsDO.setY(_s.controlsY);
            }
        };

        
        /** 
          * Large next/prev butons.
          */
        _s.setupLargeNextButton = function(){
            FWDR3DCovSimpleButton.setPrototype();
            var cls = 'fwdr3dcov-button large';
            if(_d.isSkinWhite){
                cls = 'fwdr3dcov-button large white';
            }
            if(_d.useVectorIcons){
                _s.largeNextButtonDO = new FWDR3DCovSimpleButton(0, 0,
                                '<span class="fwdr3dcov-icon fwdr3dcov-icon-next"></span>',
                                 cls,
                                 'selected');
            }else{
                _s.largeNextButtonDO = new FWDR3DCovSimpleButton(_s._d.largeNextButton_img, _s._d.largeNextButtonSPath_str);
            }
            _s.largeNextButtonDO.screen.className = 'fwdr3dcov-large-next-button';
            _s.largeNextButtonDO.addListener(FWDR3DCovSimpleButton.CLICK, _s.nextButtonOnClickHandler);
            _s.largeNextButtonDO.setDisabledState();
            _s.largeNextButtonDO.setOverflow('visible');
            _s.largeNextButtonDO.n_do.setAlpha(0);
            _s.addChild(_s.largeNextButtonDO);
        };
        
        _s.setupLargePrevButton = function(){
            FWDR3DCovSimpleButton.setPrototype();
            var cls = 'fwdr3dcov-button large';
            if(_d.isSkinWhite){
                cls = 'fwdr3dcov-button large white';
            }
            if(_d.useVectorIcons){
                _s.largePrevButtonDO = new FWDR3DCovSimpleButton(0, 0,
                                '<span class="fwdr3dcov-icon fwdr3dcov-icon-prev"></span>',
                                 cls,
                                 'selected');
            }else{
                _s.largePrevButtonDO = new FWDR3DCovSimpleButton(_s._d.largePrevButton_img, _s._d.largePrevButtonSPath_str);
            }
            _s.largePrevButtonDO.screen.className = 'fwdr3dcov-large-prev-button';
            _s.largePrevButtonDO.addListener(FWDR3DCovSimpleButton.CLICK, _s.prevButtonOnClickHandler);
            _s.largePrevButtonDO.setDisabledState();
            _s.largePrevButtonDO.setOverflow('visible');
            _s.largePrevButtonDO.n_do.setAlpha(0);
            _s.addChild(_s.largePrevButtonDO);
        };
        
        _s.showLargeNextAndPrevButtons = function(animate){
            _s.areLargeNextAndPrevButtonsShowed = true;
            _s.largePrevButtonDO.n_do.setX(-_s.largePrevButtonDO.w);
            _s.largeNextButtonDO.n_do.setX(_s.largeNextButtonDO.w);
            FWDAnimation.to(_s.largePrevButtonDO.n_do, .8, {x:0, alpha:1,ease:Quint.easeOut});
            FWDAnimation.to(_s.largeNextButtonDO.n_do, .8, {x:0, alpha:1,ease:Quint.easeOut});
        };
        
        _s.hideLargeNextAndPrevButtons = function(){
            if(!_s.areLargeNextAndPrevButtonsShowed) return;
            _s.areLargeNextAndPrevButtonsShowed = false;
            _s.largePrevButtonDO.setDisabledState();
            _s.largeNextButtonDO.setDisabledState();
            FWDAnimation.to(_s.largePrevButtonDO.n_do, .8, {alpha:0, x:-_s.largePrevButtonDO.w, ease:Quint.easeOut});
            FWDAnimation.to(_s.largeNextButtonDO.n_do, .8, {alpha:0, x:_s.largeNextButtonDO.w, ease:Quint.easeOut});
        };
        
    
        _s.postionNextAndPrevLargeButtons = function(animate){
            if(_s.showLargeNextAndPrevButtons_bl){
            
                _s.pX = Math.round((_s.stageWidth  - _s.largeNextAndPrevButtonsMaxWidthPos)/2);
                _s.nX = Math.round((_s.stageWidth  + _s.largeNextAndPrevButtonsMaxWidthPos)/2) - _s.largeNextButtonDO.w;    

                if(_s.stageWidth > _s.largeNextAndPrevButtonsMaxWidthPos || !_s.largeNextAndPrevButtonsMaxWidthPos){
                    _s.largeNextButtonDO.setVisible(true);
                    _s.largePrevButtonDO.setVisible(true);
                }else{
                    _s.largeNextButtonDO.setVisible(false);
                    _s.largePrevButtonDO.setVisible(false);
                }
                
                _s.largePrevButtonDO.setX(_s.pX);
                _s.largeNextButtonDO.setX(_s.nX);
                
                
                _s.largeNextButtonDO.setY(parseInt((_s.stageHeight - _s.largeNextButtonDO.h)/2));
                _s.largePrevButtonDO.setY(parseInt((_s.stageHeight - _s.largePrevButtonDO.h)/2));
            }else{
                _s.largeNextButtonDO.setVisible(false);
                _s.largePrevButtonDO.setVisible(false);
            }
        };
        

        /**
          * Bulletes navigation.
          */
        _s.setupBulletsNavigation = function(){
        
            FWDR3DCovBulletsNavigation.setPrototype();
            _s.bulletsNavigationDO = new FWDR3DCovBulletsNavigation(_s._d, _s.totalThumbs, _s.curId);
            _s.bulletsNavigationDO.addListener(FWDR3DCovBulletsNavigation.BULLET_CLICK, _s.bulletNavigationClick);
            _s.addChild(_s.bulletsNavigationDO);
        };
        
        _s.bulletNavigationClick = function(e){
            if(_s.isLoading) return;
            if(_s.infiniteLoop){
                _s.curId += e.id;
                if (_s.curId < 0){
                    _s.curId = _s.totalThumbs + _s.curId;
                    
                }else if(_s.curId > _s.totalThumbs - 1){
                    _s.curId = _s.curId - _s.totalThumbs;
                }
            }else{
                _s.curId = e.id;
            }
            _s.goToThumb();
        };
        

        /**
         * Setup next and prev buttons.
         */
        _s.setupPrevButton = function(){

            FWDR3DCovSimpleButton.setPrototype();
            var cls = 'fwdr3dcov-button';
            if(_d.isSkinWhite){
                cls = 'fwdr3dcov-button white';
            }
            if(_d.useVectorIcons){
                _s.prevButtonDO = new FWDR3DCovSimpleButton(0, 0,
                                '<span class="fwdr3dcov-icon fwdr3dcov-icon-prev"></span>',
                                 cls,
                                 'selected');
            }else{
                _s.prevButtonDO = new FWDR3DCovSimpleButton(_s._d.prevButtonNImg, _s._d.prevButtonSPath);
            }
            _s.prevButtonDO.screen.className = 'fwdr3dcov-prev-button';
            _s.prevButtonDO.addListener(FWDR3DCovSimpleButton.CLICK, _s.prevButtonOnClickHandler);
            _s.controlsDO.addChild(_s.prevButtonDO);
        };
        
        _s.prevButtonOnClickHandler = function(){
            if(_s.isLoading) return;
            if (_s.infiniteLoop){
                if (_s.curId == 0){
                    _s.curId = _s.totalThumbs-1;
                }else{
                    _s.curId--;
                }
                
                _s.goToThumb();
            }else{
                if (_s.curId > 0){
                    _s.curId--;
                    _s.goToThumb();
                }
            }
        };
        
        _s.setupNextButton = function(){
            FWDR3DCovSimpleButton.setPrototype();
            var cls = 'fwdr3dcov-button';
            if(_d.isSkinWhite){
                cls = 'fwdr3dcov-button white';
            }
            if(_d.useVectorIcons){
                _s.nextButtonDO = new FWDR3DCovSimpleButton(0, 0,
                                '<span class="fwdr3dcov-icon fwdr3dcov-icon-next"></span>',
                                 cls,
                                 'selected');
            }else{
                _s.nextButtonDO = new FWDR3DCovSimpleButton(_s._d.nextButtonNImg, _s._d.nextButtonSPath);
            }
            
            _s.nextButtonDO.screen.className = 'fwdr3dcov-next-button';
            _s.nextButtonDO.addListener(FWDR3DCovSimpleButton.CLICK, _s.nextButtonOnClickHandler);
            _s.controlsDO.addChild(_s.nextButtonDO);
            
            _s.nextButtonDO.setX(_s.controlsWidth);
            _s.controlsWidth += _s.nextButtonDO.getWidth();
        };
        
        _s.nextButtonOnClickHandler = function(){
            if(_s.isLoading) return;
            if (_s.infiniteLoop){
                if (_s.curId == _s.totalThumbs-1){
                    _s.curId = 0;
                }else{
                    _s.curId++;
                }
                
                _s.goToThumb();
            }else{
                if (_s.curId < _s.totalThumbs-1){
                    _s.curId++;
                    _s.goToThumb();
                }
            }
        };
        

        /**
         * Setup slideshow button.
         */
        _s.setupSlideshowButton = function(){
            FWDR3DCovSlideshowButton.setPrototype();
            
            _s.slideshowButtonDO = new FWDR3DCovSlideshowButton(_s, _s._d);
            _s.slideshowButtonDO.screen.className = 'fwdr3dcov-slideshow-button';
            _s.slideshowButtonDO.addListener(FWDR3DCovSlideshowButton.PLAY_CLICK, _s.onSlideshowButtonPlayClickHandler);
            _s.slideshowButtonDO.addListener(FWDR3DCovSlideshowButton.PAUSE_CLICK, _s.onSlideshowButtonPauseClickHandler);
            _s.slideshowButtonDO.addListener(FWDR3DCovSlideshowButton.TIME, _s.onSlideshowButtonTime);
            _s.controlsDO.addChild(_s.slideshowButtonDO);
            
            _s.slideshowButtonDO.setX(_s.controlsWidth);
            if(!_s.showSlideshowButton) _s.slideshowButtonDO.setX(-5000);
            _s.controlsWidth += _s.slideshowButtonDO.getWidth();
            
            if (!_s.showSlideshowButton){
                _s.slideshowButtonDO.setVisible(false);
                _s.controlsWidth -= _s.slideshowButtonDO.getWidth();
            }
        };
        
        _s.onSlideshowButtonPlayClickHandler = function(){
            _s.isPlaying = true;
        };
        
        _s.onSlideshowButtonPauseClickHandler = function(){
            _s.isPlaying = false;
            clearTimeout(_s.slideshowTimeoutId);
        };
        
        _s.startSlideshow = function(){
            if (!_s.isPlaying){
                _s.isPlaying = true;
                
                _s.slideshowButtonDO.start();
                _s.slideshowButtonDO.onMouseOut();
            }
        };
        
        _s.stopSlideshow = function(){
            if (_s.isPlaying){
                _s.isPlaying = false;
                clearTimeout(_s.slideshowTimeoutId);
                
                _s.slideshowButtonDO.stop();
                _s.slideshowButtonDO.onMouseOut();
            }
        };
        
        _s.onSlideshowButtonTime = function(){
            if(_s.isLoading) return;
            if (_s.curId == _s.totalThumbs-1){
                _s.curId = 0;
            }else{
                _s.curId++;
            }
            
            _s.goToThumb();
        };
        
        _s.startTimeAgain = function(){
            _s.slideshowButtonDO.resume();
        };

        _s.setupScrollbar = function(){
            FWDR3DCovScrollbar.setPrototype();
            
            _s.scrollbarDO = new FWDR3DCovScrollbar(_s._d, _s.totalThumbs, _s.curId, _s);
            _s.scrollbarDO.addListener(FWDR3DCovScrollbar.MOVE, _s.onScrollbarMove);
            _s.controlsDO.addChild(_s.scrollbarDO);
            
            _s.controlsWidth += _s.scrollbarDO.getWidth();
        };
        
        _s.onScrollbarMove = function(e){
            _s.curId = e.id;
            _s.goToThumb();
        };
        

        /**
          * Mouse wheel support.
          */
        _s.addMouseWheelSupport = function(){
            _s.prt.mainDO.screen.addEventListener("mousewheel", _s.mouseWheelHandler);
            _s.prt.mainDO.screen.addEventListener('DOMMouseScroll', _s.mouseWheelHandler);
        };
        
        _s.mouseWheelHandler = function(e){
            if (!_s.introFinished || !_s.allowToSwitchCat || _s.isLoading)
                return;
                
            if (_s.showScrollbar && _s.scrollbarDO.isPressed)
                return;
            
            var dir = e.detail || e.wheelDelta; 
            
            if (e.wheelDelta)
                dir *= -1;
            
                if (_s.infiniteLoop){
                if (dir > 0){
                    if (_s.curId == _s.totalThumbs-1){
                        _s.curId = 0;
                    }else{
                        _s.curId++;
                    }
                }else if (dir < 0){
                    if (_s.curId == 0){
                        _s.curId = _s.totalThumbs-1;
                    }else{
                        _s.curId--;
                    }
                }
                
                _s.goToThumb();
            }else{
                if (dir > 0){
                    if (_s.curId < _s.totalThumbs-1){
                        _s.curId++;
                        _s.goToThumb();
                    }
                }else if (dir < 0){
                    if (_s.curId > 0){
                        _s.curId--;
                        _s.goToThumb();
                    }
                }
            }
            
            if (e.preventDefault){
                e.preventDefault();
            }else{
                return false;
            }
        };
        
        
        /**
         * Setup mobile drag.
         */
        _s.setupMobileDrag = function(){
            if(_s.totalThumbs <= 1) return;
            if(_s.hasPointerEvent){
                _s.prt.mainDO.screen.addEventListener("pointerdown", _s.mobileDragStartHandler);
            }else if(!_s.isMobile){
                _s.prt.mainDO.screen.addEventListener("mousedown", _s.mobileDragStartHandler);
            }else{
                _s.prt.mainDO.screen.addEventListener("touchstart", _s.mobileDragStartTest);
            }
        };
        
        _s.mobileDragStartTest = function(e){
            var vmc = FWDR3DCovUtils.getViewportMouseCoordinates(e);    
            
            _s.lastPressedX = vmc.screenX;
            _s.lastPressedY = vmc.screenY;
            
            _s.dragCurId = _s.curId;
            
            if(_s.isMobile){
                window.addEventListener("touchmove", _s.mobileDragMoveTest, {passive:false});
                window.addEventListener("touchend", _s.mobileDragEndTest);
            }       
        };
        
        _s.mobileDragMoveTest = function(e){
            if (e.touches.length != 1) return;
            
            _s.disableThumbClick = true;
            
            var vmc = FWDR3DCovUtils.getViewportMouseCoordinates(e);    
            _s.mouseX = vmc.screenX;
            _s.mouseY = vmc.screenY;
            
            var angle = Math.atan2(_s.mouseY - _s.lastPressedY, _s.mouseX - _s.lastPressedX);
            var posAngle = Math.abs(angle) * 180 / Math.PI;
            
            if ((posAngle > 120) || (posAngle < 60)){
                if(e.preventDefault) e.preventDefault();
                _s.mobileDragStartHandler(e);
            }

            _s.mobileDragEndTest();
        };
        
        _s.mobileDragEndTest = function(e){
            _s.disableThumbClick = false;
            window.removeEventListener("touchmove", _s.mobileDragMoveTest);
            window.removeEventListener("touchend", _s.mobileDragEndTest);
        };
        

        _s.mobileDragStartHandler = function(e){
            if(prt.menuDO && prt.menuDO.isShowed_bl || _s.isLoading)
                return;

            if (!_s.introFinished || !_s.allowToSwitchCat || _s.isLoading)
                return;

            var vmc = FWDR3DCovUtils.getViewportMouseCoordinates(e);
            _s.vmcX = vmc.screenX;
            _s.vmcY = vmc.screenY;      
            
            if(FWDR3DCovUtils.hitTest(_s.controlsDO.screen, _s.vmcX, _s.vmcY)
            || FWDR3DCovUtils.hitTest(_s.bulletsNavigationDO.screen, _s.vmcX, _s.vmcY)){
                return;
            }

            if(_s.evp && _s.evp.controller_do
            && (FWDR3DCovUtils.hitTest(_s.evp.controller_do.mainHolder_do.screen, vmc.screenX, vmc.screenY)
            || FWDR3DCovUtils.hitTest(_s.playBtnDO.screen, vmc.screenX, vmc.screenY)
            || (_s.evp.apt && FWDR3DCovUtils.hitTest(_s.evp.apt.screen, vmc.screenX, vmc.screenY)))
            || _s.isEvpFSDL){
                return;
            }
            
            _s.mouseX = _s.lastPressedX = vmc.screenX;  
            _s.lastDragNumber = 0;
            _s.dragCurId = _s.curId;

            if(_s.useDrag){
                _s.style().cursor = _s.grabC;
                prt.mainDO.style().cursor = _s.grabC;
                if(_s.captionPosition == 'in'){
                    _s.textHolderDO.style().cursor = _s.grabC;
                }
                _s.updateEVPCursor(_s.grabC);
            }
            

            if(_s.hasPointerEvent){
                window.addEventListener("pointerup", _s.mobileDragEndHandler);
                window.addEventListener("pointermove", _s.mobileDragMoveHandler);
            }else if(!_s.isMobile){
                window.addEventListener("mouseup", _s.mobileDragEndHandler);
                window.addEventListener("mousemove", _s.mobileDragMoveHandler);
            }else{
                window.addEventListener("touchend", _s.mobileDragEndHandler);
                window.addEventListener("touchmove", _s.mobileDragMoveHandler, {passive:false});
            }
        };
        
        _s.mobileDragMoveHandler = function(e){
            if(e.preventDefault) e.preventDefault();
            
            var vmc = FWDR3DCovUtils.getViewportMouseCoordinates(e);    
            if(Math.abs(_s.lastPressedX - vmc.screenX)){
                _s.disableThumbClick = true;
                _s.showDsb();
            }

            _s.mouseX = vmc.screenX;
            
            if (_s.infiniteLoop){
                _s.curDragNumber = parseInt((_s.mouseX - _s.lastPressedX) / 100);
                var sign = (_s.mouseX - _s.lastPressedX) > 0 ? "plus" : "minus";

                if(sign == "plus"){
                    if (_s.curId < 0){
                        _s.curId = _s.totalThumbs-1;
                    }else{
                        if(_s.lastDragNumber != _s.curDragNumber){
                            _s.curId --;    
                            _s.mouseX = _s.lastPressedX = vmc.screenX;
                        }
                    }
                }else if(sign == "minus"){
                    if (_s.curId > _s.totalThumbs-1){
                        _s.curId = 0;
                    }else{
                        if(_s.lastDragNumber != _s.curDragNumber){
                            _s.curId ++;
                            _s.mouseX = _s.lastPressedX = vmc.screenX;
                        }
                    }
                }
            }else{
                _s.curId = _s.dragCurId + Math.floor(-(_s.mouseX - _s.lastPressedX) / 100);
                if (_s.curId < 0){
                    _s.curId = 0;
                }else if (_s.curId > _s.totalThumbs-1){
                    _s.curId = _s.totalThumbs-1;
                }
            }
            _s.updateEVPCursor(_s.handC);

            if(_s.curId < 0 || _s.curId > _s.totalThumbs-1){
                return;
            }
            
            if (_s.curId != _s.prevCurId){
                _s.goToThumb();
            }
        };

        _s.mobileDragEndHandler = function(e){

            setTimeout(function(){
                _s.disableThumbClick = false;
                _s.hideDsb();
            }, 200);
            _s.lastDragNumber = 100;
    
            
            if(_s.useDrag && !_s.isMobile){
                _s.style().cursor = _s.handC;
                prt.mainDO.style().cursor = _s.handC;
                if(_s.captionPosition == 'in'){
                    _s.textHolderDO.style().cursor = _s.handC;
                }
            }
            
            if(_s.hasPointerEvent){
                window.removeEventListener("pointerup", _s.mobileDragEndHandler);
                window.removeEventListener("pointermove", _s.mobileDragMoveHandler);
            }else if(_s.isMobile){
                window.removeEventListener("touchend", _s.mobileDragEndHandler);
                window.removeEventListener("touchmove", _s.mobileDragMoveHandler);
            }else{
                window.removeEventListener("mouseup", _s.mobileDragEndHandler);
                window.removeEventListener("mousemove", _s.mobileDragMoveHandler);
            }
        };
        
        _s.removeMobileDrag = function(){
            if (_s.hasPointerEvent){
                _s.prt.mainDO.screen.removeEventListener("pointerdown", _s.mobileDragStartHandler);
                window.removeEventListener("pointerup", _s.mobileDragEndHandler);
                window.removeEventListener("pointermove", _s.mobileDragMoveHandler);
            }else if(!_s.isMobile){
                _s.prt.mainDO.screen.removeEventListener("mousedown", _s.mobileDragStartHandler);
                window.removeEventListener("mouseup", _s.mobileDragEndHandler);
                window.removeEventListener("mousemove", _s.mobileDragMoveHandler);
            }else if (window.addEventListener){
                _s.prt.mainDO.screen.removeEventListener("touchstart", _s.mobileDragStartTest);
                window.removeEventListener("touchmove", _s.mobileDragMoveTest);
                window.removeEventListener("touchmove", _s.mobileDragMoveHandler);
                window.removeEventListener("touchend", _s.mobileDragEndTest);
            }
        };
        
        /**
         * Keyboard support.
         */
        _s.addKeyboardSupport = function(){
            document.addEventListener("keydown",  _s.onKeyDownHandler); 
            document.addEventListener("keyup",  _s.onKeyUpHandler); 
        };
        
        _s.onKeyDownHandler = function(e){
            if (!_s.introFinished || !_s.allowToSwitchCat || _s.isLoading || FWDR3DCov.rlShowed)
                return;
                
            if (_s.showScrollbar && _s.scrollbarDO.isPressed)
                return;
                
            if (prt.lightboxDO && prt.lightboxDO.isShowed_bl)
                return;

            if(_s.evp && _s.evp.isPlaying_bl || _s.isEvpFS) return;

            if((prt.stageContainer.getBoundingClientRect().top + prt.stageHeight) < 0) return;
        
            document.removeEventListener("keydown",  _s.onKeyDownHandler);
            
            if (e.keyCode == 39){   
                if (_s.infiniteLoop){
                    if (_s.curId == _s.totalThumbs-1){
                        _s.curId = 0;
                    }else{
                        _s.curId++;
                    }
                    
                    _s.goToThumb();
                }else{
                    if (_s.curId < _s.totalThumbs-1){
                        _s.curId++;
                        _s.goToThumb();
                    }
                }
                
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    return false;
                }
            }else if (e.keyCode == 37){
                if (_s.infiniteLoop){
                    if (_s.curId == 0){
                        _s.curId = _s.totalThumbs-1;
                    }else{
                        _s.curId--;
                    }
                    
                    _s.goToThumb();
                }else{
                    if (_s.curId > 0){
                        _s.curId--;
                        _s.goToThumb();
                    }
                }
                
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    return false;
                }
            }
        };
        
        _s.onKeyUpHandler = function(e){
            document.addEventListener("keydown",  _s.onKeyDownHandler); 
        };
        
        _s.update = function(e){
             _s.updated = true;

            var val = e.nrSideThumbs;
            
            if(val == 0){
                _s.nrThumbsToDisplay = 4;
            }else if(val == 1){
                _s.nrThumbsToDisplay = 3;
            }else if(val == 2){
                _s.nrThumbsToDisplay = 2;
            }else if(val == 3){
                _s.nrThumbsToDisplay = 0;
            }

            if(_s.nrThumbsToDisplay == 0){
                _s.infiniteLoop = false;
            }else{
                _s.infiniteLoop = e.infiniteLoop;
            }

            _s.reflDist = e.reflDist;
            _s.showRefl = e.showRefl;

            for (var i=0; i<_s.totalThumbs; i++){
                _s.thumbsAr[i].update();
            }

            _s.thumbXOffset3D = e.thumbnailXOffset3D;
            _s.thumbXSpace3D = e.thumbnailXSpace3D;
            _s.thumbYAngle3D = e.thumbnailYAngle3D;
            _s.thumbZOffset3D = e.thumbnailZOffset3D;
            _s.thumbZSpace3D = e.thumbnailZSpace3D;
          
            _s.goToThumb();
        };
        
        _s.init();
    };


    /**
      * Prototype.
      */
    FWDR3DCovThumbsManager.setPrototype = function(){
        FWDR3DCovThumbsManager.prototype = new FWDR3DCovDO3D("div", "relative", "visible");
    };
    
    FWDR3DCovThumbsManager.THUMB_CLICK = "onThumbClick";
    FWDR3DCovThumbsManager.LOAD_ERROR = "onLoadError";
    FWDR3DCovThumbsManager.THUMBS_INTRO_FINISH = "onThumbsIntroFinish";
    FWDR3DCovThumbsManager.THUMB_CHANGE = "onThumbChange";

    window.FWDR3DCovThumbsManager = FWDR3DCovThumbsManager;

}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Timer manager.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
    
    var FWDR3DCovTimerManager = function(delay, autoplay){

        'use strict';
        
        var _s = this;
        var prototpype = FWDR3DCovTimerManager.prototype;
        
        _s.timeOutId;
        _s.delay = delay;
        _s.isStopped_bl = !autoplay;
        
        _s.stop = function(){
            clearTimeout(_s.timeOutId);
            _s.dispatchEvent(FWDR3DCovTimerManager.STOP);
        };
        
        _s.start = function(){
            if(!_s.isStopped_bl){
                _s.timeOutId = setTimeout(_s.onTimeHanlder, _s.delay);
                _s.dispatchEvent(FWDR3DCovTimerManager.START);
            }
        };
        
        _s.onTimeHanlder = function(){
            _s.dispatchEvent(FWDR3DCovTimerManager.TIME);
        };
    };

    FWDR3DCovTimerManager.setProtptype = function(){
        FWDR3DCovTimerManager.prototype = new FWDR3DCovEventDispatcher();
    };
    
    FWDR3DCovTimerManager.START = "start";
    FWDR3DCovTimerManager.STOP = "stop";
    FWDR3DCovTimerManager.TIME = "time";
    
    FWDR3DCovTimerManager.prototype = null;
    window.FWDR3DCovTimerManager = FWDR3DCovTimerManager;
    
}(window));/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Utils.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

    var FWDR3DCovUtils = function(){
        'use strict';
    };  
    
    FWDR3DCovUtils.dumy = document.createElement("div");
    
    /**
     * String.
     */
    FWDR3DCovUtils.trim = function(str){
        return str.replace(/\s/gi, "");
    };
    
    FWDR3DCovUtils.splitAndTrim = function(str, trim_bl){
        var array = str.split(",");
        var length = array.length;
        for(var i=0; i<length; i++){
            if(trim_bl) array[i] = FWDR3DCovUtils.trim(array[i]);
        };
        return array;
    };

    
    /**
     * Array.
     */
    FWDR3DCovUtils.indexOfArray = function(array, prop){
        var length = array.length;
        for(var i=0; i<length; i++){
            if(array[i] === prop) return i;
        };
        return -1;
    };
    
    FWDR3DCovUtils.randomizeArray = function(aArray) {
        var randomizedArray = [];
        var copyArray = aArray.concat();
            
        var length = copyArray.length;
        for(var i=0; i< length; i++) {
                var index = Math.floor(Math.random() * copyArray.length);
                randomizedArray.push(copyArray[index]);
                copyArray.splice(index,1);
            }
        return randomizedArray;
    };
    
    FWDR3DCovUtils.removeArrayDuplicates = function(arr, key){ 
        var newArr = [],
            origLen = arr.length,
            found,
            x, y;

        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if(arr[x][key] === newArr[y][key]) { 
                  found = true;
                  break;
                }
            }
            if(!found) newArr.push(arr[x]);    
        }
        return newArr;
    };
    

    /**
     * DOM.
     */
    FWDR3DCovUtils.prt = function (e, n){
        if(n === undefined) n = 1;
        while(n-- && e) e = e.parentNode;
        if(!e || e.nodeType !== 1) return null;
        return e;
    };
    
    FWDR3DCovUtils.sibling = function(e, n){
        while (e && n !== 0){
            if(n > 0){
                if(e.nextElementSibling){
                     e = e.nextElementSibling;   
                }else{
                    for(var e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
                }
                n--;
            }else{
                if(e.previousElementSibling){
                     e = e.previousElementSibling;   
                }else{
                    for(var e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
                }
                n++;
            }
        }
        return e;
    };
    
    FWDR3DCovUtils.getChildAt = function (e, n){
        var kids = FWDR3DCovUtils.getChildren(e);
        if(n < 0) n += kids.length;
        if(n < 0) return null;
        return kids[n];
    };
    
    FWDR3DCovUtils.getChildById = function(id){
        return document.getElementById(id) || undefined;
    };
    
    FWDR3DCovUtils.getChildren = function(e, allNodesTypes){
        var kids = [];
        for(var c = e.firstChild; c != null; c = c.nextSibling){
            if(allNodesTypes){
                kids.push(c);
            }else if(c.nodeType === 1){
                kids.push(c);
            }
        }
        return kids;
    };
    
    FWDR3DCovUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
        var kids = [];
        for(var c = e.firstChild; c != null; c = c.nextSibling){
            if(allNodesTypes && FWDR3DCovUtils.hasAttribute(c, attr)){
                kids.push(c);
            }else if(c.nodeType === 1 && FWDR3DCovUtils.hasAttribute(c, attr)){
                kids.push(c);
            }
        }
        return kids.length == 0 ? undefined : kids;
    };
    
    FWDR3DCovUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
        for(var c = e.firstChild; c != null; c = c.nextSibling){
            if(allNodesTypes && FWDR3DCovUtils.hasAttribute(c, attr)){
                return c;
            }else if(c.nodeType === 1 && FWDR3DCovUtils.hasAttribute(c, attr)){
                return c;
            }
        }
        return undefined;
    };
    
    FWDR3DCovUtils.getAttributeValue = function(e, attr){
        if(!FWDR3DCovUtils.hasAttribute(e, attr)) return undefined;
        return e.getAttribute(attr);    
    };
    
    FWDR3DCovUtils.hasAttribute = function(e, attr){
        if(e.hasAttribute){
            return e.hasAttribute(attr); 
        }else {
            var test = e.getAttribute(attr);
            return  test ? true : false;
        }
    };
    
    FWDR3DCovUtils.insertNodeAt = function(prt, child, n){
        var children = FWDR3DCovUtils.children(prt);
        if(n < 0 || n > children.length){
            throw new Error("invalid index!");
        }else {
            prt.insertBefore(child, children[n]);
        };
    };
    
    FWDR3DCovUtils.hasCanvas = function(){
        return Boolean(document.createElement("canvas"));
    };
    
    
    /**
     * DOM utils.
     */
    FWDR3DCovUtils.hitTest = function(target, x, y){
        var hit = false;
        if(!target) throw Error("Hit test target is null!");
        var rect = target.getBoundingClientRect();
        
        if(x >= rect.left && x <= rect.left +(rect.right - rect.left) && y >= rect.top && y <= rect.top + (rect.bottom - rect.top)) return true;
        return false;
    };
    
    FWDR3DCovUtils.getScrollOffsets = function(){
        //all browsers
        if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
        
        //ie7/ie8
        if(document.compatMode == "CSS1Compat"){
            return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
        }
    };
    
    FWDR3DCovUtils.getViewportSize = function(){
        if(FWDR3DCovUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
            return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
        }
        
        if(FWDR3DCovUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
        return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
    };
    
    FWDR3DCovUtils.getViewportMouseCoordinates = function(e){
        var offsets = FWDR3DCovUtils.getScrollOffsets();
        
        if(e.touches){
            return{
                screenX:e.touches[0] == undefined ? e.touches.pageX - offsets.x :e.touches[0].pageX - offsets.x,
                screenY:e.touches[0] == undefined ? e.touches.pageY - offsets.y :e.touches[0].pageY - offsets.y
            };
        }
        
        return{
            screenX: e.clientX == undefined ? e.pageX - offsets.x : e.clientX,
            screenY: e.clientY == undefined ? e.pageY - offsets.y : e.clientY
        };
    };
    
    
    /**
     * Browsers test.
     */
    FWDR3DCovUtils.hasPointerEvent = (function(){
        return Boolean(window.navigator.msPointerEnabled) || Boolean(window.navigator.pointerEnabled);
    }());
    
    FWDR3DCovUtils.isMobile = (function (){
        if((FWDR3DCovUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) || (FWDR3DCovUtils.hasPointerEvent && navigator.maxTouchPoints > 1)) return true;
        var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'kfsowi'];
        for(var i in agents) {
             if(String(navigator.userAgent).toLowerCase().indexOf(String(agents[i]).toLowerCase()) != -1) {
                return true;
            }
        }
        if(navigator.platform.toLowerCase() === 'macintel' && navigator.maxTouchPoints > 1 && !window.MSStream) return true;
        return false;
    }());
    
    FWDR3DCovUtils.isAndroid = (function(){
         return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
    }());
    
    FWDR3DCovUtils.isChrome = (function(){
        return navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
    }());
    
    FWDR3DCovUtils.isSafari = (function(){
        return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
    }());
    
    FWDR3DCovUtils.isOpera = (function(){
        return navigator.userAgent.toLowerCase().indexOf('opera') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
    }());
    
    FWDR3DCovUtils.isFirefox = (function(){
        return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
    }());
    
    FWDR3DCovUtils.isIE = (function(){
        var isIE = Boolean(navigator.userAgent.toLowerCase().indexOf('msie') != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf('edge') != -1);
        return Boolean(isIE || document.documentElement.msRequestFullscreen);
    }());
    
    FWDR3DCovUtils.isIE11 = (function(){
        return Boolean(!FWDR3DCovUtils.isIE && document.documentElement.msRequestFullscreen);
    }());
    
    FWDR3DCovUtils.isIEAndLessThen9 = (function(){
        return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
    }());
    
    FWDR3DCovUtils.isIEAndLessThen10 = (function(){
        return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 
        || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1
        || navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
    }());
    
    FWDR3DCovUtils.isIE7 = (function(){
        return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1;
    }());
    
    FWDR3DCovUtils.isIOS = (function(){
        return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
    }());
    
    FWDR3DCovUtils.isIphone = (function(){
        return navigator.userAgent.match(/(iPhone|iPod)/g);
    }());
    
    FWDR3DCovUtils.isMAC = (function(){
        return navigator.appVersion.toLowerCase().indexOf('macintosh') != -1;
    }());
    
    FWDR3DCovUtils.isLocal = (function(){
        return location.href.indexOf('file:') != -1;
    }());
    
    FWDR3DCovUtils.hasFullScreen = (function(){
        return FWDR3DCovUtils.dumy.requestFullScreen || FWDR3DCovUtils.dumy.mozRequestFullScreen || FWDR3DCovUtils.dumy.webkitRequestFullScreen || FWDR3DCovUtils.dumy.msieRequestFullScreen;
    }());
    
    FWDR3DCovUtils.isAndroidAndWebkit = (function(){
        return  (FWDR3DCovUtils.isOpera || FWDR3DCovUtils.isChrome) && FWDR3DCovUtils.isAndroid;
    }());
    
    function get3d(){
        var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
        var p;
        var position;
        while (p = properties.shift()) {
           if (typeof FWDR3DCovUtils.dumy.style[p] !== 'undefined') {
               FWDR3DCovUtils.dumy.style.position = "absolute";
               position = FWDR3DCovUtils.dumy.getBoundingClientRect().left;
               FWDR3DCovUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
               position = Math.abs(FWDR3DCovUtils.dumy.getBoundingClientRect().left - position);
               
               if(position > 100 && position < 900){
                   try{document.documentElement.removeChild(FWDR3DCovUtils.dumy);}catch(e){}
                   return true;
               }
           }
        }
        try{document.documentElement.removeChild(FWDR3DCovUtils.dumy);}catch(e){}
        return false;
    };
    
    function get2d(){
        var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
        var p;
        while (p = properties.shift()) {
           if (typeof FWDR3DCovUtils.dumy.style[p] !== 'undefined') {
               return true;
           }
        }
        try{document.documentElement.removeChild(FWDR3DCovUtils.dumy);}catch(e){}
        return false;
    };  
    
    
    /**
     * Various.
     */
    FWDR3DCovUtils.onReady =  function(callbalk){
        if (document.addEventListener) {
            document.addEventListener( "DOMContentLoaded", function(){
                callbalk();
            });
        }else{
            document.onreadystatechange = function () {
                if (document.readyState == "complete") callbalk();
            };
         }
    };
    
    FWDR3DCovUtils.checkIfHasTransofrms = function(){
        if(FWDR3DCovUtils.isReadyMethodCalled_bl) return;
        document.documentElement.appendChild(FWDR3DCovUtils.dumy);
        FWDR3DCovUtils.hasTransform3d = get3d();
        FWDR3DCovUtils.hasTransform2d = get2d();
        FWDR3DCovUtils.isReadyMethodCalled_bl = true;
    };
    
    FWDR3DCovUtils.disableElementSelection = function(e){
        try{e.style.userSelect = "none";}catch(e){};
        try{e.style.MozUserSelect = "none";}catch(e){};
        try{e.style.webkitUserSelect = "none";}catch(e){};
        try{e.style.khtmlUserSelect = "none";}catch(e){};
        try{e.style.oUserSelect = "none";}catch(e){};
        try{e.style.msUserSelect = "none";}catch(e){};
        try{e.msUserSelect = "none";}catch(e){};
        e.onselectstart = function(){return false;};
    };
    
    FWDR3DCovUtils.getSearchArgs = function(){
        var args = {};
        var query = location.href.substr(location.href.indexOf("?") + 1);
        
        var pairs = query.split("&");
        
        for(var i=0; i< pairs.length; i++){
            var pos = pairs[i].indexOf("=");
            var name = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[name] = value;
        }
        return args;
    };
    
    FWDR3DCovUtils.getHashArgs = function(string){
        var args = {};
        var query = string.substr(string.indexOf("#") + 1) || location.hash.substring(1);
        var pairs = query.split("&");
        for(var i=0; i< pairs.length; i++){
            var pos = pairs[i].indexOf("=");
            var name = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[name] = value;
        }
        return args;
    };

    FWDR3DCovUtils.getHashParam = function(param){
        var value = location.hash.substr(1);
        var index = value.indexOf("?");
        if (index != -1) {
            value = value.substr(index + 1);
            var p, params = value.split("&"),
                i = params.length,
                r = [];
            while (i--) {
                p = params[i].split("=");
                if (p[0] == param) {
                    r.push(p[1])
                }
            }

            if (r.length != 0) {
                return r.length != 1 ? r : r[0]
            }
        }

    };
    
    
    FWDR3DCovUtils.isReadyMethodCalled_bl = false;
    
    window.FWDR3DCovUtils = FWDR3DCovUtils;
}(window));// FWDAnimation classs for tweening not allowed to modify or use outside this plugin!
var _fwd_fwdScope;window.FWDAnimation||(((_fwd_fwdScope="undefined"!=typeof fwd_module&&fwd_module.exports&&"undefined"!=typeof fwd_global?fwd_global:this||window)._fwd_fwdQueue||(_fwd_fwdScope._fwd_fwdQueue=[])).push(function(){"use strict";function y(t,e,i,r){i===r&&(i=r-(r-e)/1e6),t===e&&(e=t+(i-t)/1e6),this.a=t,this.b=e,this.c=i,this.d=r,this.da=r-t,this.ca=i-t,this.ba=e-t}function w(t,e,i,r){var s={a:t},n={},a={},o={c:r},l=(t+e)/2,h=(e+i)/2,f=(i+r)/2,u=(l+h)/2,p=(h+f)/2,_=(p-u)/8;return s.b=l+(t-l)/4,n.b=u+_,s.c=n.a=(s.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-_,o.b=f+(r-f)/4,a.c=o.a=(a.b+o.b)/2,[s,n,a,o]}function _(t,e,i,r,s,n){var a,o,l,h,f,u,p,_,c={},d=[],m=n||t[0];for(o in s="string"==typeof s?","+s+",":",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",null==e&&(e=1),t[0])d.push(o);if(1<t.length){for(_=t[t.length-1],p=!0,a=d.length;-1<--a;)if(o=d[a],.05<Math.abs(m[o]-_[o])){p=!1;break}p&&(t=t.concat(),n&&t.unshift(n),t.push(t[1]),n=t[t.length-3])}for(T.length=P.length=O.length=0,a=d.length;-1<--a;)o=d[a],g[o]=-1!==s.indexOf(","+o+","),c[o]=function(t,e,i,r){var s,n,a,o,l,h,f=[];if(r)for(n=(t=[r].concat(t)).length;-1<--n;)"string"==typeof(h=t[n][e])&&"="===h.charAt(1)&&(t[n][e]=r[e]+Number(h.charAt(0)+h.substr(2)));if((s=t.length-2)<0)return f[0]=new y(t[0][e],0,0,t[s<-1?0:1][e]),f;for(n=0;n<s;n++)a=t[n][e],o=t[n+1][e],f[n]=new y(a,0,0,o),i&&(l=t[n+2][e],T[n]=(T[n]||0)+(o-a)*(o-a),P[n]=(P[n]||0)+(l-o)*(l-o));return f[n]=new y(t[n][e],0,0,t[n+1][e]),f}(t,o,g[o],n);for(a=T.length;-1<--a;)T[a]=Math.sqrt(T[a]),P[a]=Math.sqrt(P[a]);if(!r){for(a=d.length;-1<--a;)if(g[o])for(u=(l=c[d[a]]).length-1,h=0;h<u;h++)f=l[h+1].da/P[h]+l[h].da/T[h]||0,O[h]=(O[h]||0)+f*f;for(a=O.length;-1<--a;)O[a]=Math.sqrt(O[a])}for(a=d.length,h=i?4:1;-1<--a;)(function(t,e,i,r,s){for(var n,a,o,l,h,f,u,p,_,c,d,m,g=t.length-1,y=0,v=t[0].a,x=0;x<g;x++)n=(l=t[y]).a,a=l.d,o=t[y+1].d,u=s?(c=T[x],m=((d=P[x])+c)*e*.25/(!r&&O[x]||.5),a-((h=a-(a-n)*(r?.5*e:0!==c?m/c:0))+(((f=a+(o-a)*(r?.5*e:0!==d?m/d:0))-h)*(3*c/(c+d)+.5)/4||0))):a-((h=a-(a-n)*e*.5)+(f=a+(o-a)*e*.5))/2,h+=u,f+=u,l.c=p=h,l.b=0!==x?v:v=l.a+.6*(l.c-l.a),l.da=a-n,l.ca=p-n,l.ba=v-n,i?(_=w(n,v,p,a),t.splice(y,1,_[0],_[1],_[2],_[3]),y+=4):y++,v=f;(l=t[y]).b=v,l.c=v+.4*(l.d-v),l.da=l.d-l.a,l.ca=l.c-l.a,l.ba=v-l.a,i&&(_=w(l.a,v,l.c,l.d),t.splice(y,1,_[0],_[1],_[2],_[3]))})(l=c[o=d[a]],e,i,r,g[o]),p&&(l.splice(0,h),l.splice(l.length-h,h));return c}var b,T,P,O,g,i,m,t;_fwd_fwdScope.FWDFWD_fwdDefine("FWDAnimation",["core.FWDAnimation","core.FWDSimpleTimeline","FWDTweenLite"],function(m,f,g){function y(t){for(var e=[],i=t.length,r=0;r!==i;e.push(t[r++]));return e}function v(t,e,i){var r,s,n=t.cycle;for(r in n)s=n[r],t[r]="function"==typeof s?s(i,e[i]):s[i%s.length];delete t.cycle}var m=function(t,e,i){g.call(this,t,e,i),this._cycle=0,this._yoyo=!0===this.vars.yoyo,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=m.prototype.render},x=1e-10,w=g._internals,T=w.isSelector,b=w.isArray,t=m.prototype=g.to({},.1,{}),P=[];m.version="1.19.0",t.constructor=m,t.kill()._gc=!1,m.killTweensOf=m.killDelayedCallsTo=g.killTweensOf,m.getTweensOf=g.getTweensOf,m.lagSmoothing=g.lagSmoothing,m.ticker=g.ticker,m.render=g.render,t.invalidate=function(){return this._yoyo=!0===this.vars.yoyo,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),g.prototype.invalidate.call(this)},t.updateTo=function(t,e){var i,r=this.ratio,s=this.vars.immediateRender||t.immediateRender;for(i in e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay)),t)this.vars[i]=t[i];if(this._initted||s)if(e)this._initted=!1,s&&this.render(0,!0,!0);else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&g._onPluginEvent("_onDisable",this),.998<this._time/this._duration){var n=this._totalTime;this.render(0,!0,!1),this._initted=!1,this.render(n,!0,!1)}else if(this._initted=!1,this._init(),0<this._time||s)for(var a,o=1/(1-r),l=this._firstPT;l;)a=l.s+l.c,l.c*=o,l.s=a-l.c,l=l._next;return this},t.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var r,s,n,a,o,l,h,f,u,p=this._dirty?this.totalDuration():this._totalDuration,_=this._time,c=this._totalTime,d=this._cycle,m=this._duration,g=this._rawPrevTime;if(p-1e-7<=t?(this._totalTime=p,this._cycle=this._repeat,this._yoyo&&0!=(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=m,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(r=!0,s="onComplete",i=i||this._timeline.autoRemoveChildren),0===m&&(!this._initted&&this.vars.lazy&&!i||(this._startTime===this._timeline._duration&&(t=0),(g<0||t<=0&&-1e-7<=t||g===x&&"isPause"!==this.data)&&g!==t&&(i=!0,x<g&&(s="onReverseComplete")),this._rawPrevTime=f=!e||t||g===t?t:x))):t<1e-7?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==c||0===m&&0<g)&&(s="onReverseComplete",r=this._reversed),t<0&&(this._active=!1,0===m&&(!this._initted&&this.vars.lazy&&!i||(0<=g&&(i=!0),this._rawPrevTime=f=!e||t||g===t?t:x))),this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(a=m+this._repeatDelay,this._cycle=this._totalTime/a>>0,0!==this._cycle&&this._cycle===this._totalTime/a&&c<=t&&this._cycle--,this._time=this._totalTime-this._cycle*a,this._yoyo&&0!=(1&this._cycle)&&(this._time=m-this._time),this._time>m?this._time=m:this._time<0&&(this._time=0)),this._easeType?(o=this._time/m,(1===(l=this._easeType)||3===l&&.5<=o)&&(o=1-o),3===l&&(o*=2),1===(h=this._easePower)?o*=o:2===h?o*=o*o:3===h?o*=o*o*o:4===h&&(o*=o*o*o*o),1===l?this.ratio=1-o:2===l?this.ratio=o:this._time/m<.5?this.ratio=o/2:this.ratio=1-o/2):this.ratio=this._ease.getRatio(this._time/m)),_!==this._time||i||d!==this._cycle){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration))return this._time=_,this._totalTime=c,this._rawPrevTime=g,this._cycle=d,w.lazyTweens.push(this),void(this._lazy=[t,e]);this._time&&!r?this.ratio=this._ease.getRatio(this._time/m):r&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(!1!==this._lazy&&(this._lazy=!1),this._active||!this._paused&&this._time!==_&&0<=t&&(this._active=!0),0===c&&(2===this._initted&&0<t&&this._init(),this._startAt&&(0<=t?this._startAt.render(t,e,i):s=s||"_dummyGS"),this.vars.onStart&&(0===this._totalTime&&0!==m||e||this._callback("onStart"))),n=this._firstPT;n;){n.f?n.t[n.p](n.c*this.ratio+n.s):(u=n.c*this.ratio+n.s,"x"==n.p?n.t.setX(u):"y"==n.p?n.t.setY(u):"z"==n.p?n.t.setZ(u):"angleX"==n.p?n.t.setAngleX(u):"angleY"==n.p?n.t.setAngleY(u):"angleZ"==n.p?n.t.setAngleZ(u):"w"==n.p?n.t.setWidth(u):"h"==n.p?n.t.setHeight(u):"alpha"==n.p?n.t.setAlpha(u):"scale"==n.p?n.t.setScale2(u):n.t[n.p]=u),n=n._next}this._onUpdate&&(t<0&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||this._totalTime===c&&!s||this._callback("onUpdate")),this._cycle!==d&&(e||this._gc||this.vars.onRepeat&&this._callback("onRepeat")),s&&(this._gc&&!i||(t<0&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),r&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[s]&&this._callback(s),0===m&&this._rawPrevTime===x&&f!==x&&(this._rawPrevTime=0)))}else c!==this._totalTime&&this._onUpdate&&(e||this._callback("onUpdate"))},m.to=function(t,e,i){return new m(t,e,i)},m.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new m(t,e,i)},m.fromTo=function(t,e,i,r){return r.startAt=i,r.immediateRender=0!=r.immediateRender&&0!=i.immediateRender,new m(t,e,r)},m.staggerTo=m.allTo=function(t,e,i,r,s,n,a){r=r||0;function o(){i.onComplete&&i.onComplete.apply(i.onCompleteScope||this,arguments),s.apply(a||i.callbackScope||this,n||P)}var l,h,f,u,p=0,_=[],c=i.cycle,d=i.startAt&&i.startAt.cycle;for(b(t)||("string"==typeof t&&(t=g.selector(t)||t),T(t)&&(t=y(t))),t=t||[],r<0&&((t=y(t)).reverse(),r*=-1),l=t.length-1,f=0;f<=l;f++){for(u in h={},i)h[u]=i[u];if(c&&(v(h,t,f),null!=h.duration&&(e=h.duration,delete h.duration)),d){for(u in d=h.startAt={},i.startAt)d[u]=i.startAt[u];v(h.startAt,t,f)}h.delay=p+(h.delay||0),f===l&&s&&(h.onComplete=o),_[f]=new m(t[f],e,h),p+=r}return _},m.staggerFrom=m.allFrom=function(t,e,i,r,s,n,a){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,m.staggerTo(t,e,i,r,s,n,a)},m.staggerFromTo=m.allFromTo=function(t,e,i,r,s,n,a,o){return r.startAt=i,r.immediateRender=0!=r.immediateRender&&0!=i.immediateRender,m.staggerTo(t,e,r,s,n,a,o)},m.delayedCall=function(t,e,i,r,s){return new m(e,0,{delay:t,onComplete:e,onCompleteParams:i,callbackScope:r,onReverseComplete:e,onReverseCompleteParams:i,immediateRender:!1,useFrames:s,overwrite:0})},m.set=function(t,e){return new m(t,0,e)},m.isTweening=function(t){return 0<g.getTweensOf(t,!0).length};var n=function(t,e){for(var i=[],r=0,s=t._first;s;)s instanceof g?i[r++]=s:(e&&(i[r++]=s),r=(i=i.concat(n(s,e))).length),s=s._next;return i},u=m.getAllTweens=function(t){return n(m._rootTimeline,t).concat(n(m._rootFramesTimeline,t))};m.killAll=function(t,e,i,r){null==e&&(e=!0),null==i&&(i=!0);for(var s,n,a=u(0!=r),o=a.length,l=e&&i&&r,h=0;h<o;h++)n=a[h],(l||n instanceof f||(s=n.target===n.vars.onComplete)&&i||e&&!s)&&(t?n.totalTime(n._reversed?0:n.totalDuration()):n._enabled(!1,!1))},m.killChildTweensOf=function(t,e){if(null!=t){var i,r,s,n,a,o=w.tweenLookup;if("string"==typeof t&&(t=g.selector(t)||t),T(t)&&(t=y(t)),b(t))for(n=t.length;-1<--n;)m.killChildTweensOf(t[n],e);else{for(s in i=[],o)for(r=o[s].target.parentNode;r;)r===t&&(i=i.concat(o[s].tweens)),r=r.parentNode;for(a=i.length,n=0;n<a;n++)e&&i[n].totalTime(i[n].totalDuration()),i[n]._enabled(!1,!1)}}};function r(t,e,i,r){e=!1!==e,i=!1!==i;for(var s,n,a=u(r=!1!==r),o=e&&i&&r,l=a.length;-1<--l;)n=a[l],(o||n instanceof f||(s=n.target===n.vars.onComplete)&&i||e&&!s)&&n.paused(t)}return m.pauseAll=function(t,e,i){r(!0,t,e,i)},m.resumeAll=function(t,e,i){r(!1,t,e,i)},m.globalTimeScale=function(t){var e=m._rootTimeline,i=g.ticker.time;return arguments.length?(t=t||x,e._startTime=i-(i-e._startTime)*e._timeScale/t,e=m._rootFramesTimeline,i=g.ticker.frame,e._startTime=i-(i-e._startTime)*e._timeScale/t,e._timeScale=m._rootTimeline._timeScale=t):e._timeScale},t.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!=(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()},t.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},t.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!=(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},t.duration=function(t){return arguments.length?m.prototype.duration.call(this,t):this._duration},t.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},t.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},t.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},t.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},m},!0),b=180/Math.PI,T=[],P=[],O=[],g={},i=_fwd_fwdScope.FWDFWD_fwdDefine.globals,m=_fwd_fwdScope.FWDFWD_fwdDefine.plugin({propName:"bezier",priority:-1,version:"1.3.7",API:2,fwd_global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._mod={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var r,s,n,a,o,l,h=e.values||[],f={},u=h[0],p=e.autoRotate||i.vars.orientToBezier;for(r in this._autoRotate=p?p instanceof Array?p:[["x","y","rotation",!0!==p&&Number(p)||0]]:null,u)this._props.push(r);for(n=this._props.length;-1<--n;)r=this._props[n],this._overwriteProps.push(r),s=this._func[r]="function"==typeof t[r],f[r]=s?t[r.indexOf("set")||"function"!=typeof t["get"+r.substr(3)]?r:"get"+r.substr(3)]():parseFloat(t[r]),o||f[r]!==h[0][r]&&(o=f);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?_(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):function(t,e,i){var r,s,n,a,o,l,h,f,u,p,_,c={},d="cubic"===(e=e||"soft")?3:2,m="soft"===e,g=[];if(m&&i&&(t=[i].concat(t)),null==t||t.length<1+d)throw"invalid Bezier data";for(u in t[0])g.push(u);for(l=g.length;-1<--l;){for(c[u=g[l]]=o=[],p=0,f=t.length,h=0;h<f;h++)r=null==i?t[h][u]:"string"==typeof(_=t[h][u])&&"="===_.charAt(1)?i[u]+Number(_.charAt(0)+_.substr(2)):Number(_),m&&1<h&&h<f-1&&(o[p++]=(r+o[p-2])/2),o[p++]=r;for(f=p-d+1,h=p=0;h<f;h+=d)r=o[h],s=o[h+1],n=o[h+2],a=2==d?0:o[h+3],o[p++]=_=3==d?new y(r,s,n,a):new y(r,(2*s+r)/3,(2*s+n)/3,n);o.length=p}return c}(h,e.type,f),this._segCount=this._beziers[r].length,this._timeRes&&(l=function(t,e){var i,r,s,n,a=[],o=[],l=0,h=0,f=(e=e>>0||6)-1,u=[],p=[];for(i in t)!function(t,e,i){for(var r,s,n,a,o,l,h,f,u,p,_,c=1/i,d=t.length;-1<--d;)for(n=(p=t[d]).a,a=p.d-n,o=p.c-n,l=p.b-n,r=s=0,f=1;f<=i;f++)r=s-(s=((h=c*f)*h*a+3*(u=1-h)*(h*o+u*l))*h),e[_=d*i+f-1]=(e[_]||0)+r*r}(t[i],a,e);for(s=a.length,r=0;r<s;r++)l+=Math.sqrt(a[r]),p[n=r%e]=l,n===f&&(h+=l,u[n=r/e>>0]=p,o[n]=h,l=0,p=[]);return{length:h,lengths:o,segments:u}}(this._beziers,this._timeRes),this._length=l.length,this._lengths=l.lengths,this._segments=l.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length),p=this._autoRotate)for(this._initialRotations=[],p[0]instanceof Array||(this._autoRotate=p=[p]),n=p.length;-1<--n;){for(a=0;a<3;a++)r=p[n][a],this._func[r]="function"==typeof t[r]&&t[r.indexOf("set")||"function"!=typeof t["get"+r.substr(3)]?r:"get"+r.substr(3)];r=p[n][2],this._initialRotations[n]=(this._func[r]?this._func[r].call(this._target):this._target[r])||0,this._overwriteProps.push(r)}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(t){var e,i,r,s,n,a,o,l,h,f=this._segCount,u=this._func,p=this._target,_=t!==this._startRatio;if(this._timeRes){if(l=this._lengths,h=this._curSeg,t*=this._length,T=this._li,t>this._l2&&T<f-1){for(o=f-1;T<o&&(this._l2=l[++T])<=t;);this._l1=l[T-1],this._li=T,this._curSeg=h=this._segments[T],this._s2=h[this._s1=this._si=0]}else if(t<this._l1&&0<T){for(;0<T&&(this._l1=l[--T])>=t;);0===T&&t<this._l1?this._l1=0:T++,this._l2=l[T],this._li=T,this._curSeg=h=this._segments[T],this._s1=h[(this._si=h.length-1)-1]||0,this._s2=h[this._si]}if(e=T,t-=this._l1,T=this._si,t>this._s2&&T<h.length-1){for(o=h.length-1;T<o&&(this._s2=h[++T])<=t;);this._s1=h[T-1],this._si=T}else if(t<this._s1&&0<T){for(;0<T&&(this._s1=h[--T])>=t;);0===T&&t<this._s1?this._s1=0:T++,this._s2=h[T],this._si=T}n=(T+(t-this._s1)/(this._s2-this._s1))*this._prec||0}else n=(t-(e=t<0?0:1<=t?f-1:f*t>>0)*(1/f))*f;for(i=1-n,T=this._props.length;-1<--T;)r=this._props[T],a=(n*n*(s=this._beziers[r][e]).da+3*i*(n*s.ca+i*s.ba))*n+s.a,this._mod[r]&&(a=this._mod[r](a,p)),u[r]?p[r](a):"x"==r?p.setX(a):"y"==r?p.setY(a):"z"==r?p.setZ(a):"angleX"==r?p.setAngleX(a):"angleY"==r?p.setAngleY(a):"angleZ"==r?p.setAngleZ(a):"w"==r?p.setWidth(a):"h"==r?p.setHeight(a):"alpha"==r?p.setAlpha(a):"scale"==r?p.setScale2(a):p[r]=a;if(this._autoRotate)for(var c,d,m,g,y,v,x,w=this._autoRotate,T=w.length;-1<--T;)r=w[T][2],v=w[T][3]||0,x=!0===w[T][4]?1:b,s=this._beziers[w[T][0]],c=this._beziers[w[T][1]],s&&c&&(s=s[e],c=c[e],d=s.a+(s.b-s.a)*n,d+=((g=s.b+(s.c-s.b)*n)-d)*n,g+=(s.c+(s.d-s.c)*n-g)*n,m=c.a+(c.b-c.a)*n,m+=((y=c.b+(c.c-c.b)*n)-m)*n,y+=(c.c+(c.d-c.c)*n-y)*n,a=_?Math.atan2(y-m,g-d)*x+v:this._initialRotations[T],this._mod[r]&&(a=this._mod[r](a,p)),u[r]?p[r](a):p[r]=a)}}),t=m.prototype,m.bezierThrough=_,m.cubicToQuadratic=w,m._autoCSS=!0,m.quadraticToCubic=function(t,e,i){return new y(t,(2*e+t)/3,(2*e+i)/3,i)},m._cssRegister=function(){var t,_,c,d,e=i.CSSPlugin;e&&(t=e._internals,_=t._parseToProxy,c=t._setPluginRatio,d=t.CSSPropTween,t._registerComplexSpecialProp("bezier",{parser:function(t,e,i,r,s,n){e instanceof Array&&(e={values:e}),n=new m;var a,o,l,h=e.values,f=h.length-1,u=[],p={};if(f<0)return s;for(a=0;a<=f;a++)l=_(t,h[a],r,s,n,f!==a),u[a]=l.end;for(o in e)p[o]=e[o];return p.values=u,(s=new d(t,"bezier",0,0,l.pt,2)).data=l,s.plugin=n,s.setRatio=c,0===p.autoRotate&&(p.autoRotate=!0),!p.autoRotate||p.autoRotate instanceof Array||(a=!0===p.autoRotate?0:Number(p.autoRotate),p.autoRotate=null!=l.end.left?[["left","top","rotation",a,!1]]:null!=l.end.x&&[["x","y","rotation",a,!1]]),p.autoRotate&&(r._transform||r._enableTransforms(!1),l.autoRotate=r._target._fwdTransform,l.proxy.rotation=l.autoRotate.rotation||0,r._overwriteProps.push("rotation")),n._onInitTween(l.proxy,p,r._tween),s}}))},t._mod=function(t){for(var e,i=this._overwriteProps,r=i.length;-1<--r;)(e=t[i[r]])&&"function"==typeof e&&(this._mod[i[r]]=e)},t._kill=function(t){var e,i,r=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=r.length;-1<--i;)r[i]===e&&r.splice(i,1);if(r=this._autoRotate)for(i=r.length;-1<--i;)t[r[i][2]]&&r.splice(i,1);return this._super._kill.call(this,t)},_fwd_fwdScope.FWDFWD_fwdDefine("plugins.CSSPlugin",["plugins.TweenPlugin","FWDTweenLite"],function(n,B){var c,P,O,d,W=function(){n.call(this,"css"),this._overwriteProps.length=0,this.setRatio=W.prototype.setRatio},h=_fwd_fwdScope.FWDFWD_fwdDefine.globals,m={},t=W.prototype=new n("css");(t.constructor=W).version="1.19.0",W.API=2,W.defaultTransformPerspective=0,W.defaultSkewType="compensated",W.defaultSmoothOrigin=!0,t="px",W.suffixMap={top:t,right:t,bottom:t,left:t,width:t,height:t,fontSize:t,padding:t,margin:t,perspective:t,lineHeight:""};function a(t,e){return e.toUpperCase()}function e(t){return K.createElementNS?K.createElementNS("http://www.w3.org/1999/xhtml",t):K.createElement(t)}function o(t){return N.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1}function g(t){window.console&&console.log(t)}function k(t,e){var i,r,s=(e=e||J).style;if(void 0!==s[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],r=5;-1<--r&&void 0===s[i[r]+t];);return 0<=r?(st="-"+(nt=3===r?"ms":i[r]).toLowerCase()+"-",nt+t):null}function y(t,e){var i,r,s,n={};if(e=e||at(t,null))if(i=e.length)for(;-1<--i;)-1!==(s=e[i]).indexOf("-transform")&&It!==s||(n[s.replace(p,a)]=e.getPropertyValue(s));else for(i in e)-1!==i.indexOf("Transform")&&Xt!==i||(n[i]=e[i]);else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===n[i]&&(n[i.replace(p,a)]=e[i]);return rt||(n.opacity=o(t)),r=Zt(t,e,!1),n.rotation=r.rotation,n.skewX=r.skewX,n.scaleX=r.scaleX,n.scaleY=r.scaleY,n.x=r.x,n.y=r.y,Yt&&(n.z=r.z,n.rotationX=r.rotationX,n.rotationY=r.rotationY,n.scaleZ=r.scaleZ),n.filters&&delete n.filters,n}function v(t,e,i,r,s){var n,a,o,l={},h=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||s&&s[a])&&-1===a.indexOf("Origin")&&("number"!=typeof n&&"string"!=typeof n||(l[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(f,"")?n:0:ht(t,a),void 0!==h[a]&&(o=new vt(h,a,h[a],o))));if(r)for(a in r)"className"!==a&&(l[a]=r[a]);return{difs:l,firstMPT:o}}function R(t,e){return"function"==typeof t&&(t=t(D,F)),"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)||0}function S(t,e){return"function"==typeof t&&(t=t(D,F)),null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)||0}function A(t,e,i,r){var s,n,a,o,l;return"function"==typeof t&&(t=t(D,F)),(o=null==t?e:"number"==typeof t?t:(s=360,n=t.split("_"),a=((l="="===t.charAt(1))?parseInt(t.charAt(0)+"1",10)*parseFloat(n[0].substr(2)):parseFloat(n[0]))*(-1===t.indexOf("rad")?1:G)-(l?0:e),n.length&&(r&&(r[i]=e+a),-1!==t.indexOf("short")&&(a%=s)!==a%180&&(a=a<0?a+s:a-s),-1!==t.indexOf("_cw")&&a<0?a=(a+3599999999640)%s-(a/s|0)*s:-1!==t.indexOf("ccw")&&0<a&&(a=(a-3599999999640)%s-(a/s|0)*s)),e+a))<1e-6&&-1e-6<o&&(o=0),o}function _(t,e,i){return 255*(6*(t=t<0?t+1:1<t?t-1:t)<1?e+(i-e)*t*6:t<.5?i:3*t<2?e+(i-e)*(2/3-t)*6:e)+.5|0}function r(t,e){for(var i,r,s=t.match(dt)||[],n=0,a=s.length?"":t,o=0;o<s.length;o++)i=s[o],n+=(r=t.substr(n,t.indexOf(i,n)-n)).length+i.length,3===(i=ct(i,e)).length&&i.push(1),a+=r+(e?"hsla("+i[0]+","+i[1]+"%,"+i[2]+"%,"+i[3]:"rgba("+i.join(","))+")";return a+t.substr(n)}var M,x,w,Y,T,C,F,D,i,s,z=/(?:\-|\.|\b)(\d|\.|e\-)+/g,X=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,b=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,f=/(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,I=/(?:\d|\-|\+|=|#|\.)*/g,N=/opacity *= *([^)]*)/i,E=/opacity:([^;]*)/i,l=/alpha\(opacity *=.+?\)/i,L=/^(rgb|hsl)/,u=/([A-Z])/g,p=/-([a-z])/gi,j=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,V=/(?:Left|Right|Width)/i,q=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,Z=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,U=/,(?=[^\)]*(?:\(|$))/gi,$=/[\s,\(]/i,Q=Math.PI/180,G=180/Math.PI,H={},K=document,J=e("div"),tt=e("img"),et=W._internals={_specialProps:m},it=navigator.userAgent,rt=(i=it.indexOf("Android"),s=e("a"),w=-1!==it.indexOf("Safari")&&-1===it.indexOf("Chrome")&&(-1===i||3<Number(it.substr(i+8,1))),T=w&&Number(it.substr(it.indexOf("Version/")+8,1))<6,Y=-1!==it.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(it)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(it))&&(C=parseFloat(RegExp.$1)),!!s&&(s.style.cssText="top:1px;opacity:.55;",/^0.55/.test(s.style.opacity))),st="",nt="",at=K.defaultView?K.defaultView.getComputedStyle:function(){},ot=W.getStyle=function(t,e,i,r,s){var n;return rt||"opacity"!==e?(!r&&t.style[e]?n=t.style[e]:(i=i||at(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(u,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==s||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:s):o(t)},lt=et.convertToPixels=function(t,e,i,r,s){if("px"===r||!r)return i;if("auto"===r||!i)return 0;var n,a,o,l=V.test(e),h=t,f=J.style,u=i<0,p=1===i;if(u&&(i=-i),p&&(i*=100),"%"===r&&-1!==e.indexOf("border"))n=i/100*(l?t.clientWidth:t.clientHeight);else{if(f.cssText="border:0 solid red;position:"+ot(t,"position")+";line-height:0;","%"!==r&&h.appendChild&&"v"!==r.charAt(0)&&"rem"!==r)f[l?"borderLeftWidth":"borderTopWidth"]=i+r;else{if(a=(h=t.parentNode||K.body)._fwdCache,o=B.ticker.frame,a&&l&&a.time===o)return a.width*i/100;f[l?"width":"height"]=i+r}h.appendChild(J),n=parseFloat(J[l?"offsetWidth":"offsetHeight"]),h.removeChild(J),l&&"%"===r&&!1!==W.cacheWidths&&((a=h._fwdCache=h._fwdCache||{}).time=o,a.width=n/i*100),0!==n||s||(n=lt(t,e,i,r,!0))}return p&&(n/=100),u?-n:n},ht=et.calculateOffset=function(t,e,i){if("absolute"!==ot(t,"position",i))return 0;var r="left"===e?"Left":"Top",s=ot(t,"margin"+r,i);return t["offset"+r]-(lt(t,e,parseFloat(s),s.replace(I,""))||0)},ft={width:["Left","Right"],height:["Top","Bottom"]},ut=["marginLeft","marginRight","marginTop","marginBottom"],pt=function(t,e){if("contain"===t||"auto"===t||"auto auto"===t)return t+" ";null!=t&&""!==t||(t="0 0");var i,r=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":r[0],n=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":r[1];if(3<r.length&&!e){for(r=t.split(", ").join(",").split(","),t=[],i=0;i<r.length;i++)t.push(pt(r[i]));return t.join(",")}return null==n?n="center"===s?"50%":"0":"center"===n&&(n="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),t=s+" "+n+(2<r.length?" "+r[2]:""),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==n.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===n.charAt(1),e.ox=parseFloat(s.replace(f,"")),e.oy=parseFloat(n.replace(f,"")),e.v=t),e||t},_t={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ct=W.parseColor=function(t,e){var i,r,s,n,a,o,l,h,f,u,p;if(t)if("number"==typeof t)i=[t>>16,t>>8&255,255&t];else{if(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),_t[t])i=_t[t];else if("#"===t.charAt(0))4===t.length&&(t="#"+(r=t.charAt(1))+r+(s=t.charAt(2))+s+(n=t.charAt(3))+n),i=[(t=parseInt(t.substr(1),16))>>16,t>>8&255,255&t];else if("hsl"===t.substr(0,3))if(i=p=t.match(z),e){if(-1!==t.indexOf("="))return t.match(X)}else a=Number(i[0])%360/360,o=Number(i[1])/100,r=2*(l=Number(i[2])/100)-(s=l<=.5?l*(o+1):l+o-l*o),3<i.length&&(i[3]=Number(t[3])),i[0]=_(a+1/3,r,s),i[1]=_(a,r,s),i[2]=_(a-1/3,r,s);else i=t.match(z)||_t.transparent;i[0]=Number(i[0]),i[1]=Number(i[1]),i[2]=Number(i[2]),3<i.length&&(i[3]=Number(i[3]))}else i=_t.black;return e&&!p&&(r=i[0]/255,s=i[1]/255,n=i[2]/255,l=((h=Math.max(r,s,n))+(f=Math.min(r,s,n)))/2,h===f?a=o=0:(u=h-f,o=.5<l?u/(2-h-f):u/(h+f),a=h===r?(s-n)/u+(s<n?6:0):h===s?(n-r)/u+2:(r-s)/u+4,a*=60),i[0]=a+.5|0,i[1]=100*o+.5|0,i[2]=100*l+.5|0),i},dt="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";for(t in _t)dt+="|"+t+"\\b";dt=new RegExp(dt+")","gi"),W.colorStringFilter=function(t){var e,i=t[0]+t[1];dt.test(i)&&(e=-1!==i.indexOf("hsl(")||-1!==i.indexOf("hsla("),t[0]=r(t[0],e),t[1]=r(t[1],e)),dt.lastIndex=0},B.defaultStringFilter||(B.defaultStringFilter=W.colorStringFilter);function mt(t,e,n,a){if(null==t)return function(t){return t};var o,l=e?(t.match(dt)||[""])[0]:"",h=t.split(l).join("").match(b)||[],f=t.substr(0,t.indexOf(h[0])),u=")"===t.charAt(t.length-1)?")":"",p=-1!==t.indexOf(" ")?" ":",",_=h.length,c=0<_?h[0].replace(z,""):"";return _?o=e?function(t){var e,i,r,s;if("number"==typeof t)t+=c;else if(a&&U.test(t)){for(s=t.replace(U,"|").split("|"),r=0;r<s.length;r++)s[r]=o(s[r]);return s.join(",")}if(e=(t.match(dt)||[l])[0],r=(i=t.split(e).join("").match(b)||[]).length,_>r--)for(;++r<_;)i[r]=n?i[(r-1)/2|0]:h[r];return f+i.join(p)+p+e+u+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,i,r;if("number"==typeof t)t+=c;else if(a&&U.test(t)){for(i=t.replace(U,"|").split("|"),r=0;r<i.length;r++)i[r]=o(i[r]);return i.join(",")}if(r=(e=t.match(b)||[]).length,_>r--)for(;++r<_;)e[r]=n?e[(r-1)/2|0]:h[r];return f+e.join(p)+u}:function(t){return t}}function gt(h){return h=h.split(","),function(t,e,i,r,s,n,a){var o,l=(e+"").split(" ");for(a={},o=0;o<4;o++)a[h[o]]=l[o]=l[o]||l[(o-1)/2>>0];return r.parse(t,a,s,n)}}et._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,r,s,n,a=this.data,o=a.proxy,l=a.firstMPT;l;)e=o[l.v],l.r?e=Math.round(e):e<1e-6&&-1e-6<e&&(e=0),l.t[l.p]=e,l=l._next;if(a.autoRotate&&(a.autoRotate.rotation=a.mod?a.mod(o.rotation,this.t):o.rotation),1===t||0===t)for(l=a.firstMPT,n=1===t?"e":"b";l;){if((i=l.t).type){if(1===i.type){for(s=i.xs0+i.s+i.xs1,r=1;r<i.l;r++)s+=i["xn"+r]+i["xs"+(r+1)];i[n]=s}}else i[n]=i.s+i.xs0;l=l._next}};function yt(t,e,i,r,s,n){var a=new xt(t,e,i,r-i,s,-1,n);return a.b=i,a.e=a.xs0=r,a}var vt=function(t,e,i,r,s){this.t=t,this.p=e,this.v=i,this.r=s,r&&((r._prev=this)._next=r)},xt=(et._parseToProxy=function(t,e,i,r,s,n){var a,o,l,h,f,u=r,p={},_={},c=i._transform,d=H;for(i._transform=null,H=e,r=f=i.parse(t,e,r,s),H=d,n&&(i._transform=c,u&&(u._prev=null,u._prev&&(u._prev._next=null)));r&&r!==u;){if(r.type<=1&&(_[o=r.p]=r.s+r.c,p[o]=r.s,n||(h=new vt(r,"s",o,h,r.r),r.c=0),1===r.type))for(a=r.l;0<--a;)l="xn"+a,_[o=r.p+"_"+l]=r.data[l],p[o]=r[l],n||(h=new vt(r,l,o,h,r.rxp[l]));r=r._next}return{proxy:p,end:_,firstMPT:h,pt:f}},et.CSSPropTween=function(t,e,i,r,s,n,a,o,l,h,f){this.t=t,this.p=e,this.s=i,this.c=r,this.n=a||e,t instanceof xt||d.push(this.n),this.r=o,this.type=n||0,l&&(this.pr=l,c=!0),this.b=void 0===h?i:h,this.e=void 0===f?i+r:f,s&&((this._next=s)._prev=this)}),wt=W.parseComplex=function(t,e,i,r,s,n,a,o,l,h){i=i||n||"","function"==typeof r&&(r=r(D,F)),a=new xt(t,e,0,0,a,h?2:1,null,!1,o,i,r),r+="",s&&dt.test(r+i)&&(r=[i,r],W.colorStringFilter(r),i=r[0],r=r[1]);var f,u,p,_,c,d,m,g,y,v,x,w,T,b=i.split(", ").join(",").split(" "),P=r.split(", ").join(",").split(" "),O=b.length,k=!1!==M;for(-1===r.indexOf(",")&&-1===i.indexOf(",")||(b=b.join(" ").replace(U,", ").split(" "),P=P.join(" ").replace(U,", ").split(" "),O=b.length),O!==P.length&&(O=(b=(n||"").split(" ")).length),a.plugin=l,a.setRatio=h,f=dt.lastIndex=0;f<O;f++)if(_=b[f],c=P[f],(g=parseFloat(_))||0===g)a.appendXtra("",g,R(c,g),c.replace(X,""),k&&-1!==c.indexOf("px"),!0);else if(s&&dt.test(_))w=")"+((w=c.indexOf(")")+1)?c.substr(w):""),T=-1!==c.indexOf("hsl")&&rt,_=ct(_,T),c=ct(c,T),(y=6<_.length+c.length)&&!rt&&0===c[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(P[f]).join("transparent")):(rt||(y=!1),T?a.appendXtra(y?"hsla(":"hsl(",_[0],R(c[0],_[0]),",",!1,!0).appendXtra("",_[1],R(c[1],_[1]),"%,",!1).appendXtra("",_[2],R(c[2],_[2]),y?"%,":"%"+w,!1):a.appendXtra(y?"rgba(":"rgb(",_[0],c[0]-_[0],",",!0,!0).appendXtra("",_[1],c[1]-_[1],",",!0).appendXtra("",_[2],c[2]-_[2],y?",":w,!0),y&&(_=_.length<4?1:_[3],a.appendXtra("",_,(c.length<4?1:c[3])-_,w,!1))),dt.lastIndex=0;else if(d=_.match(z)){if(!(m=c.match(X))||m.length!==d.length)return a;for(u=p=0;u<d.length;u++)x=d[u],v=_.indexOf(x,p),a.appendXtra(_.substr(p,v-p),Number(x),R(m[u],x),"",k&&"px"===_.substr(v+x.length,2),0===u),p=v+x.length;a["xs"+a.l]+=_.substr(p)}else a["xs"+a.l]+=a.l||a["xs"+a.l]?" "+c:c;if(-1!==r.indexOf("=")&&a.data){for(w=a.xs0+a.data.s,f=1;f<a.l;f++)w+=a["xs"+f]+a.data["xn"+f];a.e=w+a["xs"+f]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},Tt=9;for((t=xt.prototype).l=t.pr=0;0<--Tt;)t["xn"+Tt]=0,t["xs"+Tt]="";t.xs0="",t._next=t._prev=t.xfirst=t.data=t.plugin=t.setRatio=t.rxp=null,t.appendXtra=function(t,e,i,r,s,n){var a=this,o=a.l;return a["xs"+o]+=n&&(o||a["xs"+o])?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=r||"",0<o?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=s,a["xn"+o]=e,a.plugin||(a.xfirst=new xt(a,"xn"+o,e,i,a.xfirst||a,0,a.n,s,a.pr),a.xfirst.xs0=0)):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=s),a):(a["xs"+o]+=e+(r||""),a)};function bt(t,e){e=e||{},this.p=e.prefix&&k(t)||t,(m[t]=m[this.p]=this).format=e.formatter||mt(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0}var Pt=et._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var r,s=t.split(","),n=e.defaultValue;for(i=i||[n],r=0;r<s.length;r++)e.prefix=0===r&&e.prefix,e.defaultValue=i[r]||n,new bt(s[r],e)},Ot=et._registerPluginProp=function(t){var l;m[t]||(l=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin",Pt(t,{parser:function(t,e,i,r,s,n,a){var o=h.com.fwd.plugins[l];return o?(o._cssRegister(),m[i].parse(t,e,i,r,s,n,a)):(g("Error: "+l+" js file not loaded."),s)}}))};(t=bt.prototype).parseComplex=function(t,e,i,r,s,n){var a,o,l,h,f,u,p=this.keyword;if(this.multi&&(U.test(i)||U.test(e)?(o=e.replace(U,"|").split("|"),l=i.replace(U,"|").split("|")):p&&(o=[e],l=[i])),l){for(h=l.length>o.length?l.length:o.length,a=0;a<h;a++)e=o[a]=o[a]||this.dflt,i=l[a]=l[a]||this.dflt,p&&(f=e.indexOf(p))!==(u=i.indexOf(p))&&(-1===u?o[a]=o[a].split(p).join(""):-1===f&&(o[a]+=" "+p));e=o.join(", "),i=l.join(", ")}return wt(t,this.p,e,i,this.clrs,this.dflt,r,this.pr,s,n)},t.parse=function(t,e,i,r,s,n,a){return this.parseComplex(t.style,this.format(ot(t,this.p,O,!1,this.dflt)),this.format(e),s,n)},W.registerSpecialProp=function(t,l,h){Pt(t,{parser:function(t,e,i,r,s,n,a){var o=new xt(t,i,0,0,s,2,i,!1,h);return o.plugin=n,o.setRatio=l(t,e,r._tween,i),o},priority:h})},W.useSVGTransformAttr=w||Y;function kt(t,e,i){var r,s=K.createElementNS("http://www.w3.org/2000/svg",t),n=/([a-z])([A-Z])/g;for(r in i)s.setAttributeNS(null,r.replace(n,"$1-$2").toLowerCase(),i[r]);return e.appendChild(s),s}function Rt(t,e,i,r,s,n){var a,o,l,h,f,u,p,_,c,d,m,g,y,v,x=t._fwdTransform,w=qt(t,!0);x&&(y=x.xOrigin,v=x.yOrigin),(!r||(a=r.split(" ")).length<2)&&(p=t.getBBox(),a=[(-1!==(e=pt(e).split(" "))[0].indexOf("%")?parseFloat(e[0])/100*p.width:parseFloat(e[0]))+p.x,(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*p.height:parseFloat(e[1]))+p.y]),i.xOrigin=h=parseFloat(a[0]),i.yOrigin=f=parseFloat(a[1]),r&&w!==Vt&&(u=w[0],p=w[1],_=w[2],c=w[3],d=w[4],o=h*(c/(g=u*c-p*_))+f*(-_/g)+(_*(m=w[5])-c*d)/g,l=h*(-p/g)+f*(u/g)-(u*m-p*d)/g,h=i.xOrigin=a[0]=o,f=i.yOrigin=a[1]=l),x&&(n&&(i.xOffset=x.xOffset,i.yOffset=x.yOffset,x=i),s||!1!==s&&!1!==W.defaultSmoothOrigin?(o=h-y,l=f-v,x.xOffset+=o*w[0]+l*w[2]-o,x.yOffset+=o*w[1]+l*w[3]-l):x.xOffset=x.yOffset=0),n||t.setAttribute("data-svg-origin",a.join(" "))}function St(t){var e,i,r=this.data,s=-r.rotation*Q,n=s+r.skewX*Q,a=1e5,o=(Math.cos(s)*r.scaleX*a|0)/a,l=(Math.sin(s)*r.scaleX*a|0)/a,h=(Math.sin(n)*-r.scaleY*a|0)/a,f=(Math.cos(n)*r.scaleY*a|0)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=l,l=-h,h=-i,e=p.filter,u.filter="";var _=this.t.offsetWidth,c=this.t.offsetHeight,d="absolute"!==p.position,m="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+l+", M21="+h+", M22="+f,g=r.x+_*r.xPercent/100,y=r.y+c*r.yPercent/100;if(null!=r.ox&&(g+=(b=(r.oxp?_*r.ox*.01:r.ox)-_/2)-(b*o+(P=(r.oyp?c*r.oy*.01:r.oy)-c/2)*l),y+=P-(b*h+P*f)),m+=d?", Dx="+((b=_/2)-(b*o+(P=c/2)*l)+g)+", Dy="+(P-(b*h+P*f)+y)+")":", sizingMethod='auto expand')",-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?u.filter=e.replace(Z,m):u.filter=m+" "+e,0!==t&&1!==t||1==o&&0===l&&0===h&&1==f&&(d&&-1===m.indexOf("Dx=0, Dy=0")||N.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf(e.indexOf("Alpha"))&&u.removeAttribute("filter")),!d){var v,x,w,T=C<8?1:-1,b=r.ieOffsetX||0,P=r.ieOffsetY||0;for(r.ieOffsetX=Math.round((_-((o<0?-o:o)*_+(l<0?-l:l)*c))/2+g),r.ieOffsetY=Math.round((c-((f<0?-f:f)*c+(h<0?-h:h)*_))/2+y),Tt=0;Tt<4;Tt++)w=(i=-1!==(v=p[x=ut[Tt]]).indexOf("px")?parseFloat(v):lt(this.t,x,parseFloat(v),v.replace(I,""))||0)!==r[x]?Tt<2?-r.ieOffsetX:-r.ieOffsetY:Tt<2?b-r.ieOffsetX:P-r.ieOffsetY,u[x]=(r[x]=Math.round(i-w*(0===Tt||2===Tt?1:T)))+"px"}}}var At,Mt,Ct,Ft,Dt,zt="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),Xt=k("transform"),It=st+"transform",Nt=k("transformOrigin"),Yt=null!==k("perspective"),Et=et.Transform=function(){this.perspective=parseFloat(W.defaultTransformPerspective)||0,this.force3D=!(!1===W.defaultForce3D||!Yt)&&(W.defaultForce3D||"auto")},Bt=window.SVGElement,Wt=K.documentElement,Lt=(Dt=C||/Android/i.test(it)&&!window.chrome,K.createElementNS&&!Dt&&(Mt=kt("svg",Wt),Ft=(Ct=kt("rect",Mt,{width:100,height:50,x:100})).getBoundingClientRect().width,Ct.style[Nt]="50% 50%",Ct.style[Xt]="scaleX(0.5)",Dt=Ft===Ct.getBoundingClientRect().width&&!(Y&&Yt),Wt.removeChild(Mt)),Dt),jt=function(t){return!!(Bt&&t.getBBox&&t.getCTM&&function(t){try{return t.getBBox()}catch(t){}}(t)&&(!t.parentNode||t.parentNode.getBBox&&t.parentNode.getCTM))},Vt=[1,0,0,1,0,0],qt=function(t,e){var i,r,s,n,a,o,l=t._fwdTransform||new Et,h=t.style;if(Xt?r=ot(t,It,null,!0):t.currentStyle&&(r=(r=t.currentStyle.filter.match(q))&&4===r.length?[r[0].substr(4),Number(r[2].substr(4)),Number(r[1].substr(4)),r[3].substr(4),l.x||0,l.y||0].join(","):""),(i=!r||"none"===r||"matrix(1, 0, 0, 1, 0, 0)"===r)&&Xt&&((o="none"===at(t).display)||!t.parentNode)&&(o&&(n=h.display,h.display="block"),t.parentNode||(a=1,Wt.appendChild(t)),i=!(r=ot(t,It,null,!0))||"none"===r||"matrix(1, 0, 0, 1, 0, 0)"===r,n?h.display=n:o&&Gt(h,"display"),a&&Wt.removeChild(t)),(l.svg||t.getBBox&&jt(t))&&(i&&-1!==(h[Xt]+"").indexOf("matrix")&&(r=h[Xt],i=0),s=t.getAttribute("transform"),i&&s&&(-1!==s.indexOf("matrix")?(r=s,i=0):-1!==s.indexOf("translate")&&(r="matrix(1,0,0,1,"+s.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",")+")",i=0))),i)return Vt;for(s=(r||"").match(z)||[],Tt=s.length;-1<--Tt;)n=Number(s[Tt]),s[Tt]=(a=n-(n|=0))?(1e5*a+(a<0?-.5:.5)|0)/1e5+n:n;return e&&6<s.length?[s[0],s[1],s[4],s[5],s[12],s[13]]:s},Zt=et.getTransform=function(t,e,i,r){if(t._fwdTransform&&i&&!r)return t._fwdTransform;var s,n,a,o,l,h,f,u,p,_,c,d,m,g,y,v,x,w,T,b,P,O,k,R,S,A,M,C,F,D,z,X,I=i&&t._fwdTransform||new Et,N=I.scaleX<0,Y=Yt&&(parseFloat(ot(t,Nt,e,!1,"0 0 0").split(" ")[2])||I.zOrigin)||0,E=parseFloat(W.defaultTransformPerspective)||0;if(I.svg=!(!t.getBBox||!jt(t)),I.svg&&(Rt(t,ot(t,Nt,e,!1,"50% 50%")+"",I,t.getAttribute("data-svg-origin")),At=W.useSVGTransformAttr||Lt),(s=qt(t))!==Vt)for(n in 16===s.length?(f=s[0],u=s[1],p=s[2],_=s[3],c=s[4],d=s[5],m=s[6],g=s[7],y=s[8],v=s[9],x=s[10],w=s[12],T=s[13],b=s[14],P=s[11],O=Math.atan2(m,x),I.zOrigin&&(w=y*(b=-I.zOrigin)-s[12],T=v*b-s[13],b=x*b+I.zOrigin-s[14]),I.rotationX=O*G,O&&(k=c*(A=Math.cos(-O))+y*(M=Math.sin(-O)),R=d*A+v*M,S=m*A+x*M,y=c*-M+y*A,v=d*-M+v*A,x=m*-M+x*A,P=g*-M+P*A,c=k,d=R,m=S),O=Math.atan2(-p,x),I.rotationY=O*G,O&&(R=u*(A=Math.cos(-O))-v*(M=Math.sin(-O)),S=p*A-x*M,v=u*M+v*A,x=p*M+x*A,P=_*M+P*A,f=k=f*A-y*M,u=R,p=S),O=Math.atan2(u,f),I.rotation=O*G,O&&(f=f*(A=Math.cos(-O))+c*(M=Math.sin(-O)),R=u*A+d*M,d=u*-M+d*A,m=p*-M+m*A,u=R),I.rotationX&&359.9<Math.abs(I.rotationX)+Math.abs(I.rotation)&&(I.rotationX=I.rotation=0,I.rotationY=180-I.rotationY),I.scaleX=(1e5*Math.sqrt(f*f+u*u)+.5|0)/1e5,I.scaleY=(1e5*Math.sqrt(d*d+v*v)+.5|0)/1e5,I.scaleZ=(1e5*Math.sqrt(m*m+x*x)+.5|0)/1e5,I.rotationX||I.rotationY?I.skewX=0:(I.skewX=c||d?Math.atan2(c,d)*G+I.rotation:I.skewX||0,90<Math.abs(I.skewX)&&Math.abs(I.skewX)<270&&(N?(I.scaleX*=-1,I.skewX+=I.rotation<=0?180:-180,I.rotation+=I.rotation<=0?180:-180):(I.scaleY*=-1,I.skewX+=I.skewX<=0?180:-180))),I.perspective=P?1/(P<0?-P:P):0,I.x=w,I.y=T,I.z=b,I.svg&&(I.x-=I.xOrigin-(I.xOrigin*f-I.yOrigin*c),I.y-=I.yOrigin-(I.yOrigin*u-I.xOrigin*d))):Yt&&!r&&s.length&&I.x===s[4]&&I.y===s[5]&&(I.rotationX||I.rotationY)||(F=(C=6<=s.length)?s[0]:1,D=s[1]||0,z=s[2]||0,X=C?s[3]:1,I.x=s[4]||0,I.y=s[5]||0,a=Math.sqrt(F*F+D*D),o=Math.sqrt(X*X+z*z),l=F||D?Math.atan2(D,F)*G:I.rotation||0,h=z||X?Math.atan2(z,X)*G+l:I.skewX||0,90<Math.abs(h)&&Math.abs(h)<270&&(N?(a*=-1,h+=l<=0?180:-180,l+=l<=0?180:-180):(o*=-1,h+=h<=0?180:-180)),I.scaleX=a,I.scaleY=o,I.rotation=l,I.skewX=h,Yt&&(I.rotationX=I.rotationY=I.z=0,I.perspective=E,I.scaleZ=1),I.svg&&(I.x-=I.xOrigin-(I.xOrigin*F+I.yOrigin*z),I.y-=I.yOrigin-(I.xOrigin*D+I.yOrigin*X))),I.zOrigin=Y,I)I[n]<2e-5&&-2e-5<I[n]&&(I[n]=0);return i&&(t._fwdTransform=I).svg&&(At&&t.style[Xt]?B.delayedCall(.001,function(){Gt(t.style,Xt)}):!At&&t.getAttribute("transform")&&B.delayedCall(.001,function(){t.removeAttribute("transform")})),I},Ut=et.set3DTransformRatio=et.setTransformRatio=function(t){var e,i,r,s,n,a,o,l,h,f,u,p,_,c,d,m,g,y,v,x,w,T,b,P=this.data,O=this.t.style,k=P.rotation,R=P.rotationX,S=P.rotationY,A=P.scaleX,M=P.scaleY,C=P.scaleZ,F=P.x,D=P.y,z=P.z,X=P.svg,I=P.perspective,N=P.force3D;if(!((1!==t&&0!==t||"auto"!==N||this.tween._totalTime!==this.tween._totalDuration&&this.tween._totalTime)&&N||z||I||S||R||1!==C)||At&&X||!Yt)k||P.skewX||X?(k*=Q,T=P.skewX*Q,b=1e5,e=Math.cos(k)*A,s=Math.sin(k)*A,i=Math.sin(k-T)*-M,n=Math.cos(k-T)*M,T&&"simple"===P.skewType&&(g=Math.tan(T-P.skewY*Q),i*=g=Math.sqrt(1+g*g),n*=g,P.skewY&&(g=Math.tan(P.skewY*Q),e*=g=Math.sqrt(1+g*g),s*=g)),X&&(F+=P.xOrigin-(P.xOrigin*e+P.yOrigin*i)+P.xOffset,D+=P.yOrigin-(P.xOrigin*s+P.yOrigin*n)+P.yOffset,At&&(P.xPercent||P.yPercent)&&(c=this.t.getBBox(),F+=.01*P.xPercent*c.width,D+=.01*P.yPercent*c.height),F<(c=1e-6)&&-c<F&&(F=0),D<c&&-c<D&&(D=0)),v=(e*b|0)/b+","+(s*b|0)/b+","+(i*b|0)/b+","+(n*b|0)/b+","+F+","+D+")",X&&At?this.t.setAttribute("transform","matrix("+v):O[Xt]=(P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) matrix(":"matrix(")+v):O[Xt]=(P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) matrix(":"matrix(")+A+",0,0,"+M+","+F+","+D+")";else{if(Y&&(A<(c=1e-4)&&-c<A&&(A=C=2e-5),M<c&&-c<M&&(M=C=2e-5),!I||P.z||P.rotationX||P.rotationY||(I=0)),k||P.skewX)k*=Q,d=e=Math.cos(k),m=s=Math.sin(k),P.skewX&&(k-=P.skewX*Q,d=Math.cos(k),m=Math.sin(k),"simple"===P.skewType&&(g=Math.tan((P.skewX-P.skewY)*Q),d*=g=Math.sqrt(1+g*g),m*=g,P.skewY&&(g=Math.tan(P.skewY*Q),e*=g=Math.sqrt(1+g*g),s*=g))),i=-m,n=d;else{if(!(S||R||1!==C||I||X))return void(O[Xt]=(P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) translate3d(":"translate3d(")+F+"px,"+D+"px,"+z+"px)"+(1!==A||1!==M?" scale("+A+","+M+")":""));e=n=1,i=s=0}h=1,r=a=o=l=f=u=0,p=I?-1/I:0,_=P.zOrigin,c=1e-6,x=",",w="0",(k=S*Q)&&(d=Math.cos(k),f=p*(o=-(m=Math.sin(k))),r=e*m,a=s*m,p*=h=d,e*=d,s*=d),(k=R*Q)&&(g=i*(d=Math.cos(k))+r*(m=Math.sin(k)),y=n*d+a*m,l=h*m,u=p*m,r=i*-m+r*d,a=n*-m+a*d,h*=d,p*=d,i=g,n=y),1!==C&&(r*=C,a*=C,h*=C,p*=C),1!==M&&(i*=M,n*=M,l*=M,u*=M),1!==A&&(e*=A,s*=A,o*=A,f*=A),(_||X)&&(_&&(F+=r*-_,D+=a*-_,z+=h*-_+_),X&&(F+=P.xOrigin-(P.xOrigin*e+P.yOrigin*i)+P.xOffset,D+=P.yOrigin-(P.xOrigin*s+P.yOrigin*n)+P.yOffset),F<c&&-c<F&&(F=w),D<c&&-c<D&&(D=w),z<c&&-c<z&&(z=0)),v=P.xPercent||P.yPercent?"translate("+P.xPercent+"%,"+P.yPercent+"%) matrix3d(":"matrix3d(",v+=(e<c&&-c<e?w:e)+x+(s<c&&-c<s?w:s)+x+(o<c&&-c<o?w:o),v+=x+(f<c&&-c<f?w:f)+x+(i<c&&-c<i?w:i)+x+(n<c&&-c<n?w:n),R||S||1!==C?(v+=x+(l<c&&-c<l?w:l)+x+(u<c&&-c<u?w:u)+x+(r<c&&-c<r?w:r),v+=x+(a<c&&-c<a?w:a)+x+(h<c&&-c<h?w:h)+x+(p<c&&-c<p?w:p)+x):v+=",0,0,0,0,1,0,",v+=F+x+D+x+z+x+(I?1+-z/I:1)+")",O[Xt]=v}};(t=Et.prototype).x=t.y=t.z=t.skewX=t.skewY=t.rotation=t.rotationX=t.rotationY=t.zOrigin=t.xPercent=t.yPercent=t.xOffset=t.yOffset=0,t.scaleX=t.scaleY=t.scaleZ=1,Pt("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin",{parser:function(t,e,i,r,s,n,a){if(r._lastParsedTransform===a)return s;var o;"function"==typeof(r._lastParsedTransform=a)[i]&&(o=a[i],a[i]=e);var l,h,f,u,p,_,c,d,m,g=t._fwdTransform,y=t.style,v=zt.length,x=a,w={},T="transformOrigin",b=Zt(t,O,!0,x.parseTransform),P=x.transform&&("function"==typeof x.transform?x.transform(D,F):x.transform);if(r._transform=b,P&&"string"==typeof P&&Xt)(h=J.style)[Xt]=P,h.display="block",h.position="absolute",K.body.appendChild(J),l=Zt(J,null,!1),b.svg&&(_=b.xOrigin,c=b.yOrigin,l.x-=b.xOffset,l.y-=b.yOffset,(x.transformOrigin||x.svgOrigin)&&(P={},Rt(t,pt(x.transformOrigin),P,x.svgOrigin,x.smoothOrigin,!0),_=P.xOrigin,c=P.yOrigin,l.x-=P.xOffset-b.xOffset,l.y-=P.yOffset-b.yOffset),(_||c)&&(d=qt(J,!0),l.x-=_-(_*d[0]+c*d[2]),l.y-=c-(_*d[1]+c*d[3]))),K.body.removeChild(J),l.perspective||(l.perspective=b.perspective),null!=x.xPercent&&(l.xPercent=S(x.xPercent,b.xPercent)),null!=x.yPercent&&(l.yPercent=S(x.yPercent,b.yPercent));else if("object"==typeof x){if(l={scaleX:S(null!=x.scaleX?x.scaleX:x.scale,b.scaleX),scaleY:S(null!=x.scaleY?x.scaleY:x.scale,b.scaleY),scaleZ:S(x.scaleZ,b.scaleZ),x:S(x.x,b.x),y:S(x.y,b.y),z:S(x.z,b.z),xPercent:S(x.xPercent,b.xPercent),yPercent:S(x.yPercent,b.yPercent),perspective:S(x.transformPerspective,b.perspective)},null!=(p=x.directionalRotation))if("object"==typeof p)for(h in p)x[h]=p[h];else x.rotation=p;"string"==typeof x.x&&-1!==x.x.indexOf("%")&&(l.x=0,l.xPercent=S(x.x,b.xPercent)),"string"==typeof x.y&&-1!==x.y.indexOf("%")&&(l.y=0,l.yPercent=S(x.y,b.yPercent)),l.rotation=A("rotation"in x?x.rotation:"shortRotation"in x?x.shortRotation+"_short":"rotationZ"in x?x.rotationZ:b.rotation-b.skewY,b.rotation-b.skewY,"rotation",w),Yt&&(l.rotationX=A("rotationX"in x?x.rotationX:"shortRotationX"in x?x.shortRotationX+"_short":b.rotationX||0,b.rotationX,"rotationX",w),l.rotationY=A("rotationY"in x?x.rotationY:"shortRotationY"in x?x.shortRotationY+"_short":b.rotationY||0,b.rotationY,"rotationY",w)),l.skewX=A(x.skewX,b.skewX-b.skewY),(l.skewY=A(x.skewY,b.skewY))&&(l.skewX+=l.skewY,l.rotation+=l.skewY)}for(Yt&&null!=x.force3D&&(b.force3D=x.force3D,u=!0),b.skewType=x.skewType||b.skewType||W.defaultSkewType,(f=b.force3D||b.z||b.rotationX||b.rotationY||l.z||l.rotationX||l.rotationY||l.perspective)||null==x.scale||(l.scaleZ=1);-1<--v;)(1e-6<(P=l[m=zt[v]]-b[m])||P<-1e-6||null!=x[m]||null!=H[m])&&(u=!0,s=new xt(b,m,b[m],P,s),m in w&&(s.e=w[m]),s.xs0=0,s.plugin=n,r._overwriteProps.push(s.n));return P=x.transformOrigin,b.svg&&(P||x.svgOrigin)&&(_=b.xOffset,c=b.yOffset,Rt(t,pt(P),l,x.svgOrigin,x.smoothOrigin),s=yt(b,"xOrigin",(g?b:l).xOrigin,l.xOrigin,s,T),s=yt(b,"yOrigin",(g?b:l).yOrigin,l.yOrigin,s,T),_===b.xOffset&&c===b.yOffset||(s=yt(b,"xOffset",g?_:b.xOffset,b.xOffset,s,T),s=yt(b,"yOffset",g?c:b.yOffset,b.yOffset,s,T)),P=At?null:"0px 0px"),(P||Yt&&f&&b.zOrigin)&&(Xt?(u=!0,m=Nt,P=(P||ot(t,m,O,!1,"50% 50%"))+"",(s=new xt(y,m,0,0,s,-1,T)).b=y[m],s.plugin=n,Yt?(h=b.zOrigin,P=P.split(" "),b.zOrigin=(2<P.length&&(0===h||"0px"!==P[2])?parseFloat(P[2]):h)||0,s.xs0=s.e=P[0]+" "+(P[1]||"50%")+" 0px",(s=new xt(b,"zOrigin",0,0,s,-1,s.n)).b=h,s.xs0=s.e=b.zOrigin):s.xs0=s.e=P):pt(P+"",b)),u&&(r._transformType=b.svg&&At||!f&&3!==this._transformType?2:3),o&&(a[i]=o),s},prefix:!0}),Pt("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),Pt("borderRadius",{defaultValue:"0px",parser:function(t,e,i,r,s,n){e=this.format(e);for(var a,o,l,h,f,u,p,_,c,d,m,g,y=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],v=t.style,x=parseFloat(t.offsetWidth),w=parseFloat(t.offsetHeight),T=e.split(" "),b=0;b<y.length;b++)this.p.indexOf("border")&&(y[b]=k(y[b])),-1!==(l=o=ot(t,y[b],O,!1,"0px")).indexOf(" ")&&(l=(o=l.split(" "))[0],o=o[1]),h=a=T[b],f=parseFloat(l),_=l.substr((f+"").length),""===(p=(c="="===h.charAt(1))?(u=parseInt(h.charAt(0)+"1",10),h=h.substr(2),u*=parseFloat(h),h.substr((u+"").length-(u<0?1:0))||""):(u=parseFloat(h),h.substr((u+"").length)))&&(p=P[i]||_),p!==_&&(d=lt(t,"borderLeft",f,_),m=lt(t,"borderTop",f,_),o="%"===p?(l=d/x*100+"%",m/w*100+"%"):"em"===p?(l=d/(g=lt(t,"borderLeft",1,"em"))+"em",m/g+"em"):(l=d+"px",m+"px"),c&&(h=parseFloat(l)+u+p,a=parseFloat(o)+u+p)),s=wt(v,y[b],l+" "+o,h+" "+a,!1,"0px",s);return s},prefix:!0,formatter:mt("0px 0px 0px 0px",!1,!0)}),Pt("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius",{defaultValue:"0px",parser:function(t,e,i,r,s,n){return wt(t.style,i,this.format(ot(t,i,O,!1,"0px 0px")),this.format(e),!1,"0px",s)},prefix:!0,formatter:mt("0px 0px",!1,!0)}),Pt("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,r,s,n){var a,o,l,h,f,u,p="background-position",_=O||at(t,null),c=this.format((_?C?_.getPropertyValue(p+"-x")+" "+_.getPropertyValue(p+"-y"):_.getPropertyValue(p):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),d=this.format(e);if(-1!==c.indexOf("%")!=(-1!==d.indexOf("%"))&&d.split(",").length<2&&(u=ot(t,"backgroundImage").replace(j,""))&&"none"!==u){for(a=c.split(" "),o=d.split(" "),tt.setAttribute("src",u),l=2;-1<--l;)(h=-1!==(c=a[l]).indexOf("%"))!=(-1!==o[l].indexOf("%"))&&(f=0===l?t.offsetWidth-tt.width:t.offsetHeight-tt.height,a[l]=h?parseFloat(c)/100*f+"px":parseFloat(c)/f*100+"%");c=a.join(" ")}return this.parseComplex(t.style,c,d,s,n)},formatter:pt}),Pt("backgroundSize",{defaultValue:"0 0",formatter:function(t){return pt(-1===(t+="").indexOf(" ")?t+" "+t:t)}}),Pt("perspective",{defaultValue:"0px",prefix:!0}),Pt("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),Pt("transformStyle",{prefix:!0}),Pt("backfaceVisibility",{prefix:!0}),Pt("userSelect",{prefix:!0}),Pt("margin",{parser:gt("marginTop,marginRight,marginBottom,marginLeft")}),Pt("padding",{parser:gt("paddingTop,paddingRight,paddingBottom,paddingLeft")}),Pt("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,r,s,n){var a,o,l;return e=C<9?(o=t.currentStyle,l=C<8?" ":",",a="rect("+o.clipTop+l+o.clipRight+l+o.clipBottom+l+o.clipLeft+")",this.format(e).split(",").join(l)):(a=this.format(ot(t,this.p,O,!1,this.dflt)),this.format(e)),this.parseComplex(t.style,a,e,s,n)}}),Pt("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),Pt("autoRound,strictUnits",{parser:function(t,e,i,r,s){return s}}),Pt("border",{defaultValue:"0px solid #000",parser:function(t,e,i,r,s,n){var a=ot(t,"borderTopWidth",O,!1,"0px"),o=this.format(e).split(" "),l=o[0].replace(I,"");return"px"!==l&&(a=parseFloat(a)/lt(t,"borderTopWidth",1,l)+l),this.parseComplex(t.style,this.format(a+" "+ot(t,"borderTopStyle",O,!1,"solid")+" "+ot(t,"borderTopColor",O,!1,"#000")),o.join(" "),s,n)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(dt)||["#000"])[0]}}),Pt("borderWidth",{parser:gt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),Pt("float,cssFloat,styleFloat",{parser:function(t,e,i,r,s,n){var a=t.style,o="cssFloat"in a?"cssFloat":"styleFloat";return new xt(a,o,0,0,s,-1,i,!1,0,a[o],e)}});function $t(t){var e,i=this.t,r=i.filter||ot(this.data,"filter")||"",s=this.s+this.c*t|0;100==s&&(e=-1===r.indexOf("atrix(")&&-1===r.indexOf("radient(")&&-1===r.indexOf("oader(")?(i.removeAttribute("filter"),!ot(this.data,"filter")):(i.filter=r.replace(l,""),!0)),e||(this.xn1&&(i.filter=r=r||"alpha(opacity="+s+")"),-1===r.indexOf("pacity")?0==s&&this.xn1||(i.filter=r+" alpha(opacity="+s+")"):i.filter=r.replace(N,"opacity="+s))}Pt("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,r,s,n){var a=parseFloat(ot(t,"opacity",O,!1,"1")),o=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+a),l&&1===a&&"hidden"===ot(t,"visibility",O)&&0!==e&&(a=0),rt?s=new xt(o,"opacity",a,e-a,s):((s=new xt(o,"opacity",100*a,100*(e-a),s)).xn1=l?1:0,o.zoom=1,s.type=2,s.b="alpha(opacity="+s.s+")",s.e="alpha(opacity="+(s.s+s.c)+")",s.data=t,s.plugin=n,s.setRatio=$t),l&&((s=new xt(o,"visibility",0,0,s,-1,null,!1,0,0!==a?"inherit":"hidden",0===e?"hidden":"inherit")).xs0="inherit",r._overwriteProps.push(s.n),r._overwriteProps.push(i)),s}});function Qt(t){if(this.t._fwdClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Gt(i,e.p),e=e._next;1===t&&this.t._fwdClassPT===this&&(this.t._fwdClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)}var Gt=function(t,e){e&&(t.removeProperty?("ms"!==e.substr(0,2)&&"webkit"!==e.substr(0,6)||(e="-"+e),t.removeProperty(e.replace(u,"-$1").toLowerCase())):t.removeAttribute(e))};Pt("className",{parser:function(t,e,i,r,s,n,a){var o,l,h,f,u,p=t.getAttribute("class")||"",_=t.style.cssText;if((s=r._classNamePT=new xt(t,i,0,0,s,2)).setRatio=Qt,s.pr=-11,c=!0,s.b=p,l=y(t,O),h=t._fwdClassPT){for(f={},u=h.data;u;)f[u.p]=1,u=u._next;h.setRatio(1)}return(t._fwdClassPT=s).e="="!==e.charAt(1)?e:p.replace(new RegExp("(?:\\s|^)"+e.substr(2)+"(?![\\w-])"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),t.setAttribute("class",s.e),o=v(t,l,y(t),a,f),t.setAttribute("class",p),s.data=o.firstMPT,t.style.cssText=_,s=s.xfirst=r.parse(t,o.difs,s,n)}});function Ht(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,r,s,n,a=this.t.style,o=m.transform.parse;if("all"===this.e)s=!(a.cssText="");else for(r=(e=this.e.split(" ").join("").split(",")).length;-1<--r;)i=e[r],m[i]&&(m[i].parse===o?s=!0:i="transformOrigin"===i?Nt:m[i].p),Gt(a,i);s&&(Gt(a,Xt),(n=this.t._fwdTransform)&&(n.svg&&(this.t.removeAttribute("data-svg-origin"),this.t.removeAttribute("transform")),delete this.t._fwdTransform))}}for(Pt("clearProps",{parser:function(t,e,i,r,s){return(s=new xt(t,i,0,0,s,2)).setRatio=Ht,s.e=e,s.pr=-10,s.data=r._tween,c=!0,s}}),t="bezier,throwProps,physicsProps,physics2D".split(","),Tt=t.length;Tt--;)Ot(t[Tt]);(t=W.prototype)._firstPT=t._lastParsedTransform=t._transform=null,t._onInitTween=function(t,e,i,r){if(!t.nodeType)return!1;this._target=F=t,this._tween=i,this._vars=e,D=r,M=e.autoRound,c=!1,P=e.suffixMap||W.suffixMap,O=at(t,""),d=this._overwriteProps;var s,n,a,o,l,h,f,u,p,_=t.style;if(x&&""===_.zIndex&&("auto"!==(s=ot(t,"zIndex",O))&&""!==s||this._addLazySet(_,"zIndex",0)),"string"==typeof e&&(o=_.cssText,s=y(t,O),_.cssText=o+";"+e,s=v(t,s,y(t)).difs,!rt&&E.test(e)&&(s.opacity=parseFloat(RegExp.$1)),e=s,_.cssText=o),e.className?this._firstPT=n=m.className.parse(t,e.className,"className",this,null,null,e):this._firstPT=n=this.parse(t,e,null),this._transformType){for(p=3===this._transformType,Xt?w&&(x=!0,""===_.zIndex&&("auto"!==(f=ot(t,"zIndex",O))&&""!==f||this._addLazySet(_,"zIndex",0)),T&&this._addLazySet(_,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(p?"visible":"hidden"))):_.zoom=1,a=n;a&&a._next;)a=a._next;u=new xt(t,"transform",0,0,null,2),this._linkCSSP(u,null,a),u.setRatio=Xt?Ut:St,u.data=this._transform||Zt(t,O,!0),u.tween=i,u.pr=-1,d.pop()}if(c){for(;n;){for(h=n._next,a=o;a&&a.pr>n.pr;)a=a._next;(n._prev=a?a._prev:l)?n._prev._next=n:o=n,(n._next=a)?a._prev=n:l=n,n=h}this._firstPT=o}return!0},t.parse=function(t,e,i,r){var s,n,a,o,l,h,f,u,p,_,c=t.style;for(s in e)"function"==typeof(h=e[s])&&(h=h(D,F)),(n=m[s])?i=n.parse(t,h,s,this,i,r,e):(l=ot(t,s,O)+"",p="string"==typeof h,"color"===s||"fill"===s||"stroke"===s||-1!==s.indexOf("Color")||p&&L.test(h)?(p||(h=(3<(h=ct(h)).length?"rgba(":"rgb(")+h.join(",")+")"),i=wt(c,s,l,h,!0,"transparent",i,0,r)):p&&$.test(h)?i=wt(c,s,l,h,!0,null,i,0,r):(f=(a=parseFloat(l))||0===a?l.substr((a+"").length):"",""!==l&&"auto"!==l||(f="width"===s||"height"===s?(a=function(t,e,i){if("svg"===(t.nodeName+"").toLowerCase())return(i||at(t))[e]||0;if(t.getBBox&&jt(t))return t.getBBox()[e]||0;var r=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),s=ft[e],n=s.length;for(i=i||at(t,null);-1<--n;)r-=parseFloat(ot(t,"padding"+s[n],i,!0))||0,r-=parseFloat(ot(t,"border"+s[n]+"Width",i,!0))||0;return r}(t,s,O),"px"):"left"===s||"top"===s?(a=ht(t,s,O),"px"):(a="opacity"!==s?0:1,"")),""===(u=(_=p&&"="===h.charAt(1))?(o=parseInt(h.charAt(0)+"1",10),h=h.substr(2),o*=parseFloat(h),h.replace(I,"")):(o=parseFloat(h),p?h.replace(I,""):""))&&(u=s in P?P[s]:f),h=o||0===o?(_?o+a:o)+u:e[s],f!==u&&""!==u&&(o||0===o)&&a&&(a=lt(t,s,a,f),"%"===u?(a/=lt(t,s,100,"%")/100,!0!==e.strictUnits&&(l=a+"%")):"em"===u||"rem"===u||"vw"===u||"vh"===u?a/=lt(t,s,1,u):"px"!==u&&(o=lt(t,s,o,u),u="px"),_&&(!o&&0!==o||(h=o+a+u))),_&&(o+=a),!a&&0!==a||!o&&0!==o?void 0!==c[s]&&(h||h+""!="NaN"&&null!=h)?(i=new xt(c,s,o||a||0,0,i,-1,s,!1,0,l,h)).xs0="none"!==h||"display"!==s&&-1===s.indexOf("Style")?h:l:g("invalid "+s+" tween value: "+e[s]):(i=new xt(c,s,a,o-a,i,0,s,!1!==M&&("px"===u||"zIndex"===s),0,l,h)).xs0=u)),r&&i&&!i.plugin&&(i.plugin=r);return i},t.setRatio=function(t){var e,i,r,s=this._firstPT;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||-1e-6===this._tween._rawPrevTime)for(;s;){if(e=s.c*t+s.s,s.r?e=Math.round(e):e<1e-6&&-1e-6<e&&(e=0),s.type)if(1===s.type)if(2===(r=s.l))s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2;else if(3===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3;else if(4===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3+s.xn3+s.xs4;else if(5===r)s.t[s.p]=s.xs0+e+s.xs1+s.xn1+s.xs2+s.xn2+s.xs3+s.xn3+s.xs4+s.xn4+s.xs5;else{for(i=s.xs0+e+s.xs1,r=1;r<s.l;r++)i+=s["xn"+r]+s["xs"+(r+1)];s.t[s.p]=i}else-1===s.type?s.t[s.p]=s.xs0:s.setRatio&&s.setRatio(t);else s.t[s.p]=e+s.xs0;s=s._next}else for(;s;)2!==s.type?s.t[s.p]=s.b:s.setRatio(t),s=s._next;else for(;s;){if(2!==s.type)if(s.r&&-1!==s.type)if(e=Math.round(s.s+s.c),s.type){if(1===s.type){for(r=s.l,i=s.xs0+e+s.xs1,r=1;r<s.l;r++)i+=s["xn"+r]+s["xs"+(r+1)];s.t[s.p]=i}}else s.t[s.p]=e+s.xs0;else s.t[s.p]=s.e;else s.setRatio(t);s=s._next}},t._enableTransforms=function(t){this._transform=this._transform||Zt(this._target,O,!0),this._transformType=this._transform.svg&&At||!t&&3!==this._transformType?2:3};function Kt(t){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)}t._addLazySet=function(t,e,i){var r=this._firstPT=new xt(t,e,0,0,this._firstPT,2);r.e=i,r.setRatio=Kt,r.data=this},t._linkCSSP=function(t,e,i,r){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,r=!0),i?i._next=t:r||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},t._mod=function(t){for(var e=this._firstPT;e;)"function"==typeof t[e.p]&&t[e.p]===Math.round&&(e.r=1),e=e._next},t._kill=function(t){var e,i,r,s=t;if(t.autoAlpha||t.alpha){for(i in s={},t)s[i]=t[i];s.opacity=1,s.autoAlpha&&(s.visibility=1)}for(t.className&&(e=this._classNamePT)&&((r=e.xfirst)&&r._prev?this._linkCSSP(r._prev,e._next,r._prev._prev):r===this._firstPT&&(this._firstPT=e._next),e._next&&this._linkCSSP(e._next,e._next._next,r._prev),this._classNamePT=null),e=this._firstPT;e;)e.plugin&&e.plugin!==i&&e.plugin._kill&&(e.plugin._kill(t),i=e.plugin),e=e._next;return n.prototype._kill.call(this,s)};var Jt=function(t,e,i){var r,s,n,a;if(t.slice)for(s=t.length;-1<--s;)Jt(t[s],e,i);else for(s=(r=t.childNodes).length;-1<--s;)a=(n=r[s]).type,n.style&&(e.push(y(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||Jt(n,e,i)};return W.cascadeTo=function(t,e,i){var r,s,n,a,o=B.to(t,e,i),l=[o],h=[],f=[],u=[],p=B._internals.reservedProps;for(t=o._targets||o.target,Jt(t,h,u),o.render(e,!0,!0),Jt(t,f),o.render(0,!0,!0),o._enabled(!0),r=u.length;-1<--r;)if((s=v(u[r],h[r],f[r])).firstMPT){for(n in s=s.difs,i)p[n]&&(s[n]=i[n]);for(n in a={},s)a[n]=h[r][n];l.push(B.fromTo(u[r],e,a,s))}return l},n.activate([W]),W},!0),_fwd_fwdScope.FWDFWD_fwdDefine("easing.Back",["easing.Ease"],function(m){function t(t,e){var i=f("easing."+t,function(){},!0),r=i.prototype=new m;return r.constructor=i,r.getRatio=e,i}function e(t,e,i,r,s){var n=f("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new r},!0);return u(n,t),n}function g(t,e,i){this.t=t,this.v=e,i&&(((this.next=i).prev=this).c=i.v-e,this.gap=i.t-t)}function i(t,e){var i=f("easing."+t,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=i.prototype=new m;return r.constructor=i,r.getRatio=e,r.config=function(t){return new i(t)},i}var r,s,n,a=_fwd_fwdScope.FWDGlobals||_fwd_fwdScope,o=a.com.fwd,l=2*Math.PI,h=Math.PI/2,f=o._class,u=m.register||function(){},p=e("Back",i("BackOut",function(t){return--t*t*((this._p1+1)*t+this._p1)+1}),i("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),i("BackInOut",function(t){return(t*=2)<1?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),_=f("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:1<t&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=!0===i},!0),c=_.prototype=new m;return c.constructor=_,c.getRatio=function(t){var e=t+(.5-t)*this._p;return t<this._p1?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},_.ease=new _(.7,.7),c.config=_.config=function(t,e,i){return new _(t,e,i)},(c=(r=f("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0)).prototype=new m).constructor=r,c.getRatio=function(t){return t<0?t=0:1<=t&&(t=.999999999),(this._p2*t>>0)*this._p1},c.config=r.config=function(t){return new r(t)},(c=(s=f("easing.RoughEase",function(t){for(var e,i,r,s,n,a,o=(t=t||{}).taper||"none",l=[],h=0,f=0|(t.points||20),u=f,p=!1!==t.randomize,_=!0===t.clamp,c=t.template instanceof m?t.template:null,d="number"==typeof t.strength?.4*t.strength:.4;-1<--u;)e=p?Math.random():1/f*u,i=c?c.getRatio(e):e,r="none"===o?d:"out"===o?(s=1-e)*s*d:"in"===o?e*e*d:e<.5?(s=2*e)*s*.5*d:(s=2*(1-e))*s*.5*d,p?i+=Math.random()*r-.5*r:u%2?i+=.5*r:i-=.5*r,_&&(1<i?i=1:i<0&&(i=0)),l[h++]={x:e,y:i};for(l.sort(function(t,e){return t.x-e.x}),a=new g(1,1,null),u=f;-1<--u;)n=l[u],a=new g(n.x,n.y,a);this._prev=new g(0,0,0!==a.t?a:a.next)},!0)).prototype=new m).constructor=s,c.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&t<=e.t;)e=e.prev;return(this._prev=e).v+(t-e.t)/e.gap*e.c},c.config=function(t){return new s(t)},s.ease=new s,e("Bounce",t("BounceOut",function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),t("BounceIn",function(t){return(t=1-t)<1/2.75?1-7.5625*t*t:t<2/2.75?1-(7.5625*(t-=1.5/2.75)*t+.75):t<2.5/2.75?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),t("BounceInOut",function(t){var e=t<.5;return(t=e?1-2*t:2*t-1)<1/2.75?t*=7.5625*t:t=t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),e("Circ",t("CircOut",function(t){return Math.sqrt(1- --t*t)}),t("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),t("CircInOut",function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),e("Elastic",(n=function(t,e,i){var r=f("easing."+t,function(t,e){this._p1=1<=t?t:1,this._p2=(e||i)/(t<1?t:1),this._p3=this._p2/l*(Math.asin(1/this._p1)||0),this._p2=l/this._p2},!0),s=r.prototype=new m;return s.constructor=r,s.getRatio=e,s.config=function(t,e){return new r(t,e)},r})("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*this._p2)+1},.3),n("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*--t)*Math.sin((t-this._p3)*this._p2))},.3),n("ElasticInOut",function(t){return(t*=2)<1?this._p1*Math.pow(2,10*--t)*Math.sin((t-this._p3)*this._p2)*-.5:this._p1*Math.pow(2,-10*--t)*Math.sin((t-this._p3)*this._p2)*.5+1},.45)),e("Expo",t("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),t("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),t("ExpoInOut",function(t){return(t*=2)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),e("Sine",t("SineOut",function(t){return Math.sin(t*h)}),t("SineIn",function(t){return 1-Math.cos(t*h)}),t("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),f("easing.EaseLookup",{find:function(t){return m.map[t]}},!0),u(a.SlowMo,"SlowMo","ease,"),u(s,"RoughEase","ease,"),u(r,"SteppedEase","ease,"),p},!0)}),_fwd_fwdScope.FWDFWD_fwdDefine&&_fwd_fwdScope._fwd_fwdQueue.pop()(),function(_,c){"use strict";var d={},m=_.FWDGlobals=_.FWDGlobals||_;if(!m.FWDTweenLite){var g,e,i,y=function(t){for(var e=t.split("."),i=m,r=0;r<e.length;r++)i[e[r]]=i=i[e[r]]||{};return i},u=y("com.fwd"),v=1e-10,l=function(t){for(var e=[],i=t.length,r=0;r!==i;e.push(t[r++]));return e},r=function(){},x=(e=Object.prototype.toString,i=e.call([]),function(t){return null!=t&&(t instanceof Array||"object"==typeof t&&!!t.push&&e.call(t)===i)}),w={},T=function(l,h,f,u){this.sc=w[l]?w[l].sc:[],(w[l]=this).gsClass=null,this.func=f;var p=[];this.check=function(t){for(var e,i,r,s,n,a=h.length,o=a;-1<--a;)(e=w[h[a]]||new T(h[a],[])).gsClass?(p[a]=e.gsClass,o--):t&&e.sc.push(this);if(0===o&&f){if(r=(i=("com.fwd."+l).split(".")).pop(),s=y(i.join("."))[r]=this.gsClass=f.apply(f,p),u)if(m[r]=d[r]=s,!(n="undefined"!=typeof fwd_module&&fwd_module.exports)&&"function"==typeof define&&define.amd)define((_.FWDAMDPath?_.FWDAMDPath+"/":"")+l.split(".").pop(),[],function(){return s});else if(n)if(l===c)for(a in fwd_module.exports=d[c]=s,d)s[a]=d[a];else d[c]&&(d[c][r]=s);for(a=0;a<this.sc.length;a++)this.sc[a].check()}},this.check(!0)},s=_.FWDFWD_fwdDefine=function(t,e,i,r){return new T(t,e,i,r)},p=u._class=function(t,e,i){return e=e||function(){},s(t,[],function(){return e},i),e};s.globals=m;var t,n=[0,0,1,1],b=p("easing.Ease",function(t,e,i,r){this._func=t,this._type=i||0,this._power=r||0,this._params=e?n.concat(e):n},!0),P=b.map={},a=b.register=function(t,e,i,r){for(var s,n,a,o,l=e.split(","),h=l.length,f=(i||"easeIn,easeOut,easeInOut").split(",");-1<--h;)for(n=l[h],s=r?p("easing."+n,null,!0):u.easing[n]||{},a=f.length;-1<--a;)o=f[a],P[n+"."+o]=P[o+n]=s[o]=t.getRatio?t:t[o]||new t};for((t=b.prototype)._calcEnd=!1,t.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,r=1===e?1-t:2===e?t:t<.5?2*t:2*(1-t);return 1===i?r*=r:2===i?r*=r*r:3===i?r*=r*r*r:4===i&&(r*=r*r*r*r),1===e?1-r:2===e?r:t<.5?r/2:1-r/2},h=(o=["Linear","Quad","Cubic","Quart","Quint,Strong"]).length;-1<--h;)t=o[h]+",Power"+h,a(new b(null,null,1,h),t,"easeOut",!0),a(new b(null,null,2,h),t,"easeIn"+(0===h?",easeNone":"")),a(new b(null,null,3,h),t,"easeInOut");P.linear=u.easing.Linear.easeIn,P.swing=u.easing.Quad.easeInOut;var O=p("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});(t=O.prototype).addEventListener=function(t,e,i,r,s){s=s||0;var n,a,o=this._listeners[t],l=0;for(this!==M||g||M.wake(),null==o&&(this._listeners[t]=o=[]),a=o.length;-1<--a;)(n=o[a]).c===e&&n.s===i?o.splice(a,1):0===l&&n.pr<s&&(l=a+1);o.splice(l,0,{c:e,s:i,up:r,pr:s})},t.removeEventListener=function(t,e){var i,r=this._listeners[t];if(r)for(i=r.length;-1<--i;)if(r[i].c===e)return void r.splice(i,1)},t.dispatchEvent=function(t){var e,i,r,s=this._listeners[t];if(s)for(1<(e=s.length)&&(s=s.slice(0)),i=this._eventTarget;-1<--e;)(r=s[e])&&(r.up?r.c.call(r.s||i,{type:t,target:i}):r.c.call(r.s||i))};for(var o,k=_.requestAnimationFrame,R=_.cancelAnimationFrame,S=Date.now||function(){return(new Date).getTime()},A=S(),h=(o=["ms","moz","webkit","o"]).length;-1<--h&&!k;)k=_[o[h]+"RequestAnimationFrame"],R=_[o[h]+"CancelAnimationFrame"]||_[o[h]+"CancelRequestAnimationFrame"];p("Ticker",function(t,e){var s,n,a,o,l,h=this,f=S(),i=!(!1===e||!k)&&"auto",u=500,p=33,_=function(t){var e,i,r=S()-A;u<r&&(f+=r-p),A+=r,h.time=(A-f)/1e3,e=h.time-l,(!s||0<e||!0===t)&&(h.frame++,l+=e+(o<=e?.004:o-e),i=!0),!0!==t&&(a=n(_)),i&&h.dispatchEvent("tick")};O.call(h),h.time=h.frame=0,h.tick=function(){_(!0)},h.lagSmoothing=function(t,e){u=t||1e10,p=Math.min(e,u,0)},h.sleep=function(){null!=a&&((i&&R?R:clearTimeout)(a),n=r,a=null,h===M&&(g=!1))},h.wake=function(t){null!==a?h.sleep():t?f+=-A+(A=S()):10<h.frame&&(A=S()-u+5),n=0===s?r:i&&k?k:function(t){return setTimeout(t,1e3*(l-h.time)+1|0)},h===M&&(g=!0),_(2)},h.fps=function(t){if(!arguments.length)return s;o=1/((s=t)||60),l=this.time+o,h.wake()},h.useRAF=function(t){if(!arguments.length)return i;h.sleep(),i=t,h.fps(s)},h.fps(t),setTimeout(function(){"auto"===i&&h.frame<5&&"hidden"!==document.visibilityState&&h.useRAF(!1)},1500)}),(t=u.Ticker.prototype=new u.events.EventDispatcher).constructor=u.Ticker;var f=p("core.FWDAnimation",function(t,e){var i;this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=!0===e.immediateRender,this.data=e.data,this._reversed=!0===e.reversed,$&&(g||M.wake(),(i=this.vars.useFrames?U:$).add(this,i._time),this.vars.paused&&this.paused(!0))}),M=f.ticker=new u.Ticker;(t=f.prototype)._dirty=t._gc=t._initted=t._paused=!1,t._totalTime=t._time=0,t._rawPrevTime=-1,t._next=t._last=t._onUpdate=t._timeline=t.timeline=null,t._paused=!1;var C=function(){g&&2e3<S()-A&&M.wake(),setTimeout(C,2e3)};C(),t.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},t.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},t.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},t.seek=function(t,e){return this.totalTime(Number(t),!1!==e)},t.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,!1!==e,!0)},t.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},t.render=function(t,e,i){},t.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,!this._gc&&this.timeline||this._enabled(!0),this},t.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&t<i+this.totalDuration()/this._timeScale},t._enabled=function(t,e){return g||M.wake(),this._gc=!t,this._active=this.isActive(),!0!==e&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},t._kill=function(t,e){return this._enabled(!1,!1)},t.kill=function(t,e){return this._kill(t,e),this},t._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},t._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();-1<--e;)"{self}"===t[e]&&(i[e]=this);return i},t._callback=function(t){var e=this.vars,i=e[t],r=e[t+"Params"],s=e[t+"Scope"]||e.callbackScope||this;switch(r?r.length:0){case 0:i.call(s);break;case 1:i.call(s,r[0]);break;case 2:i.call(s,r[0],r[1]);break;default:i.apply(s,r)}},t.eventCallback=function(t,e,i,r){if("on"===(t||"").substr(0,2)){var s=this.vars;if(1===arguments.length)return s[t];null==e?delete s[t]:(s[t]=e,s[t+"Params"]=x(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,s[t+"Scope"]=r),"onUpdate"===t&&(this._onUpdate=e)}return this},t.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},t.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&0<this._time&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},t.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},t.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},t.totalTime=function(t,e,i){if(g||M.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(t<0&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var r=this._totalDuration,s=this._timeline;if(r<t&&!i&&(t=r),this._startTime=(this._paused?this._pauseTime:s._time)-(this._reversed?r-t:t)/this._timeScale,s._dirty||this._uncache(!1),s._timeline)for(;s._timeline;)s._timeline._time!==(s._startTime+s._totalTime)/s._timeScale&&s.totalTime(s._totalTime,!0),s=s._timeline}this._gc&&this._enabled(!0,!1),this._totalTime===t&&0!==this._duration||(X.length&&G(),this.render(t,e,!1),X.length&&G())}return this},t.progress=t.totalProgress=function(t,e){var i=this.duration();return arguments.length?this.totalTime(i*t,e):i?this._time/i:this.ratio},t.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},t.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},t.timeScale=function(t){return arguments.length?(t=t||v,this._timeline&&this._timeline.smoothChildTiming&&(i=(e=this._pauseTime)||0===e?e:this._timeline.totalTime(),this._startTime=i-(i-this._startTime)*this._timeScale/t),this._timeScale=t,this._uncache(!1)):this._timeScale;var e,i},t.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},t.paused=function(t){if(!arguments.length)return this._paused;var e,i,r=this._timeline;return t!=this._paused&&r&&(g||t||M.wake(),i=(e=r.rawTime())-this._pauseTime,!t&&r.smoothChildTiming&&(this._startTime+=i,this._uncache(!1)),this._pauseTime=t?e:null,this._paused=t,this._active=this.isActive(),!t&&0!=i&&this._initted&&this.duration()&&(e=r.smoothChildTiming?this._totalTime:(e-this._startTime)/this._timeScale,this.render(e,e===this._totalTime,!0))),this._gc&&!t&&this._enabled(!0,!1),this};var F=p("core.FWDSimpleTimeline",function(t){f.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});(t=F.prototype=new f).constructor=F,t.kill()._gc=!1,t._first=t._last=t._recent=null,t._sortChildren=!1,t.add=t.insert=function(t,e,i,r){var s,n;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),s=this._last,this._sortChildren)for(n=t._startTime;s&&s._startTime>n;)s=s._prev;return s?(t._next=s._next,s._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=s,this._recent=t,this._timeline&&this._uncache(!0),this},t._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},t.render=function(t,e,i){var r,s=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;s;)r=s._next,(s._active||t>=s._startTime&&!s._paused)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=r},t.rawTime=function(){return g||M.wake(),this._totalTime};var D=p("FWDTweenLite",function(t,e,i){if(f.call(this,e,i),this.render=D.prototype.render,null==t)throw"Cannot tween a null target.";this.target=t="string"==typeof t&&D.selector(t)||t;var r,s,n,a=t.jquery||t.length&&t!==_&&t[0]&&(t[0]===_||t[0].nodeType&&t[0].style&&!t.nodeType),o=this.vars.overwrite;if(this._overwrite=o=null==o?Z[D.defaultOverwrite]:"number"==typeof o?o>>0:Z[o],(a||t instanceof Array||t.push&&x(t))&&"number"!=typeof t[0])for(this._targets=n=l(t),this._propLookup=[],this._siblings=[],r=0;r<n.length;r++)(s=n[r])?"string"!=typeof s?s.length&&s!==_&&s[0]&&(s[0]===_||s[0].nodeType&&s[0].style&&!s.nodeType)?(n.splice(r--,1),this._targets=n=n.concat(l(s))):(this._siblings[r]=H(s,this,!1),1===o&&1<this._siblings[r].length&&J(s,this,null,1,this._siblings[r])):"string"==typeof(s=n[r--]=D.selector(s))&&n.splice(r+1,1):n.splice(r--,1);else this._propLookup={},this._siblings=H(t,this,!1),1===o&&1<this._siblings.length&&J(t,this,null,1,this._siblings);(this.vars.immediateRender||0===e&&0===this._delay&&!1!==this.vars.immediateRender)&&(this._time=-v,this.render(Math.min(0,-this._delay)))},!0),z=function(t){return t&&t.length&&t!==_&&t[0]&&(t[0]===_||t[0].nodeType&&t[0].style&&!t.nodeType)};(t=D.prototype=new f).constructor=D,t.kill()._gc=!1,t.ratio=0,t._firstPT=t._targets=t._overwrittenProps=t._startAt=null,t._notifyPluginsOfEnabled=t._lazy=!1,D.version="1.19.0",D.defaultEase=t._ease=new b(null,null,1,1),D.defaultOverwrite="auto",D.ticker=M,D.autoSleep=120,D.lagSmoothing=function(t,e){M.lagSmoothing(t,e)},D.selector=_.$||_.jQuery||function(t){var e=_.$||_.jQuery;return e?(D.selector=e)(t):"undefined"==typeof document?t:document.querySelectorAll?document.querySelectorAll(t):document.getElementById("#"===t.charAt(0)?t.substr(1):t)};var X=[],I={},N=/(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,Y=function(t){for(var e,i=this._firstPT;i;)e=i.blob?t?this.join(""):this.start:i.c*t+i.s,i.m?e=i.m(e,this._target||i.t):e<1e-6&&-1e-6<e&&(e=0),i.f?i.fp?i.t[i.p](i.fp,e):i.t[i.p](e):i.t[i.p]=e,i=i._next},E=function(t,e,i,r){var s,n,a,o,l,h,f,u=[t,e],p=0,_="",c=0;for(u.start=t,i&&(i(u),t=u[0],e=u[1]),u.length=0,s=t.match(N)||[],n=e.match(N)||[],r&&(r._next=null,r.blob=1,u._firstPT=u._applyPT=r),l=n.length,o=0;o<l;o++)f=n[o],_+=(h=e.substr(p,e.indexOf(f,p)-p))||!o?h:",",p+=h.length,c?c=(c+1)%5:"rgba("===h.substr(-5)&&(c=1),f===s[o]||s.length<=o?_+=f:(_&&(u.push(_),_=""),a=parseFloat(s[o]),u.push(a),u._firstPT={_next:u._firstPT,t:u,p:u.length-1,s:a,c:("="===f.charAt(1)?parseInt(f.charAt(0)+"1",10)*parseFloat(f.substr(2)):parseFloat(f)-a)||0,f:0,m:c&&c<4?Math.round:0}),p+=f.length;return(_+=e.substr(p))&&u.push(_),u.setRatio=Y,u},B=function(t,e,i,r,s,n,a,o,l){"function"==typeof r&&(r=r(l||0,t));var h,f="get"===i?t[e]:i,u=typeof t[e],p="string"==typeof r&&"="===r.charAt(1),_={t:t,p:e,s:f,f:"function"==u,pg:0,n:s||e,m:n?"function"==typeof n?n:Math.round:0,pr:0,c:p?parseInt(r.charAt(0)+"1",10)*parseFloat(r.substr(2)):parseFloat(r)-f||0};if("number"!=u&&("function"==u&&"get"===i&&(h=e.indexOf("set")||"function"!=typeof t["get"+e.substr(3)]?e:"get"+e.substr(3),_.s=f=a?t[h](a):t[h]()),"string"==typeof f&&(a||isNaN(f))?(_.fp=a,_={t:E(f,r,o||D.defaultStringFilter,_),p:"setRatio",s:0,c:1,f:2,pg:0,n:s||e,pr:0,m:0}):p||(_.s=parseFloat(f),_.c=parseFloat(r)-_.s||0)),_.c)return(_._next=this._firstPT)&&(_._next._prev=_),this._firstPT=_},W=D._internals={isArray:x,isSelector:z,lazyTweens:X,blobDif:E},L=D._plugins={},j=W.tweenLookup={},V=0,q=W.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1,callbackScope:1,stringFilter:1,id:1},Z={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,true:1,false:0},U=f._rootFramesTimeline=new F,$=f._rootTimeline=new F,Q=30,G=W.lazyRender=function(){var t,e=X.length;for(I={};-1<--e;)(t=X[e])&&!1!==t._lazy&&(t.render(t._lazy[0],t._lazy[1],!0),t._lazy=!1);X.length=0};$._startTime=M.time,U._startTime=M.frame,$._active=U._active=!0,setTimeout(G,1),f._updateRoot=D.render=function(){var t,e,i;if(X.length&&G(),$.render((M.time-$._startTime)*$._timeScale,!1,!1),U.render((M.frame-U._startTime)*U._timeScale,!1,!1),X.length&&G(),M.frame>=Q){for(i in Q=M.frame+(parseInt(D.autoSleep,10)||120),j){for(t=(e=j[i].tweens).length;-1<--t;)e[t]._gc&&e.splice(t,1);0===e.length&&delete j[i]}if((!(i=$._first)||i._paused)&&D.autoSleep&&!U._first&&1===M._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||M.sleep()}}},M.addEventListener("tick",f._updateRoot);var H=function(t,e,i){var r,s,n=t._fwdTweenID;if(j[n||(t._fwdTweenID=n="t"+V++)]||(j[n]={target:t,tweens:[]}),e&&((r=j[n].tweens)[s=r.length]=e,i))for(;-1<--s;)r[s]===e&&r.splice(s,1);return j[n].tweens},K=function(t,e,i,r){var s,n,a=t.vars.onOverwrite;return a&&(s=a(t,e,i,r)),(a=D.onOverwrite)&&(n=a(t,e,i,r)),!1!==s&&!1!==n},J=function(t,e,i,r,s){var n,a,o;if(1===r||4<=r){for(o=s.length,_=0;_<o;_++)if((a=s[_])!==e)a._gc||a._kill(null,t,e)&&(n=!0);else if(5===r)break;return n}for(var l,h=e._startTime+v,f=[],u=0,p=0===e._duration,_=s.length;-1<--_;)(a=s[_])===e||a._gc||a._paused||(a._timeline!==e._timeline?(l=l||tt(e,0,p),0===tt(a,l,p)&&(f[u++]=a)):a._startTime<=h&&a._startTime+a.totalDuration()/a._timeScale>h&&((p||!a._initted)&&h-a._startTime<=2e-10||(f[u++]=a)));for(_=u;-1<--_;)if(a=f[_],2===r&&a._kill(i,t,e)&&(n=!0),2!==r||!a._firstPT&&a._initted){if(2!==r&&!K(a,e))continue;a._enabled(!1,!1)&&(n=!0)}return n},tt=function(t,e,i){for(var r=t._timeline,s=r._timeScale,n=t._startTime;r._timeline;){if(n+=r._startTime,s*=r._timeScale,r._paused)return-100;r=r._timeline}return e<(n/=s)?n-e:i&&n===e||!t._initted&&n-e<2*v?v:(n+=t.totalDuration()/t._timeScale/s)>e+v?0:n-e-v};t._init=function(){var t,e,i,r,s,n,a=this.vars,o=this._overwrittenProps,l=this._duration,h=!!a.immediateRender,f=a.ease;if(a.startAt){for(r in this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),s={},a.startAt)s[r]=a.startAt[r];if(s.overwrite=!1,s.immediateRender=!0,s.lazy=h&&!1!==a.lazy,s.startAt=s.delay=null,this._startAt=D.to(this.target,0,s),h)if(0<this._time)this._startAt=null;else if(0!==l)return}else if(a.runBackwards&&0!==l)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{for(r in 0!==this._time&&(h=!1),i={},a)q[r]&&"autoCSS"!==r||(i[r]=a[r]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&!1!==a.lazy,i.immediateRender=h,this._startAt=D.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=f=f?f instanceof b?f:"function"==typeof f?new b(f,a.easeParams):P[f]||D.defaultEase:D.defaultEase,a.easeParams instanceof Array&&f.config&&(this._ease=f.config.apply(f,a.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(n=this._targets.length,t=0;t<n;t++)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],o?o[t]:null,t)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,o,0);if(e&&D._onPluginEvent("_onInitAllProps",this),o&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),a.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=a.onUpdate,this._initted=!0},t._initProps=function(t,e,i,r,s){var n,a,o,l,h,f;if(null==t)return!1;for(n in I[t._fwdTweenID]&&G(),this.vars.css||t.style&&t!==_&&t.nodeType&&L.css&&!1!==this.vars.autoCSS&&function(t,e){var i,r={};for(i in t)q[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!L[i]||L[i]&&L[i]._autoCSS)||(r[i]=t[i],delete t[i]);t.css=r}(this.vars,t),this.vars)if(f=this.vars[n],q[n])f&&(f instanceof Array||f.push&&x(f))&&-1!==f.join("").indexOf("{self}")&&(this.vars[n]=f=this._swapSelfInParams(f,this));else if(L[n]&&(l=new L[n])._onInitTween(t,this.vars[n],this,s)){for(this._firstPT=h={_next:this._firstPT,t:l,p:"setRatio",s:0,c:1,f:1,n:n,pg:1,pr:l._priority,m:0},a=l._overwriteProps.length;-1<--a;)e[l._overwriteProps[a]]=this._firstPT;(l._priority||l._onInitAllProps)&&(o=!0),(l._onDisable||l._onEnable)&&(this._notifyPluginsOfEnabled=!0),h._next&&(h._next._prev=h)}else e[n]=B.call(this,t,n,"get",f,n,0,null,this.vars.stringFilter,s);return r&&this._kill(r,t)?this._initProps(t,e,i,r,s):1<this._overwrite&&this._firstPT&&1<i.length&&J(t,this,e,this._overwrite,i)?(this._kill(e,t),this._initProps(t,e,i,r,s)):(this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration)&&(I[t._fwdTweenID]=!0),o)},t.render=function(t,e,i){var r,s,n,a,o,l,h,f=this._time,u=this._duration,p=this._rawPrevTime;if(u-1e-7<=t?(this._totalTime=this._time=u,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(r=!0,s="onComplete",i=i||this._timeline.autoRemoveChildren),0===u&&(!this._initted&&this.vars.lazy&&!i||(this._startTime===this._timeline._duration&&(t=0),(p<0||t<=0&&-1e-7<=t||p===v&&"isPause"!==this.data)&&p!==t&&(i=!0,v<p&&(s="onReverseComplete")),this._rawPrevTime=a=!e||t||p===t?t:v))):t<1e-7?(this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==f||0===u&&0<p)&&(s="onReverseComplete",r=this._reversed),t<0&&(this._active=!1,0===u&&(!this._initted&&this.vars.lazy&&!i||(0<=p&&(p!==v||"isPause"!==this.data)&&(i=!0),this._rawPrevTime=a=!e||t||p===t?t:v))),this._initted||(i=!0)):(this._totalTime=this._time=t,this._easeType?(o=t/u,(1===(l=this._easeType)||3===l&&.5<=o)&&(o=1-o),3===l&&(o*=2),1===(h=this._easePower)?o*=o:2===h?o*=o*o:3===h?o*=o*o*o:4===h&&(o*=o*o*o*o),this.ratio=1===l?1-o:2===l?o:t/u<.5?o/2:1-o/2):this.ratio=this._ease.getRatio(t/u)),this._time!==f||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(!1!==this.vars.lazy&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=f,this._rawPrevTime=p,X.push(this),void(this._lazy=[t,e]);this._time&&!r?this.ratio=this._ease.getRatio(this._time/u):r&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(!1!==this._lazy&&(this._lazy=!1),this._active||!this._paused&&this._time!==f&&0<=t&&(this._active=!0),0===f&&(this._startAt&&(0<=t?this._startAt.render(t,e,i):s=s||"_dummyGS"),this.vars.onStart&&(0===this._time&&0!==u||e||this._callback("onStart"))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(t<0&&this._startAt&&-1e-4!==t&&this._startAt.render(t,e,i),e||(this._time!==f||r||i)&&this._callback("onUpdate")),s&&(this._gc&&!i||(t<0&&this._startAt&&!this._onUpdate&&-1e-4!==t&&this._startAt.render(t,e,i),r&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[s]&&this._callback(s),0===u&&this._rawPrevTime===v&&a!==v&&(this._rawPrevTime=0)))}},t._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:D.selector(e)||e;var r,s,n,a,o,l,h,f,u,p=i&&this._time&&i._startTime===this._startTime&&this._timeline===i._timeline;if((x(e)||z(e))&&"number"!=typeof e[0])for(r=e.length;-1<--r;)this._kill(t,e[r],i)&&(l=!0);else{if(this._targets){for(r=this._targets.length;-1<--r;)if(e===this._targets[r]){o=this._propLookup[r]||{},this._overwrittenProps=this._overwrittenProps||[],s=this._overwrittenProps[r]=t?this._overwrittenProps[r]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,s=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){if(h=t||o,f=t!==s&&"all"!==s&&t!==o&&("object"!=typeof t||!t._tempKill),i&&(D.onOverwrite||this.vars.onOverwrite)){for(n in h)o[n]&&(u=u||[]).push(n);if((u||!t)&&!K(this,i,e,u))return!1}for(n in h)(a=o[n])&&(p&&(a.f?a.t[a.p](a.s):a.t[a.p]=a.s,l=!0),a.pg&&a.t._kill(h)&&(l=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),f&&(s[n]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return l},t.invalidate=function(){return this._notifyPluginsOfEnabled&&D._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],f.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-v,this.render(Math.min(0,-this._delay))),this},t._enabled=function(t,e){if(g||M.wake(),t&&this._gc){var i,r=this._targets;if(r)for(i=r.length;-1<--i;)this._siblings[i]=H(r[i],this,!0);else this._siblings=H(this.target,this,!0)}return f.prototype._enabled.call(this,t,e),!(!this._notifyPluginsOfEnabled||!this._firstPT)&&D._onPluginEvent(t?"_onEnable":"_onDisable",this)},D.to=function(t,e,i){return new D(t,e,i)},D.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new D(t,e,i)},D.fromTo=function(t,e,i,r){return r.startAt=i,r.immediateRender=0!=r.immediateRender&&0!=i.immediateRender,new D(t,e,r)},D.delayedCall=function(t,e,i,r,s){return new D(e,0,{delay:t,onComplete:e,onCompleteParams:i,callbackScope:r,onReverseComplete:e,onReverseCompleteParams:i,immediateRender:!1,lazy:!1,useFrames:s,overwrite:0})},D.set=function(t,e){return new D(t,0,e)},D.getTweensOf=function(t,e){if(null==t)return[];var i,r,s,n;if(t="string"==typeof t&&D.selector(t)||t,(x(t)||z(t))&&"number"!=typeof t[0]){for(i=t.length,r=[];-1<--i;)r=r.concat(D.getTweensOf(t[i],e));for(i=r.length;-1<--i;)for(n=r[i],s=i;-1<--s;)n===r[s]&&r.splice(i,1)}else for(i=(r=H(t).concat()).length;-1<--i;)(r[i]._gc||e&&!r[i].isActive())&&r.splice(i,1);return r},D.killTweensOf=D.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var r=D.getTweensOf(t,e),s=r.length;-1<--s;)r[s]._kill(i,t)};var et=p("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=et.prototype},!0);if(t=et.prototype,et.version="1.19.0",et.API=2,t._firstPT=null,t._addTween=B,t.setRatio=Y,t._kill=function(t){var e,i=this._overwriteProps,r=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;-1<--e;)null!=t[i[e]]&&i.splice(e,1);for(;r;)null!=t[r.n]&&(r._next&&(r._next._prev=r._prev),r._prev?(r._prev._next=r._next,r._prev=null):this._firstPT===r&&(this._firstPT=r._next)),r=r._next;return!1},t._mod=t._roundProps=function(t){for(var e,i=this._firstPT;i;)(e=t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&"function"==typeof e&&(2===i.f?i.t._applyPT.m=e:i.m=e),i=i._next},D._onPluginEvent=function(t,e){var i,r,s,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,r=s;r&&r.pr>o.pr;)r=r._next;(o._prev=r?r._prev:n)?o._prev._next=o:s=o,(o._next=r)?r._prev=o:n=o,o=a}o=e._firstPT=s}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},et.activate=function(t){for(var e=t.length;-1<--e;)t[e].API===et.API&&(L[(new t[e])._propName]=t[e]);return!0},s.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,r=t.priority||0,s=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_mod",mod:"_mod",initAll:"_onInitAllProps"},a=p("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){et.call(this,i,r),this._overwriteProps=s||[]},!0===t.fwd_global),o=a.prototype=new et(i);for(e in(o.constructor=a).API=t.API,n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,et.activate([a]),a},o=_._fwd_fwdQueue){for(h=0;h<o.length;h++)o[h]();for(t in w)w[t].func||_.console.log("FWDAnimation encountered missing dependency: "+t)}g=!1}}("undefined"!=typeof fwd_module&&fwd_module.exports&&"undefined"!=typeof fwd_global?fwd_global:this||window,"FWDAnimation"));