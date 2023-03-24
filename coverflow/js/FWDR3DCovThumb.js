/**
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
			if (_s.isEnabled) 	return;
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
}(window));