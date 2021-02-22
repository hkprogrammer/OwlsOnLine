//libraries
const fs = require("fs");

const credentials = __dirname + "/../../log/credentials.log"

class log{
    constructor(text, document){
        this.text = text;
        this.document = document
    }

    writeLog(){
        switch(this.document){
            case "credentials":
               
                fs.readFile(credentials, (err,data)=>{
                    if(err) throw err
                    var date = new Date().toDateString()
                    let finalData = String(data) 
                    
                        + "\n" + "\n====================================================\n"
                    
                    + String(date) + "\n" + `Type of Log: ${this.document} \n` + "Log Data: \n" +  String(this.text);
                    fs.writeFile(credentials,finalData,(err)=>{
                        if(err) throw err
                        
                    })
                })
                break
                
            case "" :
                break
            default:
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