/* FWDR3DCovBulletsNavigation */
(function(window) {
	var FWDR3DCovBulletsNavigation = function(data, totalItems, curItemId){
		var _s = this;
		var prototype = FWDR3DCovBulletsNavigation.prototype;
	
		_s.bulletsNormalColor = data.bulletsNormalColor;
		_s.bulletsSelectedColor = data.bulletsSelectedColor;
		_s.bulletsNormalRadius = data.bulletsNormalRadius * 2;
		_s.bulletsSelectedRadius = data.bulletsSelectedRadius * 2;
		
		_s.mainHolder_do;
		
		_s.totalItems = totalItems;
		_s.curItemId = curItemId;
		_s.prevCurItemId = 0;
		_s.totalWidth = 0;
		_s.totalHeight = Math.max(_s.bulletsNormalRadius, _s.bulletsSelectedRadius);
		
		_s.mouseX = 0;
		_s.mouseY = 0;
		_s.spaceBetweenBullets = data.spaceBetweenBullets;
		_s.bullets_ar;
		
		_s.isPressed = false;

		_s.isMobile = FWDR3DCovUtils.isMobile;
		_s.hasPointerEvent = FWDR3DCovUtils.hasPointerEvent;

		// ##########################################//
		/* initialize _s */
		// ##########################################//
		_s.init = function(){
			_s.mainHolder_do = new FWDR3DCovDO("div", "absolute", "visible");
			_s.addChild(_s.mainHolder_do);
			_s.setHeight(_s.totalHeight);
			_s.setWidth(_s.totalWidth);
			_s.createBullets();
			if(data.infiniteLoop) _s.updateInininteBullets();
			
		};
		
		_s.resize = function(stageWidth){
			_s.stageWidth = stageWidth;
		};
		
		_s.updateBullets = function(id){
			_s.curItemId = id;
			var bullet;
			
			if(data.infiniteLoop) return;

			for(var i=0; i<_s.totalItems; i++){
				bullet = _s.bullets_ar[i];
				if(i == _s.curItemId){
					bullet.disable();
					bullet.setSelectedState(true);
				}else{
					bullet.enable();
					bullet.setNormalState(true);
				}
			}
	
			_s.prevCurItemId = _s.curItemId;
		};

		_s.updateInininteBullets = function(id){

			_s.curItemId = Math.round(_s.totalItems/2) - 1;
			if(id === undefined)  id = _s.curItemId;
			for(var i=0; i<_s.totalItems; i++){
				bullet = _s.bullets_ar[i];
				if(i == id){
					bullet.setSelectedState(true);
				}else{
					bullet.setNormalState(true);
				}
			}
		}
		
		_s.createBullets = function(){
			var bullet;
			_s.bullets_ar = [];
			_s.totalWidth = 0;

			if(data.infiniteLoop){
				_s.totalItems = data.nrThumbsToDisplay * 2 + 1;
			}

		
			for(var i=0; i<_s.totalItems; i++){
				FWDR3DCovBullet.setPrototype();
				bullet = new FWDR3DCovBullet(i, data.bulletsNormalColor, data.bulletsSelectedColor, data.bulletsNormalRadius, data.bulletsSelectedRadius);
				bullet.addListener(FWDR3DCovBullet.MOUSE_UP, _s.bulletMouseUpHanlder);
				
				if(data.infiniteLoop){
					bullet.addListener(FWDR3DCovBullet.MOUSE_OVER, _s.bulletMouseOverHanlder);
					bullet.addListener(FWDR3DCovBullet.MOUSE_OUT, _s.bulletMouseOutHanlder);
				}
				
				_s.totalWidth += bullet.w + _s.spaceBetweenBullets;
				bullet.setX((bullet.w + _s.spaceBetweenBullets) * i);
				bullet.hide();
				_s.mainHolder_do.addChild(bullet);
				_s.bullets_ar[i] = bullet;
			}
			
			
			_s.totalWidth -= _s.spaceBetweenBullets;
			_s.setWidth(_s.totalWidth);
			
			_s.updateBullets(_s.curItemId);
			
			clearTimeout(_s.showBulletsId_to);
			if(data.infiniteLoop) _s.updateInininteBullets();
			_s.showBulletsId_to = setTimeout(_s.show, 1000);
		};
		
		_s.bulletMouseUpHanlder = function(e){
			var id = e.id;
			if(data.infiniteLoop){
				_s.curItemId = Math.round(_s.totalItems/2) - 1;
				id = id - _s.curItemId;
			}
			
			_s.dispatchEvent(FWDR3DCovBulletsNavigation.BULLET_CLICK, {id:id});
		};

		_s.bulletMouseOverHanlder =  function(e){
			clearTimeout(_s.upd);
			_s.updateInininteBullets(e.id);
		}

		_s.bulletMouseOutHanlder = function(e){
			clearTimeout(_s.upd);
			_s.upd = setTimeout(_s.updateInininteBullets, 500);
		}
		
		_s.hideBullets = function(){
			clearTimeout(_s.showBulletsId_to);
			var bullet;
			for(var i=0; i<_s.totalItems; i++){
				bullet = _s.bullets_ar[i];
				bullet.hide(true);
			}
			clearTimeout(_s.hideBulletsId_to);
			_s.hideBulletsId_to = setTimeout(_s.destroyBullets, 800);
		};
		
		_s.destroyBullets = function(){
			clearTimeout(_s.showBulletsId_to);
			var bullet;
			for(var i=0; i<_s.totalItems; i++){
				bullet = _s.bullets_ar[i];
				_s.mainHolder_do.removeChild(bullet);
				bullet.destroy();
			}
		};
		
		_s.show = function(){
			var bullet;
			var delayRight = .1;
			var delayLeft = _s.curItemId/10;

			if(data.infiniteLoop){
				_s.curItemId = Math.round(_s.totalItems/2) - 1;
				delayLeft = _s.curItemId/10;
			} 

			var bullet = _s.bullets_ar[_s.curItemId];
			bullet.show(0);

			for(var i=_s.curItemId; i<_s.totalItems; i++){
				bullet = _s.bullets_ar[i];
				bullet.show(delayRight);
				delayRight += .1;
			}
			
			for(var i=0; i<_s.totalItems; i++){
				bullet = _s.bullets_ar[i];
				bullet.show(delayLeft);
				delayLeft -= .1;
			}
		};
		
		// ##############################//
		/* destroy */
		// ##############################//
		_s.destroy = function() {
			clearTimeout(_s.showBulletsId_to);
			clearTimeout(_s.hideBulletsId_to);
			
			_s.main_do.destroy();
			_s.main_do = null;
			
			_s.setInnerHTML("");
			prototype.destroy();
			_s = null;
			prototype = null;
			FWDR3DCovBulletsNavigation.prototype = null;
		};

		_s.init();
	};

	/* set prototype */
	FWDR3DCovBulletsNavigation.setPrototype = function(){
		FWDR3DCovBulletsNavigation.prototype = new FWDR3DCovDO("div");
	};

	FWDR3DCovBulletsNavigation.BULLET_CLICK = "bulletClick";

	FWDR3DCovBulletsNavigation.prototype = null;
	window.FWDR3DCovBulletsNavigation = FWDR3DCovBulletsNavigation;
}(window));