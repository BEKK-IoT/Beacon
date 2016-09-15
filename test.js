var Beacon = require('./index');

Beacon.startAdvertising('e2c56db5dffb48d2b060d0f5a71096e0', 0, 0, -59);

Beacon.on('discover', function(Beacon) {
  console.log('Beacon found: ' + JSON.stringify(Beacon));
});

Beacon.on('telemetrydata', function(telemetrydata){
	console.log('telemetrydata: ', telemetrydata);
});

Beacon.startScanning(/*'e2c56db5dffb48d2b060d0f5a71096e0', 0, 0*/);

