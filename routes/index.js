var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mqtt    = require('mqtt');
var util = require('util');

var client  = mqtt.connect('mqtt://192.168.1.1');

var conn = mysql.createPool({
  host    :'localhost',
  port : 3306,
  user : 'root',
  password : 'root',
  database:'foo'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/switch', function(req,res,next) {
  conn.getConnection(function(err, connection) {
    if ( err )
      console.log (err);
    connection.query('SELECT * FROM switch', function (err, rows) {
      if (err) console.error("err : " + err);
      //console.log("rows : " + JSON.stringify(rows));

      res.render('index', {title: 'test', rows: rows});
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
    var state = {
      'name' : req.query.name,
      'state' : req.query.state,
      'num' : req.query.num
    };
    connection.query('insert into switch set?', state, function(err, result) {
      if ( err )
        console.log(err);
      else {
        console.log(result);
        console.log('insert success');
      }
    });
  })
})

router.get('/switch/:user', function(req,res,next) {
  console.log(req.params.user);

  conn.getConnection(function(err, connection) {
    if (err)
      console.log(err);
    connection.query('SELECT * FROM switch order by id desc limit 1', function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows[0]));

      //res.render('index', {title: 'test', rows: rows});
      res.end(JSON.stringify(rows[0]));
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

module.exports = router;
