window.onload = function () {
    getUserInfo()
}

let userInfo;

function getUserInfo() {
    let toSend = {}
    url = "http://localhost:3000/loggedInUser"
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        let email = data.account.username;
        let name = email.substring(0, email.lastIndexOf("@"));
        document.getElementById("welcome-message").innerHTML = "Hello, " + name
    })
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


