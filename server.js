/*

--- USEFUL REFERENCES ---

* Microsoft Graph REST API v1.0 (user resource type): https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0
* Javascript SPA Tutorial: https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-javascript-auth-code
* Javascript Node.js Web App Tutorial: https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-nodejs-webapp-msal
* MSAL.js library: https://github.com/AzureAD/microsoft-authentication-library-for-js
* NPM cross-fetch module: https://www.npmjs.com/package/cross-fetch
* Jwt: https://jwt.ms/
* Graph Explorer: https://developer.microsoft.com/en-us/graph/graph-explorer

--------------------------

*/


///////////////// Express Config /////////////////////
const express = require("express");
const bodyParser = require("body-parser") 
const msal = require('@azure/msal-node');
const fetch = require('cross-fetch');

const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json())

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))


///////////////// Msal Config ////////////////

const clientId = "8142c14f-9866-43e9-a0d0-e93f773f8503" // Retrieved from the App Registration dashboard
const authorityId = "560a8f3a-5282-4c2b-ac62-51234b1428b5" // Retrieved from the App Registration dashboard
const clientSecret = process.env.CLIENT_SECRET

// Initial config object used to initialize the msal ConfidentialClientApplication object
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

/*
The /login endpoint is the first to be accessed in our App.
Prompts user for their MS Azure credentials and asks to delegate the below scoped permissions to the App
Passes the scope&redirectUri to a function of the cca object in order to fulfill the first part of the auth2.0 flow
*/ 
app.get('/login', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["User.Read", "User.ReadWrite", "Directory.AccessAsUser.All"],
        redirectUri: "http://localhost:3000/redirect",
    };

    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {

        console.log("\n------------------------ Auth code URL ---------------------")
        console.log(response)
        console.log("------------------------------------------------------------\n")

        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});


/*
Sends our custom js file to the frontend
*/
app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/index.js');
});

/*
Sends the username of the logged-in user in json format
Retrieves the username from the token response
Used only for the Welcome Message on the html
*/
app.get('/loggedInUser', (req, res) => {
    res.json(loggedInUser);
});

/*
Endpoint specified as the redirectUri of the first part of the auth2.0 token flow
Used for the second part of the auth2.0 token flow -> retrieving the accessToken
Once retrieved, saves the user's username and accessToken to a var
If auth flow completes successfuly, lands the user on our main index.html page 
*/
app.get('/redirect', (req, res) => {

    console.log("--------------- Code received by redirect endpoint --------------")
    console.log(req.query)
    console.log("-----------------------------------------------------------------")

    const tokenRequest = {
        code: req.query.code,
        scopes: ["User.Read", "User.ReadWrite", "Directory.AccessAsUser.All"],
        redirectUri: "http://localhost:3000/redirect",
    };

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\n--------------------------------Response with access token:-------------------------------");
        console.log(response)
        console.log("---------------------------------------------------------------------------")
        let username = response.account.username;
        loggedInUser = {'username': username};
        accessToken = response.accessToken;
        res.sendFile(__dirname + '/index.html')
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});


/*
Endpoint to retrieve the user's details by interacting with the /1.0/me Graph API endpoint
Possible due to delegated (and required) User.Read permissions given on the App Registration's API permissions
Sends the access token as part of a Bearer token authorization header
Returns the user's details as json back to the frontend
*/
app.get('/getUserDetailsGraph', (req, res) =>  {

    let graphEndpoint = "me";
    let url = baseGraphUrl + graphEndpoint;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        res.json(data)
    });

});


/*
Endpoint to update some of the user's Azure AD properties.
This request isn't working. Likely we don't have enough permissions to change our own information on Azure AD even if delegated on the App Registration
If Azure AD-tenant level permissions were given, the App would require User.ReadWrite permissions as well in order to modify user details
Interacts with the same /1.0/me Graph API endpoint as above, however it uses the PATCH http request method
Resends the success/failure json response received from the Graph API back to the frontend 
*/
app.post('/updateUserDetailsGraph', (req, res) =>  {

    let graphEndpoint = "me";
    const url = baseGraphUrl + graphEndpoint;

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        res.json(data)
    });

});


/* 
Endpoint to update the user's password by calling MS Graph API
This functionality uses/requires the 'Directory.AccessAsUser.All' permissions
The json body payload comes pre-built in the frontend (this endpoint accepts only two keys in the json: 'currentPassword' and 'newPassword')
Sends the response code received by the MS Graph back to the frontend
*/
app.post('/updateUserPasswordGraph', (req, res) =>  {

    let graphEndpoint = "me/changePassword";
    const url = baseGraphUrl + graphEndpoint;

    console.log(JSON.stringify(req.body))

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }).then(function(response) {
        return response
    }).then(function(data) {
        res.status(data.status).end()
    })

});