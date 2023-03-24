/**
 * Royal 3D Coverflow PACKAGED v2.0
 * Data.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function(window){
	var FWDR3DCovData = function(props, prt){
		
		'use strict';

		var _s = this;
		var prototype = FWDR3DCovData.prototype;

		_s.props = props;
		_s.graphicsPathsAr = [];
		_s.imagesAr = [];
		_s.dataListAr = [];
		_s.categoriesAr = [];
		_s.lightboxAr = [];
		_s.countLoadedGraphics = 0;

		
		/**
		 * Initalize.
		 */
		_s.init = function(){
			_s.parseProperties();
		};


		/**
		 * Set props.
		 */
		_s.parseProperties = function(){
			var errorMessage;

			// Check for coverflowDataListDivId property.
			if (!_s.props.coverflowDataListDivId){
				errorMessage = "Carousel _d list id is not defined in FWDR3DCov constructor function!";
				_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text : errorMessage});
				return;
			};

			// Set the root element of the coverflow list.
			_s.rootElement = prt.rootElement;

			
			_s.mainFolderPath = _s.props.mainFolderPath;
			if(!_s.mainFolderPath){
				setTimeout(function(){
					if(_s == null) return;
					errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
					_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((_s.mainFolderPath.lastIndexOf("/") + 1) != _s.mainFolderPath.length){
				_s.mainFolderPath += "/";
			}
			
			_s.skinPath_str = _s.props.skinPath;;
			if(!_s.skinPath_str){
				setTimeout(function(){
					if(_s == null) return;
					errorMessage_str = "The <font color='#FF0000'>skinPath</font> property is not defined in the constructor function!";
					_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
		
			if((_s.skinPath_str.lastIndexOf("/") + 1) != _s.skinPath_str.length){
				_s.skinPath_str += "/";
			}
			
			_s.lightboxSkinPath_str = _s.skinPath_str;
			_s.skinPath_str = _s.mainFolderPath + _s.skinPath_str;

			if(_s.skinPath_str.indexOf('white') != -1){
				_s.isSkinWhite = true;
			}
			
			_s.handIconPath_str	= _s.skinPath_str + "/hand.cur";
			_s.grabIconPath_str = _s.skinPath_str + "/grab.cur";
			

			// Set main properties.
			_s.useDragAndSwipe_bl = _s.props.useDragAndSwipe;
			_s.useDragAndSwipe_bl = _s.useDragAndSwipe_bl == "yes" ? true : false;
			_s.backgroundColor = _s.props.backgroundColor || "transparent";
			_s.thumbXSpace3D = _s.props.thumbnailXSpace3D || 0;
			_s.thumbXOffset3D = _s.props.thumbnailXOffset3D || 0;
			_s.thumbZSpace3D = _s.props.thumbnailZSpace3D || 0;
			_s.thumbZOffset3D = _s.props.thumbnailZOffset3D || 0;
			_s.thumbYAngle3D = _s.props.thumbnailYAngle3D || 0;
			_s.thumbHoverOffset = _s.props.thumbnailHoverOffset || 0;
			_s.thumbnailOffsetY = _s.props.thumbnailOffsetY || 0;
			_s.coverflowXRotation = _s.props.coverflowXRotation || 0;
			_s.rightClickContextMenu = _s.props.rightClickContextMenu;
			_s.addKeyboardSupport = _s.props.addKeyboardSupport == "yes" ? true : false;
			_s.useVectorIcons = _s.props.useVectorIcons == "yes" ? true : false;
			_s.showGradient = _s.props.showThumbnailsGradient == "yes" ? true : false;
			_s.gradientColor1 = _s.props.thumbnailGradientColor1;
			_s.gradientColor2 = _s.props.thumbnailGradientColor2;
		
			
			// Thumbs properties.
			_s.thumbWidth = _s.props.thumbnailWidth || 400;
			_s.thumbHeight = _s.props.thumbnailHeight || 266;
			_s.thumbBorderSize = _s.props.thumbnailBorderSize || 0;
			if(_s.thumbMinAlpha == undefined) _s.thumbMinAlpha = .3;
			_s.thumbBackgroundColor = _s.props.thumbnailBackgroundColor || "transparent";
			_s.thumbBorderColor1 = _s.props.thumbnailBorderColor1 || "transparent";
			_s.thumbBorderColor2 = _s.props.thumbnailBorderColor2 || "transparent";
			_s.transparentImages = _s.props.transparentImages == "yes" ? true : false;
			_s.infiniteLoop = _s.props.infiniteLoop == "yes" ? true : false;
			_s.showGradient = _s.props.showThumbnailsGradient == "yes" ? true : false;
			_s.showCaption = _s.props.showCaption == "yes" ? true : false;
			_s.showCaptionOnTap = _s.props.showCaptionOnTap == "yes" ? true : false;
			_s.captionPosition = _s.props.captionPosition || 'out';
			_s.captionAnimationType = _s.props.captionAnimationType || 'opacity';
			_s.showFullCaption = _s.props.showFullCaption == "yes" ? true : false;
			_s.coverflowStartPosition = _s.props.coverflowStartPosition;

			if (_s.props.numberOfThumbnailsToDisplayLeftAndRight == "all"){
				_s.nrThumbsToDisplay = 0;
				_s.infiniteLoop = false;
			}else{
				_s.nrThumbsToDisplay = parseInt(_s.props.numberOfThumbnailsToDisplayLeftAndRight) || 0;
			}

			_s.useVideo = _s.props.useVideo == "yes" ? true : false;
			_s.videoAutoPlay = _s.props.videoAutoPlay == "yes" ? true : false;
			_s.nextVideoAutoPlay = _s.props.nextVideoAutoPlay == "yes" ? true : false;
			_s.videoAutoPlayText = _s.props.videoAutoPlayText || 'Click to unmute';
			_s.volume = _s.props.volume;
			if(_s.volume === undefined) _s.volume = 1;
			_s.showLogo = _s.props.showLogo == "yes" ? true : false;
			_s.logoPath = _s.props.logoPath || "content/rl/content/evp/skin/logo.png";
			_s.hideLogoWithController = _s.props.hideLogoWithController == "yes" ? true : false;
			_s.logoLink = _s.props.logoLink || '';
			_s.showDefaultControllerForVimeo = _s.props.showDefaultControllerForVimeo == "yes" ? true : false;
			_s.showScrubberWhenControllerIsHidden = _s.props.showScrubberWhenControllerIsHidden == "yes" ? true : false;
			_s.showVolumeButton = _s.props.showVolumeButton == "yes" ? true : false;
			_s.showScrubberToolTipLabel = _s.props.showScrubberToolTipLabel == "yes" ? true : false;
			_s.showTime = _s.props.showTime == "yes" ? true : false;
			_s.showRewindButton = _s.props.showRewindButton == "yes" ? true : false;
			_s.showQualityButton = _s.props.showQualityButton == "yes" ? true : false;
			_s.showChromecastButton = _s.props.showChromecastButton == "yes" ? true : false;
			_s.showFullScreenButton = _s.props.showFullScreenButton == "yes" ? true : false;
			_s.showScrubberToolTipLabel = _s.props.showScrubberToolTipLabel == "yes" ? true : false;
			_s.fillEntireVideoScreen = _s.props.fillEntireVideoScreen == "yes" ? true : false;
			_s.videoControllerHideDelay = _s.props.videoControllerHideDelay;
			if(_s.videoControllerHideDelay === undefined) _s.videoControllerHideDelay = 3000;
			_s.videoControllerHideDelay = _s.videoControllerHideDelay/1000;
			_s.timeColor = _s.props.timeColor || '#B9B9B9';
			_s.youtubeQualityButtonNormalColor = _s.props.youtubeQualityButtonNormalColor || '#B9B9B9';
			_s.youtubeQualityButtonSelectedColor = _s.props.youtubeQualityButtonSelectedColor || '#FFFFFF';
			_s.scrubbersToolTipLabelBackgroundColor = _s.props.scrubbersToolTipLabelBackgroundColor || '#FFFFFF';
			_s.scrubbersToolTipLabelFontColor = _s.props.scrubbersToolTipLabelFontColor || '#5a5a5a';
			_s.showPlaybackRateButton = _s.props.showPlaybackRateButton == "yes" ? true : false;
			_s.audioVisualizerLinesColor = _s.props.audioVisualizerLinesColor || '#570AB8';
			_s.audioVisualizerCircleColor = _s.props.audioVisualizerCircleColor || '#b9b9b9';
			_s.thumbnailsPreviewWidth = _s.props.thumbnailsPreviewWidth || 196;
			_s.thumbnailsPreviewBackgroundColor = _s.props.thumbnailsPreviewBackgroundColor || '#2e2e2e';
			_s.thumbnailsPreviewBorderColor = _s.props.thumbnailsPreviewBorderColor || '#414141';
			_s.thumbnailsPreviewLabelBackgroundColor = _s.props.thumbnailsPreviewLabelBackgroundColor || '#414141';
			_s.thumbnailsPreviewLabelFontColor = _s.props.thumbnailsPreviewLabelFontColor || '#CCCCCC';
			_s.skipToVideoText = _s.props.skipToVideoText || 'You can skip to video in: ';
			_s.skipToVideoButtonText = _s.props.skipToVideoButtonText || 'Skip Ad';
			_s.rlLogoLink = _s.props.rlLogoLink || '';
			_s.rlShowControllerWhenVideoIsStopped = _s.props.rlShowControllerWhenVideoIsStopped == "yes" ? true : false;
			_s.rlShowDefaultControllerForVimeo = _s.props.rlShowDefaultControllerForVimeo == "yes" ? true : false;
			_s.rlShowScrubberWhenControllerIsHidden = _s.props.rlShowScrubberWhenControllerIsHidden == "yes" ? true : false;
			_s.rlShowRewindButton = _s.props.rlShowRewindButton == "yes" ? true : false;
			_s.rlShowVolumeButton = _s.props.rlShowVolumeButton == "yes" ? true : false;
			_s.rlShowTime = _s.props.rlShowTime == "yes" ? true : false;
			_s.rlTimeColor = _s.props.rlTimeColor || "#B9B9B9";
			_s.rlShowChromecastButton = _s.props.rlShowChromecastButton == "yes" ? true : false;
			_s.rlShowPlaybackRateButton = _s.props.rlShowPlaybackRateButton == "yes" ? true : false;
			_s.rlShowQualityButton = _s.props.rlShowQualityButton == "yes" ? true : false;
			_s.rlShowFullScreenButton = _s.props.rlShowFullScreenButton == "yes" ? true : false;
			_s.rlShowScrubberToolTipLabel = _s.props.rlShowScrubberToolTipLabel == "yes" ? true : false;
			_s.rlYoutubeQualityButtonNormalColor = _s.props.rlYoutubeQualityButtonNormalColor || '#B9B9B9';
			_s.rlYoutubeQualityButtonSelectedColor = _s.props.rlYoutubeQualityButtonSelectedColor || '#FFFFFF';
			_s.rlScrubbersToolTipLabelBackgroundColor = _s.props.rlScrubbersToolTipLabelBackgroundColor || '#FFFFFF';
			_s.rlScrubbersToolTipLabelFontColor = _s.props.rlScrubbersToolTipLabelFontColor || '#5a5a5a';
			_s.rlAudioVisualizerLinesColor = _s.props.rlAudioVisualizerLinesColor || '#570AB8';
			_s.rlAudioVisualizerCircleColor = _s.props.rlAudioVisualizerCircleColor || '#b9b9b9';
			
			if (_s.transparentImages){
				_s.thumbBorderSize = 0;
			}
			_s.thumbWidth += _s.thumbBorderSize * 2;
			_s.thumbHeight += _s.thumbBorderSize * 2;

			
			// Controls properties.
			_s.showLargeNextAndPrevButtons = _s.props.showLargeNextAndPrevButtons == "yes" ? true : false;
			_s.largeNextAndPrevButtonsMaxWidthPos = _s.props.largeNextAndPrevButtonsMaxWidthPos || 0;
			_s.nextAndPrevButtonsOffsetX = _s.props.nextAndPrevButtonsOffsetX || 20;
			_s.showNextAndPrevButtonsOnMobile_str = _s.props.showNextAndPrevButtonsOnMobile;
			_s.showScrollbar = _s.props.showScrollbar == "yes" ? true : false;
			_s.showScrollbarOnMobile = _s.props.showScrollbarOnMobile == "yes" ? true : false;
			_s.showNextAndPrevButtonsOnMobile = _s.props.showNextAndPrevButtonsOnMobile == "yes" ? true : false;
			_s.enableMouseWheelScroll = _s.props.enableMouseWheelScroll == "yes" ? true : false;
			_s.controlsMaxWidth = _s.props.controlsMaxWidth || 800;
			_s.controlsOffset = parseInt(_s.props.controlsOffset);
			_s.handlerWidth = _s.props.scrollbarHandlerWidth || 300;
			_s.scrollbarTextColorNormal = _s.props.scrollbarTextColorNormal || "#777777";
			_s.scrollbarTextColorSelected = _s.props.scrollbarTextColorSelected || "#FF0000";
			_s.slideshowDelay = _s.props.slideshowDelay || 5;
			_s.slideshowDelay = _s.slideshowDelay * 1000;
			_s.slideshowPreloaderBackgroundColor = _s.props.slideshowPreloaderBackgroundColor || "#333333";
			_s.slideshowPreloaderFillColor = _s.props.slideshowPreloaderFillColor || "#FFFFFF";
			_s.slideshowAutoplay = _s.props.slideshowAutoplay == "yes" ? true : false;
			_s.showNextAndPrevButtons = _s.props.showNextAndPrevButtons == "yes" ? true : false;
			_s.showSlideshowButton = _s.props.showSlideshowButton == "yes" ? true : false;
			_s.slideshowTimerColor = _s.props.slideshowTimerColor || "#777777";
			_s.controlsPos = _s.props.controlsPosition == "top" ? true : false;

			_s.showBulletsNavigation = _s.props.showBulletsNavigation;
			_s.showBulletsNavigation = _s.showBulletsNavigation == "yes" ? true : false;
			if(_s.showBulletsNavigation){
				_s.showNextAndPrevButtons = false;
				_s.showScrollbar = false;
				_s.showNextAndPrevButtons = false;
				_s.showSlideshowButton = false;
			}

			_s.bulletsNormalColor = _s.props.bulletsNormalColor || "#333333";
			_s.bulletsSelectedColor = _s.props.bulletsSelectedColor || "#FFFFFF";
			_s.bulletsNormalRadius = _s.props.bulletsNormalRadius || 6;
			_s.bulletsSelectedRadius = _s.props.bulletsSelectedRadius || 6;
			_s.spaceBetweenBullets = _s.props.spaceBetweenBullets || 6;

			
			// Reflection.
			_s.showRefl = _s.props.showReflection == "yes" ? true : false;
			_s.reflHeight = _s.props.reflectionHeight || 100;
			_s.reflDist = _s.props.reflectionDistance || 0;
			_s.reflAlpha = _s.props.reflectionOpacity || .5;

			
			// Menu.
			_s.showMenu = _s.props.showMenu == "yes" ? true : false;
			_s.showAllCategories = _s.props.showAllCategories == "yes" ? true : false;
			_s.allCategoriesLabel = _s.props.allCategoriesLabel || null;
			_s.selectLabel = _s.props.selectLabel || "not defined!";
			_s.selectorLineColor = _s.props.selectorLineColor;
			_s.selectorBackgroundColor = _s.props.selectorBackgroundColor;
			_s.buttonBackgroundColor = _s.props.buttonBackgroundColor;
			_s.selectorTextNormalColor = _s.props.selectorTextNormalColor;
			_s.selectorTextSelectedColor = _s.props.selectorTextSelectedColor;
			_s.buttonBackgroundNormalColor1 = _s.props.buttonBackgroundNormalColor1;
			_s.buttonTextNormalColor = _s.props.buttonTextNormalColor;
			_s.buttonTextSelectedColor = _s.props.buttonTextSelectedColor;
			_s.comboBoxHorizontalMargins = _s.props.menuHorizontalMargins || 0;
			_s.comboBoxVerticalMargins = _s.props.menuVerticalMargins || 0;
			
			if ((_s.props.menuPosition == "topleft") || (_s.props.menuPosition == "topright")){
				_s.menuPosition = FWDR3DCovUtils.trim(_s.props.menuPosition).toLowerCase();
			}else{
				_s.menuPosition = "topleft";
			}

			
			// Lightbox.
			_s.useLightbox = _s.props.useLightbox == "yes" ? true : false;
			_s.rlUseDeepLinking = _s.props.rlUseDeepLinking == "yes" ? true : false;
			_s.rlButtonsAlignment = _s.props.rlButtonsAlignment;
			_s.rlMediaLazyLoading = _s.props.rlMediaLazyLoading == "yes" ? true : false;
			_s.rlUseDrag = _s.props.rlUseDrag == "yes" ? true : false;
			_s.rlUseAsModal = _s.props.rlUseAsModal == "yes" ? true : false;
			_s.rlShowSlideShowButton = _s.props.rlShowSlideShowButton == "yes" ? true : false;
			_s.rlShowSlideShowAnimation = _s.props.rlShowSlideShowAnimation == "yes" ? true : false;
			_s.rlSlideShowAutoPlay = _s.props.rlSlideShowAutoPlay == "yes" ? true : false;
			_s.rlSlideShowAutoStop = _s.props.rlSlideShowAutoStop == "yes" ? true : false;
			_s.rlSlideShowDelay = _s.props.rlSlideShowDelay || 6;
			_s.rlSlideShowBkColor = _s.props.rlSlideShowBkColor || '#2e2e2e';
			_s.rlSlideShowFillColor = _s.props.rlSlideShowFillColor || '#FFFFFF';
			_s.rlUseKeyboard = _s.props.rlUseKeyboard == "yes" ? true : false;
			_s.rlUseDoubleClick = _s.props.rlUseDoubleClick == "yes" ? true : false;
			_s.rlShowCloseButton = _s.props.rlShowCloseButton == "yes" ? true : false;
			_s.rlShowFullscreenButton = _s.props.rlShowFullscreenButton == "yes" ? true : false;
			_s.rlShowZoomButton = _s.props.rlShowZoomButton == "yes" ? true : false;
			_s.rlShowCounter = _s.props.rlShowCounter == "yes" ? true : false;
			_s.rlShowNextAndPrevBtns = _s.props.rlShowNextAndPrevBtns == "yes" ? true : false;
			_s.rlMaxZoom = _s.props.rlMaxZoom || 6;
			_s.rlButtonsHideDelay = _s.props.rlButtonsHideDelay || 5;
			_s.rlDefaultItemWidth = _s.props.rlDefaultItemWidth || 1527;
			_s.rlDefaultItemHeight = _s.props.rlDefaultItemHeight || 859;
			_s.rlItemOffsetHeight = _s.props.rlItemOffsetHeight || 37;
			_s.rlItemOffsetHeightButtonsTop = _s.props.rlItemOffsetHeightButtonsTop || 47;
			_s.rlSpaceBetweenBtns = _s.props.rlSpaceBetweenBtns || 8;
			_s.rlButtonsOffsetIn = _s.props.rlButtonsOffsetIn || 10;
			_s.rlButtonsOffsetOut = _s.props.rlButtonsOffsetOut || 10;
			_s.rlItemBorderSize = _s.props.rlItemBorderSize || 0;
			_s.rlItemBackgroundColor = _s.props.rlItemBackgroundColor || '#212121';
			_s.rlItemBorderColor = _s.props.rlItemBorderColor || '#FFFFFF';
			_s.rlPreloaderBkColor = _s.props.rlPreloaderBkColor || '#2e2e2e';
			_s.rlPreloaderFillColor = _s.props.rlPreloaderFillColor || '#FFFFFF';
			_s.rlBackgroundColor = _s.props.rlBackgroundColor || 'rgba(0,0,0,.99)';
			_s.rlShareButtons = _s.props.rlShareButtons || ['facebook', 'twitter', 'linkedin', 'tumblr', 'pinterest', 'reddit', 'buffer', 'digg','blogger'];
			_s.rlShareText = _s.props.rlShareText || 'Share on';
			_s.rlSharedURL = _s.props.rlSharedURL || 'deeplink';
			_s.rlShareMainBackgroundColor = _s.props.rlShareMainBackgroundColor || 'rgba(0,0,0,.4)';
			_s.rlShareBackgroundColor = _s.props.rlShareBackgroundColor || '#FFFFFF';
			_s.rlShowThumbnails = _s.props.rlShowThumbnails == "yes" ? true : false;
			_s.rlShowThumbnailsIcon = _s.props.rlShowThumbnailsIcon == "yes" ? true : false;
			_s.rlThumbnailsHeight = _s.props.rlThumbnailsHeight || 80;
			_s.rlThumbnailsOverlayColor = _s.props.rlThumbnailsOverlayColor || 'rgba(0,0,0,.4)';
			_s.rlThumbnailsBorderSize = _s.props.rlThumbnailsBorderSize;
			if(_s.rlThumbnailsBorderSize ==  undefined) _s.rlThumbnailsBorderSize = 2;
			_s.rlThumbnailsBorderColor = _s.props.rlThumbnailsBorderColor || '#FFFFFF';
			_s.rlSpaceBetweenThumbnailsAndItem = _s.props.rlSpaceBetweenThumbnailsAndItem;
			if(_s.rlSpaceBetweenThumbnailsAndItem ==  undefined) _s.rlSpaceBetweenThumbnailsAndItem = 10;
			_s.rlThumbnailsOffsetBottom = _s.props.rlThumbnailsOffsetBottom;
			if(_s.rlThumbnailsOffsetBottom ==  undefined) _s.rlThumbnailsOffsetBottom = 10;
			_s.rlSpaceBetweenThumbnails = _s.props.rlSpaceBetweenThumbnails;
			if(_s.rlSpaceBetweenThumbnails ==  undefined) _s.rlSpaceBetweenThumbnails = 5;
			_s.rlShowCaption = _s.props.rlShowCaption == "yes" ? true : false;
			_s.rlCaptionPosition = _s.props.rlCaptionPosition || 'bottomout';
			_s.rlShowCaptionOnSmallScreens = _s.props.rlShowCaptionOnSmallScreens == "yes" ? true : false;
			_s.rlCaptionAnimationType = _s.props.rlCaptionAnimationType || 'motion';
			_s.rlUseVideo = _s.props.rlUseVideo == "yes" ? true : false;
			_s.rlFillEntireScreenWithPoster = _s.props.rlFillEntireScreenWithPoster == "yes" ? true : false;
			_s.rlVolume = _s.props.rlVolume;
			if(_s.rlVolume === undefined) _s.rlVolume = 1;
			_s.rlVideoAutoPlay = _s.props.rlVideoAutoPlay == "yes" ? true : false;
			_s.rlNextVideoAutoPlay = _s.props.rlNextVideoAutoPlay == "yes" ? true : false;
			_s.rlVideoAutoPlayText = _s.props.rlVideoAutoPlayText || 'Click to unmute';
			_s.rlShowLogo = _s.props.rlShowLogo == "yes" ? true : false;
			_s.rlLogoPath = _s.props.rlLogoPath || "content/rl/content/evp/skin/logo.png";
			_s.rlThumbnailsPreviewWidth = _s.props.rlThumbnailsPreviewWidth || 196;
			_s.rlThumbnailsPreviewBackgroundColor = _s.props.rlThumbnailsPreviewBackgroundColor || "#2e2e2e";
			_s.rlThumbnailsPreviewBorderColor = _s.props.rlThumbnailsPreviewBorderColor || "#414141";
			_s.rlThumbnailsPreviewLabelBackgroundColor = _s.props.rlThumbnailsPreviewLabelBackgroundColor || "#414141";
			_s.rlThumbnailsPreviewLabelFontColor = _s.props.rlThumbnailsPreviewLabelFontColor || "#CCCCCC";
			_s.rlSkipToVideoText = _s.props.rlSkipToVideoText || "You can skip to video in: ",
			_s.rlSkipToVideoButtonText = _s.rlSkipToVideoButtonText || "Skip Ad";


			// Parse datalist.
			var dataListAr = prt.dataListAr;
			
			_s.totalDataLists = dataListAr.length;
			var allCatAr = [];
			var allMediaAr = [];
			var mediaAr;
			var dataAr;
			var childKidsAr;
			var curUlElem;
			var totalChildren;
			var totalInnerChildren;
			var dataListChildrenAr;
			var mediaKid;
			var attributeMissing;
			var dataListPositionError;
			var positionError;

			for (var i=0; i<_s.totalDataLists; i++){
				var lightboxParsedPlaylist_ar = [];
				curUlElem = dataListAr[i];
				dataAr = [];
				mediaAr = [];
				dataListChildrenAr = FWDR3DCovUtils.getChildren(curUlElem);
				totalChildren = dataListChildrenAr.length;

				for (var j=0; j<totalChildren; j++){
					var obj = {};
					var child = dataListChildrenAr[j];
					var childKidsAr = FWDR3DCovUtils.getChildren(child);
					
					dataListPositionError = i + 1;
					positionError = j + 1;
					
					totalInnerChildren = childKidsAr.length;
			
					// check for data-thumb-src attribute.
					var hasError = true;
					for(var k=0; k<totalInnerChildren; k++){
						attributeMissing = "data-thumb-src";
						if (FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-thumb-src")){
							hasError = false;
							obj.thumbSrc = FWDR3DCovUtils.trim(FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-src"));
							break;
						}
					}

					obj.thumbVideoSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-video-src");
					obj.password = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-password");
					obj.subtitleSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-subtitle-src");
					obj.thumbPreviewSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-preview-src");
					obj.thumbVastSrc = FWDR3DCovUtils.getAttributeValue(childKidsAr[k], "data-thumb-vast-src");

					if (hasError){
						errorMessage = "Element with attribute <font color='#FF0000'>" + attributeMissing + "</font> is not defined in the datalist number - <font color='#FF0000'>" + dataListPositionError + "</font> at position - <font color='#FF0000'>" + positionError + "</font> in the datalist ul element.";
						_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:errorMessage});
						return;
					}
					
					if(_s.showCaption){
						for (var k=0; k<totalInnerChildren; k++){
							if (FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-thumb-caption")){
								obj.thumbText = childKidsAr[k].innerHTML;
								mediaKid = childKidsAr[k];
								break;
							}
						}
						
						obj.captionOffset = 0;
						if(mediaKid){
							if(FWDR3DCovUtils.getAttributeValue(mediaKid, "data-thumb-caption-offset")){
								obj.captionOffset = parseInt(FWDR3DCovUtils.trim(FWDR3DCovUtils.getAttributeValue(mediaKid, "data-thumb-caption-offset")));
							}
						}
					}
					
					// Set arrays for lightbox.
					obj.type = "none";

					var rlKid;
					for (var k=0; k<totalInnerChildren; k++){
						rlKid = undefined;
						if (FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-rl-src")){
							rlKid = childKidsAr[k];
							break;
						}
					}

					var secondObj = undefined;
					if(rlKid){

						secondObj = {};
						secondObj.type = 'none';
						secondObj.src = String(FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-src"));
						secondObj.thumbSrc = obj.thumbSrc;

						var soTarget = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-target");
						if(soTarget){
							 secondObj.target = soTarget;
						}else{
							 secondObj.target = '_blank';
						}
					
						var soPosterSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-poster-src");
						if(soPosterSrc) secondObj.posterSrc = soPosterSrc;

						var soPassword = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-password");
						if(soPassword) secondObj.password = soPassword;

						var soSubtitleSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-subtitle-src");
						if(soSubtitleSrc) secondObj.subtitleSrc = soSubtitleSrc;

						var soThumbnailsPreviewSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-preview-src");
						if(soThumbnailsPreviewSrc) secondObj.thumbnailsPreviewSrc = soThumbnailsPreviewSrc;

						var soVastSrc = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-vast-src");
						if(soVastSrc) secondObj.vastSrc = soVastSrc

						var soWidth = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-width");
						if(soWidth) secondObj.width = soWidth

						var soHeight = FWDR3DCovUtils.getAttributeValue(rlKid, "data-rl-height");
						if(soHeight) secondObj.height = soHeight
						
						// Check for rl caption.
						for (var k=0; k<totalInnerChildren; k++){
							if(FWDR3DCovUtils.hasAttribute(childKidsAr[k], "data-rl-caption")){
								secondObj.caption = childKidsAr[k].innerHTML;
								break;
							}
						}
						
						if(/link:/i.test(secondObj.src)){
							secondObj.src = secondObj.src.substr(5);
							secondObj.type = "link";
							obj.type = "link";
						}else if(/none/i.test(secondObj.src)){
							secondObj.src = secondObj.src.substr(5);
							secondObj.type = "none";
							obj.type = "none";
						}
						obj.secondObj = secondObj;

					}

					_s.setItemType(obj, obj.thumbVideoSrc);
					if(secondObj && secondObj.type != 'link'){
						_s.setItemType(secondObj, secondObj.src);
					}
					
					if(secondObj && secondObj.type != "link" && secondObj.type != "none" && !obj.thumbVideoSrc){
						lightboxParsedPlaylist_ar.push(secondObj);
					}
					
					dataAr[j] = obj;
					allCatAr.push(obj);
				}
				
				_s.categoriesAr[i] = FWDR3DCovUtils.getAttributeValue(curUlElem, "data-cat") || "not defined!";
				_s.dataListAr[i] = dataAr;
				_s.lightboxAr[i] = {playlistItems:lightboxParsedPlaylist_ar};
			}

			if (_s.showAllCategories){
				_s.categoriesAr.unshift(_s.allCategoriesLabel);
				_s.dataListAr.unshift(allCatAr);
				
				_s.totalDataLists++;
			}

			if(_s.totalDataLists <=1) _s.showMenu = false;
			
			if (!_s.skinPath_str){
				_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:"Carousel graphics skin path is not defined in FWDR3DCov constructor function!"});
				return;
			}
			
			_s.skinPaths_ar = [
				{img:_s.largePlayNImg = new Image(), src:_s.skinPath_str + "large-play.png"},
				{img:_s.prevButtonNImg = new Image(), src:_s.skinPath_str + "prev-button.png"},
				{img:_s.comboboxArrowIconN_img = new Image(), src:_s.skinPath_str + "menuIcon.png"},
				{img:_s.nextButtonNImg = new Image(), src:_s.skinPath_str + "next-button.png"},
				{img:_s.pauseButtonImg = new Image(), src:_s.skinPath_str + "pause-button.png"},
				{img:_s.playButtonNImg = new Image(), src:_s.skinPath_str + "play-button.png"},
				{img:_s.largeNextButton_img = new Image(), src:_s.skinPath_str + "next-button-large-normal.png"},
				{img:_s.largePrevButton_img = new Image(), src:_s.skinPath_str + "prev-button-large-normal.png"},
				{img:_s.handlerLeftNImg = new Image(), src:_s.skinPath_str + "handler-left-normal.png"},
				{img:_s.handlerLeftSImg = new Image(), src:_s.skinPath_str + "handler-left-selected.png"},
				{img:_s.handlerRightNImg = new Image(), src:_s.skinPath_str + "handler-right-normal.png"},
				{img:_s.handlerRightSImg = new Image(), src:_s.skinPath_str + "handler-right-selected.png"},
				{img:_s.trackLeftImg = new Image(), src:_s.skinPath_str + "trackLeft.png"},
				{img:_s.trackCenterImg = new Image(), src:_s.skinPath_str + "trackCenter.png"},
				{img:_s.trackRightImg = new Image(), src:_s.skinPath_str + "trackRight.png"}
			];
			
			
			// set images
			_s.largePlaySPath = _s.skinPath_str + "large-play-over.png";
			_s.playButtonSPath = _s.skinPath_str + "play-button-over.png";
			_s.nextButtonSPath =  _s.skinPath_str + "next-button-over.png";
			_s.prevButtonSPath =  _s.skinPath_str + "prev-button-over.png";
			_s.circleBK = _s.skinPath_str + "slideshow-background.png";
			_s.preloaderPath = _s.skinPath_str + "preloader.png"
			_s.mainPreloaderImg = new Image();
			_s.largeNextButtonSPath_str = _s.skinPath_str + "next-button-large-selected.png";
			_s.largePrevButtonSPath_str = _s.skinPath_str + "prev-button-large-selected.png";
			_s.comboboxArrowIconN_str = _s.skinPath_str + "menuIcon.png";
			_s.handlerCenterNPath = _s.skinPath_str + "handler-center-normal.png";
			_s.handlerCenterSPath = _s.skinPath_str + "handler-center-selected.png";
			_s.trackCenterPath = _s.skinPath_str + "/trackCenter.png";
			_s.thumbGradientLeftPath = _s.skinPath_str + "gradientLeft.png";
			_s.thumbGradientRightPath = _s.skinPath_str + "gradientRight.png";
			_s.thumbTitleGradientPath = _s.skinPath_str + "textGradient.png";

			
			_s.totalGraphics = _s.skinPaths_ar.length;
			_s.countLoadedSkinImages = 0;
			
			setTimeout(function(){
				_s.dispatchEvent(FWDR3DCovData.PRELOADER_LOAD_DONE);
				if(_s.useVectorIcons){
					if(_s.useVideo){
						_s.loadVideoPlayer();
					}else{
						_s.doneLoading();
					}
				}else{
					_s.loadSkin();
				}
			}, 50);
		};

		_s.setItemType = function(obj, str){
			if(/\.jpg|\.jpeg|.webp|\.png|\.bmp|\.gif|\.tif|\.tiff|\.jfi|\.jfif|\.exif|\.svg/i.test(str)){
				obj.type = FWDR3DCov.IMAGE;
			}else if(/\.mp4|\.m3u8|\.mpd/i.test(str)){
				obj.type = FWDR3DCov.VIDEO;
			}else if(/youtube\./i.test(str)){
				obj.type = FWDR3DCov.YOUTUBE;
			}else if(/vimeo\./i.test(str)){
				obj.type = FWDR3DCov.VIMEO;
			}else if(/\.mp3/i.test(str)){
				obj.type = FWDR3DCov.AUDIO;
			}else if(/https:|http:|\.pdf/i.test(str)){
				obj.type = FWDR3DCov.IFRAME;
			}else if(document.getElementById(str)){
				obj.type = FWDR3DCov.HTML;
			}
		}


		/**
		  * Load buttons png icons.
		  */
		_s.loadSkin = function(){
			var img;
			var src;
			
			for(var i=0; i<_s.totalGraphics; i++){
				img = _s.skinPaths_ar[i].img;
				src = _s.skinPaths_ar[i].src;
				img.onload = _s.onSkinLoadHandler;
				img.onerror = _s.onSkinLoadErrorHandler;
				img.src = src;
			}
		};
		
		_s.onSkinLoadHandler = function(e){
			_s.countLoadedSkinImages++;
		
			if(_s.countLoadedSkinImages == _s.totalGraphics){
				if(_s.useVideo){
					_s.loadVideoPlayer();
				}else{
					_s.doneLoading();
				}
			}
		};

		_s.doneLoading = function(){
			_s.dispatchEvent(FWDR3DCovData.LOAD_DONE);
		}
		
		_s.onSkinLoadErrorHandler = function(e){
			if (FWDR3DCovUtils.isIEAndLessThen9){
				var message = "Graphics image not found!";
			}else{
				var message = "The skin icon with label <font color='#ff0000'>" + e.target.src + "</font> can't be loaded, check path!";
			}
			
			if(window.console) console.log(e);
			var err = {text:message};
			setTimeout(function(){
				if(_s) _s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, err);
			}, 50);
		};


		/**
	 	 * Load video player.
	 	 */
	 	_s.loadVideoPlayer = function(){
	 		if(!FWDR3DCov.hasLoadEVP && !window['FWDEVPlayer']){
		 		var script = document.createElement('script');
				script.src = _s.mainFolderPath + 'rl/content/evp/java/FWDEVPlayer.js';
				document.head.appendChild(script);
				script.onload = _s.videoLoadDone;
				script.onerror = _s.onVidLoadError;
			}

			_s.evp_it = setInterval(function(){
				if(FWDR3DCov.hasEVP || window['FWDEVPlayer']){
					_s.doneLoading();
					clearInterval(_s.evp_it);
				}
			}, 5);

			FWDR3DCov.hasLoadEVP = true;
	 	}

	 	_s.onVidLoadError = function(){
	 		clearInterval(_s.evp_it);
			var error = "Error loading video player!";
	 		_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:error});
	 	}

	 	_s.videoLoadDone = function(){
	 		FWDR3DCov.hasEVP = true;	
	 	}


		/**
		  * Check if element with and attribute exists or throw error.
		  */
		_s.checkForAttribute = function(e, attr){
			var test = FWDR3DCovUtils.getChildFromNodeListFromAttribute(e, attr);
			
			test = test ? FWDR3DCovUtils.trim(FWDR3DCovUtils.getAttributeValue(test, attr)) : undefined;
			
			if (!test)
			{
				_s.dispatchEvent(FWDR3DCovData.LOAD_ERROR, {text:"Element  with attribute <font color='#FF0000'>" + attr + "</font> is not defined."});
				return;
			}
			
			return test;
		};

		_s.init();
	};

	/**
	 * Prototype.
	 */
	FWDR3DCovData.setPrototype = function(){
		FWDR3DCovData.prototype = new FWDR3DCovEventDispatcher();
	};

	FWDR3DCovData.prototype = null;
	FWDR3DCovData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDR3DCovData.LOAD_DONE = "onLoadDone";
	FWDR3DCovData.LOAD_ERROR = "onLoadError";

	window.FWDR3DCovData = FWDR3DCovData;
}(window));