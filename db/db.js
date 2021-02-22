const sqlite3 = require('sqlite3').verbose();

var  db = new sqlite3.Database(__dirname + "/master.sqlite3",sqlite3.OPEN_READWRITE ,(err)=>{
    if(err) throw err;
    console.log("Connected to database")
})
db.run('CREATE TABLE IF NOT EXISTS testing (number INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, passwordID INTEGER, userID INTEGER, fullName TEXT, title TEXT, role TEXT, privilege INTEGER, dateCreated)');
db.run('CREATE TABLE IF NOT EXISTS credentials (ID INTEGER, hashedPass TEXT, dateCreated TEXT)');
db.run('CREATE TABLE IF NOT EXISTS session (userID INTEGER, sessionValue TEXT, dateCreated TEXT, dateExpire TEXT)');

module.exports = db;