/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Timer manager.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
	
	var FWDR3DCovTimerManager = function(delay, autoplay){

		'use strict';
		
		var _s = this;
		var prototpype = FWDR3DCovTimerManager.prototype;
		
		_s.timeOutId;
		_s.delay = delay;
		_s.isStopped_bl = !autoplay;
		
		_s.stop = function(){
			clearTimeout(_s.timeOutId);
			_s.dispatchEvent(FWDR3DCovTimerManager.STOP);
		};
		
		_s.start = function(){
			if(!_s.isStopped_bl){
				_s.timeOutId = setTimeout(_s.onTimeHanlder, _s.delay);
				_s.dispatchEvent(FWDR3DCovTimerManager.START);
			}
		};
		
		_s.onTimeHanlder = function(){
			_s.dispatchEvent(FWDR3DCovTimerManager.TIME);
		};
	};

	FWDR3DCovTimerManager.setProtptype = function(){
		FWDR3DCovTimerManager.prototype = new FWDR3DCovEventDispatcher();
	};
	
	FWDR3DCovTimerManager.START = "start";
	FWDR3DCovTimerManager.STOP = "stop";
	FWDR3DCovTimerManager.TIME = "time";
	
	FWDR3DCovTimerManager.prototype = null;
	window.FWDR3DCovTimerManager = FWDR3DCovTimerManager;
	
}(window));