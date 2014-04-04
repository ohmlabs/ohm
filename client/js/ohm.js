////////////////////////////////
// Phone Slideshow           //
//////////////////////////////
if (typeof jQuery !== "undefined") {
  $(function() {
    $('.phoneframe img:gt(0)').hide();
      setInterval(function() {
        $('.phoneframe :first-child').fadeOut().next('img').fadeIn().end().appendTo('.phoneframe');
      }, 3000);
  });
}
