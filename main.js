var Yamaha = require('./yamaha');

var ip = process.argv[2];
var cmd = process.argv[3];
var params = process.argv[4];

console.log("Connecting to: " + ip);

var yamaha = new Yamaha(ip);

yamaha.isOnline().then(function(isOnline){
  if (isOnline === false){
    console.log("Amplifier not online");
  }
  else{
    switch(cmd)
    {
      case 's':
        GetState();
        break;
      case 'p':
        yamaha.setPower(params);
        console.log("Power to: " + params);
        break;
      case 'v':
        if (!Number.isInteger(params)){
          console.log("Parameter is not a number: " + params);
          break;
        }

        yamaha.setVolume(params);
        console.log("Volume to: " + params);
        break;
      default:
        console.log("Unknown command");
        break;
    }
  }
}, function(error){
  console.log("Amplifier not online");
});

function GetState()
{
  yamaha.isOn().then(function(result){
    console.log("State: " + result);
  });

  yamaha.getVolume().then(function(result){
    console.log("Volume: " + result);
  });
}
