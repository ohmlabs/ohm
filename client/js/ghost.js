// Global vars
var $artHeaderInner = $('.art-header-inner');
var $artHeader = $('.art-header');
var $postImage = $('.post-image');
var $nav = $('.nav');
/** Set Cover Image 
* Searches the page for image with class 'post-image'
*/
function setCoverImage() {
  'use strict';
  if ( $postImage.length ) {
    var postImageURL = $postImage.attr('src');
    $artHeader.css('background-image','url(' + postImageURL + ')');
  }
  $postImage.remove();
}
setCoverImage();
// Scroll Menu (throttled w/ Underscore)
var throttledMenuScroll =  _.throttle(ScrollMenu, 500);
// On scroll affect menu and  video
window.onscroll = function () {
  throttledMenuScroll();
};
// Initialize Lightbox
var lightbox = new LightBox();
// Identify if visitor has a large enough viewport for parallaxing title
function isLargeViewport() {
  'use strict';
  if($nav.css('position') === "relative") {
    return false;
  } else {
    return true;
  }
}
// If large viewport and not mobile, parallax the title
if(!isMobile) {
  $(window).scroll(function() {
    if(isLargeViewport()) {
      slidingTitle();
    }
  });
  // Window gets large enough, need to recalc all parallaxing title values
  $(window).resize(function() {
    if(isLargeViewport()) {
      slidingTitle();
    }
  });
}
// Functional parallaxing calculations
function slidingTitle() {
  'use strict';
  //Get scroll position of window
  var windowScroll = window.pageYOffset;
  //Slow scroll of .art-header-inner scroll and fade it out
  $artHeaderInner.css({
    'margin-top' : -(windowScroll/3)+"px",
    'opacity' : 1-(windowScroll/550)
  });
  //Slowly parallax the background of .art-header
  $artHeader.css({
    'background-position' : 'center ' + (-windowScroll/8)+"px"
  });
  //Fade the .nav out
  $nav.css({
    'opacity' : 1-(windowScroll/400)
  });
}
// Link to top of page without changing URL
$('.back-to-top a').click(function(e) {
  e.preventDefault();
  $(window).scrollTop(0);
});

if (document.getElementById("map_canvas")){
  var style = [{
    "featureType": "water",
    "stylers": [
      { "color": "#eeeeee" }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "color": "#666" }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "poi.park",
    "stylers": [
      { "saturation": -100 }
    ]
  },{
    "elementType": "labels.text",
    "stylers": [
      { "hue": "#ff0022" },
      { "color": "#000000" }
    ]
  },{
    "elementType": "labels.text.stroke",
    "stylers": [
      { "weight": 0.1 }
    ]
  },{
  },{
    "elementType": "geometry.stroke",
    "stylers": [
      { "weight": 1.5 },
      { "color": "#cccccc" }
    ]
  },{
    "featureType": "road.local",
    "stylers": [
      { "color": "#666666" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "color": "#cccccc" }
    ]
  },{
    "featureType": "road.highway.controlled_access",
    "elementType": "labels.icon",
    "stylers": [
      { "saturation": -100 }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "saturation": -100 }
    ]
  }];
  var gmapper = new Gmapper({
    locations: [{"icon":"http://drake.fm/img/apple-touch-icon-precomposed.png","latLng":{"__type":"GeoPoint","latitude":41.890212,"longitude":-87.624967},"name":"Drake.fm","url":"http://work.drake.fm","objectId":"rL2aub1TOi"}],
    scrollWheel: false,
    theme: style,
    overlay: false,
    lat: 41.80,
    lng: -87.60,
    search: false,
    query: "cameron",
    types: ["web design"],
    radius: 40000,
    zoom: 4
  });
}