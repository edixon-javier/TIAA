/**
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
}(window));