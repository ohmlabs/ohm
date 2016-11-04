(function(){
  'use strict';
  var assert        = require('assert');
  var expect        = require('chai').expect;
  var request       = require('supertest');
  var ViewerContext = require('../models/ViewerContext.js');

  var hasCookie = function(res) {
    return expect(res.headers['set-cookie'][0]).to.contain('ojxsid');
  };

  describe('Server', function() {
    beforeEach(function(){
      var app = require('../../ohm.js');
    });

    describe('GET /sample', function() {
      it('contain cookie', function(done) {
        request(app)
          .get('/sample')
          .expect(200)
          .expect(hasCookie)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });
    describe('GET /', function() {
      it('404 ', function(done) {
        request(app)
          .get('/')
          .expect(404, done);
      });
    });
  });
}());
