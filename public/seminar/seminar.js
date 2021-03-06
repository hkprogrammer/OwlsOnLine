var editor =  CKEDITOR.replace("textEditor")

function checkSeminarID(){
	var seminarID = String(window.location.href);
    seminarID = Number(seminarID.split("=")[1]);
	if(notEmpty([seminarID])){
		loadClassDetails(seminarID)
		document.getElementById("seminarArea").style.display = "block"
		document.getElementById("joinSeminar").style.display = "none"
		
	}
	else{
		loadAssignment()
		document.getElementById("joinSeminar").style.display = "block"
		document.getElementById("seminarArea").style.display = "none"
	}
}

function notEmpty(inList){
    for(let i=0;i<inList.length;i++){
        let d = String(inList[i]) //d variable stores the temporary data in string type for each iterations in list.
        if(d == "" || d == " " || d == null || d == 0 || d == undefined || d == "NaN"){
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
 
function loadClassDetails(seminarID){

	if(notEmpty([seminarID])){
		let classes = JSON.parse(localStorage.getItem("classDetail"))
		let assignments = JSON.parse(localStorage.getItem("assignmentDetail"))[0]

		let foundFlagClasses = false;
		let classID = localStorage.getItem("targetClass")
		let classRow;

		let assignmentRow;
		for(let i =0;i<classes.length;i++){
			if(classes[i]["classID"] == classID){
				foundFlagClasses = true;
				classRow = classes[i]
				break
			}
		}
		
		
		for(let i=0;i<assignments.length;i++){
			console.log(assignments[i],seminarID)
			if(Number(assignments[i]["assignmentID"]) == Number(seminarID)){
				
				assignmentRow = assignments[i];
				break
			}
		}
		

		if(foundFlagClasses){

			document.getElementById("className").innerHTML = classRow["className"]
			document.getElementById("classTeacherName").innerHTML = classRow["classTeacherName"]
			document.getElementById("zoomLink").href = classRow["classZoom"]
			document.getElementById("assignmentName").innerHTML = assignmentRow["assignmentName"]

			localStorage.setItem("tClassID", classRow["classID"])
			localStorage.setItem("tAssignmentID", seminarID)

		}
		else{
			window.location.assign("/seminar")
		}

	}
	else{
		window.location.assign("/seminar")
	}

}



function saveData(){
	var typedResponse = editor.getData()
	document.getElementById("output").innerHTML = typedResponse

	var userID = localStorage.getItem("userID")
	var sessionValue = localStorage.getItem("sessionValue")



	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
	 
		var data = JSON.parse(this.responseText)
        
        switch(data["status"]){
            case "success":
                
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

		localStorage.removeItem("tClassID")
		localStorage.removeItem("tAssignmentID")
		
	}
	};
	xhttp.open("POST", "/seminars/publishSeminarQuote", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	
	let sendcontent = {
		"userID" : userID,
		"sessionValue" : sessionValue,
		"typedResponse" : typedResponse,
		"classID" : localStorage.getItem("tClassID"),
		"assignmentID" : localStorage.getItem("tAssignmentID")
	}
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);


}
function loadAssignment(){

	var userID = localStorage.getItem("userID")
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {

		var data = JSON.parse(this.responseText);
		switch(data["status"]){
			case "success":
				
				for(let i=0;i<data["rows"].length;i++){

					var className; 
					var teacherName;
					let classID;
					let d = data["rows"][i] //temporary varibale to store iterations
					
					for(let n=0;n<data["classList"].length;n++){
						
						if(data["classList"][n]["classID"] == d["assignmentClassID"]){
							classID = data["classList"][n]["classID"]
							className = data["classList"][n]["className"]
							teacherName = data["classList"][n]["classTeacherName"]
							
						}
					}

					document.getElementById("assignmentTable").innerHTML += `
					<tr>
						<td>${d["assignmentName"]}</td>
						<td>${className}</td>
						<td>${teacherName}</td>
						<td><a class="btn btn-sm btn-primary" target="_blank" onclick="localStorage.setItem(\'targetClass\',\'${classID}\')" href="/seminar?seminarID=${d["assignmentID"]}" >Participate</a></td>
					</tr>`
				}
			
				
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
		
	};
}
	xhttp.open("POST", "/myClass/loadAllAssignment", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	let sendcontent = {
		"userID" : localStorage.getItem("userID"),
        "sessionValue" : localStorage.getItem("sessionValue")
	}
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);
}


// editor.on( 'change', function( evt ) {
//     // getData() returns CKEditor's HTML content.
//     console.log( 'Total bytes: ' + evt.editor.getData().length );
// });