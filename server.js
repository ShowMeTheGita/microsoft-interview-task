///////////////// Express Config /////////////////////

const express = require("express");
const msal = require('@azure/msal-node');
const path = require('path');

const SERVER_PORT = process.env.PORT || 3000;

// Create Express App and Routes
const app = express();

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))


///////////////// Msal Config ////////////////


const clientId = "8142c14f-9866-43e9-a0d0-e93f773f8503"
const authorityId = "560a8f3a-5282-4c2b-ac62-51234b1428b5"
const clientSecret = "EIr7Q~553A_6ywyrAiDcq5pRbsBH8rp6EUu4m"

const config = {
    auth: {
      clientId: clientId,
      authority: `https://login.microsoftonline.com/${authorityId}`,
      clientSecret: clientSecret
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: msal.LogLevel.Verbose,
            }
        }
};

/////////////////////////////////////////////////////////////////////////////

const cca = new msal.ConfidentialClientApplication(config);
const baseGraphUrl = "https://graph.microsoft.com/v1.0/";
let loggedInUser = {};
let accessToken = "";

app.get('/login', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
       redirectUri: "http://localhost:3000/redirect",
    };

    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});


app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/index.js');
});

app.get('/loggedInUser', (req, res) => {
    res.json(loggedInUser);
});

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/redirect",
    };

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        username = response.account.username;
        loggedInUser = {'username': username};
        accessToken = response.accessToken;
        res.sendFile(__dirname + '/index.html')
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

app.get('/getUserDetailsGraph', (req, res) =>  {

    let graphEndpoint = "me"
    let url = baseGraphUrl + graphEndpoint

    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${tokenResponse.accessToken}`
        })
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        res.json(data)
    });

});