'use strict';
var isMobile, distance, dev;
/** 
* Mobile Device Detection
*/
isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
/**
* Check for dev environment
*/
dev = window.location.origin.indexOf("8887") !== -1 ? true: false;
if (dev)
{
  handleError("development mode");
}
distance = isMobile ? "70%" : "30%";
/**
* Display message onscreen
* @param {string} msg the message to be displayed
*/
function handleError(msg) {
  if (document.getElementById('general-error-wrapper')){
    document.getElementById('general-error-wrapper').style.display="block";
    document.getElementById('general-error').innerHTML = msg;
    setTimeout(function() {document.getElementById('general-error-wrapper').style.display="none";},2500);
  }
}
///////////////////////////////////////
//  IMAGES                          //
/////////////////////////////////////
/*
function expandImage(img)
{
  var image = img;
  if(image){
    addImage(image);
  }
}
function addImage(full)
{
  $('#fullscreen_image').html('<img alt="flier" width="95%" style="margin: 10px 0 10px 0;"  src=' + full + ' />');
  $('#fullscreen_image').show();
  $('#fullscreen_image').parent().show();
}

///////////////////////////////////////
//  TEXT                            //
/////////////////////////////////////
function truncate(str)
{
  if (str.length > 200){
    var pos = 180,
    // Search for the word's beginning and end.
    right = str.slice(pos).search(/\s/);
    return str.substring(0, pos + right)+'<span class="link read-less" style="display:none;">less</span><span style="display:inline;"class="link read-more">... more</span>';
  } else {
    return str;
  }
}
///////////////////////////////////////
//  FORMS                           //
/////////////////////////////////////
function form_as_object(form)
{
  var object = {};
  var split = (form.serialize()).split('&');
  for (var i in split)
  {
    var key_value = split[i].split('=');
    object[key_value[0]] = key_value[1];
  }
  return object;
}
///////////////////////////////////////
//  COUNTDOWN                       //
/////////////////////////////////////
function countdown(deadline, id)
{
  // set the date we're counting down to
  var target_date = new Date(deadline).getTime();
  calculateCountdown(target_date, id);

  // update the tag with id "countdown" every 1 second
  setInterval(function () {
    calculateCountdown(target_date, id);
  }, 1000 * 60);
}
function calculateCountdown(target_date, id) {
  // variables for time units
  var days, hours, minutes, seconds;

  // find the amount of "seconds" between now and target
  var current_date = new Date().getTime();
  var seconds_left = (target_date - current_date) / 1000;

  // do some time calculations
  days = padInt(parseInt(seconds_left / 86400));
  seconds_left = seconds_left % 86400;

  hours = padInt(parseInt(seconds_left / 3600));
  seconds_left = seconds_left % 3600;

  minutes = padInt(parseInt(seconds_left / 60));
  seconds = padInt(parseInt(seconds_left % 60));

  // format countdown string + set tag value
  $('#countdown-days-'+id).html(days);
  $('#countdown-hours-'+id).html(hours);
  $('#countdown-minutes-'+id).html(minutes);
}
function padInt(n) {
  return (n < 10) ? ("0" + n) : n;
}
///////////////////////////////////////
//  Horizontal Pan Arrows           //
/////////////////////////////////////
function panArrows()
{
  var scrollHandle = 0,
      scrollStep = 5,
      parent = $(".scrolls");
  //Start the scrolling process
  $(".panner").on("mouseenter", function () {
    var data = $(this).data('scrollModifier'), direction = parseInt(data, 10);
    $(this).addClass('active');
    startScrolling(direction, scrollStep);
  });
  //Kill the scrolling
  $(".panner").on("mouseleave", function () {
    stopScrolling();
    $(this).removeClass('active');
  });
  //Actual handling of the scrolling
  function startScrolling(modifier, step) {
    if (scrollHandle === 0) {
      scrollHandle = setInterval(function () {
        var newOffset = parent.scrollLeft() + (scrollStep * modifier);
        parent.scrollLeft(newOffset);
      }, 10);
    }
  }
  function stopScrolling() {
    clearInterval(scrollHandle);
    scrollHandle = 0;
  }
}
*/
