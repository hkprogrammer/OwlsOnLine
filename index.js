'use strict';


//libraries imports
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const e = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3')


//routing imports
const routerRouting = require(__dirname + '/router/index.js');
const systemRouting = require(__dirname + '/router/system.js')
const credentialsRouting = require(__dirname + '/router/credentials.js')



// Constants
const PORT = 3000;
const HOST = 'localhost';
var privateKey = fs.readFileSync(__dirname + '/ssl/server.key','utf8');
var certificate = fs.readFileSync(__dirname + '/ssl/server.cert','utf8');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//SSL
var credentials = {
  key: privateKey,
  cert: certificate
  
}
//app
var app = express();


https.createServer(credentials, app).listen(PORT, function () {
  console.log('Go to https://localhost:3000/')
})



//configurations
app.use(bodyParser.urlencoded({
  extended: true
}));

//Frontview
app.use(bodyParser.json());
app.use(express.static('public'));

//Routings
app.use('/index',routerRouting);
app.use('/system',systemRouting);
app.use('/credentials',credentialsRouting);




// app.listen(PORT,()=>{
//   console.log(`Running on http://${HOST}:${PORT}`);
// });









//route template
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

