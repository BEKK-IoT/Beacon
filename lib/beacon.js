var events = require('events');
var util = require('util');

var debug = require('debug')('bleacon');

var noble = require('noble');
var bleno = require('bleno');

var EXPECTED_MANUFACTURER_DATA_LENGTH = 25;
var APPLE_COMPANY_IDENTIFIER = 0x004c; // https://www.bluetooth.org/en-us/specification/assigned-numbers/company-identifiers
var IBEACON_TYPE = 0x02;
var EXPECTED_IBEACON_DATA_LENGTH = 0x15;

var Beacon = function() {
  this._uuid = null;
  this._major = null;
  this._minor = null;

  this._discovered = {};

  noble.on('discover', this.onDiscover.bind(this));
};

util.inherits(Beacon, events.EventEmitter);

Beacon.prototype.startAdvertising = function(uuid, major, minor, measuredPower) {
  debug('startAdvertising: uuid = %s, major = %s, minor = %s, measuredPower = %s', uuid, major, minor, measuredPower);

  if (bleno.state === 'poweredOn') {
    bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
  } else {
    bleno.on('stateChange', function() {
      bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
    });
  }
};

Beacon.prototype.stopAdvertising = function() {
  debug('stopAdvertising');
  bleno.stopAdvertising();
};

Beacon.prototype.startScanning = function(uuid, major, minor, noDuplicates) {
  debug('startScanning: uuid = %s, major = %s, minor = %s', uuid, major, minor);

  if(uuid && !Array.isArray(uuid)) {
    uuid = new Array(uuid);
  }

  this._uuid = uuid;
  this._major = major;
  this._minor = minor;

  var duplicates = !noDuplicates;

  if (noble.state === 'poweredOn') {
    noble.startScanning([], duplicates);
  } else {
    noble.on('stateChange', function() {
      noble.startScanning([], duplicates);
    });
  }
};

Beacon.prototype.stopScanning = function() {
  debug('stopScanning');
  noble.stopScanning();
};

Beacon.prototype.onDiscover = function(peripheral) {
  debug('onDiscover: %s', peripheral);

  var manufacturerData = peripheral.advertisement.manufacturerData;
  var rssi = peripheral.rssi;

  debug('onDiscover: manufacturerData = %s, rssi = %d', manufacturerData ?  manufacturerData.toString('hex') : null, rssi);

  if (manufacturerData &&
      EXPECTED_MANUFACTURER_DATA_LENGTH <= manufacturerData.length &&
      APPLE_COMPANY_IDENTIFIER === manufacturerData.readUInt16LE(0) &&
      IBEACON_TYPE === manufacturerData.readUInt8(2) &&
      EXPECTED_IBEACON_DATA_LENGTH === manufacturerData.readUInt8(3)) {

    var uuid = manufacturerData.slice(4, 20).toString('hex');
    var major = manufacturerData.readUInt16BE(20);
    var minor = manufacturerData.readUInt16BE(22);
    var measuredPower = manufacturerData.readInt8(24);

    debug('onDiscover: uuid = %s, major = %d, minor = %d, measuredPower = %d', uuid, major, minor, measuredPower);

    if ((!this._uuid || this._uuid.indexOf(uuid) != -1 ) &&
        (!this._major || this._major === major) &&
        (!this._minor || this._minor === minor)) {

      var accuracy = Math.pow(12.0, 1.5 * ((rssi / measuredPower) - 1));
      var proximity = null;

      if (accuracy < 0) {
        proximity = 'unknown';
      } else if (accuracy < 0.5) {
        proximity = 'immediate';
      } else if (accuracy < 4.0) {
        proximity = 'near';
      } else {
        proximity = 'far';
      }

      var Beacon = this._discovered[peripheral.uuid];

      if (!Beacon) {
        Beacon = {};
      }

      Beacon.uuid = uuid;
      Beacon.major = major;
      Beacon.minor = minor;
      Beacon.measuredPower = measuredPower;
      Beacon.rssi = rssi;
      Beacon.accuracy = accuracy;
      Beacon.proximity = proximity;

      this._discovered[peripheral.uuid] = Beacon;

      debug('onDiscover: Beacon = %s', JSON.stringify(Beacon));

      this.emit('discover', Beacon);
    }
  }
};

module.exports = Beacon;
