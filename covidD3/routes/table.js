var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('table', { title: 'Table' });
});

router.get('/detail',function(req,res,next){
  res.send('detail');
});

module.exports = router;
