(function() {
  'use strict';

  var _              = require('lodash');
  var BaseController = include('controllers/BaseController.js');

  function SampleController() {
    BaseController.apply(this, arguments);
  }

  _.extend(SampleController.prototype, BaseController.prototype, {
    genResponse: function () {
      var params   = this.getBootloaderParams('example');
      params.title = 'Sample Page';
      return this.res.render('bootloader', {
        bodyClass: '',
        args: params,
      });
    },
  });

  module.exports = SampleController;
}());
