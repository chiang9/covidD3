var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index2', { title: 'Express' });
});

router.get('/detail',function(req,res,next){
  res.send('detail');
});

module.exports = router;
