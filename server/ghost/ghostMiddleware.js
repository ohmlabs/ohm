var ghost = require( 'ghost' )
 
function ghostMiddleware( options ) {
  var app = false
  var requestBuffer = []
 
  ghost( options ).then(function( blog ){
    app = blog.rootApp;
    while( requestBuffer.length ){
      app.apply( app, requestBuffer.pop() )
    }
  }).catch( function( err ){
    console.log( err )
  })
 
  return function( req, res ){
    if( app === false ){
      requestBuffer.unshift([req, res]);
    } else {
      app( req, res )
    }
  }
}
 
module.exports = ghostMiddleware
