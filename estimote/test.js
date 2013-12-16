var async = require('async');

var Estimote = require('./estimote.js');

Estimote.discover(function(estimote) {
  async.series([
    function(callback) {
      estimote.on('disconnect', function() {
        console.log('disconnected!');
        process.exit(0);
      });

      console.log('found: ' + estimote.toString());

      console.log('connect');
      estimote.connect(callback);
    },
    function(callback) {
      console.log('discoverServicesAndCharacteristics');
      estimote.discoverServicesAndCharacteristics(callback);
    },
    function(callback) {
      console.log('readDeviceName');
      estimote.readDeviceName(function(deviceName) {
        console.log('\tdevice name = ' + deviceName);

        callback();
      });
    },
    function(callback) {
      console.log('readMinor');
      estimote.readMinor(function(minor) {
        console.log('\tminor = ' + minor + ' (0x' + minor.toString(16) + ')');

        callback();
      });
    },
    function(callback) {
      console.log('readMajor');
      estimote.readMajor(function(major) {
        console.log('\tmajor = ' + major + ' (0x' + major.toString(16) + ')');

        callback();
      });
    },
    function(callback) {
      console.log('readUuid1');
      estimote.readUuid1(function(uuid1) {
        console.log('\tuuid 1 = ' + uuid1);

        callback();
      });
    },
    function(callback) {
      console.log('readUuid2');
      estimote.readUuid2(function(uuid2) {
        console.log('\tuuid 2 = ' + uuid2);

        callback();
      });
    },
    function(callback) {
      console.log('readSignalStrength');
      estimote.readSignalStrength(function(signalStrength) {
        console.log('\tsignal strength = ' + signalStrength + ' dBm');

        callback();
      });
    },
    function(callback) {
      console.log('readAdvertisementInterval');
      estimote.readAdvertisementInterval(function(advertisementInterval) {
        console.log('\tadvertisement interval = ' + advertisementInterval + ' ms');

        callback();
      });
    },
    // function(callback) {
    //   console.log('readService2_7');
    //   estimote.readService2_7(function(data) {
    //     console.log('\tservice 2 7 = ' + data.toString('hex'));

    //     callback();
    //   });
    // },
    function(callback) {
      console.log('readPowerLevel');
      estimote.readPowerLevel(function(powerLevel) {
        console.log('\tpower level ' + powerLevel);

        callback();
      });
    },
    // function(callback) {
    //   console.log('readService2_9');
    //   estimote.readService2_9(function(data) {
    //     console.log('\tservice 2 9 = ' + data.toString('hex'));

    //     callback();
    //   });
    // },
    // function(callback) {
    //   console.log('readService2_10');
    //   estimote.readService2_10(function(data) {
    //     console.log('\tservice 2 10 = ' + data.toString('hex'));

    //     callback();
    //   });
    // },
    function(callback) {
      console.log('readBatteryLevel');
      estimote.readBatteryLevel(function(batteryLevel) {
        console.log('\tbattery level = ' + batteryLevel);

        callback();
      });
    },
    // function(callback) {
    //   console.log('readService3_1');
    //   estimote.readService3_1(function(data) {
    //     console.log('\tservice 3 1 = ' + data.toString('hex'));

    //     callback();
    //   });
    // },
    // function(callback) {
    //   console.log('readService3_2');
    //   estimote.readService3_2(function(data) {
    //     console.log('\tservice 3 2 = ' + data.toString('hex'));

    //     callback();
    //   });
    // },
    function(callback) {
      console.log('readFirmwareVersion');
      estimote.readFirmwareVersion(function(firmwareVersion) {
        console.log('\tfirmware version = ' + firmwareVersion);

        callback();
      });
    },
    function(callback) {
      console.log('readHardwareVersion');
      estimote.readHardwareVersion(function(hardwareVersion) {
        console.log('\thardware version = ' + hardwareVersion);

        callback();
      });
    },
    function(callback) {
      console.log('disconnect');
      estimote.disconnect(callback);
    }
  ]);
});