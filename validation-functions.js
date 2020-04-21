function addHouseMembers(that){
	var large = document.getElementById("family-info");
	var family = document.getElementById("family-input-container");
	while(family.hasChildNodes()){
		family.removeChild(family.lastChild);
	}
	for(var i = 1; i < that.value; i++){
		family.appendChild(document.createTextNode("Family Member " + (i+1)));
		family.appendChild(document.createElement("br"));
		
		//name
		family.appendChild(document.createTextNode("Name: " ));
		var input = document.createElement("input");
		input.type = "text";
		input.name = "member" + i + "_name";
		input.pattern = "^[a-zA-Z ]*$";
		input.required = true;
		family.appendChild(input);
		family.appendChild(document.createElement("br"));
		
		//date of birth
		family.appendChild(document.createTextNode("Date of Birth: " ));
		input = document.createElement("input");
		input.type = "date";
		input.name = "member" + i + "_dob";
		input.required = true;
		family.appendChild(input);
		family.appendChild(document.createElement("br"));
		
		//relationship
		family.appendChild(document.createTextNode("Relationship: " ));
		input = document.createElement("input");
		input.type = "text";
		input.name = "member" + i + "_relationship";
		input.name = "member" + i + "_name";
		input.pattern = "^[a-zA-Z ]*$";
		input.required = true;
		family.appendChild(input);
		family.appendChild(document.createElement("br"));
		
		//race
		family.appendChild(document.createTextNode("Race: " ));
		var selection = document.createElement("select");
		var options = [];
		
		for(var ii = 0; ii < 6; ii++){
			options.push(document.createElement("option"));
		}
		options[0].text = "Black (Not of Hispanic Origin)"; 
		options[0].value = "black";
		
		options[1].text = "White (Not of Hispanic Origin)";
		options[1].value = "white";
		
		options[2].text = "Asian";
		options[2].value = "asian";
		
		options[3].text = "Hispanic";
		options[3].value = "hispanic";
		
		options[4].text = "American Indian/Alaskan Native";
		options[4].value = "native-american";
		
		options[5].text = "Native Hawaiian/Pacific Islander";
		options[5].value = "pacific-islander";
		
		for(var ii = 0; ii < options.length; ii++){
			selection.appendChild(options[ii]);
		}
		
		selection.name = "member" + i + "_race";
		family.appendChild(selection);
		family.appendChild(document.createElement("br"));
		
		//gender
		family.appendChild(document.createTextNode("Race: " ));
		selection = document.createElement("select");
		options = [];
		
		for(var ii = 0; ii < 2; ii++){
			options.push(document.createElement("option"));
		}
		options[0].text = "Male"; 
		options[0].name = "Male";
		
		options[1].text = "Female";
		options[1].name = "Female";
		
		for(var ii = 0; ii < options.length; ii++){
			selection.appendChild(options[ii]);
		}
		
		selection.name = "member" + i + "_gender";
		family.appendChild(selection);
		family.appendChild(document.createElement("br"));
		family.appendChild(document.createElement("br"));
	}
}

function sendData(){
	
}

$( "form" ).on( "submit", function( event ) {
	event.preventDefault();
	
	var deploy = true;
	var sheetUrl = 'https://script.google.com/macros/s/AKfycbwR2oJeXmuD4hI4QUKr8QE-dZIInYmzsXRJH422DhJBJFlWEgY/exec';
	var serverUrl = 'https://127.0.0.1:5000';
	var redirectUrl = '#';
	var uploadData = $(this).serialize();
	
	if(deploy){
		sheetUrl = 'https://script.google.com/macros/s/AKfycbyxMNusJI0snt3lSaQPWIMDKMH2DrMjQJXWBQYCb5dSlcikvCY/exec';
		serverUrl = 'https://shifa-server.xyz';
		redirectUrl = 'success-page.html';
	}
	
	
	//add loading icon
	$('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
	
	//Send data to Food Bank Updater
	var jqxhr = $.post(serverUrl, uploadData, function(data){
		console.log("success, data: " + data.statusText);
		$(location).attr('href', redirectUrl);
	})
	.fail(function(data){
		console.warn("error, data: " + data.statusText);
		console.log(serverUrl);
		if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
            alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
            $(location).attr('href',redirectUrl);                
        }
	});
	
	//Send data to google sheet
	var jqxhr = $.get(sheetUrl, uploadData, function(data){
		console.log("success, data: " + data.statusText);
		$(location).attr('href', redirectUrl);
	})
	.fail(function(data){
		console.warn("error, data: " + data.statusText);
		if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
            alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
            $(location).attr('href',redirectUrl);                
        }
	});
	
});