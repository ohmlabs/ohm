(function() {
  'use strict';
  /**
   * Broadcast Map
   * Display Nearby Braodcasts to the User via Google Maps
   * @module BroadcastMap
   */
  const _            = require('underscore');
  const React        = require('react');
  const ReactDOM     = require('react-dom');
  const async        = require('./async.js');
  const BroadcastMap = React.createClass({

    propTypes: {
      center: React.PropTypes.object.isRequired,
      apiKey: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
      return {
        userLocation: {},
        nearbyBroadcasts: []
      };
    },

    componentDidMount: function() {
      async.load(
        'https://maps.google.com/maps/api/js?key=' + this.props.apiKey + '&v=3&signed_in=true&libraries=places!callback',
        this._googleMapApiCallback
      );
    },

    /**
     * The callback for the Google Map async request. This
     * fetches the nearby locations from Parse, resets the state,
     * and then adds the markers to the Google Map.
     */
    _googleMapApiCallback: function() {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          this.setState({
            userLocation: pos.coords
          });
          this._drawGoogleMap();
        }.bind(this));
      } else {
        this.setState({
          userLocation: this.props.center
        });
        this._drawGoogleMap();
      }
    },

    /**
     * Generates a Google Map LatLng object.
     */
    _genGoogleMapLatLng: function(markerData) {
      return markerData ? new google.maps.LatLng(markerData.latitude, markerData.longitude) : null;
    },

    /**
     * Helper functional to make rendering Google Map markers easier
     */
    _makeMapListener: function(window, map, content, marker) {
      return function() {
        window.setContent(content);
        window.open(map, this);
      };
    },

    /**
     * Begins rendering of Javascript version of Google Map
     */
    _drawGoogleMap: function() {
      var mapOptions, gMap, mapStyles, styledMap, infowindow;

      styledMap = new google.maps.StyledMapType([{
        "featureType": "water",
        "stylers": [{
          "color": "#eeeeee"
        }]
      }, {
        "featureType": "landscape.man_made",
        "stylers": [{
          "color": "#666"
        }]
      }, {
        "featureType": "landscape",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "poi.park",
        "stylers": [{
          "saturation": -100
        }]
      }, {
        "elementType": "labels.text",
        "stylers": [{
          "hue": "#ff0022"
        }, {
          "color": "#000000"
        }]
      }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "weight": 0.1
        }]
      }, {}, {
        "elementType": "geometry.stroke",
        "stylers": [{
          "weight": 1.5
        }, {
          "color": "#cccccc"
        }]
      }, {
        "featureType": "road.local",
        "stylers": [{
          "color": "#666666"
        }]
      }, {
        "featureType": "poi",
        "stylers": [{
          "color": "#cccccc"
        }]
      }, {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.icon",
        "stylers": [{
          "saturation": -100
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "saturation": -100
        }]
      }], {
        name: this.props.mapName
      });

      mapOptions = {
        center: this._genGoogleMapLatLng(this.state.userLocation),
        zoom: this.props.zoom,
        mapTypeId: this.props.mapType || google.maps.MapTypeId.ROADMAP,
        scrollwheel: this.props.scrollwheel,
        mapTypeControlOptions: {
          mapTypeIds: [(this.props.mapType || google.maps.MapTypeId.ROADMAP), 'map_style']
        }
      };

      gMap = new google.maps.Map(this.refs.map, mapOptions);
      //Associate the styled map with the MapTypeId and set it to display.
      gMap.mapTypes.set('map_style', styledMap);
      gMap.setMapTypeId('map_style');
      // initialize infoWindow
      infowindow = new google.maps.InfoWindow({
        maxWidth: 300
      });
      //      !data.lng || !data.lat ? center = new google.maps.LatLng(37.429856, -122.169425) : center = new google.maps.LatLng(data.lat, data.lng);
      this._addBroadcastLocations(gMap, infowindow);
    },

    /**
     * Adds a broadcast icon to Google Map for each nearby broadcast
     */
    _addBroadcastLocations: function(gMap, infowindow) {
      var tooltip;
      _.each(this.state.nearbyBroadcasts, function(broadcast) {
        if (broadcast.googlePlacesReference) {
          this._getGoogleDetails(broadcast.googlePlacesReference, gMap, function(broadcast, data) {
            broadcast.google = data;
            // FIXME: this uses a renderTostring method that is deprecated
            // tooltip          = this._tooltip(broadcast);
            this._addBroadcastGoogleMapTooltip(gMap, broadcast, tooltip, infowindow);
          }.bind(this, broadcast));
        } else {
          // FIXME: this uses a renderTostring method that is deprecated
          // var tooltip = this._tooltip(broadcast);
          this._addBroadcastGoogleMapTooltip(gMap, broadcast, null, infowindow);
        }
      }.bind(this));
    },

    /**
     * Adds the icons and details (generated by clicks) for broadcasts
     * close to the users current location.
     */
    _addBroadcastGoogleMapTooltip: function(gMap, broadcast, tooltipContent, infowindow) {
      var marker, icon;

      broadcast.location = broadcast.latLng;

      var markerOpts = {
        position: this._genGoogleMapLatLng(broadcast.location),
        location: broadcast.location,
        title: broadcast.channelName,
        animation: google.maps.Animation.DROP,
        map: gMap,
        url: broadcast.url
      };
      if (broadcast.icon) {
        markerOpts.icon = {
          url: broadcast.icon || 'img/small-record.png',
          anchor: new google.maps.Point(20, 20),
        };
        if (broadcast.size) {
          markerOpts.icon.size = new google.maps.Size(40, 40);
        }
        
      }
      if (broadcast.googlePlacesReference) {
        markerOpts.place = {
          placeId: broadcast.googlePlacesReference,
          location: {
            lat: broadcast.location.latitude,
            lng: broadcast.location.longitude
          }
        };
        markerOpts.attribution = {
          source: broadcast.title,
          webUrl: broadcast.url
        };
      }
      marker = new google.maps.Marker(markerOpts);

      google.maps.event.addListener(
        marker,
        'click',
        this._makeMapListener(infowindow, gMap, tooltipContent, marker)
      );
      marker.setMap(gMap);
    },

    /**
     * Get Details for Google Place.
     * @param {object} data The details for the location
     * @param {object} marker The Google Maps Marker
     * @param {object} map The Google Map
     */
    _getGoogleDetails: function(id, map, callback) {
      if (!id) {
        return;
      }
      var request = {
        placeId: id
      };
      var service = new google.maps.places.PlacesService(map);
      service.getDetails(request, function(callback, details, status) {
        if (details) {
          return callback(details);
        } else {
          return;
        }
      }.bind(this, callback));
    },

    _tooltip: function(broadcast) {
      var address   = broadcast.google ? broadcast.google.formatted_address : null;
      var rating    = broadcast.google ? broadcast.google.rating : null;
      var phone     = broadcast.google ? broadcast.google.formatted_phone_number : null;
      var website   = broadcast.google ? broadcast.google.website.replace(/.*?:\/\//g, "") : null;
      var more      = broadcast.google ? (<a className="glyphicon glyphicon-link" href={broadcast.google.url} target="_blank"></a>) : null;
      var classes   = broadcast.google ? "infowindow-google infowindow" : "infowindow";

      var tooltip = (
        <div className={classes}>
          <a href={"/station/" + broadcast.objectId}>
            <p className="name">{broadcast.channelName}</p>
          </a>
          <p className="address">{address}</p>
          <a href={website} target="_blank"><p className="website">{website}</p></a>
          <p className="phone">{phone}</p>
          <p className="rating">{rating}</p>
          <p className="description">
            {broadcast.description}
          </p>
          {more}
        </div>
      );

      tooltip = React.renderToString(tooltip);
      return tooltip;
    },

    render: function () {
      // TODO: Update map when user moves / new channels appear
      return (
        <div>
          <div ref="map" className="canvasMap"></div>
        </div>
      );
    }
  });

  module.exports = BroadcastMap;
}());
