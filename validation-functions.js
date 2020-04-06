$(document).ready(function() {
    $('#test-form').bootstrapValidator({
        //submitButtons: '#postForm',
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },        
        fields: {
            "First Name": {
             message: 'The first name is not valid',
                validators: {
                    notEmpty: {
                        message: 'The first name is required and cannot be empty'
                    },
                    stringLength: {
                        min: 1,
                        max: 30,
                        message: 'The first name must be more than 1 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z ]*$/,
                        message: 'The first name can only accept alphabetical input'
                    },
                }
            },
			"Last Name": {
             message: 'The last name is not valid',
                validators: {
                    notEmpty: {
                        message: 'The last name is required and cannot be empty'
                    },
                    stringLength: {
                        min: 1,
                        max: 30,
                        message: 'The last name must be more than 1 and less than 30 characters long'
                    },
					regexp: {
                        regexp: /^[a-zA-Z ]*$/,
                        message: 'The last name can only accept alphabetical input'
                    },
                }
            },
			"household-size": {
             message: 'The household size is not valid',
                validators: {
                    notEmpty: {
                        message: 'The household size is required and cannot be empty'
                    },
                    between: {
						inclusive: true,
						min: 1,
						max: 20,
						message: 'Household size must be a number between 1 and 20'
					}
                }
            },
            "Street Address": {
                message: 'Address is not valid',
                validators: {
                    notEmpty: {
                        message: 'Address is required and cannot be empty'
                    },
					regexp:{
						regexp: /^[a-zA-Z\d ]*$/,
						message: 'Street address can only accept alphanumeric input'
					}
                }
            },
			"Apartment/lot number": {
                message: 'Address is not valid',
                validators: {
					regexp:{
						regexp: /^[a-zA-Z\d ]*$/,
						message: 'Apartment number can only accept alphanumeric input'
					}
                }
            },
			"Zip code": {
                message: 'Zip code is not valid',
                validators: {
                    notEmpty: {
                        message: 'Zip code is required and cannot be empty'
                    },
					between: {
						inclusive: true,
						min: 29400,
						max: 29500,
						message: 'Please enter a Charleston area Zip Code'
					}
                }
            },
			"Phone Number": {
                message: 'Phone number is not valid',
                validators: {
                    notEmpty: {
                        message: 'Phone number is required and cannot be empty'
                    },
					regexp: {
                        regexp: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                        message: 'Please enter a valid phone number'
                    }
                }
            },
            "Email (optional)": {
                validators: {
                    emailAddress: {
                        message: 'The email address is not valid'
                    }
                }
            },
             

        }
    })
    .on('success.form.bv', function(e) {
		var deploy = true;
		
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');

        // Use Ajax to submit form data
        var url = 'https://script.google.com/macros/s/AKfycbwR2oJeXmuD4hI4QUKr8QE-dZIInYmzsXRJH422DhJBJFlWEgY/exec';
		
		if(deploy){
			url = 'https://script.google.com/macros/s/AKfycbyxMNusJI0snt3lSaQPWIMDKMH2DrMjQJXWBQYCb5dSlcikvCY/exec';
		}
	url = 'https://script.google.com/macros/s/AKfycbwR2oJeXmuD4hI4QUKr8QE-dZIInYmzsXRJH422DhJBJFlWEgY/exec';
        var redirectUrl = 'https://shifaclinics.com/thank-you';
        // show the loading 
        $('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
        var jqxhr = $.get(url, $form.serialize(), function(data) {
            console.log("Success! Data: " + data.statusText);
            $(location).attr('href',redirectUrl);
        })
            .fail(function(data) {
                console.warn("Error! Data: " + data.statusText);
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
                    $(location).attr('href',redirectUrl);                
                }
            });
		
		url = 'http://127.0.0.1:5000/';
		
		if(deploy){
			url = 'https://shifa-server.xyz';
		}
		
		var jqxhr2 = $.post(url, $form.serialize(), function(data) {
            console.log("Success! Data: " + data.statusText);
            $(location).attr('href',redirectUrl);
        })
            .fail(function(data) {
                console.warn("Error! Data: " + data.statusText);
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
                    $(location).attr('href',redirectUrl);                
                }
            });
    });
});

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
		input.pattern = "/^[a-zA-Z ]*$/";
		family.appendChild(input);
		family.appendChild(document.createElement("br"));
		
		//date of birth
		family.appendChild(document.createTextNode("Date of Birth: " ));
		input = document.createElement("input");
		input.type = "date";
		input.name = "member" + i + "_dob";
		family.appendChild(input);
		family.appendChild(document.createElement("br"));
		
		//relationship
		family.appendChild(document.createTextNode("Relationship: " ));
		input = document.createElement("input");
		input.type = "text";
		input.name = "member" + i + "_relationship";
		input.pattern = "/^[a-zA-Z ]*$/";
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
