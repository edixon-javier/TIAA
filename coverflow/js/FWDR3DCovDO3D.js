/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Display 3D Object.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, _s applies only if the position is relative.
	 */
	var FWDR3DCovDO3D = function(type, position, overflow, display){

		'use strict';
	
		var _s = this;
		_s.listeners = {events_ar:[]};
		
		if(type == "div" || type == "img" || type == "canvas"){
			_s.type = type;	
		}else{
			throw Error("Type is not valid! " + type);
		}
	
		_s.children_ar = [];
		_s.position = position || "absolute";
		_s.overflow = overflow || "hidden";
		_s.display = display || "block";
		_s.visible = true;
		_s.x = 0;
		_s.y = 0;
		_s.z = 0;
		_s.angleX = 0;
		_s.angleY = 0;
		_s.angleZ = 0;
		_s.perspective = 0;
		_s.zIndex = 0;
		_s.scale = 1;
		_s.w = 0;
		_s.h = 0;
		_s.rect;
		_s.alpha = 1;
		_s.innerHTML = "";
		_s.isHtml5_bl = false;
		
		_s.hasT3D = FWDR3DCovUtils.hasTransform3d;
		_s.hasT2D = FWDR3DCovUtils.hasTransform2d;
		
		
		/**
		 * Initialize.
		 */
		_s.init = function(){
			_s.setScreen();
		};	
		

		/**
		 * Check if it supports transforms.
		 */
		_s.getTransform = function() {
		    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
		    var p;
		    while (p = properties.shift()) {
		       if (typeof _s.screen.style[p] !== 'undefined') {
		            return p;
		       }
		    }
		    return false;
		};
		
		
		/**
		 * Check if it supports transforms.
		 */
		_s.setScreen = function(element){
			if(_s.type == "img" && element){
				_s.screen = element;
				_s.setMainProperties();
			}else{
				_s.screen = document.createElement(_s.type);
				_s.setMainProperties();
			}
		};
		
	
		/**
		 * Set main properties.
		 */
		_s.setMainProperties = function(){
			
			_s.transform = _s.getTransform();
			_s.setPosition(_s.position);
			_s.setDisplay(_s.display);
			_s.setOverflow(_s.overflow);
			
			_s.screen.style.left = "0px";
			_s.screen.style.top = "0px";
			_s.screen.style.margin = "0px";
			_s.screen.style.padding = "0px";
			_s.screen.style.maxWidth = "none";
			_s.screen.style.maxHeight = "none";
			_s.screen.style.border = "none";
			_s.screen.style.lineHeight = "1";
			
			if(type == "img"){
				_s.setWidth(_s.screen.width);
				_s.setHeight(_s.screen.height);
				_s.screen.onmousedown = function(e){return false;};
			}
		};
		
		_s.setBackfaceVisibility =  function(){
			_s.screen.style.backfaceVisibility = "visible";
			_s.screen.style.webkitBackfaceVisibility = "visible";
			_s.screen.style.MozBackfaceVisibility = "visible";		
		};
		
		_s.removeBackfaceVisibility =  function(){
			_s.screen.style.backfaceVisibility = "hidden";
			_s.screen.style.webkitBackfaceVisibility = "hidden";
			_s.screen.style.MozBackfaceVisibility = "hidden";		
		};
		
		
		/**
		 * Set / get various peoperties.
		 */
		_s.setSelectable = function(val){
			if(!val){
				try{_s.screen.style.userSelect = "none";}catch(e){};
				try{_s.screen.style.MozUserSelect = "none";}catch(e){};
				try{_s.screen.style.webkitUserSelect = "none";}catch(e){};
				try{_s.screen.style.khtmlUserSelect = "none";}catch(e){};
				try{_s.screen.style.oUserSelect = "none";}catch(e){};
				try{_s.screen.style.msUserSelect = "none";}catch(e){};
				try{_s.screen.msUserSelect = "none";}catch(e){};
				_s.screen.ondragstart = function(e){return  false;};
				_s.screen.onselectstart = function(){return false;};
				_s.screen.style.webkitTouchCallout='none';
			}
		};
		
		_s.getScreen = function(){
			return _s.screen;
		};
		
		_s.setVisible = function(val){
			_s.visible = val;
			if(_s.visible == true){
				_s.screen.style.visibility = "visible";
			}else{
				_s.screen.style.visibility = "hidden";
			}
		};
		
		_s.getVisible = function(){
			return _s.visible;
		};
			
		_s.setResizableSizeAfterParent = function(){
			_s.screen.style.width = "100%";
			_s.screen.style.height = "100%";
		};
		
		_s.style = function(){
			return _s.screen.style;
		};
		
		_s.setOverflow = function(val){
			_s.overflow = val;
			_s.screen.style.overflow = _s.overflow;
		};
		
		_s.setPosition = function(val){
			_s.position = val;
			_s.screen.style.position = _s.position;
		};
		
		_s.setDisplay = function(val){
			_s.display = val;
			_s.screen.style.display = _s.display;
		};
		
		_s.setButtonMode = function(val){
			_s.buttonMode = val;
			if(_s.buttonMode ==  true){
				_s.screen.style.cursor = "pointer";
			}else{
				_s.screen.style.cursor = "default";
			}
		};
		
		_s.setBkColor = function(val){
			_s.screen.style.backgroundColor = val;
		};
		
		_s.setInnerHTML = function(val){
			_s.innerHTML = val;
			_s.screen.innerHTML = _s.innerHTML;
		};
		
		_s.getInnerHTML = function(){
			return _s.innerHTML;
		};
		
		_s.getRect = function(){
			return _s.screen.getBoundingClientRect();
		};
		
		_s.setAlpha = function(val){
			_s.alpha = val;
			_s.screen.style.opacity = _s.alpha;
		};
		
		_s.getAlpha = function(){
			return _s.alpha;
		};
		
		_s.getRect = function(){
			return _s.screen.getBoundingClientRect();
		};
		
		_s.getGlobalX = function(){
			return _s.getRect().left;
		};
		
		_s.getGlobalY = function(){
			return _s.getRect().top;
		};
		
		_s.setX = function(val){
			_s.x = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}else if(_s.hasT2D){
				_s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
			}else{
				_s.screen.style.left = _s.x + "px";
			}
		};
		
		_s.getX = function(){
			return  _s.x;
		};
		
		_s.setY = function(val){
			_s.y = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}else if(_s.hasT2D){
				_s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
			}else{
				_s.screen.style.top = _s.y + "px";
			}
		};
		
		_s.getY = function(){
			return  _s.y;
		};
		
		_s.setZ = function(val){
			_s.z = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}
		};
		
		_s.getZ = function(){
			return  _s.z;
		};
		
		_s.setAngleX = function(val){
			_s.angleX = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}
		};
		
		_s.getAngleX = function(){
			return  _s.angleX;
		};
		
		_s.setAngleY = function(val){
			_s.angleY = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}
		};
		
		_s.getAngleY = function(){
			return  _s.angleY;
		};
		
		_s.setAngleZ = function(val){
			_s.angleZ = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}
		};
		
		_s.getAngleZ = function(){
			return  _s.angleZ;
		};
		
		_s.setScale2 = function(val){
			_s.scale = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) scale(" + _s.scale + ", " + _s.scale + ")";
			}else if(_s.hasT2D){
				_s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
			}
		};
		
		_s.setScale3D = function(val){
			_s.scale = val;
			if(_s.hasT3D){
				_s.screen.style[_s.transform] = "translate3d(" + _s.x + "px," + _s.y + "px," + _s.z + "px) rotateX(" + _s.angleX + "deg) rotateY(" + _s.angleY + "deg) rotateZ(" + _s.angleZ + "deg) scale3d(" + _s.scale + ", " + _s.scale + ", " + _s.scale + ")";
			}else if(_s.hasT2D){
				_s.screen.style[_s.transform] = "translate(" + _s.x + "px," + _s.y + "px) scale(" + _s.scale + ", " + _s.scale + ")";
			}
		};
		
		_s.getScale = function(){
			return  _s.scale;
		};
		
		_s.setPerspective = function(val){
			_s.perspective = val;
			_s.screen.style.perspective = _s.perspective + "px";
			_s.screen.style.WebkitPerspective = _s.perspective + "px";
			_s.screen.style.MozPerspective = _s.perspective + "px";
			_s.screen.style.msPerspective = _s.perspective + "px";
			_s.screen.style.OPerspective = _s.perspective + "px";
		};
		
		_s.setPreserve3D = function(){
			_s.screen.style.transformStyle = "preserve-3d";
			_s.screen.style.WebkitTransformStyle = "preserve-3d";
			_s.screen.style.MozTransformStyle = "preserve-3d";
			_s.screen.style.msTransformStyle = "preserve-3d";
			_s.screen.style.OTransformStyle = "preserve-3d";
		};
		
		_s.setZIndex = function(val){
			_s.zIndex = val;
			_s.screen.style.zIndex = _s.zIndex;
		};
		
		_s.getZIndex = function(){
			return _s.zIndex;
		};
		
		_s.setWidth = function(val){
			_s.w = val;
			if(_s.type == "img"){
				_s.screen.width = _s.w;
			}
			_s.screen.style.width = _s.w + "px";	
		};
		
		_s.getWidth = function(){
			if(_s.type == "div"){
				if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
				return _s.w;
			}else if(_s.type == "img"){
				if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
				if(_s.screen.width != 0) return  _s.screen.width;
				return _s._w;
			}else if( _s.type == "canvas"){
				if(_s.screen.offsetWidth != 0) return  _s.screen.offsetWidth;
				return _s.w;
			}
		};
		
		_s.setHeight = function(val){
			_s.h = val;
			if(_s.type == "img"){
				_s.screen.height = _s.h;
			}
			_s.screen.style.height = _s.h + "px";
		};
		
		_s.getHeight = function(){
			if(_s.type == "div"){
				if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
				return _s.h;
			}else if(_s.type == "img"){
				if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
				if(_s.screen.height != 0) return  _s.screen.height;
				return _s.h;
			}else if(_s.type == "canvas"){
				if(_s.screen.offsetHeight != 0) return  _s.screen.offsetHeight;
				return _s.h;
			}
		};
		
		_s.getNumChildren = function(){
			return _s.children_ar.length;
		};
		
		_s.setCSSGradient = function(color1, color2){
			if (FWDR3DCovUtils.isIEAndLessThen10){
				_s.setBkColor(color1);
			}else{
				_s.screen.style.backgroundImage = "-webkit-linear-gradient(top, " + color1 + ", " + color2 + ")";
				_s.screen.style.backgroundImage = "-moz-linear-gradient(top, " + color1 + ", " + color2 + ")";
				_s.screen.style.backgroundImage = "-ms-linear-gradient(top, " + color1 + ", " + color2 + ")";
				_s.screen.style.backgroundImage = "-o-linear-gradient(top, " + color1 + ", " + color2 + ")";
			}
		};
		
		
		/**
		 * DOM list.
		 */
		_s.addChild = function(e){
			if(_s.contains(e)){	
				_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}else{
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}
		};
		
		_s.removeChild = function(e){
			if(_s.contains(e)){
				_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);
				_s.screen.removeChild(e.screen);
			}else{
				throw Error("##removeChild()## Child doesn't exist, it can't be removed!");
			};
		};
		
		_s.contains = function(e){
			if(FWDR3DCovUtils.indexOfArray(_s.children_ar, e) == -1){
				return false;
			}else{
				return true;
			}
		};
		
		_s.addChildAtZero = function(e){
			if(_s.numChildren == 0){
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}else{
				_s.screen.insertBefore(e.screen, _s.children_ar[0].screen);
				if(_s.contains(e)){_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1);}	
				_s.children_ar.unshift(e);
			}
		};

		_s.addChildAt = function(e, index){
			if(_s.getNumChildren() == 0){
				_s.children_ar.push(e);
				_s.screen.appendChild(e.screen);
			}else if(index == 1){
				_s.screen.insertBefore(e.screen, _s.children_ar[0].screen);
				_s.screen.insertBefore(_s.children_ar[0].screen, e.screen);	
				if(_s.contains(e)){
					_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1, e);
				}else{
					_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 0, e);
				}
			}else{
				if(index < 0  || index > _s.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
				
				_s.screen.insertBefore(e.screen, _s.children_ar[index].screen);
				if(_s.contains(e)){
					_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 1, e);
				}else{
					_s.children_ar.splice(FWDR3DCovUtils.indexOfArray(_s.children_ar, e), 0, e);
				}
			}
		};
		
		_s.getChildAt = function(index){
			if(index < 0  || index > _s.numChildren -1) throw Error("##getChildAt()## Index out of bounds!");
			if(_s.numChildren == 0) throw Errror("##getChildAt## Child dose not exist!");
			return _s.children_ar[index];
		};
		
		_s.removeChildAtZero = function(){
			_s.screen.removeChild(_s.children_ar[0].screen);
			_s.children_ar.shift();
		};
		
		
		/**
		 * Event dispatcher.
		 */
		_s.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = _s;
	        _s.listeners.events_ar.push(event);
	    };
	    
	    _s.dispatchEvent = function(type, props){
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
	        	if(_s.listeners.events_ar[i].target === _s && _s.listeners.events_ar[i].type === type){
	        		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		_s.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		_s.listeners.events_ar[i].listener.call(_s, _s.listeners.events_ar[i]);
	        		break;
	        	}
	        }
	    };
	    
	   _s.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=_s.listeners.events_ar.length; i < len; i++){
	        	if(_s.listeners.events_ar[i].target === _s 
	        			&& _s.listeners.events_ar[i].type === type
	        			&& _s.listeners.events_ar[i].listener ===  listener
	        	){
	        		_s.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	  
	    /**
		 * Destroy.
		 */
		_s.disposeImage = function(){
			if(_s.type == "img") _s.screen.src = "";
		};
		
		
		_s.destroy = function(){
			
			try{_s.screen.parentNode.removeChild(_s.screen);}catch(e){};
			
			_s.screen.onselectstart = null;
			_s.screen.ondragstart = null;
			_s.screen.ontouchstart = null;
			_s.screen.ontouchmove = null;
			_s.screen.ontouchend = null;
			_s.screen.onmouseover = null;
			_s.screen.onmouseout = null;
			_s.screen.onmouseup = null;
			_s.screen.onmousedown = null;
			_s.screen.onmousemove = null;
			_s.screen.onclick = null;

			_s.children_ar = null;
			_s.style = null;
			_s.screen = null;
			_s.numChildren = null;
			_s.transform = null;
			_s.position = null;
			_s.overflow = null;
			_s.display= null;
			_s.visible= null;
			_s.buttonMode = null;
			_s.globalX = null;
			_s.globalY = null;
			_s.x = null;
			_s.y = null;
			_s.w = null;;
			_s.h = null;;
			_s.rect = null;
			_s.alpha = null;
			_s.innerHTML = null;
			_s.isHtml5_bl = null;
			_s.hasT3D = null;
			_s.hasT2D = null;
			_s = null;
		};
		
	    /* init */
		_s.init();
	};
	
	window.FWDR3DCovDO3D = FWDR3DCovDO3D;
}(window));