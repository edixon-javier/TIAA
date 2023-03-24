/**
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
}(window));