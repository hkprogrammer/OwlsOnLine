function detailsLoad(){
    var classID = String(window.location.href);
    classID = Number(classID.split("=")[1]);
    document.getElementById("classID").innerHTML = `ClassID: ${classID}`
    var classDetails = JSON.parse(localStorage.getItem("classDetail"))
    console.log(classDetails)
    for(let i = 0;i<classDetails.length;i++){
        console.log(classDetails[i],classID)
        if(classDetails[i]["classID"] == classID){
            document.getElementById("className").innerHTML = classDetails[i]["className"];
            document.getElementById("classTeacherName").innerHTML = classDetails[i]["classTeacherName"]
            document.getElementById("zoomLink").innerHTML = classDetails[i]["classZoom"]
            break
        }
    }
        

}
function createAssignment(){
    var assignmentName = document.getElementById("assignmentNameField").value;
    var assignmentDueDate = document.getElementById("dueDateField").value
    var assignmentType = document.getElementById("selectTypeField").value
    var classID = String(window.location.href);
    classID = Number(classID.split("=")[1]);

    if(notEmpty([assignmentDueDate,assignmentName,assignmentType])){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         
            var data = JSON.parse(this.responseText);
            switch(data["status"]){
                case "success":
                    document.getElementById("assignmentName").innerHTML = assignmentName;
                    document.getElementById("assignmentType").innerHTML = assignmentType;
                    document.getElementById("assignmentDueDate").innerHTML = assignmentDueDate;
                    document.getElementById("assignmentID").innerHTML = data["assignmentID"]
                    document.getElementById("successDialog").style.display = "block"
                    location.reload()
                    break
                case "invalid":
                    document.getElementById("failureDialog").innerHTML = data["message"]
                    document.getElementById("failureDialog").style.display = "block"
                    break
                case "failure":
                    document.getElementById("failureDialog").style.display = "block"
                    break
                default:
                    document.getElementById("failureDialog").style.display = "block"
                    break
            }
        
        }
        };
        xhttp.open("POST", "/myClass/createAssignment", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        let sendcontent = {
            "assignmentName" : assignmentName,
            "assignmentType" : assignmentType,
            "assignmentDueDate" : assignmentDueDate,
            "userID" : localStorage.getItem("userID"),
            "classID" : classID
        }
        sendcontent = JSON.stringify(sendcontent)
        xhttp.send(sendcontent);
    }
    else{
        document.getElementById("failureDialog").style.display = "block"
    }

}

function loadAssignment(){
    var userID = localStorage.getItem("userID")

    var classID = String(window.location.href);
    classID = Number(classID.split("=")[1]);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     
      
        var data = JSON.parse(this.responseText)
        
       
        
        switch(data["status"]){
            case "success":
                let tempLocal = []
                for(let i =0;i<data["rows"].length;i++){
                    let d = data["rows"][i]
                    if(d["assignmentType"] == "seminar"){
                        document.getElementById("assignmentTable").innerHTML +=  `
                        <tr>
                            <td>${d["assignmentName"]}</td>
                            <td>${d["assignmentType"]}</td>
                            <td>${d["assignmentDueDate"]}</td>
                            <td><a class="btn btn-primary btn-sm" onclick="localStorage.setItem(\'targetClass\',\'${classID}\')" href="/seminar?seminarID=${d["assignmentID"]}">Open</a></td>
                            <td><a onclick="deleteAssignment('${d["assignmentID"]}')" class="btn btn-sm btn-danger text-white">delete</a></td>
                        </tr>`
                    }
                    else{
                        document.getElementById("assignmentTable").innerHTML +=  `
                        <tr>
                            <td>${d["assignmentName"]}</td>
                            <td>${d["assignmentType"]}</td>
                            <td>${d["assignmentDueDate"]}</td>
                            <td><a href="" class="btn btn-primary btn-sm">Open</a></td>
                            <td><a onclick="deleteAssignment('${d["assignmentID"]}')" class="btn btn-sm btn-danger text-white">delete</a></td>
                        </tr>`
                    }
                    tempLocal.push(d)
                    
                    
                }
                localStorage.setItem("assignmentDetail", JSON.stringify([tempLocal]))
                break
            case "invalid":
                document.getElementsByTagName("body")[0].innerHTML = `<center class="alert alert-danger" style="color:white">An Error has occured Please try login again</center>` + document.getElementsByTagName("body")[0].innerHTML 
                break
            case "failure":
                document.getElementsByTagName("body")[0].innerHTML = `<center class="alert alert-danger" style="color:white">An Error has occured Please try login again</center>` + document.getElementsByTagName("body")[0].innerHTML 
                break
            default:
                document.getElementsByTagName("body")[0].innerHTML = `<center class="alert alert-danger" style="color:white">An Error has occured Please try login again</center>` + document.getElementsByTagName("body")[0].innerHTML 
                break
        }


       
    
    }
    };
    xhttp.open("POST", "/myClass/loadAssignment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let sendcontent = {
       "userID" : userID,
       "classID" : classID,
       "sessionValue" : localStorage.getItem("sessionValue")
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);


}

function deleteAssignment(assignmentID){

    var userID = localStorage.getItem("userID")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     
      
       var data = JSON.parse(this.responseText);
       switch(data["status"]){
            case "success":
                location.reload()
                break
            default:
                document.getElementsByTagName("body")[0].innerHTML = `<center class="alert alert-danger" style="color:white">An Error has occured Please try login again</center>` + document.getElementsByTagName("body")[0].innerHTML 
                break
       }
    
    }
    };
    xhttp.open("POST", "/myClass/deleteAssignment", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let sendcontent = {
       "userID" : userID,
       "assignmentID" : assignmentID,
       "sessionValue" : localStorage.getItem("sessionValue")
    
    }
    sendcontent = JSON.stringify(sendcontent)
    xhttp.send(sendcontent);

    

}

function checkCreateAssignment(){
    var priviledge = Number(localStorage.getItem("priviledge"))

    if(priviledge > 1){
        document.getElementById("createAssignment").style.display = "block"
    }
    else{
        document.getElementById("createAssignment").style.display = "none"
    }

    
}


function notEmpty(list){
    for(let i=0;i<list.length;i++){
        let d = String(list[i]) //d variable stores the temporary data in string type for each iterations in list.
        if(d == "" || d == " " || d == null || d == 0){
			if(d.length<1){
				return false
			}
            return false
        }
        else{
            continue
        }
    }
    return true;
}
 