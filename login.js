/*
Name: Rashi Anil Agrawal
SJSU ID: 009337783
CMPE 273 - Lab 2

Lab Description:
The purpose of this lab is to get familiar with the HTTP protocol in general, 
as well as Node.js and their framework (Connect middleware). 
Using Node.js and Connect, we will be building a simple cookie-based authentication application.
*/

/**
 * Login Class
 */
function Login() {
	// sessionId -> user map
	this.sessionMap = {
		99999 : { name: 'Foo', email: 'foo@bar.com' }
	};
}
/**
 * Say Hello {name} to the user
 */
Login.prototype.hello = function(sessionId) {
	return 'Hello ' + this.sessionMap[sessionId].name + ' , Your session id is:' + sessionId + '\n';
};

/**
 * Check whether the given session id is valid (is in sessionMap) or not.
 */
Login.prototype.isLoggedIn = function(sessionId) {
	return sessionId in this.sessionMap;
};

/**
 * Create a new session id for the given user.
 */
Login.prototype.login = function(_name, _email) {
   /*
	* Generate unique session id and set it into sessionMap like foo@bar.com
	*/
	var sessionId = new Date().getTime();
	this.sessionMap[sessionId] = { name: _name, email: _email } 
	
	console.log('new session id ' + sessionId + ' for login::' + _email);
	
	return sessionId;
};

/**
 * Logout from the server
 */ 
Login.prototype.logout = function(sessionId) {
	console.log('Logout::' + sessionId);
   /*
	* TODO: Remove the given sessionId from the sessionMap
	*/
	delete this.sessionMap[sessionId];
	if(this.sessionMap[sessionId] == null) {
		console.log("Logout successful");
	}
	else {
		console.log("Logout unsuccessful");	
	}
};

/*
*  Renew the Session Id for logged in user. 
*/
Login.prototype.renew = function(sessionId) {
	
	var old_name = this.sessionMap[sessionId].name;
	var old_email = this.sessionMap[sessionId].email;

	delete this.sessionMap[sessionId];

	var newSessionId = new Date().getTime();
	this.sessionMap[newSessionId] = { name: old_name, email: old_email };

	return newSessionId;
}

// Export the Login class
module.exports = new Login();
