// These are the Error Types, used for navigating / displaying specific errors
// redirects to /index.html?error={ERROR_TYPE}

const LOGIN_TAG = "loginFail";
const ACCESS_TAG = "access";
const BAD_REQUEST_TAG = "badRequest";
const GAME_INACTIVE_TAG = "gameNotActive";
const ALREADY_IN_TAG = "alreadyLoggedIn";
const NOT_LOGGED_IN_TAG = "notLoggedIn";
const DATABASE_TAG = "database";
const BAD_SESSION = "badSession";
const GAME_DOES_NOT_EXIST = "gameDoesNotExist";

module.exports = {
	LOGIN_TAG,
	ACCESS_TAG,
	BAD_REQUEST_TAG,
	GAME_INACTIVE_TAG,
	ALREADY_IN_TAG,
	NOT_LOGGED_IN_TAG,
	DATABASE_TAG,
	BAD_SESSION,
	GAME_DOES_NOT_EXIST
};
