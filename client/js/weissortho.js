var map;
var infoWindow;
var center;
////////////////////////////////
// Initialize                //
//////////////////////////////
$(document).ready(function(){
  if (skrollr){
    var skroll = skrollr.init({forceHeight:false, smoothScrolling:true});
    //The options (second parameter) are all optional. The values shown are the default values.
    skrollr.menu.init(skroll, {
        //skrollr will smoothly animate to the new position using `animateTo`.
        animate: true,

        //The easing function to use.
        easing: 'sqrt',

        //How long the animation should take in ms.
        duration: function(currentTop, targetTop) {
            //By default, the duration is hardcoded at 500ms.
            return 500;

            //But you could calculate a value based on the current scroll position (`currentTop`) and the target scroll position (`targetTop`).
            //return Math.abs(currentTop - targetTop) * 10;
        },
    });
  }
  Parse.initialize("0Oo10fhvF3DX8Le8JjCybiaV8VogpPM3kxY8sRUs", "swogI2OnTAlsScMKdxgEKW6PmfWsen3kFOTTfga9");
});
////////////////////////////////
// Map Styles                //
//////////////////////////////
var mapStyles = [
  {
    "featureType": "water",
    "stylers": [
      { "color": "#000000" }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "poi.park",
    "stylers": [
      { "saturation": -100 }
    ]
  },{
    "elementType": "labels.text",
    "stylers": [
      { "hue": "#ff0022" },
      { "color": "#000000" }
    ]
  },{
    "elementType": "labels.text.stroke",
    "stylers": [
      { "weight": 0.1 }
    ]
  },{
  },{
    "elementType": "geometry.stroke",
    "stylers": [
      { "weight": 1.5 },
      { "color": "#cccccc" }
    ]
  },{
    "featureType": "road.local",
    "stylers": [
      { "color": "#cccccc" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "color": "#fffffe" }
    ]
  },{
    "featureType": "road.highway.controlled_access",
    "elementType": "labels.icon",
    "stylers": [
      { "saturation": -100 }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "saturation": -100 }
    ]
  }
];

function initializeMap() {
  // define the center of map and search area
  center = new google.maps.LatLng(38.042165, -122.5381458);
  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(mapStyles,
    {name: "Black & White"});

  var mapOptions = {
    center: center,
    zoom: 10,
    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  // add infoWindow
  infowindow = new google.maps.InfoWindow();
  // request to Parse to retrieve locations saved
  getParseLocations(map);
  // request to get Google place references
  // getGooglePlaces(map);
}

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
}

function getParseLocations(map){

  var Locations = Parse.Object.extend("locations");
  var query = new Parse.Query(Locations);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) { 
        var office = results[i].attributes;
        office.readable_address = office.address1 + ', ' + office.city + ', ' + office.state + ' ' + office.zip;
        // we need lat and lng to plot on google map
        geoCodeLocations(office, map);
      }
    },
    error: function(){
      console.log('Something Went Wrong');
    }
  });
}

function geoCodeLocations (office, map){
  var geocoder;
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': office.readable_address}, function(response, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      office.latLng = response[0].geometry.location;
      // now that we have latLng, add marker to map
      addMarker(office, map);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function addMarker(office, map) {
  var marker;
  marker = new google.maps.Marker({
    position: office.latLng,
    title: office.name,
    icon: 'img/weiss-favicon.png',
    map: map
  });
  // on click we want to display info window
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(office.name);
    infowindow.open(map, this);
  });
  marker.setMap(map);
}

////////////////////////////////
// Parallax                  //
//////////////////////////////
$(window).scroll(function() {
  parallax();
});
function parallax() {
  // Get the scroll position of the page
  scrollPos = $(this).scrollTop();
  // Display Scroll position for debugging
  $('#scrollTop').html($(this).scrollTop());
}

// Load Google Map on window load
google.maps.event.addDomListener(window, 'load', initializeMap);