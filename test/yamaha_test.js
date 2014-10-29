var assert = require("assert");
var Yamaha = require('../yamaha.js');

describe('Yamaha Receiver', function(){

  var ip = "10.0.0.2";
  var yamaha = new Yamaha(ip);

/*
  describe('isOn()', function(){
    it('should return true for isOn', function(){
      assert.equal(true, yamaha.isOn());
    });
  });

  describe('getVolume()', function(){
    it('should return 2', function(){
      assert.equal(2, yamaha.getVolume());
    });
  });
*/

  describe('Get Url', function(){
    it('should return http://'+ip+'/YamahaRemoteControl/ctrl', function(){
      assert.equal('http://'+ip+'/YamahaRemoteControl/ctrl', yamaha.getUrl());
    });
  });


});
