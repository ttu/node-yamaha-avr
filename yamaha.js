var Request = require('request');
var Q = require('q');
var StringFormat = require('string-format');
var parseString = require('xml2js').parseString;
var YamahaCommands = require('./yamahaCommands');

function Yamaha(ip){
  this.commands = new YamahaCommands();

  this.ip = ip;
  this.url = 'http://{ip}/YamahaRemoteControl/ctrl';
}

Yamaha.prototype.isOnline = function(){
  var xml = this.commands.basicStatusCommand();
  return deferredAction(this.getUrl(), xml, function(result){
    // Check that returned xml is in valid Yamaha format
    return result.YAMAHA_AV !== undefined;
  });
};

Yamaha.prototype.getStatus = function(){
  var xml = this.commands.basicStatusCommand();
  return deferredAction(this.getUrl(), xml, function(result){
    return result;
  });
};

Yamaha.prototype.getSystemConfig = function(){
  var xml = this.commands.systemConfigCommand();
  return deferredAction(this.getUrl(), xml, function(result){
    return result;
  });
};

Yamaha.prototype.isOn = function(){
  var xml = this.commands.basicStatusCommand();
  return deferredAction(this.getUrl(), xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Basic_Status[0].Power_Control[0].Power[0] === "On";
  });
};

Yamaha.prototype.setPower = function(state){
  var xml;
  if (state == "on"){
    xml = this.commands.powerOn();
  }else{
    xml = this.commands.powerOff();
  }

  return deferredAction(this.getUrl(), xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Basic_Status[0].Power_Control[0].Power[0] === "On";
  });
};

Yamaha.prototype.getVolume = function(){
  var xml = this.commands.getVolumeCommand();
  return deferredAction(this.getUrl(), xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Volume[0].Lvl[0].Val[0];
  });
};

Yamaha.prototype.setVolume = function(volume){

  // Safety: Do not set volume ever too loud
  if (volume < 200)
    volume = 200;

  var xml = this.commands.setVolumeCommand(volume);
  return deferredAction(this.getUrl(), xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Volume[0].Lvl[0].Val[0];
  });
};

Yamaha.prototype.getUrl = function(){
  return this.url.format({ip : this.ip});
};

function deferredAction(url, commandXml, parseAction){
  var deferred = Q.defer();

  var promise = getCommandReply(url, commandXml);

  promise.then(function (response){
    parseString(response, function (err, result){
      var res = parseAction(result);
      deferred.resolve(res);
    });
  }, function (error){
    deferred.resolve("No connection");
  });

  return deferred.promise;
}

function getCommandReply(url, commandXml){

  var deferred = Q.defer();
  var request = Request.post({
    method: 'POST',
    uri: url,
    body: commandXml
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(body);
    }
    else{
      deferred.reject(body);
    }
  });

  return deferred.promise;
}

module.exports = Yamaha;
