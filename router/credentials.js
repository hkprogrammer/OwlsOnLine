//libraries
const express = require('express');
const md5 = require('md5')
const fs = require('fs')

//express router
var router = express.Router();

// modules import
var database = require('../db/db.js');

var session = require(__dirname + '/modules/session.js')
var logging = require(__dirname + "/modules/log.js");



//open Salt file
var salt = String(fs.readFileSync(__dirname + '/credentials/salt.txt'))

//Login route
router.post('/login', (req, res) =>{
    
    //data of incoming http request
    let data = req.body;

    var incomingUsername = data["username"]
    var incomingPassword = data["password"]
    var rememberMe = Boolean(data["remember-me"])
    //hashed with salt
    var hashedPassword = md5(salt + incomingPassword)
    
    database.all("SELECT * FROM users", (err, rows)=>{
        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
        
                    
        let found = false;
        for(let i=0;i<rows.length;i++){
            if(rows[i]["username"] == incomingUsername){
                found = true;
                var passwordID = rows[i]["passwordID"]
                var userID = rows[i]["userID"]
                database.all(`SELECT * FROM credentials WHERE ID=${passwordID}`, (err, rows)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                      
                    //console.log(rows[0]["hashedPass"], hashedPassword)
                    if(String(rows[0]["hashedPass"]) == String(hashedPassword)){
                        var sessionValue = new session().createSession();
                        //console.log(sessionValue)
                        let response = {
                            "status": "success",
                            "sessionValue" : sessionValue,
                            "userID" : userID,
                            "remember-me" : rememberMe
                        }
                        //do Date Created Later
                        let sql = ` SELECT userID,
                                    CASE
                                        WHEN userID = ${userID} THEN "True"
                                        ELSE "False"
                                    END AS Result
                                    FROM session`
                        database.all(sql, (err, rows)=>{
                            if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                            
                            // let sessionFound = false;
                            // for(let i=0;i<rows.length;i++){
                            //     if(rows[i]["Result"] == "True"){
                            //         sql = `UPDATE session SET sessionValue="${sessionValue}" WHERE userID=${userID}`
                            //         sessionFound = true
                            //     }
                        
                            // }
                            // if(!sessionFound){
                            //     sql = `INSERT INTO session(userID, sessionValue) VALUES(${userID},"${sessionValue}")`
                        
                            // }
                            
                            database.all(`SELECT sessionID FROM session ORDER BY sessionID ASC`, (err, rows)=>{
                                if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                                
                                
                                //find current highest value of SesionID and increment by one to create new session ID.
                                let max = 0;
                                for(let i=0;i<rows.length;i++){
                                    if(rows[i]["sessionID"] > max){
                                        max = rows[i]["sessionID"]
                                    }
                                }
                                max++;
                                sql = `INSERT INTO session(userID, sessionValue, sessionID) VALUES(${userID},"${sessionValue}", ${max})`

                                database.run(sql)
                                res.send(response)
                            })

                            
                        })
                        
                    }
                    else{
                        let response = {
                            "status": "failure",
                            "message" : "invalidLogin"
                        }
                        res.send(response)
                    }

                })

            }
        }
        if(found == false){
            let response = {
                "status": "failure",
                "message" : "invalidLogin"
            }
            res.send(response)
        }

       
    })
})

// logout route
router.post('/logout',(req, res)=> {
    
    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]

    database.all(`SELECT * FROM session`, (err, rows)=>{
        let f = false; //temporary flag
        for(let i=0;i<rows.length;i++){
            if(Number(rows[i]["userID"]) == Number(incomingUserID) && String(rows[i]["sessionValue"] == String(incomingSessionValue))){
                database.run(`DELETE FROM session WHERE sessionID=${rows[i]["sessionID"]}`)
                f = true;
                res.send({"status": "success"})
                
                break
            }
            
        }
        if(f == false){
            res.send({"status": "failure"})
        }
    })

})

router.post('/validateSession', (req,res)=>{

    var data = req.body;
    var incomingUserID = Number(data["userID"])
    var incomingSessionValue = String(data["sessionValue"])
    //console.log(data)
    database.all(`SELECT * FROM session`, (err, rows)=>{
        if(err){
            new logging(`Err ${err}`, "Errors").writeLog()
            throw err
        }
        
        let foundSessionValue = false;
        for(let i=0;i<rows.length;i++){
            //console.log(rows)
            if(Number(rows[i]["userID"])== Number(incomingUserID)){
                if(String(rows[i]["sessionValue"]) == String(incomingSessionValue)){
                    
                    let responsePacket = {
                        "status" : "success",
                        "expireDate" : ""
                    }
                    foundSessionValue = true
                    res.send(responsePacket)
                    
                    break
                }
                
                else{
                    
                    console.log("Invalid Entry")
                }
                console.log(rows[i],data["sessionValue"])
            }
            
        }
        if(!foundSessionValue){
            let responsePacket = {
                "status" : "failure",
                "expireDate" : ""
            }
            
            res.send(responsePacket)
            
        }

    })

})

