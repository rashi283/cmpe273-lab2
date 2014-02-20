/*
Name: Rashi Anil Agrawal
SJSU ID: 009337783
CMPE 273 - Lab 2

Lab Description:
The purpose of this lab is to get familiar with the HTTP protocol in general, 
as well as Node.js and their framework (Connect middleware). 
Using Node.js and Connect, we will be building a simple cookie-based authentication application.
*/

var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	
	console.log('GET request received');

	var cookies = request.cookies;
	console.log(cookies);
	
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	
	console.log('POST request received');
	
	// TODO: read 'name and email from the request.body'
	var json = request.body;
	
	// TODO: set new session id to the 'session_id' cookie in the response
	var newSessionId = login.login(json.name, json.email);
	
	// replace "Logged In" response with response.end(login.hello(newSessionId));
	response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
	response.end(login.hello(newSessionId));
};

function del(request, response) {
	
	console.log("DELETE request received");
 	
 	// TODO: remove session id via login.logout(xxx)
 	var cookies = request.cookies;
 	
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			console.log("DELETE:: Logout from the server");
			login.logout(sid);
			response.end('Logged out from the server\n');
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login first via HTTP POST\n");
	}
 	// No need to set session id in the response cookies since you just logged out!
  	
};

function put(request, response) {
	
	console.log("PUT request received");
	console.log("PUT:: Re-generate new seesion_id for the same user");
	
	// TODO: refresh session id; similar to the post() function
	var cookies = request.cookies;
	if ('session_id' in cookies) {
		
		var sid = cookies['session_id'];
		var newSessionId = login.renew(sid);
		
		response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
		response.end(login.hello(newSessionId) + 'Session ID successfully refreshed ! \n');
	} else {
		response.end( 'Invalid session_id ! Please log in again\n ');
	}

	response.end( 'Re-freshed session id successfully\n ');
};

app.listen(8000);

console.log("Node.JS server running at 8000 from Rashi's machine...");
