var express = require('express');
var router = express.Router();
var fs = require('fs');
const sqlite3 = require('sqlite3')
var database = require('../db/db.js')


router.post('/test', function (req, res) {
 
})


router.get('/about', function (req, res) {
 database.close();
})

router.post('/sendDataWithHTTPs', (req,res)=>{
  
  var username = "";
  var password = "";
  console.log(req.body.name)
  console.log(req.body);
  // var wrapper = {req};
  // var data = JSON.stringify(wrapper);
  // fs.writeFileSync('./log/log.txt', data, (err)=>{
  //   if (err) throw err;
  // })
  res.send("a username and password display here")
});


module.exports = router;