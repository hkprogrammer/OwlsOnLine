//global variables
var classList = [];

function load(){
    ValidateSession()
    queryUsername()
    
}

function ValidateSession(){
    //to-do later
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
        
        var data = JSON.parse(this.responseText)
        console.log({data})
        if(data["status"] == "success"){
            document.getElementById("logged-in").style.display = "inline";
            document.getElementById("logged-out").style.display = "none";
        }
        else if(data["status"]== "failure"){
            document.getElementById("logged-in").style.display = "none";
            document.getElementById("logged-out").style.display = "inline";
        } 
        //errors
        else{
            document.getElementById("logged-in").style.display = "none";
            document.getElementById("logged-out").style.display = "inline";
        }
        
    }
    };
    xhttp.open("POST", "/credentials/validateSession", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    var sendcontent = {
        "userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessionValue")
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);
   



   

}
async function queryUsername(){
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;

        var data = JSON.parse(this.responseText);
        switch(data["status"]){
            case "success":
                localStorage.setItem("userID", data["userID"])
                localStorage.setItem("username", data["username"])
                localStorage.setItem("fullName", data["fullName"])
                localStorage.setItem("title", data["title"])
                localStorage.setItem("role", data["role"])
                localStorage.setItem("priviledge", data["priviledge"])

                document.getElementById("displayUsername").innerHTML = data["fullName"];
                break
            case "failure":
                
                break
            case "invalid":
                break
            default:
            
        }
        

    }
    };
    xhttp.open("POST", "/credentials/queryInformations", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    var sendcontent = {
        "userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessionValue")
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);


}

function logout(){
    
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;

        var data = JSON.parse(this.responseText)
        if(data["status"] == "success"){
            document.getElementById("logged-in").style.display = "none";
            document.getElementById("logged-out").style.display = "inline";
        }
        

    }
    };
    xhttp.open("POST", "/credentials/logout", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    var sendcontent = {
        "userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessioNValue")

    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);
    
    localStorage.removeItem("sessionValue")
    localStorage.removeItem("userID")
    localStorage.removeItem("loginStatus")
}


function loadClass(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     
        
        var data = JSON.parse(this.responseText);
        classList = data["rows"]
        switch(data["status"]){
            case "success":
                for(let i=0;i<data["rows"].length;i++){
                    document.getElementById("classTable").innerHTML += 
                
                    `<tr>
                        <td>${data["rows"][i]["className"]}</td>
                        <td>${data["rows"][i]["classTeacherName"]}</td>
                        <td><a class="btn btn-sm btn-primary text-white"  onclick="viewClass(\'${data["rows"][i]["classID"]}\')">View</a></td>
                    </tr>`
                }
               
                break
            case "failure":
                break
            case "invalid":
                break
            default:
                break
        }

        
    }
    };
    xhttp.open("POST", "/myClass/loadClass", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let sendcontent = {
        "userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessionValue")
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);
}

function viewClass(classID){
    console.log(classID)
   
    localStorage.setItem("classDetail", JSON.stringify(classList))
    window.open(`/myClass/details?classID=${classID}`,"_blank")

    

}

// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
// if (this.readyState == 4 && this.status == 200) {
//     //document.getElementById("demo").innerHTML = this.responseText;

    
// }
// };
// xhttp.open("POST", "/", true);
// xhttp.setRequestHeader("Content-type", "application/json");
// 
// var sendcontent = {}
// sendcontent = JSON.stringify(sendcontent)
// xhttp.send(sendcontent);