//Sends a request to the google sheet api and validates if there is availability for delivery
var slotsReserved = true;
checkDeliverySlots(this);
const validCities = ["Mount Pleasant","North Charleston","Charleston","Summerville","West Ashley"]



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
		family.appendChild(document.createTextNode("Gender: " ));
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

function addDeliveryForm(value){
	var family = document.getElementById("delivery-form");
	while(family.hasChildNodes()){
		family.removeChild(family.lastChild);
	}
	if(value.value == "delivery"){
		message = document.createElement("small");
		message.innerHTML = "Please be aware that deliveries are fulfilled in the order they are requested and may take 2 weeks or longer for you to receive the food.";

		family.appendChild(message);
		family.appendChild(document.createElement("br"));
		family.appendChild(document.createElement("br"));


		family.appendChild(document.createTextNode("Reason for Delivery?: "));
		var selection = document.createElement("select");
		var options = [];
		
		for(var ii = 0; ii < 4; ii++){
			options.push(document.createElement("option"));
		}
		options[0].text = "Please choose"; 
		options[0].value = "";
		options[0].selected = true;
		options[0].disabled = true;
		options[0].hidden = true;

		options[1].text = "Elderly"; 
		options[1].value = "Elderly";
		
		options[2].text = "Disabled";
		options[2].value = "Disabled";
		
		options[3].text = "No access to transportation";
		options[3].value = "Transportation";
		
		for(var ii = 0; ii < options.length; ii++){
			selection.appendChild(options[ii]);
		}
		
		selection.name = "Reason";
		selection.required = true;
		family.appendChild(selection);
	}
}
//Disables the Delviery and changes the help message
function disableDelivery(message){
	setError(message); 
	document.getElementById("delivery").disabled=true;
	document.getElementById("pickup").checked=true;
	addDeliveryForm(false)
}

//Called on Change in the cities selection column
function validateDelivery(that){
	var family = document.getElementById("delivery");
	//Checks if there are slots available
	if (slotsReserved){
		//Checks if the city is right
		if(validCities.includes(that.value)){
		setError("Please fill out the delivery requirements below if requesting delivery");
		family.disabled=false
		}
		else{
		disableDelivery("Sorry, we don't deliver to your requested city. Please use pickup.")
		}
}	}
//Sets the error message for delivery
function setError(message){
	var deliveryError = document.getElementById("delivery-error");
	deliveryError.innerHTML = message;
}


//Calls the Google Sheets script and checks for availbility
function checkDeliverySlots(that){
	var deploy = true;
	//Note we have different test sheets
	var sheetUrl = 'https://script.google.com/macros/s/AKfycbxlMNY40_TLjzhGDWErf1bCDRyzcahXFUnwKjO9DG5e4EDgCS0/exec';
	uploadData = "request=getSlotsReserved";
	if(deploy){
		sheetUrl = 'https://script.google.com/macros/s/AKfycbyxMNusJI0snt3lSaQPWIMDKMH2DrMjQJXWBQYCb5dSlcikvCY/exec';
	}
	//Calls the google scripts api using request-getSlotsReserved for protocol
	var jqxhr = $.getJSON(sheetUrl,uploadData, function(data){
		console.log("success, data: " + JSON.stringify(data));
		slotsReserved = data["slotsAvailable"];
		//Disables delivery if sheets returns false
		if (slotsReserved == false) disableDelivery("No slots available for delivery, Please try another day");
		
	})
	.fail(function(data){
		console.warn("error, data: " + data.statusText);
		disableDelivery("Error checking delivery availability, Please refresh page");
		slotsReserved = false;
	})
}



function sendData(){
	
}

$( "form" ).on( "submit", function( event ) {
	event.preventDefault();
	
	var deploy = true;
	//Note that we have different test sheets
	var sheetUrl = 'https://script.google.com/macros/s/AKfycbxlMNY40_TLjzhGDWErf1bCDRyzcahXFUnwKjO9DG5e4EDgCS0/exec';
	var serverUrl = 'https://127.0.0.1:5000';
	var redirectUrl = 'success-page.html';
	var uploadData = $(this).serialize();
	
	if(deploy){
		sheetUrl = 'https://script.google.com/macros/s/AKfycbyxMNusJI0snt3lSaQPWIMDKMH2DrMjQJXWBQYCb5dSlcikvCY/exec';
		serverUrl = 'https://shifa-server.xyz';
		redirectUrl = 'success-page.html';
	}
	
	if(document.querySelector('input[name="receive-method"]:checked').value === 'pickup'){
		uploadData += '&Group=50&request=pickup';
		redirectUrl = 'https://shifafreeclinic.makeplans.net/services/14509/slots  ';
	}

	if(document.querySelector('input[name="receive-method"]:checked').value === 'delivery'){
		uploadData += '&request=delivery';
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