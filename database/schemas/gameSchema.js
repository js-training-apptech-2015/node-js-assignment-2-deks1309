const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Game = new Schema({
    token:{
        type: String,
        unique: true,
        validate: {
            validator: function(v){
                return /\d{32}/.test(v);
            },
            message: '{VALUE} is not a valid token!'
        }
    },
    type:{
        type: Number,
        validate: {
            validator: function(v){
                return v == 0;
            },
            message: '{VALUE} is not a valid type! (only 0)'
        }
    },
    field1:{
        type: Number
    },
    field2:{
        type: Number
    },
    state:{
        type: String,
        lowercase: true
    }
});

module.exports = Game;