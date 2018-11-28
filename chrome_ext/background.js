// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Global Variables
var toDetectPunyCode = true;
var toDetectRedirectCode = true;
var toDetectGlobal = false;
var isPunyCode = false;
var isRedirect = false;
var isGlobal = false;
//var dictionary = readDictionaryFile("wordlist.txt");
var phishingText = "";

// OnChanged event
// Update the button values when users enable/disable them
chrome.storage.onChanged.addListener(function(changes, namespace) 
{
	for (var key in changes) {
		var storageChange = changes[key];
		if (key == 'global_storage')
		{
			toDetectGlobal = storageChange.newValue;
		}
		else if (key == 'punycode_storage')
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
	if (toDetectGlobal == false && toDetectPunyCode == false && toDetectRedirectCode == false)
	{
		chrome.browserAction.setBadgeText({text: 'OFF'});
		chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
	}
	else
	{
		chrome.browserAction.setBadgeText({text: 'ON'});
		chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
	}
	
	console.log("Updated: Global: " + toDetectGlobal + " PunyCode: " + toDetectPunyCode + " RedirectCode: " + toDetectRedirectCode);	
});

// After installed, set the default values for the options.
// Both options are set to true.
chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		global_storage: toDetectGlobal
	}, function() {
		// Update status to let user know options were saved.
		//alert("Options saved");
	});
	
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
	if (toDetectGlobal) {
		checkPhishing(details.url, details);
	}
	else if (details.url.includes("127.0.0.1")) {
		console.log("inside local detection");
		console.log(details.url);
		checkPhishing(details.url, details);//"http://www." + details.url.split("/")[4].toString(), details);
	}
	else if (toDetectPunyCode)
	{
		console.log("inside puny code detection");
		console.log(details.url);
		//Check for xn-- OR non Ascii Printable in URL
		if ((details.url.indexOf("xn--") != -1)||(!isAsciiPrintable(details.url)))
		{
			isPunyCode = true;
			console.log("hits check");
			//alert(details.parentFrameId + " " + details.frameId);
			/*
			var user_action = confirm("Website has homographic URL, proceed?\n\n"
							+ "To be visited URL: " + details.url);
									  
			if (user_action != true) {
				return {cancel:true};  // Do not display page
			}*/
			 return checkPhishing(details.url, details);
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

// Performs redirect detection. Passes the redirected url to checkPhishing for processing.
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
			
			console.log("Original url: " + details.url);
			console.log("Redirected url: " + redirect_url);
			
			// Check whether it is just HTTPS upgrade or local redirection
			if (getTLD(details.url) === getTLD(redirect_url) || redirect_url.indexOf("/") === 0) {
				console.log("HTTPS UPGRADING OR LOCAL REDIRECT - SKIP CHECKS");
				return;
			}
			
			isRedirect = true;
			return checkPhishing(redirect_url, details);
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

// This serves as the main controller function that calls the various phishing checks
function checkPhishing(url, details) {
	/* likely need to return an array containing [immediate_failure, probability score] for each check */
	
	var similarURL = identifySimilarURL(url);
	if (url === similarURL)
	//if (false)
	{
		// Identical URL. No phishing check required.
		console.log("Identical URL. No phishing check.");
	}
	else
	{
		if (url.includes("127.0.0.1")) {
			url = "http://www." + details.url.split("/")[4].toString();
		}
		
		checkDomain(url);
		checkPageStats(url, similarURL);
		checkContent(url);
		
		var displayMessage="SmellsPhishy Evaluation Results:\n";
		if (checkDomainAgeResults[0])
		{
			displayMessage+="Domain Age: PASSED - " + checkDomainAgeResults[1] + "\n";
		}
		else
		{
			displayMessage+="Domain Age: FAILED - " + checkDomainAgeResults[1] + "\n";
		}
		
		if (checkDomainExpiryResults[0])
		{
			displayMessage+="Domain Expiry: PASSED - " + checkDomainExpiryResults[1] + "\n";
		}
		else
		{
			displayMessage+="Domain Expiry: FAILED - " + checkDomainExpiryResults[1] + "\n";
		}
		
		if (checkDomainRegistrantResults[0])
		{
			displayMessage+="Domain Registrant: PASSED - " + checkDomainRegistrantResults[1] + "\n";
		}
		else
		{
			displayMessage+="Domain Registrant: FAILED - " + checkDomainRegistrantResults[1] + "\n";
		}
		
		if (isTrafficHitsLegit[0])
		{
			displayMessage+="Traffic Hits: PASSED - " + isTrafficHitsLegit[1] + "\n";
		}
		else
		{
			displayMessage+="Traffic Hits: FAILED - " + isTrafficHitsLegit[1] + "\n";
		}
		
		if (isGlobalRankLegit[0])
		{
			displayMessage+="Global Rank: PASSED - " + isGlobalRankLegit[1] + "\n";
		}
		else
		{
			displayMessage+="Global Rank: FAILED - " + isGlobalRankLegit[1] + "\n";
		}
		
		if (checkContentResults[0])
		{
			displayMessage+="Content: PASSED - " + checkContentResults[1] + "\n";
		}
		else
		{
			displayMessage+="Content: FAILED - " + checkContentResults[1] + "\n";
		}
		
		displayMessage+="\nContinue to " + url + " ?\n";
		
		var userAction = confirm(displayMessage);
			  
		if (userAction != true) 
		{
			var blockingResponse = {};
			blockingResponse.cancel = true;
			return blockingResponse;
		}
	}
}