var  d3, _, Hammer, isMobile;
var $lightbox     = document.getElementById('lightbox_fade');
var $thumbs       = document.getElementById('thumbnails');
var $figures      = document.getElementsByClassName('lb-expandable');
var $buckets      = document.getElementsByClassName('lb-bucket');
var $galleries    = document.getElementsByClassName('lb-gallery');
/**
* Light.js
*
* Copyright (c) 2014 Ohm Labs Inc
* Licensed under the MIT license
* For all details and documentation:
* http://drake.fm/light
*
* @version  0.2.0
* @author     Cameron W. Drake
* @copyright  Copyright (c) 2014 Ohm Labs
* @license    Licensed under the MIT license

* @module LightBox
* @requires Underscore
* @requires D3
* @requires Hammer
*/
var LightBox = (function(){
  'use strict';
  try {
    _.toString();
    d3.toString();
  } catch(e){
    console.log("Something is wrong... fall back");
    return;
  }
  /** Hide LightBox on click */
  $lightbox && $lightbox.addEventListener('click', this._hideLightBox);
  var context = this;

  /** Image Gallery click */
  _.each($galleries, function (img){
    img.addEventListener('click', function(){
      this._changeActive(img);
    }.bind(context));
  }.bind(context));

  /** S3 Buckets click */
  _.each($buckets, function (link){
    link.addEventListener('click', function(){
      this._getPhotos(link.dataset.id);
    }.bind(context));
  }.bind(context));
  
  /** Expandable Image click */
  _.each($figures, function(fig){
    if (fig.nodeName === "IMG") {
      var str = fig.src;
    } else if (fig.nodeName === "FIGURE") {
      var str = fig.style.backgroundImage.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
    }
    fig.addEventListener('click', function(){
      this._lightBox(str);
    }.bind(context));
  }.bind(context));

  /** Listen for Next/Last Keys */
  window.onkeydown = function(e){
    if (e.keyCode === 39){
      this._nextPhoto();
    } else if (e.keyCode === 37) {
      this._previousPhoto();
    }
  }.bind(this);
});

_.extend(LightBox.prototype, {
  /**
   * Fetch Photos from Amazon S3
   * @param {string} bucketname The name of the S3 Bucket
   */
  _getPhotos: function (id) {
    'use strict';
    var thumbs = document.getElementById('thumbnails');
    event.stopPropagation();

    if(id && thumbs.hasClassName(id)){
      this._showThumbs(id);
    } else {
      thumbs.innerHTML= "";
      d3.json("/s3/" + id, function(error, json) {
        if (error) return console.warn(error);
        _.each(json.Contents, function(data) {
          if (data.Key.indexOf("thumbs/") === -1) {
            var li = document.createElement("li");
            li.innerHTML = '<div class="thumbnail" style="background:url(\'' + 'https://s3.amazonaws.com/' + id + '/thumbs/' + data.Key + '\');background-size: cover;" data-full="https://s3.amazonaws.com/' + id + '/' + data.Key + '"></div>';
            li.addEventListener('click', function(){
              this._changeActive(li.childNodes[0]);
            }.bind(this));
            thumbs.appendChild(li);
          }
        }.bind(this));
        this._showThumbs(id);
      }.bind(this));
    }
  },

  /**
   * Show Image in Lightbox
   * @param {object} img
   */
  _lightBox: function (img) {
    'use strict';
    event.stopPropagation();
    this._showLightBox();
    var fsImg = document.getElementById('fullscreen_image');
    fsImg.style.display= "none";
    if(img){
      $thumbs.addClassName("thumbnails-nav");
      fsImg.innerHTML= '<img id="fullscreen" alt="flier" src="' + img + '" />';
      fsImg.style.display= "table-cell";
    }
    var node = document.getElementById('fullscreen');
    node.onload = function() {
      var mc = new Hammer(node);
      mc.on("swiperight", this._previousPhoto.bind(this));
      mc.on("swipeleft", this._nextPhoto.bind(this));
      if (!isMobile) {
        isPortrait(node) ? node.style.maxWidth="500px" : node.style.maxWidth="800px";
      }
    }.bind(this);
    function isPortrait(i) {
      var w = i.naturalWidth || i.width,
          h = i.naturalHeight || i.height;
      return (h > w);
    }
  },

  /** Show Thumbs 
  * @param {string} id 
  */
  _showThumbs: function (id) {
    'use strict';
    var fsImg = document.getElementById('fullscreen_image');
  
    $thumbs.className="";
    $thumbs.addClassName('thumbnails');
    $thumbs.addClassName(id);
    $thumbs.style.display= "block";
  
    fsImg.style.display= "none";
    this._showLightBox();
  },

  /** Show Thumbs */
  _hideThumbs: function(){
    'use strict';
    $thumbs.style.display='none';
  },

  /** Show LightBox */
  _showLightBox: function() {
    'use strict';
    $lightbox.style.display="table";
    document.body.style.overflow="hidden";
  
  },

  /** Hide LightBox */
  _hideLightBox: function() {
    'use strict';
    $lightbox.style.display='none';
    document.body.style.overflow='auto';
  },

  /** Change Active */
  _changeActive: function(context) {
    'use strict';
    var $active       = document.getElementById('active-thumb');
    if ($active){
      $active.removeAttribute('id');
    }
    context.parentNode.id='active-thumb';
    this._lightBox(context.getAttribute("data-full"));
  },

  /** Previous Photo */
  _previousPhoto: function() {
    'use strict';
    var $active       = document.getElementById('active-thumb');
    var l = $active.previousElementSibling;
    if (l) {
      $active.removeAttribute("id");
      l.id='active-thumb';
      this._changeActive(l.firstChild);
    }
  },

  /** Next Photo */
  _nextPhoto: function() {
    'use strict';
    var $active       = document.getElementById('active-thumb');
    var n = $active.nextElementSibling;
    if (n) {
      $active.removeAttribute("id");
      n.id='active-thumb';
      this._changeActive(n.firstChild);
    }
  }
});
