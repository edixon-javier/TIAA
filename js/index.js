// *
// * Add Thumbnails to DOM
// *
// > Data
const data = [
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_DEL_01001213_RND.png",
    thumbVideoSrc: "TIAA_1-PlanFocus_v09_DEL.mp4",
    title: "Institutional Platforms Reimagined",
    desc: "Reimagined Plan Sponsor and Consultant experiences to improve quality, reduce administrative time, and optimize business",
  },
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_DEL_01035317_RND.png",
    thumbVideoSrc: "TIAA_2-Web-Mobile_v07_DEL.mp4",
    title: "Participant Experiences Reimagined",
    desc: "Reimagined Web and Mobile experiences to provide delightful and transformational omni-channel experiences that engage and support participants through their life journey and help them achieve their retirement goals",
  },
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_DEL_01070317_RND.png",
    thumbVideoSrc: "TIAA_4-GoogleAI_v11_DEL.mp4",
    title: "Customer Servicing Reimagined",
    desc: "Strategic Partnerships and AI-driven platforms to provide a best-in-class customer servicing experience",
  },
  {
    thumbSrc: "placeholder.svg",
    title: "Title",
    desc: "Description",
    externalUrl:
      "https://vision.tiaa.org/public/vista/getontrack/calculator/start",
  },
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_PLAYALL_RND.png",
    thumbVideoSrc: "TIAA_0-Forum2023-LOOP_DEL.mp4",
    title: "Reimagined TIAA Retirement Technology",
    desc: "The next generation of transformative changes coming soon to the platforms and technology that support retirement",
  },
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_DEL_01043014_RND.png",
    thumbVideoSrc: "TIAA_3-Gateway_v07_DEL.mp4",
    title: "Retirement Gateway",
    desc: "The next-generation engine that enables extended integration and external interconnectivity, for a fully digital retirement offering ecosystem",
  },
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_DEL_01074603_RND.png",
    thumbVideoSrc: "TIAA_5-MFABB_v11_DEL.mp4",
    title: "Next Generation Digital Security and Identity",
    desc: "The next generation of digital security includes state-of-the-art tools for multi factor authentication, biometrics, and device binding",
  },
  {
    thumbSrc: "TIAA_0-Forum2023-LOOP_DEL_01083623_RND.png",
    thumbVideoSrc: "TIAA_6-Awards_v01_DEL.mp4",
    title: "TIAA Accolades",
    desc: "TIAA has been recognized as a game-changer and leader in the retirement industry",
  },
];

const addThumbnails = () => {
  const thumbsVideo = document.getElementById("thumbsVideo");

  // > Add elements to DOM
  for (let index = 0; index < data.length; index++) {
    const ul = document.createElement("ul");
    const liLink = document.createElement("li");
    const liImg = document.createElement("li");
    const liTextThumb = document.createElement("li");
    const title = document.createElement("p");
    const description = document.createElement("p");

    liImg.setAttribute("data-thumb-src", `assets/${data[index].thumbSrc}`);
    liImg.setAttribute(
      "data-thumb-video-src",
      `videos/${data[index].thumbVideoSrc}`
    );

    liTextThumb.setAttribute("data-thumb-caption", "");
    liTextThumb.setAttribute("data-thumb-caption-offset", "70");

    title.className = "fwdr3dcov-title";
    title.textContent = data[index].title;

    description.className = "fwdr3dcov-desc";
    description.textContent = data[index].desc;

    liTextThumb.appendChild(title);
    liTextThumb.appendChild(description);

    ul.appendChild(liLink);
    ul.appendChild(liImg);
    ul.appendChild(liTextThumb);

    if (thumbsVideo) thumbsVideo.appendChild(ul);
  }
};

