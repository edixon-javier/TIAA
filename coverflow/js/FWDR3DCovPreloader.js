/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Preloader.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	
	var FWDR3DCovPreloader = function(prt, preloaderPostion, radius, backgroundColor, fillColor, strokeSize, animDur){

		'use strict';
		
		var _s  = this;
		var prototype = FWDR3DCovPreloader.prototype;
		_s.main_do;
		_s.preloaderPostion = preloaderPostion;
		_s.backgroundColor = backgroundColor;
		_s.fillColor = fillColor;
		_s.radius = radius;
		_s.strokeSize = strokeSize;
		_s.animDur = animDur || 300;
		_s.strtAngle = 270;
		_s.isShowed_bl = true;
		_s.angle = {n:0};
		
		
		/**
		 * Initialize.
		 */
		_s.init = function(){
			_s.mm_do =  new FWDR3DCovDO("div");
			_s.mm_do.setOverflow('visible');
			

			_s.main_do = new FWDR3DCovDO("div");
			_s.main_do.setOverflow("visible");
			_s.main_do.setWidth(_s.radius * 2 + _s.strokeSize);
			_s.main_do.setHeight(_s.radius * 2 + _s.strokeSize);
			
			_s.setOverflow('visible');
			_s.setWidth((_s.radius * 2) + _s.strokeSize);
			_s.setHeight((_s.radius * 2) + _s.strokeSize);
			_s.mm_do.setWidth(_s.w);
			_s.mm_do.setHeight(_s.h);
			_s.bkCanvas =  new FWDR3DCovDO("canvas");
			_s.bkCanvasContext = _s.bkCanvas.screen.getContext('2d');
			_s.fillCircleCanvas = new FWDR3DCovDO("canvas");
			_s.fillCtx = _s.fillCircleCanvas.screen.getContext('2d');
			_s.main_do.screen.style.transformOrigin = "50% 50%";
			
			_s.main_do.addChild(_s.bkCanvas);
			_s.main_do.addChild(_s.fillCircleCanvas);
			_s.mm_do.addChild(_s.main_do);
			_s.addChild(_s.mm_do);
			_s.drawBackground();
			_s.drawFill();
			_s.hide();
		};

		_s.setFWidth = function(w, h){
			_s.main_do.setX(Math.round(w-_s.w)/2);
			_s.main_do.setY(Math.round(h-_s.h)/2);
			_s.setWidth(w);
			_s.setHeight(h);

		}


		/**
		 * Postion and resize.
		 */
		_s.positionAndResize = function(){

			if(_s.preloaderPostion == 'bottomleft'){
				_s.setX(prt.offsetPreloader);
				_s.setY(prt.sH - _s.h - prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'bottomright'){
				_s.setX(prt.sW - _s.w - prt.offsetPreloader);
				_s.setY(prt.sH - _s.h - prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'topright'){
				_s.setX(prt.sW - _s.w - prt.offsetPreloader);
				_s.setY(prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'topleft'){
				_s.setX(prt.offsetPreloader);
				_s.setY(prt.offsetPreloader);
			}else if(_s.preloaderPostion == 'center'){
				_s.setX(Math.round(prt.sW - _s.w)/2);
				_s.setY(Math.round(Math.min(prt.sH, prt.viewportSize.h) - _s.h)/2);
			}
		}	

		
		/**
		 * Draw background.
		 */
		_s.drawBackground = function(){
			_s.bkCanvas.screen.width = (_s.radius * 2) + _s.strokeSize * 2;
			_s.bkCanvas.screen.height = (_s.radius * 2) + _s.strokeSize * 2;
			_s.bkCanvasContext.lineWidth = _s.thicknessSize;
			_s.bkCanvasContext.translate(_s.strokeSize/2, _s.strokeSize/2);
			_s.bkCanvasContext.shadowColor = '#333333';
		    _s.bkCanvasContext.shadowBlur = 1;
		   
			_s.bkCanvasContext.lineWidth=_s.strokeSize;
			_s.bkCanvasContext.strokeStyle = _s.backgroundColor;
			_s.bkCanvasContext.beginPath();
			_s.bkCanvasContext.arc(_s.radius, _s.radius,  _s.radius, (Math.PI/180) * 0, (Math.PI/180) * 360, false);
			_s.bkCanvasContext.stroke();
			_s.bkCanvasContext.closePath();
		};
		
		
		/**
		 * Draw fill.
		 */
		_s.drawFill = function(p){	
			if(p) _s.angle.n = Math.round(p * 360);	
			_s.fillCircleCanvas.screen.width = (_s.radius * 2) + _s.strokeSize * 2;
			_s.fillCircleCanvas.screen.height = (_s.radius * 2) + _s.strokeSize * 2;
			_s.fillCtx.lineWidth = _s.thicknessSize;
			_s.fillCtx.translate(_s.strokeSize/2, _s.strokeSize/2);
			_s.fillCtx.lineWidth=_s.strokeSize;
			_s.fillCtx.strokeStyle = _s.fillColor;
			_s.fillCtx.beginPath();
			_s.fillCtx.arc(_s.radius, _s.radius,  _s.radius, (Math.PI/180) * _s.strtAngle, (Math.PI/180) * (_s.strtAngle +  _s.angle.n), false);
			_s.fillCtx.stroke();
			_s.fillCtx.closePath()
		};
		
		
		/**
		 * Start/stop preloader animation.
		 */
		_s.startSlideshow = function(){
			if(_s == null || self.isSlideShowRun) return;
			self.isSlideShowRun = true;
			FWDAnimation.killTweensOf(_s.angle);
			FWDAnimation.to(_s.angle, _s.animDur, {n:360, onUpdate:_s.drawFill, onComplete:_s.stopSlideshow});
		};
		
		_s.stopSlideshow = function(o){
			if(!self.isSlideShowRun && !o) return;
			self.isSlideShowRun = false;
			FWDAnimation.killTweensOf(_s.angle);
			FWDAnimation.to(_s.angle, .8, {n:0, onUpdate:_s.drawFill, ease:Expo.easeInOut});
		};

		_s.resetSlideshow = function(){
			FWDAnimation.killTweensOf(_s.angle);
			_s.angle.n = 0;
			_s.drawFill();
		}
		
		_s.startPreloader = function(){
			_s.stopPreloader();
			_s.angle = {n:0};
			FWDAnimation.to(_s.angle, _s.animDur, {n:360, onUpdate:_s.drawFill, repeat:100, yoyo:true, ease:Expo.easeInOut});
			FWDAnimation.to(_s.main_do.screen, _s.animDur, {rotation:360,  repeat:100});
		}

		_s.stopPreloader = function(){
			FWDAnimation.killTweensOf(_s.angle);
			FWDAnimation.killTweensOf(_s.main_do.screen);
			FWDAnimation.to(_s.main_do.screen, 0.00001, {rotation:0});
		}
		
	
		/**
		 * Show/hide preloader animation.
		 */
		_s.show = function(){
			if(_s.isShowed_bl) return;
			_s.setVisible(true);
			FWDAnimation.killTweensOf(_s.mm_do);
			FWDAnimation.to(_s.mm_do, 1, {alpha:1, delay:.2});
			_s.stopPreloader();
			_s.startPreloader();
			_s.isShowed_bl = true;
		};
		
		_s.hide = function(animate){
			if(!_s.isShowed_bl) return;
			
			FWDAnimation.killTweensOf(_s.mm_do);
			if(animate){
				FWDAnimation.to(_s.mm_do, .2, {alpha:0, onComplete:_s.onHideComplete});
			}else{
				_s.setVisible(false);
				_s.mm_do.setAlpha(0);
			}
			_s.isShowed_bl = false;
		};

		_s.show2 = function(){
			if(_s.isShowed_bl) return;
			_s.isShowed_bl = true;
			_s.setVisible(true);
			FWDAnimation.killTweensOf(_s.mm_do);
			FWDAnimation.to(_s.mm_do, 1, {alpha:1, ease:Expo.easeOut});
		}

		_s.hide2 = function(){
			if(!_s.isShowed_bl) return;
			_s.isShowed_bl = false;
			FWDAnimation.killTweensOf(_s.mm_do);
			FWDAnimation.to(_s.mm_do, 1, {alpha:0, onComplete:_s.onHideComplete, ease:Expo.easeOut});
		}
		
		_s.onHideComplete = function(){
			_s.setVisible(false);
			_s.stopPreloader();
			_s.dispatchEvent(FWDR3DCovPreloader.HIDE_COMPLETE);
		};
		
		_s.init();
	};
	
	
	/**
	 * Set prototype.
	 */
    FWDR3DCovPreloader.setPrototype = function(){
    	FWDR3DCovPreloader.prototype = new FWDR3DCovDO("div");
    };
    
    FWDR3DCovPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDR3DCovPreloader.prototype = null;
	window.FWDR3DCovPreloader = FWDR3DCovPreloader;
}(window));