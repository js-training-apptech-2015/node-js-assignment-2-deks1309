const express = require('express');

var GameModel = require('../database/connection.js').GameModel;
var constants = require('../utils/constants.js');
var functions = require('../utils/functions.js');

const stateGame = constants.stateGame;
const listError = constants.listError;
const empty_field = constants.empty_field;

var generateToken = functions.generateToken;
var win = functions.win;
var tie = functions.tie;
var changeState = functions.changeState;
var occupied = functions.occupied;

var router = express.Router();

router.get('/games', function(req, res, next){
    return GameModel.find(null, '-__v', function(err, games){
        if(!err){
            console.info('Game list sended.');
            return res.send(games);       
        }else{
            console.error('Internal error(500):'+ err.message);
            return next(listError.server_error);
        }
    })
});

router.post('/games', function(req, res, next){
    var game = new GameModel({
        token: generateToken(),
        type: req.body.type,
        field1: empty_field,
        field2: empty_field,
        state: stateGame.turn.first
    });
    
    game.save(function(err, model){
        if(!err){
            GameModel.findOne(model, '-__v', function (err, game) {
                if (!err){ 
                    res.statusCode = 201;
                    console.info('Game created.');
                    res.send(JSON.stringify(game));
                }else{
                    console.error('Internal error(500):'+ err.message);
                    return next(listError.server_error);
                }
            });
        }else{
            if(err.name == 'ValidationError') {
                return next(listError.valid_error);
            } else {
                console.error('Internal error(500):'+ err.message);
                return next(listError.server_error);
            }
            
        }
    })
});

router.get('/games/:id', function(req, res, next){
    GameModel.findOne({token: req.params.id}, '-__v', function (err, game) {
        if(!game || game.length === 0){
            return next(listError.notFound);
        }
        if (!err){ 
            res.statusCode = 200;
            console.info('Game found.');
            res.send(JSON.stringify(game));
        }else{
            console.error('Internal error(500):'+ err.message);
            return next(listError.server_error);
        }
    });    
})

router.put('/games/:id', function(req, res, next){
    return GameModel.findOne({token: req.params.id}, '-__v', function (err, game) {
        if(!game || game.length === 0){
            return next(listError.notFound);
        }
        if (!err){ 
            if(req.body.position < 9){
                switch(game.state){
                    case stateGame.turn.first: {
                        if(req.body.player !== 1){
                            return next(listError.wrongTurn);
                        }                    
                        if(occupied(req.body.position, game.field1, game.field2)){
                            return next(listError.occCell);
                        }
                        
                        game.state = changeState(game.state, game.field1, game.field2);
                        
                        var pos_mask = 1 << req.body.position;
                        game.field1 = game.field1 | pos_mask;
                        break;
                    };
                    case stateGame.turn.second: {
                        if(req.body.player !== 2){
                            return next(listError.wrongTurn);
                        }                    
                        if(occupied(req.body.position, game.field1, game.field2)){
                            return next(listError.occCell);
                        }
                        
                        game.state = changeState(game.state, game.field1, game.field2);
                        
                        var pos_mask = 1 << req.body.position;
                        game.field2 = game.field2 | pos_mask;
                        break;
                    };
                }
                return game.save(function(err){
                    if(err){
                        if(err.name == 'ValidationError') {
                            return next(listError.valid_error);
                        } else {
                            console.error('Internal error(500):'+ err.message);
                            return next(listError.server_error);
                        }
                    }
                    res.statusCode = 200;
                    console.info('Game updated');
                    res.send(JSON.stringify(game));
                });
            }else{
                return next(listError.wrongPos);
            }
        }else{
            console.error('Internal error(500):'+ err.message);
            return next(listError.server_error);
        }
    });    
})

module.exports = router;

