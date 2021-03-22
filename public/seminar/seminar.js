var editor =  CKEDITOR.replace("textEditor")

function checkSeminarID(){
	var seminarID = String(window.location.href);
    seminarID = Number(seminarID.split("=")[1]);
	if(notEmpty([seminarID])){
		loadClassDetails(seminarID)
		loadSeminarTopics()
		showTopics()
		
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
 
function showTopics(){
	document.getElementById("topicSection").style.display = "block"
	document.getElementById("createSeminarTopic").style.display = "block"
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
		
		console.log(assignmentRow, assignments)
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

	var userID = localStorage.getItem("userID")
	var sessionValue = localStorage.getItem("sessionValue")
	var topicID = document.getElementById("topicSelect").value;
	
	if(!notEmpty(topicID)){
		topicID = 0
	}
	
	
	var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		
			var data = JSON.parse(this.responseText)
			
			switch(data["status"]){
				case "success":
					document.getElementById("invalidMessage").style.color = "green"
					document.getElementById("invalidMessage").innerHTML = "Your submission was successful, reload to see your entry"
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

			// localStorage.removeItem("tClassID")
			// localStorage.removeItem("tAssignmentID")
			
		}
		};
		xhttp.open("POST", "/seminars/publishSeminarQuote", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		
		let sendcontent = {
			"userID" : userID,
			"sessionValue" : sessionValue,
			"typedResponse" : btoa(typedResponse), 
			"classID" : localStorage.getItem("tClassID"),
			"assignmentID" : localStorage.getItem("tAssignmentID"),
			"topicID" : Number(topicID)
		}
		//sends encoded Base64 of typedResponse rather than plain text to avoid any intrution or injection attacks.
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
		"userID" : userID,
        "sessionValue" : localStorage.getItem("sessionValue")
	}
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);
}

