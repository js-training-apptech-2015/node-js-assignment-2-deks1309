module.exports.stateGame = {
    turn:{
        'first': 'first-player-turn',
        'second': 'second-player-turn'
    },
    end:{
        'tie': 'tie',
        'first': 'first-player-wins',
        'second': 'second-player-wins'
    }
}

module.exports.listError = {
    "server_error": {status: 500, message: 'Server error.'},
    "valid_error": {status: 400, message: 'Validation error.'},
    "notFound": {status: 404, message: 'Not found'},
    "wrongTurn": {status: 400, message: 'Wrong turn'},
    "occCell": {status: 400, message: 'Occupied cell'},
    "wrongPos": {status: 400, message: 'Wrong position'}
}

module.exports.empty_field = 0