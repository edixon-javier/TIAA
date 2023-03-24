/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Utils.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){

	var FWDR3DCovUtils = function(){
		'use strict';
	};	
	
	FWDR3DCovUtils.dumy = document.createElement("div");
	
	/**
	 * String.
	 */
	FWDR3DCovUtils.trim = function(str){
		return str.replace(/\s/gi, "");
	};
	
	FWDR3DCovUtils.splitAndTrim = function(str, trim_bl){
		var array = str.split(",");
		var length = array.length;
		for(var i=0; i<length; i++){
			if(trim_bl) array[i] = FWDR3DCovUtils.trim(array[i]);
		};
		return array;
	};

	
	/**
	 * Array.
	 */
	FWDR3DCovUtils.indexOfArray = function(array, prop){
		var length = array.length;
		for(var i=0; i<length; i++){
			if(array[i] === prop) return i;
		};
		return -1;
	};
	
	FWDR3DCovUtils.randomizeArray = function(aArray) {
		var randomizedArray = [];
		var copyArray = aArray.concat();
			
		var length = copyArray.length;
		for(var i=0; i< length; i++) {
				var index = Math.floor(Math.random() * copyArray.length);
				randomizedArray.push(copyArray[index]);
				copyArray.splice(index,1);
			}
		return randomizedArray;
	};
	
	FWDR3DCovUtils.removeArrayDuplicates = function(arr, key){ 
		var newArr = [],
	        origLen = arr.length,
	        found,
	        x, y;

	    for (x = 0; x < origLen; x++) {
	        found = undefined;
	        for (y = 0; y < newArr.length; y++) {
	            if(arr[x][key] === newArr[y][key]) { 
	              found = true;
	              break;
	            }
	        }
	        if(!found) newArr.push(arr[x]);    
	    }
	    return newArr;
	};
	

	/**
	 * DOM.
	 */
	FWDR3DCovUtils.prt = function (e, n){
		if(n === undefined) n = 1;
		while(n-- && e) e = e.parentNode;
		if(!e || e.nodeType !== 1) return null;
		return e;
	};
	
	FWDR3DCovUtils.sibling = function(e, n){
		while (e && n !== 0){
			if(n > 0){
				if(e.nextElementSibling){
					 e = e.nextElementSibling;	 
				}else{
					for(var e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
				}
				n--;
			}else{
				if(e.previousElementSibling){
					 e = e.previousElementSibling;	 
				}else{
					for(var e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
				}
				n++;
			}
		}
		return e;
	};
	
	FWDR3DCovUtils.getChildAt = function (e, n){
		var kids = FWDR3DCovUtils.getChildren(e);
		if(n < 0) n += kids.length;
		if(n < 0) return null;
		return kids[n];
	};
	
	FWDR3DCovUtils.getChildById = function(id){
		return document.getElementById(id) || undefined;
	};
	
	FWDR3DCovUtils.getChildren = function(e, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes){
				kids.push(c);
			}else if(c.nodeType === 1){
				kids.push(c);
			}
		}
		return kids;
	};
	
	FWDR3DCovUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDR3DCovUtils.hasAttribute(c, attr)){
				kids.push(c);
			}else if(c.nodeType === 1 && FWDR3DCovUtils.hasAttribute(c, attr)){
				kids.push(c);
			}
		}
		return kids.length == 0 ? undefined : kids;
	};
	
	FWDR3DCovUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDR3DCovUtils.hasAttribute(c, attr)){
				return c;
			}else if(c.nodeType === 1 && FWDR3DCovUtils.hasAttribute(c, attr)){
				return c;
			}
		}
		return undefined;
	};
	
	FWDR3DCovUtils.getAttributeValue = function(e, attr){
		if(!FWDR3DCovUtils.hasAttribute(e, attr)) return undefined;
		return e.getAttribute(attr);	
	};
	
	FWDR3DCovUtils.hasAttribute = function(e, attr){
		if(e.hasAttribute){
			return e.hasAttribute(attr); 
		}else {
			var test = e.getAttribute(attr);
			return  test ? true : false;
		}
	};
	
	FWDR3DCovUtils.insertNodeAt = function(prt, child, n){
		var children = FWDR3DCovUtils.children(prt);
		if(n < 0 || n > children.length){
			throw new Error("invalid index!");
		}else {
			prt.insertBefore(child, children[n]);
		};
	};
	
	FWDR3DCovUtils.hasCanvas = function(){
		return Boolean(document.createElement("canvas"));
	};
	
	
	/**
	 * DOM utils.
	 */
	FWDR3DCovUtils.hitTest = function(target, x, y){
		var hit = false;
		if(!target) throw Error("Hit test target is null!");
		var rect = target.getBoundingClientRect();
		
		if(x >= rect.left && x <= rect.left +(rect.right - rect.left) && y >= rect.top && y <= rect.top + (rect.bottom - rect.top)) return true;
		return false;
	};
	
	FWDR3DCovUtils.getScrollOffsets = function(){
		//all browsers
		if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
		
		//ie7/ie8
		if(document.compatMode == "CSS1Compat"){
			return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
		}
	};
	
	FWDR3DCovUtils.getViewportSize = function(){
		if(FWDR3DCovUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
			return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
		}
		
		if(FWDR3DCovUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
		return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
	};
	
	FWDR3DCovUtils.getViewportMouseCoordinates = function(e){
		var offsets = FWDR3DCovUtils.getScrollOffsets();
		
		if(e.touches){
			return{
				screenX:e.touches[0] == undefined ? e.touches.pageX - offsets.x :e.touches[0].pageX - offsets.x,
				screenY:e.touches[0] == undefined ? e.touches.pageY - offsets.y :e.touches[0].pageY - offsets.y
			};
		}
		
		return{
			screenX: e.clientX == undefined ? e.pageX - offsets.x : e.clientX,
			screenY: e.clientY == undefined ? e.pageY - offsets.y : e.clientY
		};
	};
	
	
	/**
	 * Browsers test.
	 */
	FWDR3DCovUtils.hasPointerEvent = (function(){
		return Boolean(window.navigator.msPointerEnabled) || Boolean(window.navigator.pointerEnabled);
	}());
	
	FWDR3DCovUtils.isMobile = (function (){
		if((FWDR3DCovUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) || (FWDR3DCovUtils.hasPointerEvent && navigator.maxTouchPoints > 1)) return true;
		var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'kfsowi'];
	    for(var i in agents) {
	    	 if(String(navigator.userAgent).toLowerCase().indexOf(String(agents[i]).toLowerCase()) != -1) {
	            return true;
	        }
	    }
	    if(navigator.platform.toLowerCase() === 'macintel' && navigator.maxTouchPoints > 1 && !window.MSStream) return true;
	    return false;
	}());
	
	FWDR3DCovUtils.isAndroid = (function(){
		 return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
	}());
	
	FWDR3DCovUtils.isChrome = (function(){
		return navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
	}());
	
	FWDR3DCovUtils.isSafari = (function(){
		return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDR3DCovUtils.isOpera = (function(){
		return navigator.userAgent.toLowerCase().indexOf('opera') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDR3DCovUtils.isFirefox = (function(){
		return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
	}());
	
	FWDR3DCovUtils.isIE = (function(){
		var isIE = Boolean(navigator.userAgent.toLowerCase().indexOf('msie') != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf('edge') != -1);
		return Boolean(isIE || document.documentElement.msRequestFullscreen);
	}());
	
	FWDR3DCovUtils.isIE11 = (function(){
		return Boolean(!FWDR3DCovUtils.isIE && document.documentElement.msRequestFullscreen);
	}());
	
	FWDR3DCovUtils.isIEAndLessThen9 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
	}());
	
	FWDR3DCovUtils.isIEAndLessThen10 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 
		|| navigator.userAgent.toLowerCase().indexOf("msie 8") != -1
		|| navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
	}());
	
	FWDR3DCovUtils.isIE7 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1;
	}());
	
	FWDR3DCovUtils.isIOS = (function(){
		return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
	}());
	
	FWDR3DCovUtils.isIphone = (function(){
		return navigator.userAgent.match(/(iPhone|iPod)/g);
	}());
	
	FWDR3DCovUtils.isMAC = (function(){
		return navigator.appVersion.toLowerCase().indexOf('macintosh') != -1;
	}());
	
	FWDR3DCovUtils.isLocal = (function(){
		return location.href.indexOf('file:') != -1;
	}());
	
	FWDR3DCovUtils.hasFullScreen = (function(){
		return FWDR3DCovUtils.dumy.requestFullScreen || FWDR3DCovUtils.dumy.mozRequestFullScreen || FWDR3DCovUtils.dumy.webkitRequestFullScreen || FWDR3DCovUtils.dumy.msieRequestFullScreen;
	}());
	
	FWDR3DCovUtils.isAndroidAndWebkit = (function(){
		return  (FWDR3DCovUtils.isOpera || FWDR3DCovUtils.isChrome) && FWDR3DCovUtils.isAndroid;
	}());
	
	function get3d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    var position;
	    while (p = properties.shift()) {
	       if (typeof FWDR3DCovUtils.dumy.style[p] !== 'undefined') {
	    	   FWDR3DCovUtils.dumy.style.position = "absolute";
	    	   position = FWDR3DCovUtils.dumy.getBoundingClientRect().left;
	    	   FWDR3DCovUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
	    	   position = Math.abs(FWDR3DCovUtils.dumy.getBoundingClientRect().left - position);
	    	   
	           if(position > 100 && position < 900){
	        	   try{document.documentElement.removeChild(FWDR3DCovUtils.dumy);}catch(e){}
	        	   return true;
	           }
	       }
	    }
	    try{document.documentElement.removeChild(FWDR3DCovUtils.dumy);}catch(e){}
	    return false;
	};
	
	function get2d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    while (p = properties.shift()) {
	       if (typeof FWDR3DCovUtils.dumy.style[p] !== 'undefined') {
	    	   return true;
	       }
	    }
	    try{document.documentElement.removeChild(FWDR3DCovUtils.dumy);}catch(e){}
	    return false;
	};	
	
	
	/**
	 * Various.
	 */
	FWDR3DCovUtils.onReady =  function(callbalk){
		if (document.addEventListener) {
			document.addEventListener( "DOMContentLoaded", function(){
				callbalk();
			});
		}else{
			document.onreadystatechange = function () {
				if (document.readyState == "complete") callbalk();
			};
		 }
	};
	
	FWDR3DCovUtils.checkIfHasTransofrms = function(){
		if(FWDR3DCovUtils.isReadyMethodCalled_bl) return;
		document.documentElement.appendChild(FWDR3DCovUtils.dumy);
		FWDR3DCovUtils.hasTransform3d = get3d();
		FWDR3DCovUtils.hasTransform2d = get2d();
		FWDR3DCovUtils.isReadyMethodCalled_bl = true;
	};
	
	FWDR3DCovUtils.disableElementSelection = function(e){
		try{e.style.userSelect = "none";}catch(e){};
		try{e.style.MozUserSelect = "none";}catch(e){};
		try{e.style.webkitUserSelect = "none";}catch(e){};
		try{e.style.khtmlUserSelect = "none";}catch(e){};
		try{e.style.oUserSelect = "none";}catch(e){};
		try{e.style.msUserSelect = "none";}catch(e){};
		try{e.msUserSelect = "none";}catch(e){};
		e.onselectstart = function(){return false;};
	};
	
	FWDR3DCovUtils.getSearchArgs = function(){
		var args = {};
		var query = location.href.substr(location.href.indexOf("?") + 1);
		
		var pairs = query.split("&");
		
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};
	
	FWDR3DCovUtils.getHashArgs = function(string){
		var args = {};
		var query = string.substr(string.indexOf("#") + 1) || location.hash.substring(1);
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};

	FWDR3DCovUtils.getHashParam = function(param){
        var value = location.hash.substr(1);
        var index = value.indexOf("?");
        if (index != -1) {
            value = value.substr(index + 1);
            var p, params = value.split("&"),
                i = params.length,
                r = [];
            while (i--) {
                p = params[i].split("=");
                if (p[0] == param) {
                    r.push(p[1])
                }
            }

            if (r.length != 0) {
                return r.length != 1 ? r : r[0]
            }
        }

    };
	
	
	FWDR3DCovUtils.isReadyMethodCalled_bl = false;
	
	window.FWDR3DCovUtils = FWDR3DCovUtils;
}(window));