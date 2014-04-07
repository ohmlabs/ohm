var map;
var infoWindow;
var overlay;
var layer;
var center;
var mapOptions;
var mapStyles;
var styledMap;
var offices = [];

function initializeMap(data) {
  // load style from json
  if (data.theme !== null && (data.theme === "BW" || data.theme === "weiss")) {
    d3.json("maps/" + data.theme + ".json", function(json) {
      mapStyles = json;
      styledMap = new google.maps.StyledMapType(mapStyles, {name: data.theme});
      //Associate the styled map with the MapTypeId and set it to display.
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');
    });
  }
  !data.lng || !data.lat ? center = new google.maps.LatLng(37.429856, -122.169425) : center = new google.maps.LatLng(data.lat, data.lng);
  !data.zoom ? data.zoom = 10 : null;
  !data.scrollWheel === null ? data.scrollWheel = true: null;
  mapOptions = {
    center: center,
    zoom: data.zoom,
    scrollwheel: data.scrollWheel,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  // Initialize infoWindow for markers
  infowindow = new google.maps.InfoWindow();
  for (var i in data.locations) {
    var office = data.locations[i];
    
    if (!office.latLng){
      // we need lat and lng to plot on google map
      // send readable_address to Google geocoder
      geoCodeLocations(office, map);
    }
    if (!data.overlay && !data.gplus) {
      // if you are not using d3 overlay or Google places search...
      addMarker(office, map, data.icon);
    }
    // add the offices to an array 
    offices.push(office);
  }
  if (data.gplus) {
    // search google for results to map if there is no overlay
    getGooglePlaces(map, data, center);
  }
  if (data.overlay) {
    // add array of officers to map in d3 overlay
    addOverlay(offices);
  }
}

function geoCodeLocations (location, map){
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
}

function addMarker(data, map, icon) {
  var gll;
  data.latLng.latitude ? gll = new google.maps.LatLng(data.latLng.latitude, data.latLng.longitude) : gll = data.latLng;
  var marker = new google.maps.Marker({
    position: gll,
    title: data.name,
    icon: icon,
    map: map
  });
  // on click we want to display info window
  addInfoWindow(data, marker, map);
  marker.setMap(map);
}

function addInfoWindow(data, marker, map) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(data.name);
    infowindow.open(map, this);
  });
}

function addOverlay(data) {
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
}

function getGooglePlaces(map, data, center)
{
  var request = {
    location: center,
    radius: data.gplus_radius,
    types: data.gplus_types,
    name: data.gplus_query
  };
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, googleSearchCallback);
  function googleSearchCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        if (results[2].name.indexOf(data.gplus_query) !== -1) {
          results[i].readable_address = results[i].vicinity;
          results[i].latLng = results[i].geometry.location;
          console.log(results[i].readable_address);
          addMarker(results[i], map, data.icon);
        }
      }
    }
  }
}
