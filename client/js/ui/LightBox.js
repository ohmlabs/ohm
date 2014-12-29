var d3, _, Hammer, isMobile, $lightbox, $thumbs, $figures, $buckets, $instagram, $nextInstagram, $galleries, $loading, $thumbsToggle;
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
 
 * @module LightBox Client
 * @requires Underscore
 * @requires D3
 * @requires Hammer
 */
// Set up the variables we'll need
$lightbox      = document.getElementById('lightbox_fade');
$thumbs        = document.getElementById('thumbnails');
$instagramFeed = document.getElementById('lb-instagram-feed');
$nextInstagram = document.getElementById('lb-instagram-next');
$loading       = document.getElementById('loading');
$figures       = document.getElementsByClassName('lb-expandable');
$buckets       = document.getElementsByClassName('lb-bucket');
$instagram     = document.getElementsByClassName('lb-instagram');
$galleries     = document.getElementsByClassName('lb-gallery');
$thumbsToggle  = document.getElementsByClassName('lb-thumbs-toggle')[0];

var LightBox = (function() {
  'use strict';
  try {
    _.toString();
    d3.toString();
  } catch (e) {
    console.log("Something is wrong... fall back");
    return;
  }
  /** Hide LightBox on click */
  $lightbox && $lightbox.addEventListener('click', this._hideLightBox);

  /** Image Gallery click */
  $thumbsToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    if (!$thumbs.hasClassName('active') && $thumbs.childNodes.length > 0) this._showThumbs();
  }.bind(this));

  /** Image Gallery click */
  _.each($galleries, function(img) {
    img.addEventListener('click', function(event) {
      event.stopPropagation();
      this._changeActive(img);
    }.bind(this));
  }.bind(this));

  /** S3 Buckets click */
  _.each($buckets, function(link) {
    link.addEventListener('click', function(event) {
      event.stopPropagation();
      this._getPhotos(link.dataset.id);
    }.bind(this));
  }.bind(this));

  /** Instagram click */
  _.each($instagram, function(link) {
    link.addEventListener('click', function(event) {
      event.stopPropagation();
      this._getInstagram(link.dataset.instagram);
    }.bind(this));
  }.bind(this));

  /** Instagram Feed click */
  $instagramFeed && $instagramFeed.addEventListener('click', function(event) {
    event.stopPropagation();
    this._getInstagramFeed();
  }.bind(this));

  /** Expandable Image click */
  _.each($figures, function(fig) {
    var str;
    if (fig.nodeName === "IMG") {
      str = fig.src;
    } else if (fig.nodeName === "FIGURE") {
      str = fig.style.backgroundImage.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
    }
    fig.addEventListener('click', function(event) {
      event.stopPropagation();
      this._lightBox(str, "upload");
    }.bind(this));
  }.bind(this));

  /** Listen for Next/Last Keys */
  window.onkeydown = function(e) {
    var like = document.getElementById('fullscreen');
    if ($lightbox.hasClassName('active')) {
      if (e.keyCode === 39) {
        this._nextPhoto();
      } else if (e.keyCode === 37) {
        this._previousPhoto();
      } else if (e.keyCode === 27) {
        this._hideLightBox();
      } else if (e.keyCode === 76 && like && like.dataset.media !== "undefined" ) {
        this._likePhoto();
      } else if (e.keyCode === 77) {
        document.getElementById('lb-instagram-next') && document.getElementById('lb-instagram-next').click();
      } else if (e.keyCode === 84) {
        this._showThumbs();
      }
    }
  }.bind(this);
});

