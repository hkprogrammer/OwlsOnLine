function registerSubmit(){

    var username = document.getElementById("username").value;
    var name = document.getElementById("fullName").value;
    var email = document.getElementById("email").value;
    var role = document.getElementById("selectRole").value;
    var password = document.getElementById("password").value;
    var passwordRepeat = document.getElementById("repeatPassword").value;
    var pass = true;


    if(
        (String(password) != String(passwordRepeat) && (password.length !=0 && passwordRepeat.length!=0)) || 
        (username == "" || username == null)
        ||
        (ValidateEmail(email) == false) ||
        (role == "" || role =="role" || role=="none")||
        (name == "" || name == null || name ==" ")){
        document.getElementById("invalid").style.display = 'inline';
        
    }
    else{
        
        if(role == "Other"){
            role = document.getElementById("roleOther").value;
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            
            var data = JSON.parse(this.responseText)
            switch(data["status"]){

                case "success":
                    window.location.assign("/login")
                    break
                case "failure":
                    document.getElementById("invalid").style.display = 'inline';
                    document.getElementById("invalid").innerHTML = "Your registration request was invalid, please contact support"
                    break
                case "invalid":
                    document.getElementById("invalid").style.display = 'inline';
                    document.getElementById("invalid").innerHTML = String(data["message"]);
                    break
                default:
                    

            }


    
        }
        };
        xhttp.open("POST", "/credentials/register", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        //xhttp.send("fname=Henry&lname=Ford");
        var sendcontent = {
    
            "username": username,
            "email": email,
            "password": password,
            "role": role,
            "fullName" : name
    
        }
        sendcontent = JSON.stringify(sendcontent)
        xhttp.send(sendcontent);
    }
    
    



    





}

function checkOther(){
    var selection = document.getElementById("selectRole").value;

    switch(selection){

        case "other":
            document.getElementById("roleOtherExplain").style.display = "block";
            break
        default:
            document.getElementById("roleOtherExplain").style.display = "none";
            break

    }

}