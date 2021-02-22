function load(){
    ValidateSession()
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
    //xhttp.send("fname=Henry&lname=Ford");
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
    //xhttp.send("fname=Henry&lname=Ford");
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


// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
// if (this.readyState == 4 && this.status == 200) {
//     //document.getElementById("demo").innerHTML = this.responseText;

    
// }
// };
// xhttp.open("POST", "/", true);
// xhttp.setRequestHeader("Content-type", "application/json");
// //xhttp.send("fname=Henry&lname=Ford");
// var sendcontent = {}
// sendcontent = JSON.stringify(sendcontent)
// xhttp.send(sendcontent);