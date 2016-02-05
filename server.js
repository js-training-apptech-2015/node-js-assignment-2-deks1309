const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const conf = require('./config.json');
const router = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use('/', router);
app.use(function(err, req, res, next){
    res.statusCode = err.status || 500;
    res.send(err.message || err);
});

app.listen(conf.port);

