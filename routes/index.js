var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function(req,res){
    res.render('home',{
      title : 'Home',
      style : 'homecss.css',
      script : 'homescript.js'
    });
});

module.exports = router;
