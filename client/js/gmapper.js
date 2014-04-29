/**
* Gmapper.js 0.1.0
*
* Copyright (c) 2014 Cameron Drake
* Licensed under the MIT license
* For all details and documentation:
* http://drake.fm/gmapper
*
* @version  0.1.0
*/
var Gmapper = (function(){
  'use strict';
  /**
  * Create a new instance
  * @class Gmapper
  * @constructor  
  */
  var map;
  var infoWindow;
  var overlay;
  var layer;
  var center;
  var mapOptions;
  var mapStyles;
  var styledMap;
});

_.extend(Gmapper.prototype, {
  /**
   * Initialize the Google Mapper
   * @param {object} data The details for the location
   */
  initializeMap: function (data)
  {
    var overlay_locations = [];
    var context = this;
    // load style from json
    if (data.theme !== null) {
      d3.json("maps/" + data.theme + ".json", function(json) {
        mapStyles = json;
        styledMap = new google.maps.StyledMapType(mapStyles, {name: data.theme});
        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
      });
    }
    // set the center or default to oval */
    !data.lng || !data.lat ? center = new google.maps.LatLng(37.429856, -122.169425) : center = new google.maps.LatLng(data.lat, data.lng);
    // set zoom or default to 10 */
    !data.zoom ? data.zoom = 10 : null;
    // set scrollwheel or default to false */
    !data.scrollWheel === null ? data.scrollWheel = true : null;
    // set map options
    mapOptions = {
      center: center,
      zoom: data.zoom,
      scrollwheel: data.scrollWheel,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };
    // initialize map
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    // initialize infoWindow
    infowindow = new google.maps.InfoWindow();
    // If Google Places Search
    if (data.search){
      this.googlePlaceQuery(data.query, map, center, data.radius, data.types, context);
      return;
    }
    // If Locations are provided
    if (data.locations) {
      for (var i in data.locations) {
        var glocation = data.locations[i];
        if (!glocation.latLng){
          // we need lat and lng to plot on google map
          // send readable_address to Google geocoder
          geoCodeLocations(glocation, map);
        }
        if (!data.overlay) {
          // if you are not using d3 overlay or Google places search...
          if(glocation.GooglePlacesReference){ 
            this.addMarker(glocation, map, data.icon);
          }
        }
        // add the locations to an array
        if(glocation.GooglePlacesReference){ 
          overlay_locations.push(glocation);
        }
      }
    }
    // If D3 Overlay
    if (data.overlay) {
      // add array of officers to map in d3 overlay
      this.addOverlay(overlay_locations);
    }
  },

  /**
   * Add an Google Maps Info Window.
   * @param {object} data The details for the location
   * @param {object} marker The Google Maps Marker
   * @param {object} map The Google Map
   */
  addInfoWindow: function (data, marker, map)
  {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(
        '<div class="plus-icon" style="background-image:url(\'' + data.icon +'\');"></div>' +
        '<a href="' + data.url + '" target="_blank"><h1>' + data.name + '</h1></a>' +
        '<h2>' + data.readable_address + '</h2>' +
        '<h2>' + data.phone + '</h2>'
      );
      infowindow.open(map, this);
    });
  },

  /**
   * Add a D3 Overlay.
   * @param {object} data The details for the locations
   */
  addOverlay: function (data)
  {
    // Load the station data. When the data comes back, create an overlay.
    var overlay = new google.maps.OverlayView();
    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "offices");
      // Draw each marker as a separate SVG element.
      // We could use a single SVG, but what size would it have?
      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;
        var marker = layer.selectAll("svg")
            .data(d3.entries(data))
            .each(transform) // update existing markers
          .enter().append("svg:svg")
            .each(transform)
            .attr("class", "marker");
        // Add a circle.
        marker.append("svg:circle")
            .attr("r", 10.5)
            .attr("cx", padding)
            .attr("cy", padding);
        // Add a label.
        marker.append("svg:text")
            .attr("x", padding + 7)
            .attr("y", padding)
            .attr("dy", ".31em")
            .text(function(d) { return d.value.name; });
        function transform(d) {
          d = new google.maps.LatLng(d.value.latLng.latitude, d.value.latLng.longitude);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
  },

  /**
   * Add Google Maps Marker.
   * @param {object} data The details for the location
   * @param {object} icon The image to be used for the marker
   * @param {object} map The Google Map
   */
  addMarker: function (data, map, icon)
  {
    var gll;
    data.latLng.latitude ? gll = new google.maps.LatLng(data.latLng.latitude, data.latLng.longitude) : gll = data.latLng;
    var marker = new google.maps.Marker({
      position: gll,
      title: data.name,
      icon: icon,
      map: map
    });
    if (data.GooglePlacesReference) {
      this.getGoogleDetails(data, marker, map);
    } else {
      this.addInfoWindow(data, marker, map);
    }
    marker.setMap(map);
  },

  /**
   * Get Details for Google Place.
   * @param {object} data The details for the location
   * @param {object} marker The Google Maps Marker
   * @param {object} map The Google Map
   */
  getGoogleDetails: function (data, marker, map)
  {
    var service = new google.maps.places.PlacesService(map);
    var request = {
      reference: data.GooglePlacesReference
    };
    service.getDetails(request, function(details){
      data.readable_address = details.formatted_address;
      data.url = details.url;
      data.phone = details.formatted_phone_number;
      data.icon = details.icon;
      console.log(data.readable_address);
    });
    this.addInfoWindow(data, marker, map);
  },

  /**
   * Get Details for Google Place.
   * @param {object} data The details for the location
   * @param {object} marker The Google Maps Marker
   * @param {object} map The Google Map
   * @param {string} query The query to make
   * @param {array} types The type of places to search
   */
  googlePlaceQuery: function (query, map, center, radius, types, context)
  {
    var request = {
      location: center,
      radius: radius,
      types: types,
      name: query
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, googleSearchCallback);
    function googleSearchCallback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          results[i].latLng = results[i].geometry.location;
          context.addMarker(results[i], map);
        }
      }
    }
  },

  /**
   * Geo-Code Locations.
   * @param {object} location The details for the location
   * @param {object} map The Google Map
   */
  geoCodeLocations: function (location, map)
  {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location.readable_address}, function(response, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        location.latLng = response[0].geometry.location;
        data.socket.emit("geo", { location: location });
      } else {
        console('Geocode was not successful for the following reason: ' + status);
        // TODO: Error Handler for Users
      }
    });
  },
});