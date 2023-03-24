/**
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
}(window));