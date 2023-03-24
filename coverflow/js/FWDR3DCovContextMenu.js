/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Right click context menu.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (){
	var FWDR3DCovContextMenu = function(e, showMenu){

		'use strict';
		
		var _s = this;
		_s.prt = e;
		_s.url = "http://www.webdesign-flash.ro";
		_s.menu_do = null;
		_s.normalMenu_do = null;
		_s.selectedMenu_do = null;
		_s.over_do = null;
		_s.isDisabled_bl = false;
		

		/**
		 * Initialize.
		 */
		_s.init = function(){
			_s.updateParent(_s.prt);
		};
		

		/**
		 * Update parent.
		 */
		_s.updateParent = function(prt){
			if(_s.prt){
				if(_s.prt.screen.addEventListener){
					_s.prt.screen.removeEventListener("contextmenu", _s.contextMenuHandler);
				}else{
					_s.prt.screen.detachEvent("oncontextmenu", _s.contextMenuHandler);
				}
				
			}
			_s.prt = prt;
			
			if(_s.prt.screen.addEventListener){
				_s.prt.screen.addEventListener("contextmenu", _s.contextMenuHandler);
			}else{
				_s.prt.screen.attachEvent("oncontextmenu", _s.contextMenuHandler);
			}
		};
		
		_s.contextMenuHandler = function(e){
			if(_s.isDisabled_bl) return;
			if(showMenu =="disabled"){
				if(e.preventDefault){
					e.preventDefault();
					return;
				}else{
					return false;
				}
			}else if(showMenu =="default"){
				return;
			}
			
			if(_s.url.indexOf("sh.r") == -1) return;
			_s.setupMenus();
			_s.prt.addChild(_s.menu_do);
			_s.menu_do.setVisible(true);
			_s.positionButtons(e);
			
			if(window.addEventListener){
				window.addEventListener("mousedown", _s.contextMenuWindowOnMouseDownHandler);
			}else{
				document.documentElement.attachEvent("onclick", _s.contextMenuWindowOnMouseDownHandler);
			}
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
			
		};
		
		_s.contextMenuWindowOnMouseDownHandler = function(e){
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);
			var screenX = viewportMouseCoordinates.screenX;
			var screenY = viewportMouseCoordinates.screenY;
			
			if(!FWDR3DCovUtils.hitTest(_s.menu_do.screen, screenX, screenY)){
				if(window.removeEventListener){
					window.removeEventListener("mousedown", _s.contextMenuWindowOnMouseDownHandler);
				}else{
					document.documentElement.detachEvent("onclick", _s.contextMenuWindowOnMouseDownHandler);
				}
				_s.menu_do.setX(-500);
			}
		};
		
		
		/**
		 * Setup menus.
		 */
		_s.setupMenus = function(){
			if(_s.menu_do) return;
			_s.menu_do = new FWDR3DCovDO("div");
			_s.menu_do.setX(-500);
			_s.menu_do.style().width = "100%";
			
			_s.normalMenu_do = new FWDR3DCovDO("div");
			_s.normalMenu_do.style().fontFamily = "Arial, Helvetica, sans-serif";
			_s.normalMenu_do.style().padding = "4px";
			_s.normalMenu_do.style().fontSize = "12px";
			_s.normalMenu_do.style().color = "#000000";
			_s.normalMenu_do.setInnerHTML("&#0169; made by FWD");
			_s.normalMenu_do.setBkColor("#FFFFFF");
			
			_s.selectedMenu_do = new FWDR3DCovDO("div");
			_s.selectedMenu_do.style().fontFamily = "Arial, Helvetica, sans-serif";
			_s.selectedMenu_do.style().padding = "4px";
			_s.selectedMenu_do.style().fontSize = "12px";
			_s.selectedMenu_do.style().color = "#FFFFFF";
			_s.selectedMenu_do.setInnerHTML("&#0169; made by FWD");
			_s.selectedMenu_do.setBkColor("#000000");
			_s.selectedMenu_do.setAlpha(0);
			
			_s.over_do = new FWDR3DCovDO("div");
			_s.over_do.setBkColor("#FF0000");
			_s.over_do.setAlpha(0);
			
			_s.menu_do.addChild(_s.normalMenu_do);
			_s.menu_do.addChild(_s.selectedMenu_do);
			_s.menu_do.addChild(_s.over_do);
			_s.prt.addChild(_s.menu_do);
			_s.over_do.setWidth(_s.selectedMenu_do.getWidth());
			_s.menu_do.setWidth(_s.selectedMenu_do.getWidth());
			_s.over_do.setHeight(_s.selectedMenu_do.getHeight());
			_s.menu_do.setHeight(_s.selectedMenu_do.getHeight());
			_s.menu_do.setVisible(false);
			
			_s.menu_do.setButtonMode(true);
			_s.menu_do.screen.onmouseover = _s.mouseOverHandler;
			_s.menu_do.screen.onmouseout = _s.mouseOutHandler;
			_s.menu_do.screen.onclick = _s.onClickHandler;
		};
		
		_s.mouseOverHandler = function(){
			if(_s.url.indexOf("w.we") == -1) _s.menu_do.visible = false;
			FWDAnimation.to(_s.normalMenu_do, .8, {alpha:0, ease:Expo.easeOut});
			FWDAnimation.to(_s.selectedMenu_do, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		_s.mouseOutHandler = function(){
			FWDAnimation.to(_s.normalMenu_do, .8, {alpha:1, ease:Expo.easeOut});
			FWDAnimation.to(_s.selectedMenu_do, .8, {alpha:0, ease:Expo.easeOut});
		};
		
		_s.onClickHandler = function(){
			window.open(_s.url, "_blank");
		};
		
		
		/**
		 * Position buttons.
		 */
		_s.positionButtons = function(e){
			var viewportMouseCoordinates = FWDR3DCovUtils.getViewportMouseCoordinates(e);
			var localX = viewportMouseCoordinates.screenX - _s.prt.getGlobalX(); 
			var localY = viewportMouseCoordinates.screenY - _s.prt.getGlobalY();
			var finalX = localX + 2;
			var finalY = localY + 2;
			
			if(finalX > _s.prt.getWidth() - _s.menu_do.getWidth() - 2){
				finalX = localX - _s.menu_do.getWidth() - 2;
			}
			
			if(finalY > _s.prt.getHeight() - _s.menu_do.getHeight() - 2){
				finalY = localY - _s.menu_do.getHeight() - 2;
			}
			_s.menu_do.setX(finalX);
			_s.menu_do.setY(finalY);
		};
		
		
		/**
		 * Enable/disable.
		 */
		_s.disable = function(){
			_s.isDisabled_bl = true;
		};
		
		_s.enable = function(){
			_s.isDisabled_bl = false;
		};
		
		_s.init();
	};
	
	FWDR3DCovContextMenu.prototype = null;
	window.FWDR3DCovContextMenu = FWDR3DCovContextMenu;
	
}(window));