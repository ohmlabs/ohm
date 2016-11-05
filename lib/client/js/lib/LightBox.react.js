(function() {
    'use strict';
    /**
     * Light.js
     *
     * Copyright (c) 2014 Ohm Labs Inc
     * Licensed under the MIT license
     * For all details and documentation:
     * http://drake.fm/light
     *
     * @module LightBox
     * @requires Underscore
     * @requires D3
     * @requires React
     */
    var _        = require('underscore');
    var React    = require('react');
    var utils    = require('./utils.js');
    var LightBox = React.createClass({
        getInitialState: function() {
          return {
            lbActive: false,
            thumbsActive: false,
            fsActive: false,
            current: null,
            activeId: null,
            medias: [],
            mediasType: null,
            loading: true,
            img: null,
            type: null,
            id: null,
            liked: null,
            caption: null,
            link: null
          };
        },

        componentDidMount: function() {
          var $lightbox = document.getElementById('lb-fade');
          var $loading  = document.getElementById('lb-loading');
          var $figures  = document.getElementsByClassName('lb-expandable');
          var $buckets  = document.getElementsByClassName('lb-bucket');

          this.setState({
            loading: false
          });

          ///////////////////////////
          //    Key Listeners     //
          /////////////////////////
          /** Listen for Next/Last Keys */
          window.addEventListener("keydown", function(e) {
            // Open and Close the lightbox
            if (e.keyCode === 38) {
              event.preventDefault();
              this._showLightBox();
            } else if (e.keyCode === 40) {
              event.preventDefault();
              this._hideLightBox();
            } else if (e.keyCode === 27) {
              this._hideLightBox();
            } else if (e.keyCode === 84 && this.state.lbActive) {
              if (this.state.medias) {
                this._showThumbs();
              }
            }
            // Next, Prev, Like, More, Thumbs
            if ($lightbox.hasClassName('active')) {
              if (e.keyCode === 39) {
                this._nextPhoto();
              } else if (e.keyCode === 37) {
                this._previousPhoto();
              }
            }
          }.bind(this));
        },

        addClickHandlerExpandable: function () {
          const $figures  = document.getElementsByClassName('lb-expandable');
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
              this._changeActive(event);
            }.bind(this));
          }.bind(this));
        },

        componentDidUpdate: function() {
          this.addClickHandlerExpandable();
          if (this.state.type === "video") {
            this._addTouchListeners(document.getElementById("fullscreen"));
          }
        },

        render: function() {
          return this._renderLightbox();
        },

        /** Stop Propagation */
        _stopProp: function(event) {
          event.stopPropagation();
        },

        /** Show LightBox */
        _showLightBox: function() {
          this.setState({
            lbActive: true
          });
          document.body.style.overflow = "hidden";

        },

        /** Hide LightBox */
        _hideLightBox: function() {
          this.setState({
            lbActive: false
          });
          document.body.style.overflow = 'auto';
        },

        /** Show Thumbs */
        _showThumbs: function() {
          this.setState({
            thumbsActive: true,
            fsActive: false
          });
        },

        /** Show Thumbs */
        _hideThumbs: function() {
          this.setState({
            thumbsActive: false
          });
        },

        /** Change Active */
        _changeActive: function(e) {
          this._stopProp(e);
          this.setState({
            type: e.target.dataset.type,
            link: e.target.dataset.link,
            media: e.target.dataset.media,
            current: e.target.parentNode,
            img: e.target.dataset.full,
            placeholder: e.target.dataset.placeholder,
            caption: e.target.dataset.caption,
            fsActive: true,
            thumbsActive: false
          });
          this._showLightBox();
          this._hideThumbs();
        },

        /** Previous Photo */
        _previousPhoto: function() {
          var $active, l;
          $active = this.state.current;
          if ($active) {
            l = $active.previousElementSibling;
          }
          if (l && $active) {
            this.setState({
              current: l,
            });
            l.childNodes[0].click();
          }
        },

        /** Next Photo */
        _nextPhoto: function() {
          var $active, n;
          $active = this.state.current;
          if ($active) {
            n = $active.nextElementSibling;
          }
          var firstChild, firstGrandchild, more;
          if (!n) {
            return;
          } else {
            firstChild = n.childNodes[0];
            more = firstChild ? firstChild.id === "next-button" : null;
            firstGrandchild = more ? firstChild.childNodes[0] : null;
          }
          if (typeof firstChild !== "undefined") {
            if (!more && $active) {
              this.setState({
                current: n,
              });
              firstChild.click();

            } else if (firstGrandchild) {
              firstGrandchild.click();
            }

          }
        },

        /** Add Touch Listeners */
        _addTouchListeners: function(event) {
          var node = event.currentTarget ? event.currentTarget : event;
          node.addEventListener('click', function(event) {
            event.stopPropagation();
          });
          var active = this.state.current;
          if (active) {
            var media_id = active.childNodes[0].dataset.media;
          }
        },

        /** Render LightBox */
        _renderLightbox: function() {
          var fullscreenImage, caption, captionText, loading, loadingDiv, liked, active, thumbnails, fsActive, thumbsActive, thumbsToggle, fullscreen, thumbsTogg, toggler;
          liked        = this.state.liked ? "is_liked glyphicon glyphicon-heart like-button" : " like-button glyphicon glyphicon-heart-empty";
          loading      = this.state.loading ? "active" : "inactive";
          active       = this.state.lbActive ? "active" : "inactive";
          thumbsActive = this.state.thumbsActive ? "active thumbnails" : "hidden";
          thumbsToggle = this.state.thumbsActive ? "glyphicon glyphicon-th buckets lb-thumbs-toggle buckets" : "active glyphicon glyphicon-th buckets lb-thumbs-toggle buckets";
          fsActive     = this.state.fsActive ? "active" : "hidden";
          captionText  = this.state.caption ? ": " + this.state.caption : null;

          toggler = function(e) {
            this._stopProp(e);
            this._showThumbs();
          }.bind(this);

          loadingDiv = (
            <div id="lb-loading" className={loading}>
             <div id="lb-loading-indicator"></div>
            </div>
          );

          thumbsTogg = this.state.medias ? (
            <div className={thumbsToggle} onClick={toggler}></div>
          ) : null;

          thumbnails = this.state.medias ? (
            <ul id="lb-thumbnails" className={thumbsActive}>
            </ul>
          ) : null;

          if (this.state.type === "image") {
            fullscreenImage = (
              <img id="fullscreen" alt="flier" src={this.state.img} onLoad={this._addTouchListeners} onClick={this._stopProp} />
            );
          } else if (this.state.type  === "video"){
            fullscreenImage = (
              <video id="fullscreen" width="640" onClick={this._stopProp} src={this.state.img} controls poster={this.state.placeholder} autoPlay>
                Your browser does not support the video tag.
              </video>
            );
          }

          fullscreen = this.state.current ? (
            <div id="lb-fullscreen" className={fsActive}>
                {fullscreenImage}
                <div className="caption" onClick={this._stopProp}>
                  <div id="lb-caption">
                    {captionText}
                  </div>
                </div>
            </div>
          ) : null;

          return (
            <div>
              <div id="lb-fade" className={active} onClick={this._hideLightBox}>
                {thumbnails}
                {loadingDiv}
                {fullscreen}
                <div className="glyphicon glyphicon-remove" onClick={this._hideLightBox}></div>
              </div>
            </div>
          );
        },
      });

      module.exports = LightBox;
    }());
