var editor =  CKEDITOR.replace("textEditor")

function checkSeminarID(){
	var seminarID = String(window.location.href);
    seminarID = Number(seminarID.split("=")[1]);
	if(notEmpty([seminarID])){
		document.getElementById("seminarArea").style.display = "block"
		document.getElementById("joinSeminar").style.display = "none"
		
	}
	else{
		loadAssignment()
		document.getElementById("joinSeminar").style.display = "block"
		document.getElementById("seminarArea").style.display = "none"
	}
}

function notEmpty(list){
    for(let i=0;i<list.length;i++){
        let d = String(list[i]) //d variable stores the temporary data in string type for each iterations in list.
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
 

function saveData(){
	var data = editor.getData()
	// console.log(data)
	 document.getElementById("output").innerHTML = data

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
	 
	   

		
	}
	};
	xhttp.open("POST", "/seminars/publishSeminar", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	
	let sendcontent = {
		"userID" : userID,
		"sessionValue" : sessionValue
	}
	sendcontent = JSON.stringify(sendcontent)
	//xhttp.send(sendcontent);


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
					let d = data["rows"][i] //temporary varibale to store iterations
					
					for(let n=0;n<data["classList"].length;n++){
						
						if(data["classList"][n]["classID"] == d["assignmentClassID"]){
							
							className = data["classList"][n]["className"]
							teacherName = data["classList"][n]["classTeacherName"]
							
						}
					}

					document.getElementById("assignmentTable").innerHTML += `
					<tr>
						<td>${d["assignmentName"]}</td>
						<td>${className}</td>
						<td>${teacherName}</td>
						<td><a href="/seminar?seminarID=${d["assignmentID"]}" class="btn btn-sm btn-primary" target="_blank">Participate</a></td>
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