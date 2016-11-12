(function() {
  'use strict';

  const _     = require('underscore');
  const React = require('react');
  const utils = require('./utils.js');

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
  const LightBox = React.createClass({
    propTypes: {
      onMountCallback: React.PropTypes.func,
      messenger: React.PropTypes.object
    },
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
        caption: null,
        link: null
      };
    },

    componentDidMount: function() {
      this.props.onMountCallback && this.props.onMountCallback.call(this);
      this.setState({ loading: false });
      window.addEventListener("keydown", (e) => {
        if (this.state.lbActive) {
          // Next/Prev
          if (e.keyCode === 39) {
            this._nextPhoto();
          } else if (e.keyCode === 37) {
            this._previousPhoto();
          } else if (e.keyCode === 27) {
            // close on esc
            this._hideLightBox();
          }
        }
      });
    },

    addClickHandlerExpandable: function () {
      let $figures  = document.getElementsByClassName('lb-expandable');
      /** Expandable Image click */
      _.each($figures, (fig) => {
        fig.addEventListener('click', (event) => {
          event.stopPropagation();
          return this._changeActive(event);
        });
      });
    },

    /** Stop Propagation */
    _stopProp: function(event) {
      event.stopPropagation();
    },

    /** Show LightBox */
    _showLightBox: function() {
      document.body.style.overflow = "hidden";
      return this.setState({
        lbActive: true
      });
    },

    /** Hide LightBox */
    _hideLightBox: function() {
      document.body.style.overflow = 'auto';
      return this.setState({
        lbActive: false
      });
    },

    /** Show Thumbs */
    _showThumbs: function() {
      return this.setState({
        thumbsActive: true,
        fsActive: false
      });
    },

    /** Show Thumbs */
    _hideThumbs: function() {
      return this.setState({
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
      return this._hideThumbs();
    },

    /** Previous Photo */
    _previousPhoto: function() {

      try {
        this.state.current.previousElementSibling.childNodes[0];
      }
      catch(e) {
        return false;
      }
      {
        let last = this.state.current.previousElementSibling;
        this.setState({ current: last });
        return last.childNodes[0].click();
      }
    },

    /** Next Photo */
    _nextPhoto: function() {
      try {
        this.state.current.nextElementSibling.childNodes[0];
      }
      catch(e) {
        return false;
      }
      {
        let next = this.state.current.nextElementSibling;
        this.setState({ current: next });
        return next.childNodes[0].click();
      }
    },

    render: function() {
      return this._renderLightbox();
    },

    /** Render LightBox */
    _renderLightbox: function() {
      var fullscreenImage, caption, captionText, loading, loadingDiv, active, thumbnails, fsActive, thumbsActive, thumbsToggle, fullscreen, thumbsTogg, toggler;
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
          <img id="fullscreen" alt="flier" src={this.state.img} onClick={this._stopProp} />
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
