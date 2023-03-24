/**
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
	
}(window));