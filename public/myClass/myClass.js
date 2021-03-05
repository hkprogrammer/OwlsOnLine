function createClass(){

    var className = document.getElementById("classNameField").value;
    var teacherName = document.getElementById("teacherNameField").value;
    var classCategory = document.getElementById("selectCategoryField").value;
    var classZoom = document.getElementById("zoomLinkField").value

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     
       
        var data = JSON.parse(this.responseText)
        console.log(data)
        switch(data["status"]){
            case "success": 
                document.getElementById("successDialog").style.display = "block"
                document.getElementById("className").innerHTML = className;
                document.getElementById("classTeacher").innerHTML = teacherName
                document.getElementById("classID").innerHTML = data["classID"]
                document.getElementById("classDepartment").innerHTML = classCategory
                document.getElementById("failureDialog").style.display = "none"
                location.reload()
                break
            default:
                document.getElementById("failureDialog").style.display = "block"
                break
        }

        
    }
    };
    xhttp.open("POST", "/myClass/createClass", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let sendcontent = {
        "className" : className,
        "teacherName" : teacherName,
        "classCategory" : classCategory,
        "zoomLink" : classZoom,
        "userID" : localStorage.getItem("userID")
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);
}

function pathLoad(){
    if(localStorage.getItem("priviledge") > 1){
        document.getElementById("createClassBox").style.display = "block"
        
    }
    if(localStorage.getItem("priviledge") == 1){
        document.getElementById("joinClassBtn").style.display = "inline"
    }
}

function joinClass(){
    var classCode = document.getElementById("classJoinCode").value
    var userID = localStorage.getItem("userID")

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     
       
        var data = JSON.parse(this.responseText)
        console.log(data)
        switch(data["status"]){
            case "success": 
                location.reload()
                break
            case "invalid":
                document.getElementById("invalidDialog").style.display = "inline"
                document.getElementById("invalidDialog").innerHTML = data["message"]
                break
            default:
                document.getElementById("invalidDialog").style.display = "inline"
                break
        }

        
    }
    };
    xhttp.open("POST", "/myClass/joinClass", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let sendcontent = {
        "userID" : userID,
        "classID" : classCode
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);

}

