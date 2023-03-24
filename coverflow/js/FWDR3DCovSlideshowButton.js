/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Slideshow button.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
	var FWDR3DCovSlideshowButton = function(prt, _d){
		
		'use strict';

		var _s = this;
		var prototype = FWDR3DCovSlideshowButton.prototype;

		_s.playButtonNImg = _d.playButtonNImg;
		_s.playButtonSPath = _d.playButtonSPath;
		_s.pauseButtonImg = _d.pauseButtonImg;

		_s.playButtonDO;
		_s.playButtonNDO;
		_s.playButtonSDO;
		
		_s.pauseButtonDO;
	
		_s.delay = _d.slideshowDelay;
		_s.autoplay = _d.autoplay;
		
		_s.isStopped = true;
		
		if(!_d.useVectorIcons){
			_s.btnWidth = _s.playButtonNImg.width;
			_s.btnHeight = _s.playButtonNImg.height;
		}

		_s.isMobile = FWDR3DCovUtils.isMobile;
		_s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;
		
		
		_s.animDelayId_to;
		_s.timeoutId;
		_s.timerIntervalId;


		/**
		 * Initialize.
		 */
		_s.init = function(){
			_s.setupMainContainers();
		};


		/**
		 * Setup main containers.
		 */
		_s.setupMainContainers = function(){
			_s.setButtonMode(true);

			if(_d.useVectorIcons){
				var cls = 'fwdr3dcov-slideshow-button';
				if(_d.isSkinWhite){
					cls += ' white';
				}
				_s.screen.className = cls;
				setTimeout(function(){
					_s.btnHeight = parseInt(getComputedStyle(_s.screen).getPropertyValue("height"));
					_s.btnWidth = parseInt(getComputedStyle(_s.screen).getPropertyValue("width"));
					_s.initAll();
				}, 5);
			}else{
				_s.initAll();
				_s.screen.className = 'fwdr3dcov-slideshow-button-';
			}
		};

		_s.initAll = function(){
			_s.setWidth(_s.btnWidth);
			_s.setHeight(_s.btnHeight);
			
			_s.setPauseButton();
			_s.setTimerButton();
			_s.setPlayButton();

			if (_s.isMobile){
				if (_s.hasPointerEvent){
					_s.screen.addEventListener("MSPointerOver", _s.onMouseOver);
					_s.screen.addEventListener("MSPointerOut", _s.onMouseOut);
					_s.screen.addEventListener("MSPointerUp", _s.onClick);
				}else{
					_s.screen.addEventListener("touchend", _s.onClick);
				}
			}else{
				_s.screen.addEventListener("mouseover", _s.onMouseOver);
				_s.screen.addEventListener("mouseout", _s.onMouseOut);
				_s.screen.addEventListener("click", _s.onClick);
			}
		}

		_s.setTimerButton = function(){
			
			if(_d.useVectorIcons){
				var cls = 'fwdr3dcov-slideshow-button-bk';
				if(_d.isSkinWhite){
					cls += ' white';
				}
				_s.slpBk_do =  new FWDR3DCovDO("div");
				_s.slpBk_do.screen.className = cls;
			}else{
				_s.slpBk_do =  new FWDR3DCovDO("img");
				var img = new Image();
				img.src = _d.circleBK;
				_s.slpBk_do.setScreen(img);
			}
			
			_s.slpBk_do.setWidth(_s.btnWidth);
			_s.slpBk_do.setHeight(_s.btnHeight);
			_s.slpBk_do.setAlpha(0);
			_s.addChild(_s.slpBk_do); 

			FWDR3DCovPreloader.setPrototype();
			_s.slp_do = new FWDR3DCovPreloader(_s, 'none', 8, _d.slideshowPreloaderBackgroundColor, _d.slideshowPreloaderFillColor, 2.5, (_s.delay)/1000);
			_s.slp_do.setX(Math.round((_s.w - _s.slp_do.w)/2));
			_s.slp_do.setY(Math.round((_s.h - _s.slp_do.h)/2));
			_s.addChild(_s.slp_do);
		};
		
	
		_s.setPauseButton = function(){
			if(_d.useVectorIcons){
				var cls = 'fwdr3dcov-slideshow-pause-button';
				if(_d.isSkinWhite){
					cls += ' white';
				}
				_s.pauseButtonDO = new FWDR3DCovDO("div");
				_s.pauseButtonDO.setInnerHTML('<span class="fwdr3dcov-icon fwdr3dcov-icon-pause"></span>'),
				_s.pauseButtonDO.screen.className = cls;
			}else{
				_s.pauseButtonDO = new FWDR3DCovDO("img");
				_s.pauseButtonDO.setScreen(_s.pauseButtonImg);
			}
			_s.pauseButtonDO.setAlpha(0);
			_s.addChild(_s.pauseButtonDO);
			
			_s.pauseButtonDO.setWidth(_s.btnWidth);
			_s.pauseButtonDO.setHeight(_s.btnHeight);
		};
		
		_s.setPlayButton = function(){
			_s.playButtonDO = new FWDR3DCovDO("div");

			_s.playButtonClass = 'fwdr3dcov-slideshow-play-button'
			if(_d.isSkinWhite){
				_s.playButtonClass += ' white';
			}
		
			if(_d.useVectorIcons){
				var cls = 'fwdr3dcov-slideshow-play-button';
				if(_d.isSkinWhite){
					cls += ' white';
				}
				_s.playButtonDO.setInnerHTML('<span class="fwdr3dcov-icon fwdr3dcov-icon-play-fill"></span>'),
				_s.playButtonDO.screen.className = cls;
			}else{
				_s.playButtonNDO = new FWDR3DCovDO("img");
				_s.playButtonNDO.setScreen(_s.playButtonNImg);
				_s.playButtonDO.addChild(_s.playButtonNDO);

				_s.playButtonSDO = new FWDR3DCovDO("img");
				var img = new Image();
				img.src = _s.playButtonSPath;
				_s.playButtonSDO.setScreen(img);
				_s.playButtonSDO.setWidth(_s.playButtonNDO.w);
				_s.playButtonSDO.setHeight(_s.playButtonNDO.h);
				_s.playButtonSDO.setAlpha(0);
				_s.playButtonDO.addChild(_s.playButtonSDO);
			}
			
			_s.addChild(_s.playButtonDO);
			_s.playButtonDO.setWidth(_s.btnWidth);
			_s.playButtonDO.setHeight(_s.btnHeight);
		};

		_s.onMouseOver = function(){	
			if(_s.isStopped){
				_s.slp_do.hide2();
				if(_d.useVectorIcons){
					_s.playButtonDO.screen.className = _s.playButtonClass + ' selected';
				}else{
					FWDAnimation.to(_s.playButtonSDO, .8, {alpha:1, ease:Expo.easeOut});
				}
			}else{
				_s.slp_do.hide2();
				FWDAnimation.to(_s.slpBk_do, .8, {alpha:0, ease:Expo.easeOut});
			}
		};

		_s.onMouseOut = function(){
			if(_s.isStopped){
				_s.slp_do.hide2();
				_s.pauseButtonDO.setAlpha(0);
				FWDAnimation.to(_s.slpBk_do, .8, {alpha:0, ease:Expo.easeOut});
				if(_d.useVectorIcons){
					_s.playButtonDO.screen.className = _s.playButtonClass;
				}else{
					FWDAnimation.to(_s.playButtonSDO, .8, {alpha:0, ease : Expo.easeOut});
				}
			}else{
				_s.slp_do.show2();
				FWDAnimation.to(_s.slpBk_do, .8, {alpha:1, ease:Expo.easeOut});
			}
		};

		_s.onClick = function(e){
			if(_s.isStopped){
				_s.slp_do.resetSlideshow();
				_s.start();
				_s.pauseButtonDO.setAlpha(1);
				_s.dispatchEvent(FWDR3DCovSlideshowButton.PLAY_CLICK);
			}else{
				_s.stop();
				_s.pauseButtonDO.setAlpha(0);
				_s.dispatchEvent(FWDR3DCovSlideshowButton.PAUSE_CLICK);
			}
			
			if (!_s.isMobile){
				_s.onMouseOver();
			}
		};
		
		_s.start = function(){
			if(!_s.isStopped) return;
			
			_s.isStopped = false;
			_s.playButtonDO.setAlpha(0);
			
			clearTimeout(_s.timeoutId);	
			if(!prt.videoStarted){
				_s.timeoutId = setTimeout(_s.onTimeHandler, _s.delay);
				_s.startSlideshow();
			}
		};
		
		_s.stop = function(){
			_s.isStopped = true;
			_s.playButtonDO.setAlpha(1);
			_s.stopSlideshow();
			_s.onMouseOut();
			clearTimeout(_s.timeoutId);
		};

		_s.pause = function(){
			if(_s.isStopped) return;
			clearTimeout(_s.timeoutId);
			_s.stopSlideshow();
		};

		_s.resume = function(dl){
			if(_s.isStopped) return;
			if(!prt.videoStarted){
				 _s.startSlideshow();
				clearTimeout(_s.timeoutId);
				_s.timeoutId = setTimeout(function(){
					_s.onTimeHandler();
				}, _s.delay);
			}
		};
	
		_s.onTimeHandler = function(){
			clearTimeout(_s.timeoutId);
			_s.stopSlideshow();
			_s.dispatchEvent(FWDR3DCovSlideshowButton.TIME);
		};


		_s.hideSlideshow = function(){
		
			FWDAnimation.killTweensOf(_s.playButtonSDO);
			FWDAnimation.to(_s.playButtonSDO, .8, {alpha:0, ease : Expo.easeOut});

			FWDAnimation.killTweensOf(_s.slpBk_do);
			FWDAnimation.to(_s.slpBk_do, .8, {alpha:0, ease : Expo.easeOut});

			FWDAnimation.killTweensOf(_s.pauseButtonDO);
			FWDAnimation.to(_s.pauseButtonDO, .8, {alpha:0, ease : Expo.easeOut});
			
			_s.slp_do.hide2();
			
		}

		_s.startSlideshow = function(){
			_s.slp_do.startSlideshow();
		}

		_s.stopSlideshow = function(o){
			_s.slp_do.stopSlideshow(o);
		}

		_s.init();
	};

	
	/**
	 * Prototype.
	 */
	FWDR3DCovSlideshowButton.setPrototype = function()
	{
		FWDR3DCovSlideshowButton.prototype = new FWDR3DCovDO("div");
	};

	FWDR3DCovSlideshowButton.PLAY_CLICK = "onPlayClick";
	FWDR3DCovSlideshowButton.PAUSE_CLICK = "onPauseClick";
	FWDR3DCovSlideshowButton.TIME = "onTime";

	FWDR3DCovSlideshowButton.prototype = null;
	window.FWDR3DCovSlideshowButton = FWDR3DCovSlideshowButton;
}(window));