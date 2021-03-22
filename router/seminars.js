//const
const { response } = require('express');
const express = require('express');
const axios = require('axios');


//modules
var router = express.Router();
var database = require('../db/db.js');
var logging = require(__dirname + "/modules/log.js");
var port = require(__dirname + '/modules/port.js')

/**
 * input arguments
 * {
 *      "userID" : userID,
		"sessionValue" : sessionValue,
		"typedResponse" : typedResponse, //in base64
		"classID" : localStorage.getItem("tClassID"),
		"assignmentID" : localStorage.getItem("tAssignmentID"),
        "topicID" : number(topicID)
    }
 */

router.post("/publishSeminarQuote", (req,res)=>{
    
    var data = req.body;

    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]
    var incomingTypedResponse = data["typedResponse"]
    var incomingClassID = data["classID"]
    var incomingAsignmentID = data["assignmentID"]
    var incomingTopicID = data["topicID"]


    axios({
        method: 'post',
        url: 'https://127.0.0.1:' + new port().portNumber() + '/credentials/validateSession',
        data: { 
            "userID": incomingUserID,
            "sessionValue" : incomingSessionValue
        }
        }).then((response) => {
        //response.data -> {rows : [], status: String}
            if(response.data["status"] == "success"){
               
                let sql = `SELECT entryID FROM seminarEntry`
                database.all(sql, (err, rows)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                    let maximumNumber = 0;
                  
                    for(let i=0;i<rows.length;i++){
                        if(Number(rows[i]["entryID"]) > maximumNumber){
                           
                            maximumNumber = Number(rows[i]["entryID"])
                            
                        }
                    }
                    
                    maximumNumber++
                
                    let entryID = Number(maximumNumber);

                
                    sql = `INSERT INTO seminarEntry(entryID,studentID,classID,assignmentID,textEntry,topicID) VALUES(${entryID},${incomingUserID},${incomingClassID},${incomingAsignmentID},"${String(incomingTypedResponse)}",${incomingTopicID})`

                    database.all(sql, (err, rows)=>{
                        if(err){
                            new logging(`Err ${err}`, "Errors").writeLog()
                            throw err
                        }

                        let respondPacket = {

                            "status" : "success"
                        }
                        res.send(respondPacket)

                    })

                })

                
            
            }
            else{
                let responsePacket = {
                    "status" : "failure"
                }
                res.send(responsePacket)
            }
        


        }, (error) => {
            new logging(`Err ${error}`, "Errors").writeLog()
            console.error(error)
    });

})


/**
 * incoming arguments
 * {
 *      "userID" : userID,
        "sessionValue" : localStorage.getItem("sessionValue"),
		"topicName" : topicName,
		"topicColor" : color,
        "seminarID" : seminarID
    }
 * 
 * 
 */

router.post("/createSeminarTopic", (req, res)=>{

    var data = req.body;
    var incomingTopicName = data["topicName"]
    var incomingTopicColor = data["topicColor"]
    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]
    var incomingSeminarID = data["seminarID"]

    axios({
        method: 'post',
        url: 'https://127.0.0.1:' + new port().portNumber() + '/credentials/validateSession',
        data: { 
            "userID": incomingUserID,
            "sessionValue" : incomingSessionValue
        }
        }).then((response) => {
        //response.data -> {rows : [], status: String}
            if(response.data["status"] == "success"){

                
                let sql = `SELECT topicID FROM seminarTopic`;
                database.all(sql, (err, rows)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                    let maximumNumber = 0;
                  
                    for(let i=0;i<rows.length;i++){
                        if(Number(rows[i]["topicID"]) > maximumNumber){      
                            maximumNumber = Number(rows[i]["topicID"])    
                        }
                    }
                    maximumNumber++
                    let topicID = Number(maximumNumber);

                    sql = `INSERT INTO seminarTopic(topicName,seminarID,topicColor,topicID) VALUES("${incomingTopicName}", ${incomingSeminarID},"${incomingTopicColor}",${topicID})`    
                    
                    database.all(sql, (err, rows)=>{
                        if(err){
                            new logging(`Err ${err}`, "Errors").writeLog()
                            throw err
                        }

                        let respondPacket = {
                            "status" : "success"

                        }
                        res.send(respondPacket)

                    })

                })
                
            
            }
            else{
                let responsePacket = {
                    "status" : "failure"
                }
                res.send(responsePacket)
            }
        


        }, (error) => {
            new logging(`Err ${error}`, "Errors").writeLog()
            console.error(error)
    });

})

