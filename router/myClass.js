
//const
const { response } = require('express');
const express = require('express');
const axios = require('axios');


//modules
var router = express.Router();
var database = require('../db/db.js');
var logging = require(__dirname + "/modules/log.js");



//createClass function to create class by teachers
/**
 * 
 * Input arguments 
 * {
 *  "className" : className,
    "teacherName" : teacherName,
    "classCategory" : classCategory,
    "zoomLink" : classZoom,
    "userID" : localStorage.getItem("userID")
 * }
 * 
 */
router.post('/createClass', function (req, res) {

    var data = req.body;
    var incomingClassName = data["className"]
    var incomingTeacherName = data["teacherName"]
    var incomingClassCategory = data["classCategory"]
    var incomingZoomLink = data["zoomLink"]
    var incomingUserID = data["userID"]

    let sql = `SELECT classID FROM myClass`
    database.all(sql, (err, rows)=>{
        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
        ;
        let highestValue = 0;
        for(let i =0;i<rows.length;i++){
            if(Number(rows[i]["classID"]) > Number(highestValue)){
                highestValue = rows[i]["classID"]
               
            }
        }
        var classID = highestValue + 1;
        
        if(incomingZoomLink.length > 0){
            sql = `INSERT INTO myClass(classID, className, classTeacherID, classZoom, classDepartment, classTeacherName, classStudentsID) VALUES(${classID}, "${incomingClassName}",${incomingUserID},"${incomingZoomLink}","${incomingClassCategory}","${incomingTeacherName}","0,0")`

        }
        else{
            sql = `INSERT INTO myClass(classID, className, classTeacherID, classDepartment, classTeacherName, classStudentsID) VALUES(${classID}, "${incomingClassName}",${incomingUserID},"${incomingClassCategory}","${incomingTeacherName}","0,0")`

        }
        database.all(sql,(err, rows)=>{
            if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
            ;
            res.send({
                "status" : "success",
                "classID" : classID
            })
            let l = new logging(`Successfully Created Class ${incomingClassName} with classID of ${classID} taught by ${incomingTeacherName}`, "myClass").writeLog()
        })


    })
    
    
 
})


/**
 * 
 * incoming arguments:
 * {
 *      "userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessionValue")
 * 
 * }
 *  
 * 
 * 
 */
router.post("/loadClass", (req,res)=>{
    
    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]
    
    
    //same code from credentials.js 
    database.all(`SELECT * FROM session`, (err, rows)=>{
        if(err){
            new logging(`Err ${err}`, "Errors").writeLog()
            throw err
        }
        
        let foundSessionValue = false;
        for(let i=0;i<rows.length;i++){
            
            if(Number(rows[i]["userID"])== Number(incomingUserID)){
                if(String(rows[i]["sessionValue"]) == String(incomingSessionValue)){
                 
                    foundSessionValue = true
                    
                    let sql = `SELECT * FROM users WHERE userID=${incomingUserID}`
                    database.all(sql, (err, rows)=>{
                        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                        
                        

                        let priviledge = rows[0]["priviledge"]

                        sql = `SELECT * FROM myClass`
                        database.all(sql, (err,rows)=>{

                            let foundFlag = false
                            let rowNumber = []
                            outer:
                            for(let i = 0;i<rows.length;i++){
                                if(priviledge > 1 && priviledge != 5){

                                    if(Number(rows[i]["classTeacherID"]) == incomingUserID){
                                        foundFlag = true
                                        rowNumber.push(i)
                                        //console.log(rows[i],{ rowNumber } )
                                    }

                                    //for(let i=0;i<rows[])
                                }
                                else if(priviledge == 5){
                                    
                                    for(let i = 0 ;i<rows.length;i++){
                                        rowNumber.push(i)
                                    }
                                    
                                    foundFlag = true
                                    break outer
                                }
                                else if(priviledge == 1){
                                    //onsole.log(rows[i])
                                    
                                    let splitStudentID;
                                   
                                    if(rows[i]["classStudentsID"] != null && rows[i]["classStudentsID"] != ""){
                                        splitStudentID = rows[i]["classStudentsID"].split(",")
                                        for(let n =0;n<splitStudentID.length;n++){
                                            if(splitStudentID[n] == incomingUserID){
                                                //return student information
                                                rowNumber.push(i)
                                                foundFlag = true
                                                break
                                            }
                                        }
                                    }
                                    else{
                                        
                                        foundFlag = false;
                                        break outer
                                    }
                                    
                                    
                                    
    
                                }
                                
                            }
                            //console.log({rowNumber,foundFlag,incomingUserID,priviledge})
                            //return err
                            if(foundFlag == false){
                                let responsePacket = {
                                    "status" : "failure"
                                    
                                }
                                res.send(responsePacket)
                                
                            }
                            else{
                                let responsePacket = {"rows": []}
                                for(let i = 0;i<rowNumber.length;i++){
                                    responsePacket["rows"].push(rows[rowNumber[i]])
                                    
                                }
                                 
                                responsePacket["status"] = "success"
                              
                                res.send(responsePacket)
                            }
                            


                        })


                    })

                    break
                }
                else{
                    
                }
            }
            
        }
        if(!foundSessionValue){
            let responsePacket = {
                "status" : "failure"
            }
            res.send(responsePacket)
            
        }

    })



})

