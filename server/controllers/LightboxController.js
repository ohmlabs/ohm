var aws, ig, max_like_id, redirect_uri, config;
/**
 * Lightbox.js
 *
 * Copyright (c) 2014 Ohm Labs Inc
 * Licensed under the MIT license
 * For all details and documentation:
 * http://drake.fm/light
 *
 * @version  0.0.1
 * @author     Cameron W. Drake
 * @copyright  Copyright (c) 2014 Ohm Labs
 * @license    Licensed under the MIT license
 
 * @module Lightbox Server
 * @requires instagram-node
 * @requires aws
 */
config         = require("../config/config.example.js");
redirect_uri   = config.IG_REDIRECT_URI;
ig             = require("../apis/Instagram.js");
aws            = require("../apis/AWS.js");
module.exports = {
  /**
   * Fetch Instagram Feed
   * @param {object} req request
   * @param {object} res response
   * @returns {object} Instagram Feed
   */
  getInstagramFeed: function(req, res) {
    var pics, hdlf, next;
    pics = [];
    hdlf = function(err, medias, pagination, remaining, limit) {
      if (err) {
        res.send(err);
      } else {
        for (var i in medias) {
          pics.push(medias[i]);
        }
        pagination.next ? next = pagination.next_max_id : next = false;
        pics.push(next);
        res.send(pics);
      }
    }
    if (req.params.next) { // if the user requeests the next page of results
      ig.user_self_feed({
        max_id: req.params.next
      }, hdlf);
    } else { // if you have a username get recent media
      ig.user_self_feed(hdlf);
    }
  },
  
  /**
   * Fetch Recent Instagram Photos
   * @param {object} req request
   * @param {object} res response
   * @returns {object} Recent Instagram Photos
   */
  getInstagram: function(req, res) {
    'use strict';
    var pics, hdl, next;
    pics = [];
    hdl = function(err, medias, pagination, remaining, limit) {
      if (err) {
        res.send(err);
      } else {
        for (var i in medias) {
          pics.push(medias[i]);
        }
        pagination.next ? next = pagination.next_max_id : next = false;
        pics.push(next);
        res.send(pics);
      }
    }
    if (req.params.next) { // if the user requeests the next page of results
      ig.user_media_recent(req.params.user, {
        max_id: req.params.next
      }, hdl);
    } else if (req.params.user) { // if you have a username get recent media
      ig.user_media_recent(req.params.user, hdl);
    }
  },

  /**
   * Like Instagram Photo
   * @param {object} req request
   * @param {object} res response
   */
  likeInstagramPhoto: function(req, res) {
    'use strict';
    ig.add_like(req.params.media, {
      sign_request: {
        client_secret: config.IG_CLIENT_SECRET,
        client_req: req,
        ip: req.ip,
      }
    }, function(err, remaining, limit) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("photo liked, " + remaining + " likes remaining.");
      }
      res.end();
    });
  },

  /**
   * Authorize User
   * @param {object} req request
   * @param {object} res response
   */
  auhorizeInstaUser: function(req, res) {
    'use strict';
    res.redirect(ig.get_authorization_url(redirect_uri, {
      scope: ['likes']
    }));
  },

  /**
   * Handle Authentication Code
   * @param {object} req request
   * @param {object} res response
   * @param {string} req.query.code Authentication Code
   */
  handleInstaAuth: function(req, res) {
    'use strict';
    ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        ig.use({
          access_token: result.access_token,
          client_id: config.IG_CLIENT_ID,
          client_secret: config.IG_CLIENT_SECRET,
        });
        res.redirect('/noblebachelor');
      }
    });
  },

  /**
   * Fetch Photos from S3
   * @param {object} req request
   * @param {object} res response
   * @returns {object} Recent Instagram Photos
   * @TODO This is a WIP
   */
  getBuckets: function(req, res) {
    'use strict';
    var s3 = new aws.S3();
    var bucketName = req.params.bucketname;
    s3.listBuckets(function(err, data) {
      for (var index in data.Buckets) {
        var bucket = data.Buckets[index];
        if (bucket.Name === bucketName) {
          console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
          s3.listObjects({
            "Bucket": bucketName
          }, function(err, response) {
            res.send(response);
          });
        }
      }
    });
  },
};
