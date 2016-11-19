(function(){
  'use strict';
  require('../lib/_include.js');

  const assert  = require('assert');
  const expect  = require('chai').expect;
  const request = require('supertest');
  const config  = require('../examples/basic/config/config.js');
  const Ohm     = require('../lib/ohm');
  var app       = new Ohm(config);

  var hasCookie = function(res) {
    return expect(res.headers['set-cookie'][0]).to.contain('OHMTEST');
  };

  describe('Server', function() {

    describe('GET /', function() {

      it('should return 404', function(done) {
        request(app)
          .get('/')
          .expect(404, done);
      });
    });

    describe('GET /sample', function() {

      it('should contain cookie', function(done) {
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
  });
}());
