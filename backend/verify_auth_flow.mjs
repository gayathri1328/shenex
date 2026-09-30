import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from '../src/App.jsx';
import { authService } from '../src/services/supabaseClient.js';

console.log("=================================================");
console.log("TESTING EXACT SHENEX AUTHENTICATION + ROUTING FLOW");
console.log("=================================================");

let passCount = 0;
let failCount = 0;

function assert(condition, testName, detail = "") {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (detail) console.error(`  Detail: ${detail}`);
    failCount++;
  }
}

// 1. Unauthenticated state: localStorage has no session
localStorage.clear();
const htmlLoggedOut = ReactDOMServer.renderToString(React.createElement(App));

assert(htmlLoggedOut.includes("Sign in to continue"), "1. Open website in logged-out state -> Sign In appears first");
assert(!htmlLoggedOut.includes("See the Space. Understand the Movement."), "1b. Unauthenticated user CANNOT see Home");
assert(!htmlLoggedOut.includes("Spatial Intelligence Dashboard"), "1c. Unauthenticated user CANNOT see Dashboard");
assert(!htmlLoggedOut.includes("Upload Video for YOLO Analysis"), "1d. Unauthenticated user CANNOT see Upload");
assert(!htmlLoggedOut.includes("History"), "1e. Unauthenticated user CANNOT see History");

// 2. Authenticated state: simulate user session in localStorage (e.g. on refresh while authenticated)
const mockUser = { id: "usr_999", username: "analyst_sarah", created_at: new Date().toISOString() };
localStorage.setItem('shenex_auth_session', JSON.stringify(mockUser));

const htmlLoggedIn = ReactDOMServer.renderToString(React.createElement(App));

assert(htmlLoggedIn.includes("See the Space") && htmlLoggedIn.includes("Understand the Movement"), "2. First screen after login/refresh is HOME page");
assert(!htmlLoggedIn.includes("Sign in to continue"), "2b. Authenticated user does NOT see Sign In");
assert(!htmlLoggedIn.includes("Spatial Intelligence Dashboard"), "2c. Dashboard is NOT the first page after login (Home is first)");
assert(htmlLoggedIn.includes("@analyst_sarah"), "2d. Authenticated user badge is visible in navbar");
assert(!htmlLoggedIn.includes("History"), "2e. Authenticated Home has NO History");

// Clean up
localStorage.clear();

console.log("-------------------------------------------------");
console.log(`FLOW TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
if (failCount === 0) {
  console.log("EXACT AUTHENTICATION AND ROUTING FLOW VERIFIED 100%!");
} else {
  process.exit(1);
}
