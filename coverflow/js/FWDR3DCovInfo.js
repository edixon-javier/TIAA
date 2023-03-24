/**
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
}(window));