_.extend(LightBox.prototype, {
  /**
   * Fetch Photos from Amazon S3
   * @param {string} bucketname The name of the S3 Bucket
   */
  _getPhotos: function(id) {
    'use strict';
    if (id && $thumbs.hasClassName(id)) {
      this._showThumbs();
    } else {
      $thumbs.innerHTML = "";
      d3.json("/s3/" + id, function(json) {
        if (json.error_message) handleErrorMessage(json.error_message);
        _.each(json.Contents, function(data) {
          if (data.Key.indexOf("thumbs/") === -1) {
            var li = document.createElement("li");
            li.innerHTML = '<div class="thumbnail" style="background:url(\'' + 'https://s3.amazonaws.com/' + id + '/thumbs/' + data.Key + '\');background-size: cover;" data-full="https://s3.amazonaws.com/' + id + '/' + data.Key + '" data-type="image"></div>';
            li.addEventListener('click', function(event) {
              event.stopPropagation();
              this._changeActive(li.childNodes[0]);
            }.bind(this));
            $thumbs.appendChild(li);
          }
        }.bind(this));
        this._showThumbs(id);
      }.bind(this));
    }
  },

  /** Show Loading */
  _showLoading: function() {
    $loading.addClassName('active');
  },

  /**  Show Loading */
  _hideLoading: function() {
    $loading.removeClassName('active');
  },

  /**
   * Like the Currently Active Photo
   */
  _likePhoto: function() {
    var id = document.getElementById('active-thumb').childNodes[0].dataset.media
    var heart = document.getElementsByClassName("is_liked")[0];
    if (heart.hasClassName("glyphicon-heart-empty")){
      d3.xhr("/like/" + id, function() {
        var media = '[data-media="' + id + '"]';
        // set liked to true
        document.querySelectorAll(media)[0].setAttribute("data-liked", "true");
        // change heart logo
        heart.removeClassName("glyphicon-heart-empty");
        heart.addClassName("glyphicon-heart");
      });      
    }
  },

  /**
   * Load the Thumbnails
   * @param {string} data Photos
   * @param {boolean} feed Are these photos from the feed?
   */
  _loadThumbs: function(data, feed) {
    var li = document.createElement("li");
    if (data.users_in_photo) {
      var users = [];
      _.each(data.users_in_photo, function(user) {
        // users += '<a class=\"orange\" href=\"http://instagram.com/' + user.user.username + '\" target=\"_blank\">@' + user.user.username + '</a> ';
        users.push(user.user.username);
      });
    }
    if (data.type === "image"){
      li.innerHTML = '<div class="thumbnail" style="background:url(\'' + data.images.thumbnail.url + '\');background-size: cover;" data-media="' + data.id + '" data-type="' + data.type + '" data-full="' + data.images.standard_resolution.url + '" data-caption="' + (data.caption ? data.caption.text : "") + '" data-liked="' + data.user_has_liked + '" ' + (feed ? "data-user=" + data.user.username : "") + (users !== "" ? ' data-users="' + users + '"' : "" ) + '></div>';            
    } else if (data.type === "video") {
      li.innerHTML = '<div class="thumbnail" style="background:url(\'' + data.images.thumbnail.url + '\');background-size: cover;" data-media="' + data.id + '" data-type="' + data.type + '" data-full="' + data.videos.standard_resolution.url + '" data-caption="' + (data.caption ? data.caption.text : "") + '" data-liked="' + data.user_has_liked + '" ' + (feed ? "data-user=" + data.user.username : "") + (users !== "" ? ' data-users="' + users + '"' : "" ) + '></div>';      
    }
    li.addEventListener('click', function(event) {
      event.stopPropagation();
      this._changeActive(li.childNodes[0]);
    }.bind(this));
    $thumbs.appendChild(li);
  },

  /**
   * Fetch Photos from Instagram
   * @param {string} username Instagram username
   * @next {string} next If there are more photos
   */
  _getInstagram: function(username, next) {
    'use strict';
    if (username && !$thumbs.hasClassName(username)) {
      $thumbs.innerHTML = "";
      this._showThumbs(username);
    } else if ($thumbs.hasClassName(username) && !next){
      this._showThumbs();
      return;
    }
    var url;
    next ? url = "/instagram/" + username + '/' + next : url = "/instagram/" + username;
    this._showLoading();
    d3.json(url, function(json) {
      if (json.error_message) {
        this._hideLoading();
        handleError(json.error_message);
      } else if (json) {
        // Load Thumbs
        var pics = json.slice(0, json.length - 1);
        var next = json.slice(json.length - 1, json.length);
        _.each(pics, function (data) {
          this._loadThumbs(data, false);
        }.bind(this));
        // If there are more photos render "More Photos" button
        if (next[0]) {
          var nxt = document.createElement("li");
          nxt.setAttribute("id", "next-button");
          nxt.innerHTML = '<button id="lb-instagram-next" class="btn btn-default" data-instagram="' + username + '" data-next="' + next + '">More Photos</button>';
          nxt.addEventListener('click', function(event) {
            event.stopPropagation();
            var link = event.target;
            this._getInstagram(link.dataset.instagram, link.dataset.next);
            event.currentTarget.parentNode && event.currentTarget.parentNode.removeChild(event.currentTarget);
          }.bind(this));
          $thumbs.appendChild(nxt);
        }
        this._hideLoading();
      }
    }.bind(this));
  },

  /**
   * Fetch Photos from Instagram
   * @param {string} username Instagram username
   * @next {string} next If there are more photos
   */
  _getInstagramFeed: function(next) {
    'use strict';
    if (!$thumbs.hasClassName("feed")) {
      $thumbs.innerHTML = "";
      this._showThumbs("feed");
    } else if ($thumbs.hasClassName("feed") && !next){
      this._showThumbs();
      return;
    }
    var url;
    next ? url = "/instafeed/" + next : url = "/instafeed/";
    this._showLoading();
    d3.json(url, function(json) {
      if (json.error_message) {
        this._hideLoading();
        handleError(json.error_message);
      } else if (json) {
        // Load Thumbs
        var pics = json.slice(0, json.length - 1);
        var next = json.slice(json.length - 1, json.length);
        _.each(pics, function (data) {
          this._loadThumbs(data, true);
        }.bind(this));
        // If there are more photos render "More Photos" button
        if (next[0]) {
          var nxt = document.createElement("li");
          nxt.setAttribute("id", "next-button");
          nxt.innerHTML = '<button id="lb-instagram-next" class="btn btn-default" data-next="' + next + '">More Photos</button>';
          nxt.addEventListener('click', function(event, nxt) {
            event.stopPropagation();
            var link = event.target;
            this._getInstagramFeed(link.dataset.next);
            event.currentTarget.parentNode.removeChild(event.currentTarget);
          }.bind(this));
          $thumbs.appendChild(nxt);
        }
        this._hideLoading();
      }
    }.bind(this));
  },

  /**
   * Show Image in Lightbox
   * @param {object} img Image URL
   * @param {object} type Photo or Video
   * @param {object} liked User has Liked
   * @param {object} caption Photo Caption
   * @param {object} user Username of uploader
   * @param {object} users Users in photo
   * @param {object} id Media ID
   */
  _lightBox: function(img, type, id, liked, caption, user, users) {
    'use strict';
    this._showLightBox();
    var fsImg = document.getElementById('fullscreen_image');
    fsImg.style.display = "none";
    if (img) {
      $thumbs.addClassName("thumbnails-nav");
      $thumbs.removeClassName('active');
      // Render HTML for Fullscreen
      var htmlFrag;
      if (type === "image" || type === "upload") {
        htmlFrag = '<img id="fullscreen" alt="flier" src="' + img + '" />';        
      } else if (type === "video") {
        htmlFrag = '<video id="fullscreen" width="640" height="640" autoplay><source src="' + img +'" type="video/mp4">Your browser does not support the video tag.</video>';
      }
      if (type !== "upload") {
        // Add Caption
        htmlFrag += '<div class="caption">';
        htmlFrag += '<div id="lb-caption">' +  (user ? "<a href=\"http://instagram.com/" + user + "\" target=\"_blank\" ><b class=\"orange\">" + user + ":</b></a> " : "") + caption + '</div>';
        // Container Div for users and like button
        htmlFrag += '<div class="like-container">';
        if (users) {
          users = users.split(',');
          htmlFrag += '<div class="users">';
          _.each(users, function(user){
            // Add Users
            htmlFrag += '<a href="http://instagram.com/' + user +'" target="_blank">' + user + '</a> ';
          });
          htmlFrag += '</div>';
        }
        // Add Like Button
        liked === "true" ? htmlFrag += '<div class="glyphicon glyphicon-heart is_liked"></div></div>' : htmlFrag += '<div class="glyphicon glyphicon-heart-empty is_liked"></div>';        
        htmlFrag += '</div></div>';
      }
      fsImg.innerHTML = htmlFrag;
      fsImg.style.display = "table-cell";
      // Like Photo on Empty Heart Click
      var likables = document.getElementsByClassName('glyphicon-heart-empty');
      _.each(likables, function(likeable){
        likeable.addEventListener('click', function(event){
          this._likePhoto();
        }.bind(this));          
      }.bind(this));
      // Don't hide lightbox on Caption Click
      var cap = document.getElementsByClassName('caption')[0];
      cap && cap.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    }
    // Add Event listeners on load of fullscreen image
    var node = document.getElementById('fullscreen');
    node.onload = function() {
      node.addEventListener('click', function(event){
        event.stopPropagation();
      });
      var mc = new Hammer(node);
      var active = document.getElementById('active-thumb');
      if (active) var media_id = active.childNodes[0].dataset.media;
      mc.on("swiperight", this._previousPhoto.bind(this));
      mc.on("swipeleft", this._nextPhoto.bind(this));
      mc.on("doubletap", this._likePhoto.bind(this));
      mc.on("swipedown", this._showThumbs.bind(this));
      if (!isMobile) {
        isPortrait(node) ? node.style.maxWidth = "500px" : node.style.maxWidth = "800px";
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
  _showThumbs: function(id) {
    'use strict';
    var fsImg = document.getElementById('fullscreen_image');

    $thumbsToggle.removeClassName('active');
    var $active = document.getElementById('active-thumb');
    $thumbs.className = "";
    $thumbs.addClassName('thumbnails');
    $thumbs.addClassName('active');
    if (id) {
      $thumbs.addClassName(id); 
    }

    fsImg.style.display = "none";
    this._showLightBox();
  },

  /** Show Thumbs */
  _hideThumbs: function() {
    'use strict';
    $thumbs.removeClassName('active');
    $thumbsToggle.addClassName('active');
  },

  /** Show LightBox */
  _showLightBox: function() {
    'use strict';
    $lightbox.addClassName('active');
    document.body.style.overflow = "hidden";

  },

  /** Hide LightBox */
  _hideLightBox: function() {
    'use strict';
    $lightbox.removeClassName('active');
    document.body.style.overflow = 'auto';
  },

  /** Change Active */
  _changeActive: function(image) {
    'use strict';
    var $active = document.getElementById('active-thumb');
    if ($active) {
      $active.removeAttribute('id');
    }
    image.parentNode.id = 'active-thumb';
    this._lightBox(image.getAttribute("data-full"), image.getAttribute("data-type"), image.getAttribute("data-media"), image.getAttribute("data-liked"), image.getAttribute("data-caption"), image.getAttribute("data-user"), image.getAttribute("data-users"));
    if ($thumbs.childNodes.length > 0) {
      $thumbsToggle.addClassName('active');
    }
  },

  /** Previous Photo */
  _previousPhoto: function() {
    'use strict';
    var $active = document.getElementById('active-thumb');
    if($active) var l = $active.previousElementSibling;
    if (l && $active) {
      $active.removeAttribute("id");
      l.id = 'active-thumb';
      this._changeActive(l.firstChild);
    }
  },

  /** Next Photo */
  _nextPhoto: function() {
    'use strict';
    var $active = document.getElementById('active-thumb');
    if ($active) var n = $active.nextElementSibling;
    if (n && n.childNodes[0].nodeName.toLowerCase() !== "button" && $active) {
      $active.removeAttribute("id");
      n.id = 'active-thumb';
      this._changeActive(n.firstChild);
    } else if (n) {
      n.childNodes[0].click();
    }
  }
});