/** 
 * 
 * input arguments
 *  {
        "assignmentName" : assignmentName String,
        "assignmentType" : assignmentType String,
        "assignmentDueDate" : assignmentDueDate String (Yes String, in format MM-DD-YY),
        "userID" : localStorage.getItem("userID"),
        "classID" : classID
    }
 * 
 * 
*/

router.post("/createAssignment", (req,res)=>{
    
    var data = req.body;
    var incomingAssignmentName = data["assignmentName"]
    var incomingAssignmentType = data["assignmentType"]
    var incomingAssignmentDueDate = data["assignmentDueDate"]
    var incomingTeacherID = data["userID"]
    var incomingClassID = data["classID"]
    
    let sql = `SELECT * FROM users`
    database.all(sql, (err, rows)=>{
        if(err){
            new logging(`Err ${err}`, "Errors").writeLog()
            throw err
        }
        

        let foundFlag = false;
        let teacherFullName = ""
        for(let i=0;i<rows.length;i++){
            if(rows[i]["userID"] == incomingTeacherID && Number(rows[i]["priviledge"]) > 1){
                teacherFullName = rows[i]["fullName"]
                foundFlag = true;
                break
            }
        }
        if(foundFlag = false){
            let responsePacket = {
                "status" : "failure"
            }
            res.send(responsePacket)
        }
        else{
            sql = `SELECT assignmentID FROM assignment`
            database.all(sql, (err, rows)=>{
                if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                

                let maximumNumber = 0;
                for(let i =0;i<rows.length;i++){
                    if(Number(rows[i]["assignmentID"]) > maximumNumber){
                        maximumNumber = Number(rows[i]["assignmentID"])
                    }
                }
                let assignmentID 
                if(maximumNumber == 0){
                    assignmentID = 1
                }
                else{
                    assignmentID = maximumNumber + 1;
                }
                
            
                sql = `INSERT INTO assignment(assignmentID, assignmentName, assignmentDueDate, assignmentTeacher,assignmentClassID, assignmentTeacherID, assignmentType)
                                      VALUES(${assignmentID}, "${incomingAssignmentName}", "${incomingAssignmentDueDate}","${teacherFullName}",${incomingClassID},${incomingTeacherID},"${incomingAssignmentType}")    `
                database.run(sql,(err)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                   
                    new logging(`Created Assignment ${incomingAssignmentName} with ID ${assignmentID}`, "myClass").writeLog()
                        
                    let responsePacket = {
                        "status" : "success",
                        "assignmentID" : assignmentID
                    }
                    res.send(responsePacket)

                })
                
            })
        }

    })

})
/**
 * incoming arguments
 * {
       "userID" : userID,
       "classID" : classID,
       "sessionValue" : localStorage.getItem("sessionValue")
    }
 */
router.post("/loadAssignment", (req,res)=>{
    
    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingClassID = data["classID"]
    var incomingSessionValue = data["sessionValue"]

    let sql = `SELECT * FROM assignment WHERE assignmentClassID=${incomingClassID}`
    database.all(sql, (err, rows)=>{
        if(err){
            new logging(`Err ${err}`, "Errors").writeLog()
            throw err
        }
        let respondPacket = {
            "rows": rows,
            "status": "success"
        }
        res.send(respondPacket)
        

    })


    //hold on to, might need later
    // axios({
    //     method: 'post',
    //     url: 'https://127.0.0.1:3000/myClass/loadClass',
    //     data: {
    //       "userID": incomingUserID,
    //       "sessionValue" : incomingSessionValue
    //     }
    //   }).then((response) => {
    //     //response.data -> {rows : [], status: String}
    //     let searchClassList = []
    //     // for(let i=0;i<response.data["rows"].length;i++){
    //     //     searchClassList.push(response.data["rows"][i]["classID"])
    //     // }
    //     let sql = `SELECT * FROM assignment `
        


    //   }, (error) => {
    //     new logging(`Err ${err}`, "Errors").writeLog()
    //     console.error(error)
    //   });


})


/**
 * 
 * Input arguments
 * {
 *     "userID" : userID,
       "assignmentID" : assignmentID,
 * }
 * 
 */
router.post("/deleteAssignment", (req,res)=>{

    var data = req.body;
    var incomingUserID = data["userID"];
    var incomingAssignmentID = data["assignmentID"]
    var incomingSessionValue = data["sessionValue"]
    
    axios({
        method: 'post',
        url: 'https://127.0.0.1:3000/credentials/validateSession',
        data: { 
            "userID": incomingUserID,
            "sessionValue" : incomingSessionValue
        }
        }).then((response) => {
        //response.data -> {rows : [], status: String}
            if(response.data["status"] == "success"){

                let sql = `SELECT priviledge FROM users WHERE userID=${incomingUserID}`
                database.all(sql, (err, rows)=>{
                    if(Number(rows[0]["priviledge"]) >1 ){
                        sql = `DELETE FROM assignment WHERE assignmentID=${incomingAssignmentID}`
                        database.run(sql, (err)=>{
                            if(err){
                                new logging(`Err ${err}`, "Errors").writeLog()
                                throw err
                            }
                            res.send({"status" : "success"})
                        })
                    }
                })
            
            }
            else{
                let responsePacket = {
                    "status" : "failure"
                }
                res.send(responsePacket)
            }
        


        }, (error) => {
            new logging(`Err ${err}`, "Errors").writeLog()
            console.error(error)
        });
 
})


