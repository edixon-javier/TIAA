/**
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
			var	newY = -Math.floor(_s.thumbHeight/2);

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

}(window));