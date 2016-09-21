var Beacon = require('./lib/beacon');

var beacon = new Beacon();

beacon.BleuStation = require('./bleu-station/bleu-station');
beacon.Estimote = require('./estimote/estimote');
beacon.EstimoteSticker = require('./estimote-sticker/estimote-sticker');

module.exports = {
  beacon: beacon
}