// *
// * Init carousel
// *
FWDR3DCovUtils.onReady(function () {
  // > Add elements to DOM
  addThumbnails();

  // > Create carousel
  new FWDR3DCov({
    // * Main.

    // Carousel size
    coverflowWidth: 3840, // ! Important
    coverflowOffsetHeight: 220, // ! Important

    instanceName: "fwdr3dcov0",
    coverflowHolderDivId: "coverflow-carousel",
    coverflowDataListDivId: "coverflow-data",
    displayType: "responsive",
    thumbnailResizeOffest: 60,
    zIndex: 0,
    mainFolderPath: "coverflow/start/content",
    skinPath: "skin_dark",
    useVectorIcons: "yes",
    initializeOnlyWhenVisible: "no",
    coverflowStartPosition: "center",
    coverflowXRotation: 0,
    rightClickContextMenu: "default",
    enableMouseWheelScroll: "no",
    addKeyboardSupport: "yes",
    useDragAndSwipe: "yes",
    backgroundColor: "transparent",
    backgroundImage: "",
    backgroundImageRepeat: "no-repeat",
    backgroundImageSize: "auto",
    preloaderBackgroundColor: "#333333",
    preloaderFillColor: "#FFFFFF",

    // * Thumbnails
    // Thumbnail size
    thumbnailWidth: 1400, // ! Important
    thumbnailHeight: 787.5, // ! Important

    thumbnailXOffset3D: 100,
    thumbnailXSpace3D: 97,
    thumbnailZOffset3D: 200,
    thumbnailZSpace3D: 180,
    thumbnailYAngle3D: 55,
    thumbnailHoverOffset: 100,
    thumbnailOffsetY: 0,
    thumbnailBorderSize: 0,
    thumbnailBackgroundColor: "#003865",
    thumbnailBorderColor1: "#FFFFFF",
    thumbnailBorderColor2: "#FFFFFF",
    numberOfThumbnailsToDisplayLeftAndRight: "3",
    infiniteLoop: "yes",
    transparentImages: "no",
    showReflection: "no",
    reflectionHeight: 50,
    reflectionDistance: 0,
    reflectionOpacity: 0.4,
    showThumbnailsGradient: "yes",
    thumbnailGradientColor1: "rgba(0, 56, 101, 0)",
    thumbnailGradientColor2: "rgba(0, 56, 101, 1)",
    useVideo: "yes",
    videoAutoPlay: "no",
    nextVideoAutoPlay: "no",
    videoAutoPlayText: "Click to unmute",
    volume: 1,
    showLogo: "no",
    logoPath: "",
    logoLink: "",
    fillEntireVideoScreen: "yes",
    showDefaultControllerForVimeo: "yes",
    showScrubberWhenControllerIsHidden: "yes",
    showVolumeButton: "yes",
    showTime: "yes",
    showRewindButton: "no",
    showQualityButton: "no",
    showPlaybackRateButton: "yes",
    showChromecastButton: "no",
    showFullScreenButton: "yes",
    showScrubberToolTipLabel: "yes",
    timeColor: "#B9B9B9",
    youtubeQualityButtonNormalColor: "#B9B9B9",
    youtubeQualityButtonSelectedColor: "#FFFFFF",
    scrubbersToolTipLabelBackgroundColor: "#FFFFFF",
    scrubbersToolTipLabelFontColor: "#5a5a5a",
    audioVisualizerLinesColor: "#D60E63",
    audioVisualizerCircleColor: "#FFFFFF",
    thumbnailsPreviewWidth: 196,
    thumbnailsPreviewBackgroundColor: "#2e2e2e",
    thumbnailsPreviewBorderColor: "#414141",
    thumbnailsPreviewLabelBackgroundColor: "#414141",
    thumbnailsPreviewLabelFontColor: "#CCCCCC",
    skipToVideoText: "",
    skipToVideoButtonText: "",
    // Controls.
    controlsMaxWidth: 600,
    controlsOffset: 0,
    showNextAndPrevButtons: "no",
    showNextAndPrevButtonsOnMobile: "no",
    nextAndPrevButtonsOffsetX: 20,
    showLargeNextAndPrevButtons: "no",
    largeNextAndPrevButtonsMaxWidthPos: 1610,
    showSlideshowButton: "no",
    slideshowAutoplay: "no",
    slideshowDelay: 5,
    slideshowPreloaderBackgroundColor: "#333333",
    slideshowPreloaderFillColor: "#FFFFFF",
    showScrollbar: "no",
    showScrollbarOnMobile: "no",
    scrollbarHandlerWidth: 200,
    scrollbarTextColorNormal: "#FFFFFF",
    scrollbarTextColorSelected: "#111111",
    showBulletsNavigation: "no",
    bulletsNormalColor: "#333333",
    bulletsSelectedColor: "#FFFFFF",
    bulletsNormalRadius: 6,
    bulletsSelectedRadius: 9,
    spaceBetweenBullets: 18,
    // Caption.
    showCaption: "yes",
    captionPosition: "out",
    captionAnimationType: "motion",
    showCaptionOnTap: "yes",
    showFullCaption: "no",
    // Menu.
    showMenu: "yes",
    startAtCategory: 1,
    menuPosition: "topright",
    selectorLineColor: "#333333",
    selectorBackgroundColor: "#1F1F1F",
    selectorTextNormalColor: "#FFFFFF",
    selectorTextSelectedColor: "#FFFFFF",
    buttonBackgroundColor: "#1F1F1F",
    buttonTextNormalColor: "#8F8F8F",
    buttonTextSelectedColor: "#FFFFFF",
    menuHorizontalMargins: 12,
    menuVerticalMargins: 12,
    // Lightbox.
    useLightbox: "yes",
    rlUseDeepLinking: "yes",
    rlItemBackgroundColor: "#212121",
    rlDefaultItemWidth: 1527,
    rlDefaultItemHeight: 859,
    rlItemOffsetHeight: 37,
    rlItemOffsetHeightButtonsTop: 47,
    rlItemBorderSize: 0,
    rlItemBorderColor: "#FFFFFF",
    rlMaxZoom: 1.2,
    rlPreloaderBkColor: "#2e2e2e",
    rlPreloaderFillColor: "#FFFFFF",
    rlButtonsAlignment: "in",
    rlButtonsHideDelay: 5,
    rlMediaLazyLoading: "yes",
    rlUseDrag: "yes",
    rlUseAsModal: "no",
    rlShowSlideShowButton: "yes",
    rlShowSlideShowAnimation: "yes",
    rlSlideShowAutoPlay: "no",
    rlSlideShowAutoStop: "no",
    rlSlideShowDelay: 6,
    rlSlideShowBkColor: "#2e2e2e",
    rlSlideShowFillColor: "#FFFFFF",
    rlUseKeyboard: "yes",
    rlUseDoubleClick: "yes",
    rlShowCloseButton: "yes",
    rlShowFullscreenButton: "yes",
    rlShowZoomButton: "yes",
    rlShowCounter: "yes",
    rlShowNextAndPrevBtns: "yes",
    rlSpaceBetweenBtns: 8,
    rlButtonsOffsetIn: 10,
    rlButtonsOffsetOut: 10,
    rlBackgroundColor: "rgba(0,0,0,.99)",
    rlShareButtons: [],
    rlShareText: "",
    rlSharedURL: "deeplink",
    rlShareMainBackgroundColor: "rgba(0,0,0,.4)",
    rlShareBackgroundColor: "#FFFFFF",
    rlShowThumbnails: "yes",
    rlShowThumbnailsIcon: "yes",
    rlThumbnailsHeight: 80,
    rlThumbnailsOverlayColor: "rgba(0,0,0,.4)",
    rlThumbnailsBorderSize: 2,
    rlThumbnailsBorderColor: "#FFFFFF",
    rlSpaceBetweenThumbnailsAndItem: 10,
    rlThumbnailsOffsetBottom: 10,
    rlSpaceBetweenThumbnails: 5,
    rlShowCaption: "yes",
    rlCaptionPosition: "bottomout",
    rlShowCaptionOnSmallScreens: "no",
    rlCaptionAnimationType: "motion",
    rlUseVideo: "yes",
    rlFillEntireScreenWithPoster: "yes",
    rlVolume: 1,
    rlVideoAutoPlay: "no",
    rlNextVideoAutoPlay: "no",
    rlVideoAutoPlayText: "Click to unmute",
    rlShowLogo: "no",
    rlLogoPath: "",
    rlLogoLink: "",
    rlShowDefaultControllerForVimeo: "yes",
    rlShowScrubberWhenControllerIsHidden: "yes",
    rlShowRewindButton: "yes",
    rlShowVolumeButton: "yes",
    rlShowChromecastButton: "no",
    rlShowPlaybackRateButton: "no",
    rlShowQualityButton: "yes",
    rlShowFullScreenButton: "yes",
    rlShowScrubberToolTipLabel: "yes",
    rlShowTime: "yes",
    rlTimeColor: "#B9B9B9",
    rlYoutubeQualityButtonNormalColor: "#B9B9B9",
    rlYoutubeQualityButtonSelectedColor: "#FFFFFF",
    rlScrubbersToolTipLabelBackgroundColor: "#FFFFFF",
    rlScrubbersToolTipLabelFontColor: "#5a5a5a",
    rlAudioVisualizerLinesColor: "#D60E63",
    rlAudioVisualizerCircleColor: "#FFFFFF",
    rlThumbnailsPreviewWidth: 198,
    rlThumbnailsPreviewBackgroundColor: "#2e2e2e",
    rlThumbnailsPreviewBorderColor: "#414141",
    rlThumbnailsPreviewLabelBackgroundColor: "#414141",
    rlThumbnailsPreviewLabelFontColor: "#CCCCCC",
    rlSkipToVideoText: "",
    rlSkipToVideoButtonText: "",
  });

  // ! Remove play button
  setTimeout(() => {
    document
      .querySelector(".EVPLargePlayButtonNormalState")
      ?.parentNode.remove();
  }, 500);

  // > Set videos to loop
  setTimeout(() => {
    const video = document.querySelectorAll("video")[1];
    video.loop = true;
  }, 2000);

  // > Add close button for fullscreen
  addCloseButton();

  // > Add event listener for fullscreen
  addFullScreenEventListener();
});

