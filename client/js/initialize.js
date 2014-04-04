window.addEventListener("load", function() { onLoad(); }, false);

function onLoad()
{
  bodyParts();
  if (typeof skrollr !== 'undefined'){
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
    var socket = io.connect('http://' + document.domain);
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  }
  // Load Google Map with Black and White theme
  if (typeof google !== 'undefined'){
    initializeMap({ lat: 38.042165, lng: -122.5381458, scrollWheel: false, theme: "BW", socket: socket});
  }
}
