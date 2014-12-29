// Set scroll start position
var previousScroll = window.pageYOffset;
/**
 * ScrollMenu.js 0.2.0
 * hide menu on scoll down, show on scroll up (Medium Style)
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
 * @module ScrollMenu
 
 */
var ScrollMenu = (function(e) {
  'use strict';
  try {
    d3.toString();
    _.toString();
  } catch (e) {
    console.log("d3 isn't loaded... something's wrong.");
    return;
  }
  var currentScroll = window.pageYOffset;
  if (currentScroll > previousScroll && currentScroll > 0) {
    d3.select('#header-menu').transition().style("top", "-75px");
  } else {
    d3.select('#header-menu').transition().style("top", "0px");
  }
  previousScroll = currentScroll;
});