/**
 * input arguments
 * 
 * {
 *      "userID" : userID,
        "classID" : classCode
    
    }
 * 
 */

router.post("/joinClass",(req,res)=>{

    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingClassCode = data["classID"]

    let sql = `SELECT classStudentsID FROM myClass WHERE classID=${incomingClassCode}`
    database.all(sql,(err,rows)=>{
        if(err){
            new logging(`Err ${err}`, "Errors").writeLog()
            throw err
        }

        if(rows == null || rows == ""){
            let responsePacket = {
                "status" : "failure"
            }
            res.send(responsePacket)
        }
        else{
            if(rows.length == 1){
               
                let preStudentIDs = String(rows[0]['classStudentsID']).split(",")
                let foundFlag = false;
                for(let i = 0;i<preStudentIDs.length;i++){
                    if(Number(preStudentIDs[i]) == incomingUserID){
                        foundFlag = true;
                        break
                    }
                }
                if(foundFlag == false){
                    let format = String(rows[0]['classStudentsID']) + "," + incomingUserID
                
                    sql = `UPDATE myClass SET classStudentsID="${format}" WHERE classID=${incomingClassCode}`
                    database.run(sql, (err)=>{
                        if(err){
                            new logging(`Err ${err}`, "Errors").writeLog()
                            throw err
                        }
                        
                        res.send({"status":"success"})
    
                    })
                }
                else{
                    let responsePacket = {
                        "status" : "invalid",
                        "message": "You already joined the class"
                    }
                    res.send(responsePacket)
                }
                

            }   
            else{
                let responsePacket = {
                    "status" : "failure"
                }
                res.send(responsePacket)
                new logging(`Check your myClass table`, "myClass").writeLog()
            }
        }


    })


})


/**
 * 
 * input arguments
 * {
 *      "userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessionValue")
    }
 * 
 */
router.post("/loadAllAssignment", (req,res)=>{

    var data = req.body;
    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]
    
   
    axios({
        method: 'post',
        url: 'https://127.0.0.1:3000/myClass/loadClass',
        data: { 
            "userID": incomingUserID,
            "sessionValue" : incomingSessionValue
        }
        }).then((response) => {
        //response.data -> {rows : [], status: String}
            if(response.data["status"] == "success"){
                var classIDList = []
            
                if(response.data["rows"] == null){
                    
                    new logging(`Err error`, "Errors").writeLog()
                    let responsePacket = {
                        "status" : "failure"
                    }
                    res.send(responsePacket)
                }
                
                else{
                    for(let i=0;i<response.data["rows"].length;i++){
                        let row = response.data["rows"][i]
                        classIDList.push(row["classID"])
                        
                    }
                    let allClassList = response.data["rows"]

                    let sql = `SELECT * FROM assignment`
                    database.all(sql, (err,rows)=>{
                        if(err){
                            new logging(`Err ${err}`, "Errors").writeLog()
                            throw err
                        }
                        let assignmentList = []
                        if(rows != null){
                            
                            for(let i = 0;i<rows.length;i++){
                                for(let n = 0;n<classIDList.length;n++){
                                    
                                    if(rows[i]["assignmentClassID"] == classIDList[n]){
                                        assignmentList.push(rows[i])
                                        
                                    }
                                }
                                
                            }
                            
                            let responsePacket = {
                                "status": "success",
                                "rows" : assignmentList,
                                "classList": allClassList
                            }
                            
                            res.send(responsePacket)

                        }
                        else{
                            new logging(`Err Error`, "Errors").writeLog()
                            
                            let responsePacket = {
                                "status" : "failure"
                            }
                            res.send(responsePacket)
                        }
                        


                    })
                    
                }
                
                

            
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
 * input arguments
 * {
 *      "userID" : userID,
		"sessionValue" : sessionValue,
		"typedResponse" : typedResponse,
		"classID" : localStorage.getItem("tClassID"),
		"assignmentID" : localStorage.getItem("tAssignmentID")
    }
 */

router.post("/publishSeminarQuote", (req,res)=>{
    
    var data = req.body;

    var incomingUserID = data["userID"]
    var incomingSessionValue = data["sessionValue"]
    var incomingTypedResponse = data["typedResponse"]
    var incomingClassID = data["classID"]
    var incomingAsignmentID = data["assignmentID"]

    axios({
        method: 'post',
        url: 'https://127.0.0.1:3000/credentials/validateSession',
        data: { 
            "userID": incomingUserID,
            "sessionValue" : incomingSessionValue
        }
        }).then((response) => {
        //response.data -> {rows : [], status: String}
            if(response.data["status"] == "success"){

                
            
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