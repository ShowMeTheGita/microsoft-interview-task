## Microsoft Interview Task - Simple application to authenticate a user to a specific Azure tenant and display his information by interacting with Microsoft's Graph API

### Summary

This app authenticates a user to the tenant devxaad.onmicrosoft.com and interacts with the Microsoft Graph API in order to retrieve the authenticated user's details. 

Core components:  
* JavaScript (vanilla)
* Node.js (Express.js, body-parser, cross-fetch)
* HTML
* [Microsoft Authentication Library (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js)

It uses Express.js to create a server that runs on port 3000 by default and contains a set of endpoints


### Requirements

Node.js installed


### Instructions
### UPDATE - Accesses no longer work due to tenant privileges having been revoked since

* **Clone the app:** git clone https://github.com/ShowMeTheGita/microsoft-interview-task.git
* **cd to the app folder:** cd microsoft-interview-task
* **Install the required node dependencies:** npm install
* **Start the server:** npm start

You can now access the app by going to http://localhost:${port}/login (default port is 3000) 


### Pre-Development - Registering the App

Before beginning app development, the first step was to register an App on our Azure AD tenant.  
The steps were as follows: Login to the tenant -> Azure AD -> App registrations -> New registration.  
"PoC ExpressJS WebApp" was registered as a WebApp and the following initial information was collected:  
* Application (client) ID
* Directory (tenant) ID  

A client secret was also required, and as such "WebApp Client Secret" was created under the "Certificates & secrets" tab. (Yes I was a bit lazy and had the secret as plaintext on the js files, hence the reason for the private repository. Sorry! :) )  

API permissions were also needed, so Microsoft Graph "User.Read" (the required for the App) and "User.ReadWrite" (more on this later) were granted under the "API permissions" tab.


### Application Flow  

<br/>  

![app-flow](https://i.ibb.co/Lxh2d5k/app-flow.png)  

The App has two core "stages": the authentication process, and the interaction with the Graph API.  

It uses the MSAL.js library interchangingly with Express.js endpoints to perform all the necessary auth token flow operations.  
Once the auth process is completed and the user is signed-in, an index.html page is presented with a clickable button that will both populate a table with some of the user's information, as well as presenting the raw json output from Microsoft Graph on the page itself.  
All calls to the Graph API are delegated to the backend via initial calls performed using JavaScript's 'fetch' API in the frontend. Once in the backend, the cross-fetch module is used jointly with Express to send requests to the Graph API and return the results back to the user.  

There is also a PoC HTML form that can be submitted in order to update specific Azure AD attributes of the logged-in user (hence the User.ReadWrite permission scope setting). Despite the scope of the token permissions however, the functionality is currently not working. This is likely due to lack of Azure AD permissions at the tenant-level.

Additional information regarding the specific code can be viewed commented directly in the files.


### Useful References

* **Microsoft Graph REST API v1.0 (user resource type):** https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0
* **Javascript SPA Tutorial:** https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-javascript-auth-code
* **Javascript Node.js Web App Tutorial:** https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-nodejs-webapp-msal
* **MSAL.js library:** https://github.com/AzureAD/microsoft-authentication-library-for-js
* **NPM cross-fetch module:** https://www.npmjs.com/package/cross-fetch
* **Jwt:** https://jwt.ms/
* **Graph Explorer:** https://developer.microsoft.com/en-us/graph/graph-explorer
