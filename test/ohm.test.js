(function() {
  'use strict';

  const assert = require('assert');
  const expect = require('chai').expect;
  const request = require('supertest');
  const config = require('../examples/basic/config/config.js');
  const Ohm = require('../dist/ohm');

  var hasCookie = function(res) {
    return expect(res.headers['set-cookie'][0]).to.contain('OHMTEST');
  };

  describe('Server', function() {
    var app = new Ohm(config);

    beforeEach(function(){
      app.listen(8888);
    });

    describe('GET /', function() {
      it('should return 404', function(done) {
        request(app)
          .get('/')
          .expect(404, done);
      });
    });

    describe('GET /example', function() {

      it('should contain cookie', function(done) {
        request(app)
          .get('/example')
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

    afterEach(function(){
      app.close();
    })
  });
}());
