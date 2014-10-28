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

Yamaha.prototype.isOn = function(){
  var xml = this.commands.basicStatusCommand();
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
