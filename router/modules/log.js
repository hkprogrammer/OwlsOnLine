//libraries
const fs = require("fs");

const credentials = __dirname + "/../../log/credentials.log"
const myClass = __dirname + "/../../log/myClass.log"
const errors = __dirname + "/../../log/err.log"

class log{
    constructor(text, document){
        this.text = text;
        this.document = document
    }

    writeLog(){
        switch(this.document){
            case "credentials":
               
                fs.readFile(credentials, (err,data)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }
                    
                    var date = new Date().toDateString()
                    let finalData = String(data) 
                    
                        + "\n" + "\n====================================================\n"
                    
                    + String(date) + "\n" + `Type of Log: ${this.document} \n` + "Log Data: \n" +  String(this.text);
                    fs.writeFile(credentials,finalData,(err)=>{
                        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                        
                    })
                })
                break
                
            case "myClass" :
                fs.readFile(myClass, (err,data)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                    var date = new Date().toDateString()
                    let finalData = String(data) 
                    
                        + "\n" + "\n====================================================\n"
                    
                    + String(date) + "\n" + `Type of Log: ${this.document} \n` + "Log Data: \n" +  String(this.text);
                    fs.writeFile(myClass,finalData,(err)=>{
                        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                        
                    })
                })
                break
            case "Errors":
                fs.readFile(errors, (err,data)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                    var date = new Date().toDateString()
                    let finalData = String(data) 
                    
                        + "\n" + "\n====================================================\n"
                    
                    + String(date) + "\n" + `Type of Log: ${this.document} \n` + "Log Data: \n" +  String(this.text);
                    fs.writeFile(errors,finalData,(err)=>{
                        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                        
                    })
                })
                break
            default:
                fs.readFile(errors, (err,data)=>{
                    if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                    var date = new Date().toDateString()
                    let finalData = String(data) 
                    
                        + "\n" + "\n====================================================\n"
                    
                    + String(date) + "\n" + `Type of Log: ${this.document} \n` + "Log Data: \n" +  String(this.text);
                    fs.writeFile(errors,finalData,(err)=>{
                        if(err){
                        new logging(`Err ${err}`, "Errors").writeLog()
                        throw err
                    }

                        
                    })
                })
                break
        }   
    }
    printLog(){
        console.log("log")
    }
}

// let l = new log("he", "credentials")
// l.writeLog()

module.exports = log;