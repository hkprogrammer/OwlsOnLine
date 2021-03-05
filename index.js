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
const myClassRouting = require(__dirname + '/router/myClass.js')


// Constants
const PORT = 3000;
const HOST = 'localhost';
var privateKey = fs.readFileSync(__dirname + '/ssl/rootCA.key','utf8');
var certificate = fs.readFileSync(__dirname + '/ssl/rootCA.crt','utf8');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Environment
process.env.NODE_ENV = 'development';
switch(process.env.NODE_ENV){
  case "development":
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      break
  case "production":
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
      break
  default:
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
      break
}


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
app.use('/myClass', myClassRouting)



// app.listen(PORT,()=>{
//   console.log(`Running on http://${HOST}:${PORT}`);
// });









//route template
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

