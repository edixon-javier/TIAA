/**
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
}(window));