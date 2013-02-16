
var TestCase = require('unit-test').TestCase,
    Assertions = require('unit-test').Assertions,
    sinon = require('unit-test').Sinon,
    FileSystem = require('fs');

var persistenceFilePath = __dirname + '';

module.exports = new TestCase('Middleware', {

   setUp: function() {
      try {
         FileSystem.unlinkSync(persistenceFilePath);
      }
      catch (e) {}
   },

   tearDown: function() {

   }
});