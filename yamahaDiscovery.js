var SsdpClient = require('node-ssdp').Client;
var Q = require('q');
var Request = require('request');
var parseString = require('xml2js').parseString;

function YamahaDiscovery(ip){
  this.ssdpClient = new SsdpClient();
  this.st = 'urn:schemas-upnp-org:device:MediaRenderer:1';
  this.url = 'http://{ip}/YamahaRemoteControl/ctrl';

  this.ip = ip;
}

YamahaDiscovery.prototype.getUrl = function(){
  var deferred = Q.defer();

  var self = this;
  this.getIp().then(function (ip){
    deferred.resolve(self.url.format({ip : ip}));
  }, function(error){
    deferred.reject(error);
  });

  return deferred.promise;
};

YamahaDiscovery.prototype.getIp = function(){
  var deferred = Q.defer();

  if (this.ip){
    deferred.resolve(this.ip);
  }
  else{
    var self = this;
    this.ssdpClient.on('response', function (headers, statusCode, rinfo){
      if (statusCode == 200) {
        getDescription(headers.LOCATION, function (){
          if (self.timer){
            clearTimeout(self.timer);
            self.timer = null;
          }
          self.ssdpClient.stop();

          self.ip = rinfo.address;
          deferred.resolve(rinfo.address);
        });
      }
    });

    this.ssdpClient.search(this.st);

    this.timer = setTimeout(function(){
      deferred.reject("Discovery timeout");
      self.ssdpClient.stop();
    }, 3000);
  }

  return deferred.promise;
};

function getDescription(loc, successAction){
  var request = Request.get({
    method: 'GET',
    uri: loc
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      validateDescription(body, successAction);
    }
  });
}

function validateDescription(body, successAction){
  parseString(body, function(err, result){
    if (!err){
      var manufacturer = result.root.device[0].manufacturer[0];
      var modelDescription = result.root.device[0].modelDescription[0];
      if (manufacturer.match(/yamaha/i) && modelDescription.match(/AV/)){
        successAction();
      }
    }
  });
}

module.exports = YamahaDiscovery;
