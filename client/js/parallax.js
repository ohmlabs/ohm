window.onscroll = function() {
  if (window.location.origin.indexOf("8632") !== -1)
  {
    paraBugger();
  }
}

function paraBugger() {
  // Get the scroll position of the page
  var scrollPos = window.pageYOffset;
  // Display Scroll position for debugging
  d3.select('#scrollTop').html(scrollPos);
}
function bodyParts(){
  var parts = d3.selectAll(".body-part");
  //.attr("id", function(d){
  //  var json = JSON.parse(d3.select(this).attr("data"));
  //  return json.name;
  //});
  var g = parts.selectAll("g")
    .on("mouseover", hover(50, 0.7)).on("mouseout", hover(40, 0));
  var circles = g.selectAll("circle");
  var labels = g.selectAll("text");
  function hover(radius, opacity) {
    return function(g, i) {
      d3.select(this).select("circle").transition()
        .attr("r", radius)
        .style("fill-opacity", opacity);
    };
  }
}


