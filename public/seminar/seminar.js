var editor =  CKEDITOR.replace("textEditor")



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

// editor.on( 'change', function( evt ) {
//     // getData() returns CKEditor's HTML content.
//     console.log( 'Total bytes: ' + evt.editor.getData().length );
// });