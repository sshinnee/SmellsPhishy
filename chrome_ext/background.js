// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Global Variables
var toDetectPunyCode = true;
var toDetectRedirectCode = true;
var dictionary = readDictionaryFile("wordlist.txt");
var phishingText = "";

// OnChanged event
// Update the button values when users enable/disable them
chrome.storage.onChanged.addListener(function(changes, namespace) 
{
	for (var key in changes) {
		var storageChange = changes[key];
		if (key == 'punycode_storage')
		{
			toDetectPunyCode = storageChange.newValue;
		}
		else if (key == 'redirectcode_storage')
		{
			toDetectRedirectCode = storageChange.newValue;
		}
		else
		{}
	}
	
	// Set badge to indicate if the browser extensions is on/off
	if (toDetectPunyCode == false && toDetectRedirectCode == false)
	{
		chrome.browserAction.setBadgeText({text: 'OFF'});
		chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
	}
	else
	{
		chrome.browserAction.setBadgeText({text: 'ON'});
		chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
	}
	
	console.log("Updated: PunyCode: " + toDetectPunyCode + " RedirectCode: " + toDetectRedirectCode);	
});

// After installed, set the default values for the options.
// Both options are set to true.
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
		punycode_storage: toDetectPunyCode
	}, function() {
		// Update status to let user know options were saved.
		//alert("Options saved");
	});
	
	chrome.storage.sync.set({
		redirectcode_storage: toDetectRedirectCode
	}, function() {
		// Update status to let user know options were saved.
		//alert("Options saved");
	});	
 });
 
// Performs punycode detection and returns false when detected
// Chrome has IDN policy that would decides if it should show unicode or punycode.
// http://www.chromium.org/developers/design-documents/idn-in-google-chrome
chrome.webRequest.onBeforeRequest.addListener( function(details) 
{
	if (toDetectPunyCode)
	{
		//Check for xn-- OR non Ascii Printable in URL
		if ((details.url.indexOf("xn--") != -1)||(!isAsciiPrintable(details.url)))
		{
alert(details.parentFrameId + " " + details.frameId);

			var user_action = confirm("Website has homographic URL, proceed?\n\n"
							+ "To be visited URL: " + details.url);
									  
			if (user_action != true) {
				return {cancel:true};  // Do not display page
			}
		}
		else
		{	
			return {cancel:false};  // Do display page
		}		
	}
	else
	{
		// Display
		return {cancel:false};
	}	
},
{urls: ["<all_urls>"]},
["blocking"]);

chrome.webRequest.onHeadersReceived.addListener(function(details) 
{
	if (toDetectRedirectCode)
	{
		if (details.statusCode >= 300 && details.statusCode <= 308) 
		{
			var redirect_url = "";
			var headers = details.requestHeaders;
			var numHeaders = details.responseHeaders.length;
			/* console.log("START");
			var str = JSON.stringify(details.responseHeaders, null, 4);
			console.log(str);
			console.log(numHeaders); */
			
			for (var i=0; i < numHeaders; i++) 
			{
				//console.log(details.responseHeaders[i]);
				var header = details.responseHeaders[i];
				if (header["name"] === "Location" || header["name"] === "location")
					redirect_url = header["value"];
			}
			
			checkPhishing(redirect_url, details);
		}
	}
	else
	{
		// No redirect detection
	}
},
{urls: ["<all_urls>"],
types: ["main_frame", "xmlhttprequest"]},
["blocking", "responseHeaders"]
);

function isAsciiPrintable(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
/*    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
*/
    if (!(code > 31 && code < 127)) {
      return false;
    }
  }
  return true;
};

// Make WhoIs API call to WhoIs service
function getWhoIsInfo(url) {
	var apiUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_ydUtZpQodw1xHDcjPenlRDVfFitlB&domainName=" + url;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", apiUrl, false); // true for asynchronous 
    xmlHttp.send(null);
	return xmlHttp.responseText;
};

// Perform domain-based checks
function checkDomain(url) {
	var parser = new DOMParser();
	var whoIsInfo = getWhoIsInfo(url);
	var whoIsXml = parser.parseFromString(whoIsInfo, "text/xml");
	
	// Check that registration date is > 1 month (31 days) ago
	var registrationDateFromXml = whoIsXml.getElementsByTagName("registryData")[0].childNodes[0].nodeValue;
	var today = new Date();
	var registrationDate = new Date(registrationDateFromXml);
	var msInDay = 24 * 60 * 60 * 1000;

	registrationDate.setHours(0,0,0,0);
	today.setHours(0,0,0,0);

	var domainAge = (+today - +registrationDate)/msInDay;
	
	// HAVING SOME PROBLEMS HERE. THE XML STRUCTURE IS DIFFERENT FOR EACH REDIRECTED PAGE for www.dbs.com.sg
	
	//return registrationDateFromXml;
	return whoIsInfo;
}

