var StringFormat = require('string-format');

function YamahaCommands()
{
  this.getParam = 'GetParam';

  this.commandWrapper = '<YAMAHA_AV cmd="{command}">{payload}</YAMAHA_AV>';
  this.mainZoneWrapper = '<Main_Zone>{request_text}</Main_Zone>';

  this.basicStatus = '<Basic_Status>GetParam</Basic_Status>';
  this.systemConfig = '<System><Config>GetParam</Config></System>';

  this.powerControl = '<Power_Control><Power>{state}</Power></Power_Control>';

  this.volumeLevel = '<Volume><Lvl>{value}</Lvl></Volume>';
  this.setVolumeValue = '<Val>{val}</Val><Exp>{exp}</Exp><Unit>{unit}</Unit>';

  this.muteControl = '<Volume><Mute>{state}</Mute></Volume>';

  this.setInput = '<Input><Input_Sel>{input}</Input_Sel></Input>';
}

YamahaCommands.prototype.basicStatusCommand = function(){
  var cmd = 'GET';

  var pload = this.mainZoneWrapper.format({request_text : this.basicStatus});
  return this.commandWrapper.format({command : cmd, payload : pload});
};

YamahaCommands.prototype.systemConfigCommand = function(){
  var cmd = 'GET';

  return this.commandWrapper.format({command : cmd, payload : this.systemConfig});
};

YamahaCommands.prototype.powerOnCommand = function(){
  return this.powerCommand('On');
};

YamahaCommands.prototype.powerOffCommand = function(){
  return this.powerCommand('Standby');
};

YamahaCommands.prototype.powerCommand = function(selectedState){
  var cmd = 'PUT';
  var request = this.powerControl.format({state : selectedState});

  var pload = this.mainZoneWrapper.format({request_text : request});
  return this.commandWrapper.format({command : cmd, payload : pload});
};

YamahaCommands.prototype.getVolumeCommand = function(){
  var cmd = 'GET';
  var request = this.volumeLevel.format({value : this.getParam});

  var pload = this.mainZoneWrapper.format({request_text : request});
  return this.commandWrapper.format({command : cmd, payload : pload});
};

YamahaCommands.prototype.setVolumeCommand = function(volume){
  var cmd = 'PUT';
  var volPayload = this.setVolumeValue.format({val : volume, exp : '1', unit :'db'});
  var request = this.volumeLevel.format({value : volPayload});

  var pload = this.mainZoneWrapper.format({request_text : request});
  return this.commandWrapper.format({command : cmd, payload : pload});
};

YamahaCommands.prototype.muteOnCommand = function(){
  return this.muteCommand('On');
};

YamahaCommands.prototype.muteOffCommand = function(){
  return this.muteCommand('Off');
};

YamahaCommands.prototype.muteCommand = function(selectedState){
  var cmd = 'PUT';
  var request = this.muteControl.format({state : selectedState});
  var pload = this.mainZoneWrapper.format({request_text : request});

  return this.commandWrapper.format({command : cmd, payload : pload});
};

YamahaCommands.prototype.setInputCommand = function(input_name){
  var cmd = 'PUT';
  var request = this.setInput.format({input : input_name});
  var pload = this.mainZoneWrapper.format({request_text : request});

  return this.commandWrapper.format({command : cmd, payload : pload});
};

module.exports = YamahaCommands;
