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
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

let userInfo;
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
    url = "http://localhost:3000/getUserDetailsGraph"
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data)
    })
}



