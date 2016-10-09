var assert = require("assert");
var YamahaDiscovery = require('../yamahaDiscovery.js');

describe('Yamaha Discovery', function(){

  var ip = "10.0.0.2";
  var yamaha = new YamahaDiscovery(ip);

  describe('getIp()', function(){
    it('should return '+ip, function(){
      yamaha.getIp()
        .then(function(result){
          assert.equal(ip, result);
        })
        .done();
    });
  });

  describe('getUrl()', function(){
    it('should return http://'+ip+'/YamahaRemoteControl/ctrl', function(){
      yamaha.getUrl()
        .then(function(result){
          assert.equal('http://'+ip+'/YamahaRemoteControl/ctrl', result);
        })
        .done();
    });
  });

});