// This serves as the main controller function that calls the various phishing checks
function checkPhishing(url, details) {
	/* likely need to return an array containing [immediate_failure, probability score] for each check */
	
	var similarURL = identifySimilarURL(url);
	if (url === similarURL)
	{
		// Identical URL. No phishing check required.
		console.log("Identical URL. No phishing check.");
	}
	else
	{
		//checkDomain(url);
		//checkPageStats(url, similarURL);
		//checkContent(url);
		
		//var userAction = confirm("Continue with redirect?\n\n"
		//						 + "Status code: " + details.statusCode + "\n"
		//						 + "Original URL: " + details.url + "\n"
		//						 + "Initiator: " + details.initiator + "\n"
		//						 + "Redirected URL: " + url + "\n"
		//						 + "WhoIs: " + checkDomain(url));
			  
		if (userAction != true) 
		{
			var blockingResponse = {};
			blockingResponse.cancel = true;
			return blockingResponse;
		}
	}
}

// Samantha Functions
function identifySimilarURL(url) {
	//read page title
	var page_title = readPageTitle(url);
	console.log("page title is: " + page_title.toString());
	// if (containsUnusualCharacters(url)) {
	// 	newurl = removeHomographs(url);
	// }
	var newurl = makeGoogleSearch(page_title);

	//tokenize the url
	var tokens = url.split(".")
	for (var i=0; i<tokens.length; i++) {
		if (!inDictionary(tokens[i], dictionary)) {
			//make a google search for any brands.companies
			continue;
		}
		//token[i] 
	}
	return newurl;
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getTopHit(response) {
	var el = document.createElement( 'html' );
	el.innerHTML = response;
	console.log("inside top hit function: ");
	var newurl = el.querySelectorAll('cite.iUh30')[0].outerHTML.split(">")[1].split("<")[0];
	console.log("new url from top hit function is: " + newurl);
	return newurl;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log("returning response from httpGet: " + xmlHttp.responseText);
    return xmlHttp.responseText;
}

function makeHTTPRequestASync(url) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        	console.log("we are receigin http response from: " + url);
            return xmlHttp.responseText;
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    xmlHttp.setRequestHeader('Access-Control-Allow-Methods', '*');
    xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlHttp.send(null);
    console.log("random blah: " + url);
    //return xmlHttp.responseText;
}
function makeGoogleSearch(phrase) {
	var query_phrase = phrase.replace(/\s+/g, "+");
	console.log("trying to read make google request for this: " + phrase.toString());
	var query = "http://www.google.com/search?q=" + query_phrase.toString();
	var google_hit_response = httpGet(query);//makeHTTPRequestASync(query);
	console.log("google search response is: " + google_hit_response);

	var newurl = getTopHit(google_hit_response);
	console.log("new url woot woot change applied: " + newurl.toString());

	return newurl;
}

function readDictionaryFile(filename) {
	var text = "";
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, false);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				text = rawFile.responseText;
				console.log("we actually got in here");
			}
		}
	}
	//rawFile.send();
	text = rawFile.responseText;
	console.log("this is your dictionary: \n" + text.toString());
	console.log("end of dictionary");
	return text;
}

function inDictionary(token, dictionary) {
	var in_dictionary = dictionary.includes(token);
	console.log(token.toString() + " is in dictionary: " + in_dictionary);
	return in_dictionary;
}

function readPageTitle(url) {
	console.log("trying to read this url now: " + url.toString());
	var title = "";
	var text = "";
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", url, false);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				text = rawFile.responseText;
				console.log("woot we are in page");
			}
		}
	}
	rawFile.send(null);
	var responseHeaders = rawFile.getAllResponseHeaders();
	console.log("response headers for this url: " + responseHeaders.toString());
	title = rawFile.responseText.toString().split("<title>")[1].split("</title>")[0];
	console.log("this is your page: \n" + title.toString());
	console.log("end of page");
	phishingText = rawFile.responseText; //assigning responseText to phishingText
	console.log("assigned response text to global var phishingText");
	//console.log("this is the phishing text: " + phishingText);
	return title;//responseHeaders;//title;
}

function evaluateURL(url) {
	//[immediate flag]does the url have multiple '.' after '.com'?
	//[suspicious flag]suspicious domains [.VE, .CC, .TK, .PW, .GA, .CF, .GQ, .ML, .BD, .KE, .CENTER, .NG,
	//.PK, .RU] <- this list was gotten from https://docs.apwg.org/reports/APWG_Global_Phishing_Report_2015-2016.pdf
	//[slightly suspicious flag] [.TOP, .XYZ, .ONLINE, .WIN, .SITE, .LINK, .CLUB, .WEBSITE
	//.CENTER, .TRADE] 

	return;
}

function sanitizeURL(url) {
	var flags = [];
	if (containsUnusualCharacters(url)) {
		flags.push(['uc']);
		return;
	} else {
		return;
	}
}

function containsUnusualCharacters(url) {
	console.log(url);
	return url.includes("xn--");
}

function removeHomographs(url) {
	return;
}