/**
 * incoming arguments
 * {
		"seminarID" : seminarID
    }
 * 
 */
router.post("/loadSeminarTopics", (req,res)=>{

    var data = req.body;
    var incomingSeminarID = data["seminarID"]

    let sql = `SELECT * FROM seminarTopic WHERE seminarID=${incomingSeminarID} ORDER BY topicName ASC`

    database.all(sql, (err, rows)=>{
        if(err){
            new logging(`Err ${err}`, "Errors").writeLog()
            throw err
        }
        let responsePacket = {
            "status" : "success",
            "topicRows" : rows
        }
        sql = `SELECT * FROM seminarEntry WHERE assignmentID=${incomingSeminarID} ORDER BY entryID ASC`
        database.all(sql, (err,rows)=>{
            if(err){
                new logging(`Err ${err}`, "Errors").writeLog()
                throw err
            }
            let seminarEntry = rows
            responsePacket["entryRows"] = rows
            //console.log(rows)
            sql = `SELECT username,userID,fullName,role,priviledge FROM users`
            database.all(sql,(err,rows)=>{
                if(err){
                    new logging(`Err ${err}`, "Errors").writeLog()
                    throw err
                }
                let listOfStudents = []
                for(let i=0;i<rows.length;i++){
                    for(let n=0;n<seminarEntry.length;n++){
                        if(rows[i]["userID"] == seminarEntry[n]["studentID"]){
                            listOfStudents.push(rows[i])
                        }
                    }
                   
                }
                responsePacket["studentInfo"] = listOfStudents
                res.send(responsePacket)

            })

        })

    })

})

/**
 * 
 * {
		"userID" : userID,
        "sessionValue" : localStorage.getItem("sessionValue"),
		"topicID" : topicID
	}
 * 
 * 
 */


router.post("/deleteSeminarTopic", (req,res)=>{

    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingSessionValue = data["userID"]
    var incomingTopicID= data["topicID"]

    axios({
        method: 'post',
        url: 'https://127.0.0.1:' + new port().portNumber() + '/credentials/validateSession',
        data: { 
            "userID": incomingUserID,
            "sessionValue" : incomingSessionValue
        }
        }).then((response) => {
        //response.data -> {rows : [], status: String}
            if(response.data["status"] == "success"){

              
                let sql = `DELETE FROM seminarTopic WHERE topicID=${incomingTopicID}`
                database.all(sql, (err, rows)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                    sql = `UPDATE seminarEntry SET topicID=0 WHERE topicID=${incomingTopicID}`
                    database.all(sql,(err, rows)=>{
                        if(err){
                            new logging(`Err ${err}`, "Errors").writeLog()
                            throw err
                        }
                        let respondPacket = {"status":"success"}
                        res.send(respondPacket)
                    })

                })
                
            
            }
            else{
                let responsePacket = {
                    "status" : "failure"
                }
                res.send(responsePacket)
                console.log("failure")
            }
        


        }, (error) => {
            new logging(`Err ${error}`, "Errors").writeLog()
            console.error(error)
    });

})



// if(err){
//     new logging(`Err ${err}`, "Errors").writeLog()
//     throw err
// }


// axios({
//     method: 'post',
//     url: 'https://127.0.0.1:3000/credentials/validateSession',
//     data: { 
//         "userID": incomingUserID,
//         "sessionValue" : incomingSessionValue
//     }
//     }).then((response) => {
//     //response.data -> {rows : [], status: String}
//         if(response.data["status"] == "success"){

           
//         }
//         else{
//             let responsePacket = {
//                 "status" : "failure"
//             }
//             res.send(responsePacket)
//         }
    


//     }, (error) => {
//         new logging(`Err ${err}`, "Errors").writeLog()
//         console.error(error)
// });

module.exports = router;