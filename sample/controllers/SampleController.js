(function() {
  'use strict';

  var _              = require('underscore');
  var BaseController = include('controllers/BaseController.js');

  function SampleController() {
    BaseController.apply(this, arguments);
  }

  _.extend(SampleController.prototype, BaseController.prototype, {
    genResponse: function () {
      return this.res.render('bootloader', {
        bodyClass: '',
        args: {
          title: 'Sample Page',
          initScript: 'ohm',
        },
      });
    },
  });

  module.exports = SampleController;
}());
