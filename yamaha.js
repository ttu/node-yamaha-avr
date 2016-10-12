var Request = require('request');
var Q = require('q');
var StringFormat = require('string-format');
var parseString = require('xml2js').parseString;
var YamahaCommands = require('./yamahaCommands');
var YamahaDiscovery = require('./yamahaDiscovery');

function Yamaha(ip){
  this.commands = new YamahaCommands();
  this.discovery = new YamahaDiscovery(ip);
}

Yamaha.prototype.discover = function(){
  return this.discovery.getIp();
};

Yamaha.prototype.isOnline = function(){
  var xml = this.commands.basicStatusCommand();
  return deferredAction(this.discovery, xml, function(result){
    // Check that returned xml is in valid Yamaha format
    return result.YAMAHA_AV !== undefined;
  });
};

Yamaha.prototype.getStatus = function(){
  var xml = this.commands.basicStatusCommand();
  return deferredAction(this.discovery, xml, function(result){
    return result;
  });
};

Yamaha.prototype.getSystemConfig = function(){
  var xml = this.commands.systemConfigCommand();
  return deferredAction(this.discovery, xml, function(result){
    return result;
  });
};

Yamaha.prototype.isOn = function(){
  var xml = this.commands.basicStatusCommand();
  return deferredAction(this.discovery, xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Basic_Status[0].Power_Control[0].Power[0] === "On";
  });
};

Yamaha.prototype.setPower = function(state){
  var xml;
  if (state == "on"){
    xml = this.commands.powerOnCommand();
  }else{
    xml = this.commands.powerOffCommand();
  }

  return deferredAction(this.discovery, xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Power_Control[0].Power[0];
  });
};

Yamaha.prototype.setMute = function(state){
  var xml;
  if (state == "on"){
    xml = this.commands.muteOnCommand();
  }else{
    xml = this.commands.muteOffCommand();
  }

  return deferredAction(this.discovery, xml, function(result){
    return result.YAMAHA_AV.Main_Zone !== undefined;
  });
};

Yamaha.prototype.getVolume = function(){
  var xml = this.commands.getVolumeCommand();
  return deferredAction(this.discovery, xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Volume[0].Lvl[0].Val[0];
  });
};

Yamaha.prototype.setVolume = function(volume){
  var xml = this.commands.setVolumeCommand(volume);
  return deferredAction(this.discovery, xml, function(result){
    return result.YAMAHA_AV.Main_Zone[0].Volume[0].Lvl[0].Val[0];
  });
};

Yamaha.prototype.setInput = function(input_name){
  var xml = this.commands.setInputCommand(input_name);

  return deferredAction(this.discovery, xml, function(result){
    // Responses Input_Sel is ''
    return result.YAMAHA_AV.Main_Zone[0].Input[0].Input_Sel[0] !== undefined;
  });
};

Yamaha.prototype.setScene = function(scene_num){
  var xml = this.commands.setSceneCommand(scene_num);

  return deferredAction(this.discovery, xml, function(result){
    // Responses Scene_Sel is ''
    return result.YAMAHA_AV.Main_Zone[0].Scene[0].Scene_Sel[0] !== undefined;
  });
};

function deferredAction(discovery, commandXml, parseAction){
  var deferred = Q.defer();

  discovery.getUrl()
    .then(function (url){
      return getCommandReply(url, commandXml);
    })
    .then(function (response){
      parseString(response, function (err, result){
        var res = parseAction(result);
        deferred.resolve(res);
      });
    })
    .catch(function (error){
      deferred.reject("No connection");
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
