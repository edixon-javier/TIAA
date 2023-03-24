/**
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
}(window));