var constants = require('../utils/constants.js');

const stateGame = constants.stateGame;

function generateToken(){
    var date = new Date();
    var token = '';

    for(var i = 0; i < 5; i++){
        token += Math.floor(Math.random() * (10000 + 1));
    }
    
    token += date.getTime();
    
    return token;
}

function win(field){
    var win_comb = [7, 56, 73, 84, 146, 273, 292, 448];
    
    for(var i = 0; i < win_comb.length; i++){
        if ( (field & win_comb[i]) === win_comb[i] ){
           return true; 
        }
    }
    return false;
}

function tie(field1, field2){
    return (field1 | field2) === 511;
}

function changeState(cur_state, field1, field2){
    if(win(field1)) return stateGame.end.first;
    if(win(field2)) return stateGame.end.second;
    if(tie(field1, field2)) return stateGame.end.tie;
    if(cur_state === stateGame.turn.first) return stateGame.turn.second;
    if(cur_state === stateGame.turn.second) return stateGame.turn.first;
}

function occupied(pos, field1, field2){
    var pos_mask = 1 << pos;
    return !(((field1 | field2) & pos_mask) === 0);
}

module.exports.generateToken = generateToken;

module.exports.win = win;

module.exports.tie = tie;

module.exports.changeState = changeState;

module.exports.occupied = occupied;