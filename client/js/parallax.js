////////////////////////////////
// Initialize                //
//////////////////////////////
$(document).ready(function(){
  if (skroll){
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
}); 

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
