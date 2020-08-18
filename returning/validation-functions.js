//Sends a request to the google sheet api and validates if there is availability for delivery
var slotsReserved = true;
checkDeliverySlots(this);
const validCities = ["Mount Pleasant","North Charleston","Charleston","Summerville","West Ashley","Hanahan","Johns Island"]

//Disables the Delviery and changes the help message
function disableDelivery(message){
	setError(message); 
	document.getElementById("delivery").disabled=true;
	document.getElementById("pickup").checked=true;
}
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

function addDeliveryForm(value){
	var family = document.getElementById("delivery-form");
	while(family.hasChildNodes()){
		family.removeChild(family.lastChild);
	}
	if(validCities.includes(value.value)){
		let message = document.createElement("small");
		message.innerHTML = "Due to limited volunteers available for delivery the time frame of delivery is not established. It will be delivered as and when we receive volunteers.";
		family.appendChild(message);
		family.appendChild(document.createElement("br"));
		message = document.createElement("small");
		message.innerHTML = "If you have not received food from Shifa before, please fill out new applicant form:";
		family.appendChild(message);
		let link = document.createElement("a");
		link.href = "https://www.icnarelief.org/shifaclinics/request-doorstep/";
		link.innerHTML = "https://www.icnarelief.org/shifaclinics/request-doorstep/";
		family.appendChild(link);

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
	document.getElementById("delivery").checked=false;
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
		family.checked =true
		}
		else{
		disableDelivery("Sorry, we don't deliver to your requested city. Please sign up for pickup at https://www.icnarelief.org/shifaclinics/request-doorstep/")
		}
}	}
//Sets the error message for delivery
function setError(message){
	var deliveryError = document.getElementById("delivery-error");
	deliveryError.innerHTML = message;
}

function sendData(){
	
}

$( "form" ).on( "submit", function( event ) {
	event.preventDefault();
	
	var deploy = true;
	//Note that we have different test sheets
	var sheetUrl = 'https://script.google.com/macros/s/AKfycbxlMNY40_TLjzhGDWErf1bCDRyzcahXFUnwKjO9DG5e4EDgCS0/exec';
	var redirectUrl = 'success-page.html';
	var uploadData = $(this).serialize();
	
	if(deploy){
		sheetUrl = 'https://script.google.com/macros/s/AKfycbyxMNusJI0snt3lSaQPWIMDKMH2DrMjQJXWBQYCb5dSlcikvCY/exec';
		redirectUrl = 'success-page.html';
	}
		uploadData += '&request=delivery';

	//add loading icon
	
	
	//Send data to google sheet
	if(document.querySelector('input[name="receive-method"]:checked').value === 'delivery')
	{
		$('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
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
	}
	else{
		alert("Please sign up for pickup at https://www.icnarelief.org/shifaclinics/request-doorstep/")
	}
	
});