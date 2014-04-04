var map;
var infoWindow;
var overlay;
var layer;
var center;
var mapOptions;
var mapStyles;
var styledMap;
var offices = [];
// Style the Google Map
function initializeMap(data) {
  // load style from json
  if (data.theme !== null && (data.theme === "BW" || data.theme === "RGB")) {
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
//  d3.selectAll('locations');
  mapOptions = {
    center: center,
    zoom: data.zoom,
    scrollwheel: data.scrollWheel,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  infowindow = new google.maps.InfoWindow();
  for (var i in locations) {
    var office = locations[i];
    // we need lat and lng to plot on google map
    if (!office.latLng){
      geoCodeLocations(office, map);
    }
    addMarker(office, map);
    offices.push(office);
  }

  function addMarker(data, map) {
    var gll = new google.maps.LatLng(data.latLng.latitude, data.latLng.longitude)
    var marker = new google.maps.Marker({
      position: gll,
      title: data.name,
      icon: 'img/drake/weiss-favicon.png',
      map: map
    });
    // on click we want to display info window
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(data.name);
      infowindow.open(map, this);
    });
    marker.setMap(map);
  } // end addMarker

  function geoCodeLocations (location, map){
    var geocoder;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location.readable_address}, function(response, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        location.latLng = response[0].geometry.location;
        data.socket.emit("geo", { location: location });
      } else {
        console('Geocode was not successful for the following reason: ' + status);
      }
    });
  } // end geoCodeLocations

  function getGooglePlaces(map)
  {
    var request = {
      location: center,
      radius: 40000,
      types: ['doctor'],
      name: '"Weiss Orthopaedics"'
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, googleSearchCallback);
    function googleSearchCallback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          if (results[2].name.indexOf("Weiss Orthopaedics") !== -1) {
            results[i].readable_address = results[i].vicinity;
            results[i].latLng = results[i].geometry.location;
            addMarker(results[i], map);
          }
        }
      }
    }
  } // end getGooglePlaces
} //end initializeMap
