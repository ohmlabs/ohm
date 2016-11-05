(function () {
  'use strict';
  const styles   = require('./../sass/style.sass');
  const React    = require('react');
  const ReactDOM = require('react-dom');
  const io       = require('socket.io-client');
  // FIXME: add via npm
  const LightBox = require('./../../../../lib/client/js/lib/LightBox.react.js');
  const GMap     = require('./../../../../lib/client/js/lib/GMapper.react.js');
  const socket   = io.connect();
  const center   = {
    latitude: 37.7774421,
    longitude: -122.4251068
  };

  socket.on('connect', (data) => {
    socket.emit('home', {});
    ReactDOM.render(
      <div>
        <LightBox />
        <GMap
          scrollwheel={false}
          zoom={9}
          center={center}
          apiKey={"FIXME"}
          mapName="ohm" />
        <div id="general-error-wrapper">
          <div id="general-error"></div>
        </div>
        <div id="loading">
          <div id="loading-indicator"></div>
        </div>
      </div>,
      main
    );
  });

}());
