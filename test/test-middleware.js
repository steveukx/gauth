var TestCase = require('unit-test').TestCase,
   Assertions = require('unit-test').Assertions,
   sinon = require('unit-test').Sinon,
   FileSystem = require('fs'),
   Phantom = require('phantom'),
   TaskRunner = require('task-runner').TaskRunner,
   Express = require('express'),
   GoogleAuth = require('../src/index'),
   Promise = require('promise-lite').Promise,
   XHR = require('xhrequest');

var persistenceFilePath = __dirname + '/.googleauth';

var phantom, taskRunner;
var express;
var googleAuth;
var middleware;
var promise;
var mainRoute;

module.exports = new TestCase('Middleware', {

   setUp: function () {
      promise = new Promise;

      googleAuth = new GoogleAuth(
         GoogleAuth.configure('base.url', 'http://localhost:8989/openid/responder'),
         GoogleAuth.filePersistence(persistenceFilePath));

      middleware = googleAuth.middleware();

      googleAuth.on('ready', promise.resolve.bind(promise));

      express = Express();
      express.use(Express.cookieParser('some secret'));
      express.use(Express.cookieSession({key: 'iveGotThe', secret: Date.now() + '_my_secret'}));
      express.use(middleware);
      express.get('/', mainRoute = sinon.spy(function(req, res, next) {
         res.send({ query: req.query, params: req.params, url: req.url, user: req.session.user });
      }));
      express.listen(8989);

      try {
         FileSystem.unlinkSync(persistenceFilePath);
      }
      catch (e) {
      }
   },

   tearDown: function () {
      if (phantom) {
         phantom.exit();
      }
      express.st
   },

   'test Can make a request to the server': function(done) {
      setTimeout(function() {

         promise.done(function () {
            XHR('http://localhost:8989', {
               success: function (data) {
                  console.log('OK', data.toString('utf8'));
               },
               error: function () {
                  console.log('error')
               },
               complete: function () {
                  done();
               }
            });
         })

      }, 10000)

   }
});
