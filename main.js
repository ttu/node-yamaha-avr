var Yamaha = require('./yamaha');

var ip = process.argv[2];
var cmd = process.argv[3];
var params = process.argv[4];

if (ip.length == 1){
  ip = null;
  cmd = process.argv[2];
  params = process.argv[3];
}

var yamaha = new Yamaha(ip);

yamaha.discover()
  .then(function(ip){
    console.log("Connecting to: " + ip);
    return yamaha.isOnline();
  })
  .then(function(isOnline){
    if (isOnline === false){
      console.log("Device returned unknown response");
    }
    else{
      switch(cmd)
      {
        case 's':
          GetState();
          break;
        case 'c':
          GetSystemConfig();
          break;
        case 'm':
          console.log("Mute to: " + params);
          yamaha.setMute(params);
          break;
        case 'p':
          console.log("Power to: " + params);
          yamaha.setPower(params);
          break;
        case 'v':
          console.log("Volume to: " + params);
          yamaha.setVolume(parseInt(params));
          break;
        case 'i':
            console.log("Set intput to: " + params);
            yamaha.setInput(params);
            break;
        case 'e':
            console.log("Set scene to: " + params);
            yamaha.setScene(params);
            break;
        default:
          console.log("Unknown command");
          break;
      }
    }
  })
  .catch(function(error){
    console.log("Amplifier not online");
  });

function GetState(){
  yamaha.isOn().then(function(result){
    console.log("Power on: ", result);
  });

  yamaha.getVolume().then(function(result){
    console.log("Volume: ", result);
  });

  yamaha.getStatus().then(function(result){
    console.log("Status: %j", result);
  });
}

function GetSystemConfig(){
  yamaha.getSystemConfig().then(function(result){
    console.log("System: %j", result);
  });
}
