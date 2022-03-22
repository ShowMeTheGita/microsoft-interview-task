window.onload = function () {
    getUserInfo()
}

function welcomeMessage() {

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }

    url = "http://localhost:3000/loggedInUser"

    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);

}


function getUserInfo() {

    url = "http://localhost:3000/loggedInUser"

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        let email = data.username;
        let name = email.substring(0, email.lastIndexOf("@"));
        document.getElementById("welcome-message").innerHTML = "Hello, " + name
    })

}


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
    })

}


function updateUserGraphMe(e) {
    
    e.preventDefault();

    let newUserInfo = {
        jobTitle: document.getElementById("job-title-form").value,
        mobilePhone: document.getElementById("mobile-phone-form").value,
        officeLocation: document.getElementById("office-location-form").value
    }

    const url = "http://localhost:3000/updateUserDetailsGraph"

    console.log(newUserInfo)

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