const addCloseButton = () => {
  // Get video element
  const videoContainer = document.querySelector(".video-screen-holder");

  if (videoContainer) {
    // Create and add new element for close button
    const div = document.createElement("div");
    const text = document.createTextNode("X");
    div.id = "close-btn";
    div.appendChild(text);
    videoContainer.appendChild(div);
  } else {
    setTimeout(() => {
      addCloseButton();
    }, 500);
  }
};

// *
// * Event Listener (fullscreenchange): Show CLOSE text when video is on fullscreen
// *
const addFullScreenEventListener = () => {
  // Get video and videoContainer elements
  const video = document.querySelectorAll("video")[1];
  const videoContainer = document.querySelector(".video-screen-holder");

  if (videoContainer) {
    // Add event listener
    videoContainer.addEventListener(
      "fullscreenchange",
      function (event) {
        if (!document.webkitRequestFullScreen) {
          if (document.fullscreenElement) {
            // Show close button
            document.querySelector("#close-btn").style.display = "flex";
          } else {
            // Hide close button
            document.querySelector("#close-btn").style.display = "none";

            // Pause video
            video.pause();
          }
        }
      },
      false
    );
  } else {
    setTimeout(() => {
      addFullScreenEventListener();
    }, 500);
  }
};

// *
// * Event Listener (click): Auto Fullscreen videos on play
// *
addEventListener("click", (event) => {
  // Get video and videoContainer elements
  const video = document.querySelectorAll("video")[1];
  const videoContainer = document.querySelector(".video-screen-holder");

  // ! Hacky way to find out if the element clicked is the thumbnail in the center of the carousel
  const isMainThumbnail = event.target
    .closest(".fwdr3dcov-thumbnail")
    ?.style?.transform?.includes("rotateY(0deg)");
  const isPlayBtn = event.target?.className?.includes("fwdr3dcov-icon-play");
  const isCloseBtn = event.target?.id === "close-btn";
  const isVideo = event.target?.tagName.toLowerCase() === "video";

  // > Is thumb a link?
  var modal = document.getElementById("modalWindow");
  if (
    event.target?.className == "close" ||
    event.target?.className == "modal"
  ) {
    modal.style.display = "none";
  }

  const externalUrl = window["fwdr3dcov0"]
    ? data[fwdr3dcov0.getCurrentThumbId()]?.externalUrl
    : null;
  if (isMainThumbnail && externalUrl) {
    modal.style.display = "block";
    return;
  }

  // > Exit fullscreen
  if (isCloseBtn) {
    video.pause();
    document.exitFullscreen();
    return;
  }

  // > Play video in fullscreen
  if (isMainThumbnail || isPlayBtn) {
    // Start video from the beginning
    video.currentTime = 0;

    // Play video
    video.play();

    // Set fullscreen
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullScreen) {
      videoContainer.msRequestFullScreen();
    }
    return;
  }

  // > Pause/Play video when it's playing on fullscreen
  if (isVideo) {
    const video = event.target;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    return;
  }
});

// *
// * Event Listener (keydown)
// *
addEventListener("keydown", (event) => {
  // The following fixed the issue introduced when adding a custom clickable thumbnail
  // Without this, arrow keys won't work when trying to navigate the carousel
  if (window["fwdr3dcov0"]) {
    fwdr3dcov0.goToThumb(fwdr3dcov0.getCurrentThumbId());
  }
});