router.post("/register",(req,res)=>{

    var data = req.body;
    var incomingUsername = data["username"]
    var incomingFullname = data["fullName"];
    var incomingRole = data["role"];
    var incomingEmail = data["email"]
    var incomingPassword = data["password"]
    // if( isEmpty(incomingFullname) ||
    //     isEmpty(incomingUsername) || 
    //     isEmpty(incomingRole) ||
    //     isEmpty(incomingEmail)  ||
    //     isEmpty(incomingPassword)){
    //         res.send({"status":"failure"})
    //     }
    // else{

    var hashedPassword = md5(salt + incomingPassword)
    let sql = `SELECT * FROM users`
    //database query for if user exist already
    database.all(sql, (err, rows)=>{
        let found = false;
        for(let i =0;i<rows.length;i++){
            if(rows[i]["username"] == incomingUsername){
                res.send({
                    "status" : "invalid",
                    "message" : "Username taken"
                })
                console.log("username taken during registration")
                let l = new logging(`username taken during registration for ${incomingUsername}`, "credentials").writeLog()
                found = true;
                break
            }
        }
        var highestIDNum = 1
        for(let i=0;i<rows.length;i++){
            if(Number(rows[i]["userID"]) > highestIDNum){
                highestIDNum = Number(rows[i]["userID"])
            }
        }
        var userID = Number(highestIDNum) + 1
        
        if(!found){
            
            

            //database query for passwordIDs
            sql = `SELECT * FROM credentials`
            database.all(sql, (err,rows)=>{
                let highestIDNum = 1;
                for(let i=0;i<rows.length;i++){
                    if(Number(rows[i]["ID"]) > highestIDNum){
                        highestIDNum = Number(rows[i]["ID"])
                    }
                }
                
                if(highestIDNum < 1){
                    console.log("error at fetching password ID")
                    let log = new logging("Failure fetching password ID numerical data", "credentials").writeLog()
                    res.send({"status": "failure", "message" : "error"})

                }
                else{
                    let passID = highestIDNum + 1;
                    //default title is null, priviledge is 1
                    sql = `INSERT INTO users(username,passwordID,userID,fullName,role,priviledge) 
                    VALUES("${incomingUsername}",${passID},${userID},"${incomingFullname}","${incomingRole}",1)`
                   
                    database.run(sql, (err)=>{
                        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                        
                    })

                    database.run(`INSERT INTO credentials(ID,hashedPass) VALUES (${passID},"${hashedPassword}")`)
                    res.send({
                        "status": "success"
                    })
                    let msg = `Successfully created user ${incomingUsername}, email ${incomingEmail}, and role of ${incomingRole}`
                    let l = new logging(msg, "credentials").writeLog();
                    
                } 

            })
        }
        
        
    })

    // }
    

})

router.post("/queryInformations", (req,res)=>{

    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]
    
    let sql = `SELECT * FROM session`
    database.all(sql, (err,rows)=>{
        let foundFlag = false;
        for(let i = 0; i <rows.length;i++){
            if(rows[i]["sessionValue"] == incomingSessionValue
                && rows[i]["userID"] == incomingUserID){
                
                foundFlag = true;

            }
        }
        if(foundFlag){
            
            sql = `SELECT * FROM users WHERE userID=${incomingUserID}`;
            database.all(sql, (err,rows)=>{
                let msg = {
                    "status": "success",
                    "username" : rows[0]["username"],
                    "userID" : rows[0]["userID"],
                    "fullName" : rows[0]["fullName"],
                    "title" : rows[0]["title"],
                    "role" : rows[0]["title"],
                    "priviledge" : rows[0]["priviledge"]
                }
                res.send(msg)
                //let l = new logging(`User ${incomingUserID} with ${incomingSessionValue} is attempting to query information, this action was successful.` + JSON.stringify(msg), "credentials").writeLog();

            })

        }
        else{
            let msg = {
                "status": "invalid",
                "message" : "User not found, re-login again. This incident of invalid entry is logged."
            }
            res.send(msg)
            let l = new logging(`User ${incomingUserID} with ${incomingSessionValue} is attempting to query information but was rejected with an invalid entry, this incident is logged.`, "credentials").writeLog();
            console.log(`User ${incomingUserID} with ${incomingSessionValue} is attempting to query information but was rejected with an invalid entry, this incident is logged.`)
        }
    })

})




function isEmpty(input){
    input = String(input)
    if(input == "" || input == " " || input == null){
        return true
    }
    return false
}


module.exports = router;