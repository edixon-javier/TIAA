/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Custom console.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	
	var Logger = function(){

		'use strict';
		
		var _s  = this;
		var prototype = Logger.prototype;
		
		_s.main_do = null;
		

		/**
		 * Initialize.
		 */
		_s.init = function(){
			_s.setupScreen();
			window.onerror = _s.showError;
			_s.screen.style.zIndex = 100000009;

			setTimeout(_s.addConsoleToDom, 100);
			setInterval(_s.position, 100);
		};
		
		_s.position = function(){
			var scrollOffsets = FWDR3DCovUtils.getScrollOffsets();
			_s.setX(scrollOffsets.x);
			_s.setY(scrollOffsets.y);
		};
		
		_s.addConsoleToDom  = function(){
			if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1){
				document.getElementsByTagName("body")[0].appendChild(_s.screen);
			}else{
				document.documentElement.appendChild(_s.screen);
			}
		};
		

		/**
		 * Setup screens.
		 */
		_s.setupScreen = function(){
			_s.main_do = new FWDR3DCovDO("div", "absolute");
			_s.main_do.setOverflow("auto");
			_s.main_do.setWidth(200);
			_s.main_do.setHeight(300);
			_s.setWidth(200);
			_s.setHeight(300);
			_s.main_do.setBkColor("#FFFFFF");
			_s.main_do.style().color = '#000';
			_s.addChild(_s.main_do);
		};
		
		_s.showError = function(message, url, linenumber) {
			var currentInnerHTML = _s.main_do.getInnerHTML() + "<br>" + "JavaScript error: " + message + " on line " + linenumber + " for " + url;
			_s.main_do.setInnerHTML(currentInnerHTML);
			_s.main_do.screen.scrollTop = _s.main_do.screen.scrollHeight;
		};
		
		_s.log = function(message){
			var currentInnerHTML = _s.main_do.getInnerHTML() + "<br>" + message;
			_s.main_do.setInnerHTML(currentInnerHTML);  
			_s.main_do.getScreen().scrollTop = 10000;
		};
		
		_s.init();
	};
	
	/**
	 * Set prototype.
	 */
    Logger.setPrototype = function(){
    	Logger.prototype = new FWDR3DCovDO("div", "absolute");
    };
    
    Logger.prototype = null;
	window.Logger = Logger;
}(window));