var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/hist',function(req,res,next){
  res.render('hist', { title: 'First confirmed case' });
});

router.get('/line',function(req,res,next){
  res.render('line', { title: 'Line Chart' });
});

module.exports = router;
