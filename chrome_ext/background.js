// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Global Variables
var toDetectPunyCode = true;
var toDetectRedirectCode = true;

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
			var headers = details.requestHeaders, blockingResponse = {};
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
			
			var user_action = confirm("Continue with redirect?\n\n"
									  + "Status code: " + details.statusCode + "\n"
									  + "Original URL: " + details.url + "\n"
									  + "Initiator: " + details.initiator + "\n"
									  + "Redirected URL: " + redirect_url
									  + "WhoIsInfo: " + getWhoIsInfo(redirect_url));
		  
			if (user_action != true) 
			{
				blockingResponse.cancel = true;
				return blockingResponse;
			}
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

function getWhoIsInfo(url) {
	var apiUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_ydUtZpQodw1xHDcjPenlRDVfFitlB&domainName=" + url;
	var whoIsInfo;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", apiUrl, true); // true for asynchronous 
    xmlHttp.send(null);
	whoIsInfo = xmlHttp.responseText;
	return whoIsInfo;
};