function createSeminarTopic(){

	var topicName = document.getElementById("topicNameField").value;
	var topicColor = document.getElementById("selectColorField").value;
	var seminarID = String(window.location.href);
    seminarID = Number(seminarID.split("=")[1]);

	var color = "rgb(255,255,255)";
	switch(topicColor){
		case "Red":
			color = "rgb(238, 186, 186)"
			break
		case "Blue":
			color = "rgb(201, 240, 240)"
			break
		default:
			break
	}
	var userID = localStorage.getItem("userID")

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {

		var data = JSON.parse(this.responseText);
		switch(data["status"]){
			case "success":
				
				location.reload()
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
	xhttp.open("POST", "/seminars/createSeminarTopic", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	let sendcontent = {
		"userID" : userID,
        "sessionValue" : localStorage.getItem("sessionValue"),
		"topicName" : topicName,
		"topicColor" : btoa(color),
		"seminarID" : seminarID
	}
	//topicColor will be in base 64 because it contains special characters
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);


}


function loadSeminarTopics(){
	var seminarID = String(window.location.href);
    seminarID = Number(seminarID.split("=")[1]);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {

		var data = JSON.parse(this.responseText);
		localStorage.setItem("seminarEntry",JSON.stringify(data["entryRows"]))
		localStorage.setItem("seminarStudentData", JSON.stringify(data["studentInfo"]))
		localStorage.setItem("seminarTopic",JSON.stringify(data["topicRows"]))
		switch(data["status"]){
			case "success":
				
				if(notEmpty([data["topicRows"]])){
					for(let i=0;i<data["topicRows"].length;i++){
						let d = data["topicRows"][i] //temporary var
						let e = data["entryRows"] //temporary var
						
						let number;
						

						let listOfCompatEntries = []
						for(let s = 0;s<e.length;s++){
							if(d["topicID"] == e[s]["topicID"]){
								listOfCompatEntries.push(e[s])
							}	
						}

						try{
							number = Math.floor(Math.random() * (listOfCompatEntries.length ) + 0);
						}
						catch{
							number = 0;
						}
						if(listOfCompatEntries.length>=1 && number == 0){
							number = 0
						}
						console.log(listOfCompatEntries, number)

						if(number <= 0){
							document.getElementById("seminarPosts").innerHTML += `
							<div class="col-md-6 col-sm-12" style="margin-top:20px;">
								<div class="card" style="background-color: ${atob(d["topicColor"])}">
								<div class="card-body">
									<h4>It seems like no one has submitted a ${d["topicName"]} entry yet, go submit one now!</h4>
									<a onclick="showEntryTopicDetail(${d["topicID"]})" class="btn btn-primary text-white">View More</a>&nbsp;<a onclick="deleteTopic(${d["topicID"]})" class="btn btn-danger deleteTopic" style="color:white;font-size:medium" style="display:none">Delete Topic</a>
								</div>
								</div>
							</div>`
						}
						else{
							let studentName = ""
							let studentEntry = ""
							
							for(let n=0;n<data["studentInfo"].length;n++){
								
								if(data["studentInfo"][n]["userID"] == listOfCompatEntries[number]["studentID"]){
									studentName = data["studentInfo"][n]["fullName"] 
								}
								
								
							}
							console.log(listOfCompatEntries)

							document.getElementById("seminarPosts").innerHTML += `
							<div class="col-md-6 col-sm-12" style="margin-top:20px;">
								<div class="card" style="background-color: ${atob(d["topicColor"])}">
								<div class="card-body">
									<h4 class="card-title">${d["topicName"]}</h4>
									<sub>Here is a brief entry from student:</sub>
									<div style="padding:5px; border-radius: 1%;">
									<h5 id="studentName">${studentName}</h5>
									<p id="studentEntry">${atob(listOfCompatEntries[number]["textEntry"])}</p>
									
									</div>
									<a onclick="showEntryTopicDetail(${d["topicID"]})" class="btn btn-primary text-white">View More</a>&nbsp;<a onclick="deleteTopic(${d["topicID"]})" class="btn btn-danger deleteTopic" style="color:white;font-size:medium" style="display:none">Delete Topic</a>
								</div>
								</div>
							</div>`
						}
						document.getElementById("topicSelect").innerHTML += `
							<option value="${d["topicID"]}">${d["topicName"]}</option>
						`

						

					}
				}
				else{
					document.getElementById("seminarPosts").innerHTML = ` 
					<div class="card" style="background-color: rgb(255, 255, 255); display:block" id="topicCard">
					<div class="card-body">
					
					  <div class="" id="createSeminarTopic">
						<h4>Create an topic</h4>
						<span id="failureDialog" style="color:red; display:none">There was an error creating assignment, please check your inputs</span>
						<div>
							<label>Topic Name: </label>
							<input type="text" name="topicName" placeholder="Topic Name" id="topicNameField" required><span style="color:red">*</span>
							<hr>
							<label>Topic color</label>
							<select id="selectColorField">
								<option value="default" selected default>default</option>
								<option value="Blue">Blue</option>
								<option value="Red">Red</option>
							</select><span style="color:red">*</span>
							
							<hr>
							<button onclick="createSeminarTopic()" class="btn btn-sm btn-success">Create Topic</button>
							
						</div>
					
					</div>
				  </div>
				  </div>`
				}
				if(localStorage.getItem("priviledge") <= 1){
					let topicClassElements = document.getElementsByClassName("deleteTopic")
					let topicClassElementslength = topicClassElements.length;
					console.log(topicClassElements,topicClassElementslength)
					for(let i = 0;i<topicClassElementslength;i++){
						console.log({i,topicClassElements})
						topicClassElements[topicClassElementslength-1-i].remove()
					}
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
	xhttp.open("POST", "/seminars/loadSeminarTopics", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	let sendcontent = {
		"seminarID" : seminarID
	}
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);

}


function showEntryTopicDetail(topicID){

	document.getElementById("topicCards").style.display = "none";
	document.getElementById("topicDetail").style.display = "block";
	document.getElementById("viewAllEntry").style.display = "none";




	
}

function deleteTopic(topicID){
	var userID = localStorage.getItem("userID")
	var sesionValue = localStorage.getItem("sessionValue")
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {

		var data = JSON.parse(this.responseText);
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
		
		};
	}
	xhttp.open("POST", "/seminars/deleteSeminarTopic", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	let sendcontent = {
		"userID" : userID,
        "sessionValue" : localStorage.getItem("sessionValue"),
		"topicID" : topicID
	}
	sendcontent = JSON.stringify(sendcontent)
	xhttp.send(sendcontent);

}

function loadAllEntry(){

	var entry = JSON.parse(localStorage.getItem("seminarEntry"))
	var studentInfo = JSON.parse(localStorage.getItem("seminarStudentData"))
	var topic = JSON.parse(localStorage.getItem("seminarTopic"))
	

	for(let i=0;i<entry.length;i++){
		loopStudent:
		for(let s=0;s<studentInfo.length;s++){
			if(entry[i]["studentID"] == studentInfo[s]["userID"]){
				for(let p = 0;p<topic.length;p++){
					if(topic[p]["topicID"] == entry[i]["topicID"]){
						console.log(entry[i],studentInfo[s],topic[p],String(topic[p]["topicColor"]))
						document.getElementById("viewAllEntry").innerHTML += `
						<div class="card" style="background-color: rgb(255,255,255)">
							<div class="card-body" id="">
							<h4 class="card-title">Hitoki Kidahashi<a class="btn" style="background-color: ${atob(String(topic[p]["topicColor"]))}; margin-left: 10px;">${topic[p]["topicName"]}</a></h4>
							
							<hr>
							<p>${atob(entry[i]["textEntry"])}</p>
							</div>
						</div>`
						break loopStudent
					}
				}
				
			}
		}
	}
	

}


// editor.on( 'change', function( evt ) {
//     // getData() returns CKEditor's HTML content.
//     console.log( 'Total bytes: ' + evt.editor.getData().length );
// });