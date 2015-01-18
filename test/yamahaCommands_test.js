var assert = require("assert");
var YamahaCommands = require('../yamahaCommands.js');

describe('Yamaha XML Commands', function(){

  var yamaha = new YamahaCommands();

  describe('Status Commands', function(){
    it('should return basic status command', function(){
      var cmd = '<YAMAHA_AV cmd="GET"><Main_Zone><Basic_Status>GetParam</Basic_Status></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.basicStatusCommand());
    });

    it('should return system config command', function(){
      var cmd = '<YAMAHA_AV cmd="GET"><System><Config>GetParam</Config></System></YAMAHA_AV>';
      assert.equal(cmd, yamaha.systemConfigCommand());
    });
  });

  describe('Power Commands', function(){
    it('should return on command', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>On</Power></Power_Control></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.powerOnCommand());
    });

    it('should return off command', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>Standby</Power></Power_Control></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.powerOffCommand());
    });
  });

  describe('Volume Commands', function(){
    it('should return get volume', function(){
      var cmd = '<YAMAHA_AV cmd="GET"><Main_Zone><Volume><Lvl>GetParam</Lvl></Volume></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.getVolumeCommand());
    });

    it('should return set volume', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Lvl><Val>210</Val><Exp>1</Exp><Unit>db</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.setVolumeCommand(210));
    });
  });

  describe('Mute Commands', function(){
    it('should return mute on', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Mute>On</Mute></Volume></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.muteOnCommand());
    });

    it('should return mute off', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Mute>Off</Mute></Volume></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.muteOffCommand());
    });
  });

  describe('Set Input Commands', function(){
    it('should return HDMI1', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>HDMI1</Input_Sel></Input></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.setInputCommand('HDMI1'));
    });

    it('should return AV2', function(){
      var cmd = '<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV2</Input_Sel></Input></Main_Zone></YAMAHA_AV>';
      assert.equal(cmd, yamaha.setInputCommand('AV2'));
    });
  });

});
