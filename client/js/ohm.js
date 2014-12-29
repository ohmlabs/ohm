// Global vars
var $artHeaderInner = $('.art-header-inner');
var $artHeader = $('.art-header');
var $nav = $('.nav');

if (ScrollMenu) {
  // Scroll Menu (throttled w/ Underscore)
  var throttledMenuScroll = _.throttle(ScrollMenu, 500);

  /** On scroll affect menu and  video */
  window.onscroll = function() {
    throttledMenuScroll();
  };  
}

// Initialize Lightbox
var lightbox = new LightBox();

/** Identify if visitor has a large enough viewport for parallaxing title */
function isLargeViewport() {
  'use strict';
  if ($nav.css('position') === "relative") {
    return false;
  } else {
    return true;
  }
}

// If large viewport and not mobile, parallax the title
if (!isMobile) {
  $(window).scroll(function() {
    if (isLargeViewport()) {
      slidingTitle();
    }
  });
  // Window gets large enough, need to recalc all parallaxing title values
  $(window).resize(function() {
    if (isLargeViewport()) {
      slidingTitle();
    }
  });
}

/** Functional parallaxing calculations */
function slidingTitle() {
  'use strict';
  //Get scroll position of window
  var windowScroll = window.pageYOffset;
  //Slow scroll of .art-header-inner scroll and fade it out
  $artHeaderInner.css({
    'margin-top': (windowScroll / 2) + "px",
    'opacity': 1 - (windowScroll / 550)
  });
  //Slowly parallax the background of .art-header
  $artHeader.css({
    'background-position': 'center ' + (-windowScroll / 8) + "px"
  });
  //Fade the .nav out
  $nav.css({
    'opacity': 1 - (windowScroll / 400)
  });
}

// Link to top of page without changing URL
$('.back-to-top a').click(function(e) {
  e.preventDefault();
  $(window).scrollTop(0);
});