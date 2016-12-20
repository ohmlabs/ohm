(function () {
  'use strict';
  const styles   = require('./../sass/style.sass');
  const React    = require('react');
  const ReactDOM = require('react-dom');
  const io       = require('socket.io-client');

  const LightBox = require('./../../../../lightbox.js');
  const GMap     = require('./../../../../gmapper.js');
  const socket   = io.connect();
  const center   = {
    latitude: 37.7774421,
    longitude: -122.4251068
  };

  var callback = function () {
    console.log('loaded');
  };

  ReactDOM.render(
    <div>
      <LightBox 
        onMountCallback={callback}/>
      <GMap
        scrollwheel={false}
        zoom={9}
        center={center}
        apiKey={"AIzaSyC4Tnw7DEdnK7-mr7MG0a60H9qTIE87NQc"}
        mapName="ohm" />
    </div>,
    main
  );

}());
