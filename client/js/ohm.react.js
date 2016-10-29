(function () {
  'use strict';
  const styles   = require('./../sass/ohm.sass');
  const React    = require('react');
  const ReactDOM = require('react-dom');
  const io       = require('socket.io-client');
  const LightBox = require('./ohm/LightBox.react.js');
  const GMap     = require('./ohm/GMapper.react.js');
  const socket   = io.connect();

  socket.on('connect', (data) => {
    ReactDOM.render(
      <div>
        <LightBox />
        <GMap
          scrollwheel={false}
          zoom={9}
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
