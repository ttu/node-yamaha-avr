node-yamaha-avr
===============

Node.js module for controlling Yamaha RX-V-series receiver (HTTP API)

> npm install

> npm test

#### Command line arguments

```
node main.js [IP_ADDRESS] COMMAND PARAMETERS
```

If `IP_ADDRESS` is omitted, the receiver's IP will be automatically discovered
via SSDP. Discovery can take up to 3 seconds.

`COMMAND` can be one of the following:

* s get status
* c get system configuration
* p set power (on/off)
* m set mute (on/off)
* v set volume (in 0.5 dB steps from –80.5 dB to 16.5 dB (very loud!), written as `-805` to `165`)
* i set input (HDMIx, AVx, AUDI, TUNER ...)
* e set scene (1, 2, 3 ...)

Examples:

```
node main.js s
node main.js c
node main.js p on
node main.js p off
node main.js m on
node main.js m off
node main.js v -550
node main.js i HDMI1
node main.js e 2
```
