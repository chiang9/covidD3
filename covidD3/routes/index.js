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

router.get('/groupBar',function(req,res,next){
  res.render('groupBar', { title: 'Group Bar' });
});

router.get('/scatter',function(req,res,next){
  res.render('scatter', { title: 'Scatter' });
});

router.get('/stack',function(req,res,next){
  res.render('stack', { title: 'Stack' });
});

module.exports = router;
