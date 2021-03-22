function loadAssignment(){

	var userID = localStorage.getItem("userID")
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {

		var data = JSON.parse(this.responseText);
		switch(data["status"]){
			case "success":
				var tempLocal = []
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
		
	};
}
	xhttp.open("POST", "/myClass/loadAllAssignment", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	let sendcontent = {
		"userID" : userID,
        "sessionValue" : localStorage.getItem("sessionValue")
	}
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);
}