window.onload = function () {
    welcomeMessage()
}

/*
Custom welcome message using the logged-in user's username
Retrieved from the token flow json response
*/
function welcomeMessage() {

    url = "http://localhost:3000/loggedInUser"

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        let email = data.username;
        let name = email.substring(0, email.lastIndexOf("@"));
        document.getElementById("welcome-message").innerHTML = "Hello, " + name
    })

}

/* 
Makes a call to the backend endpoint responsible for interracting with the Graph API
Receives user's information and populates the html table with certain attributes
Also outputs the entire json response from the Graph API to the frontend to an html pre tag for clarity
*/
function callGraphMe() {

    const url = "http://localhost:3000/getUserDetailsGraph"

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        document.getElementById("display-name").innerHTML = data.displayName
        document.getElementById("given-name").innerHTML = data.givenName
        document.getElementById("job-title").innerHTML = data.jobTitle
        document.getElementById("mobile-phone").innerHTML = data.mobilePhone
        document.getElementById("office-location").innerHTML = data.officeLocation
        document.getElementById("azure-ad-id").innerHTML = data.id

        document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
    })

}

/*
Sends a POST to the backend endpoint responsible for updating user's info using the Graph API
The request contains a json created from the user's html form input with a new job title, mobile phone, and office location
Currently not working (more info on the backend endpoint comment)
*/
function updateUserGraphMe(e) {
    
    e.preventDefault();

    let newUserInfo = {
        jobTitle: document.getElementById("job-title-form").value,
        mobilePhone: document.getElementById("mobile-phone-form").value,
        officeLocation: document.getElementById("office-location-form").value
    }

    const url = "http://localhost:3000/updateUserDetailsGraph"

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserInfo)
    }).then(response => response.json())
      .then(data => { console.log('Success:', data);
    }).catch((error) => { console.error('Error:', error); });

}


