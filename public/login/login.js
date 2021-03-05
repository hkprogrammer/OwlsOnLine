function loginSubmit(){

    //login xhttp request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
    
        var data = JSON.parse(this.responseText);
        switch(data["status"]){
            case "success":
                localStorage.setItem('sessionValue', data["sessionValue"])
                localStorage.setItem('loginStatus', "1")
                localStorage.setItem('userID', data["userID"])
                window.location.assign("/")
                break
            case "failure":
                var invalid = document.getElementById("invalidLogin");
                invalid.style.visibility = "visible"
                break

            default:
               console.log(data["status"])
               break

        }
        if(data["status"] == "" || data["status"] == null){
            var invalid = document.getElementById("invalidLogin");
            invalid.style.visibility = "visible"
        }
        
    }
    };
    xhttp.open("POST", "/credentials/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value
    let sendcontent = {
        "username" : username,
        "password" : password
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);
    console.log(sendcontent)
}



function load(){

    let userID = localStorage.getItem("userID")
    let sessionValue = localStorage.getItem("sessionValue")
    if(localStorage.getItem("loginStatus") == 1){
        
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //document.getElementById("demo").innerHTML = this.responseText;
    
        let data = JSON.parse(this.responseText)
        switch(data["status"]){
            case "success":
                window.location.assign("/")
                break
            default:
                
        }
    
        
    }
    };
    xhttp.open("POST", "/credentials/validateSession", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    let sendcontent = {
        "userID" : userID,
        "sessionValue" : sessionValue
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);
    }
    

}