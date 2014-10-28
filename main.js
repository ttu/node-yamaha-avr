var Yamaha = require('./yamaha');

var yamaha = new Yamaha("192.168.1.40");

yamaha.isOn().then(function(result){
  console.log(result);
});

yamaha.getVolume().then(function(result){
  console.log(result);
});