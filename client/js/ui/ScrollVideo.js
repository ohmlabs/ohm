// Select the scrollable video
var scrollVid   = document.getElementById('scrollVid');
// Scroll Video
/**
* ScrollVideo.js 0.2.0
* This plugin sets the video currentTime based on scroll position
* Found this hack: http://stackoverflow.com/questions/19587676/moving-video-background-as-mouse-scrolls
*
* Copyright (c) 2014 Ohm Labs Inc
* Licensed under the MIT license
* For all details and documentation:
* http://drake.fm/scrollVideo
*
* @version  0.2.0
* @author     Cameron W. Drake
* @copyright  Copyright (c) 2014 Ohm Labs
* @license    Licensed under the MIT license
* @module ScrollVideo
* @param {data} Options
*/
var ScrollVideo = (function(e, data){
  'use strict';
  /**
  * @class ScrollVideo
  * @constructor
  */
  try {
    $.toString();
  } catch(e){
    console.log("jQuery isn't loaded... something's wrong.");
    return;
  }
  var offset = data.offset;
  var video = data.video;
  var scrollPosition = window.pageYOffset;
  if(video.duration) {
    var videoLength = video.duration;
    var videoTime = video.currentTime = (scrollPosition - offset) * videoLength / ($(document).height() - offset);
    if (dev)
    {
      paraBugger(scrollPosition, "y: ");
    }
  }
});
