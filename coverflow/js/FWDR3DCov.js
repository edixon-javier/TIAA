/**
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

}(window));