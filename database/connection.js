const mongoose = require('mongoose');
const conf = require('../config');

var gameSchema = require('./schemas/gameSchema.js');

mongoose.connect(conf.dburi);
var db = mongoose.connection;

db.on('error', function(err){
    console.error('Connection error:', err.message);
})

db.once('open', function(){
    console.info('Connected to DB.');
})

var GameModel = mongoose.model('Game', gameSchema);

module.exports.GameModel = GameModel;

