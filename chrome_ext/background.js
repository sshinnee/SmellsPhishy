// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Global Variables
var toDetectPunyCode = true;
var toDetectRedirectCode = true;
var dictionary = readDictionaryFile("wordlist.txt");

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
	
// Perform checks on page stats
function checkPageStats(reqUrl, posOrigUrl)
{
	//var reqUrl="http://www.bankofamerica.concerninglife.com/";
	//var posUrl="https://www.bankofamerica.com/";
	//console.log(reqUrl);
	//console.log(posUrl);
	//checkPageStats(reqUrl, posUrl);
	
	var apiKey="a60267b0831842808a637bbce385d829";
	
	// Remove http, https, :// www. and the ending /
	// The url needs to be in (eg. cnn.com)
	reqUrl = reqUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]
	posOrigUrl = posOrigUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]
	
	// Traffic Hits
	// Compare if requesting URL has lesser or equal website traffic when comparing with possible original url
	// OR if requesting URL has lesser or equal website traffic when comparing with arbitrary traffic hits of 50000.00
	var isTrafficHitsLegit=checkWebsiteTraffic(reqUrl, posOrigUrl, apiKey);
	
	// Global rank
	// Compare if requesting URL has lesser or equal global rank when comparing with possible original url
	// OR if requesting URL has lesser or equal global rank when comparing with arbitrary rank of 10000.
	var isGlobalRankLegit=checkGlobalRank(reqUrl, posOrigUrl, apiKey);
	
	// Results
	if (isTrafficHitsLegit && isGlobalRankLegit)
	{
		console.log("PageStats ("+reqUrl+") Legit");
	}
	else
	{
		console.log("PageStats ("+reqUrl+") Not Legit");
		console.log("TrafficHits: "+isTrafficHitsLegit);
		console.log("GlobalRank: "+isGlobalRankLegit);
	}
}

function checkGlobalRank(reqUrl, posOrigUrl, apiKey)
{
	var EPSILON = 0.0001;
	var isGlobalRankLegit=false;
	var arbitraryRank=10000.00;
	var numOfRankAgainstOrigUrl=0;
	
	// Request for global rank (Global and Country Rank)
	var startDate="2018-08";
	var endDate="2018-10";
	var mainDomain=false;
	
	// Requesting Website
	var reqApiUrl="https://api.similarweb.com/v1/website/"+reqUrl+"/global-rank/global-rank?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&main_domain_only="+mainDomain;
	
	// Possible Original Website
	var posOrigApiUrl="https://api.similarweb.com/v1/website/"+posOrigUrl+"/global-rank/global-rank?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&main_domain_only="+mainDomain;
	
	// Request for information for user requested website
	var reqXmlHttp = new XMLHttpRequest();
    reqXmlHttp.open("GET", reqApiUrl, false); // true for asynchronous 
    reqXmlHttp.send(null);
	var reqResponse = reqXmlHttp.responseText;
	var reqObj = JSON.parse(reqResponse);
	console.log(reqObj);
	
	// Request for information for possible original website
	var posOrigXmlHttp = new XMLHttpRequest();
    posOrigXmlHttp.open("GET", posOrigApiUrl, false); // true for asynchronous 
    posOrigXmlHttp.send(null);
	var posOrigResponse = posOrigXmlHttp.responseText;
	var posOrigObj = JSON.parse(posOrigResponse);
	console.log(posOrigObj);
	
	// Verify that user requested website rank is better or equal to possible original site
	// Verify that both requests are successful
	// Compare both sites on global rank
	// If the request sites has lower or equal than the possible original site, it should be legit
	if ((reqObj.meta.status == 'Success') && (posOrigObj.meta.status == 'Success'))
	{				
		// Compare both sites on global ranking.
		for (var count=0; count < reqObj.global_rank.length; count++)
		{
			// If request object global_rank is lesser than or equal to possible original site, then it could be legit.
			if ((reqObj.global_rank[count].global_rank < posOrigObj.global_rank[count].global_rank) || (reqObj.global_rank[count].global_rank == posOrigObj.global_rank[count].global_rank))
			{
				numOfRankAgainstOrigUrl++;
			}
			else
			{
				// Greater than possible original site.
			}
		}
		
		// Check percentage of global rank is more than 50%
		if ((numOfRankAgainstOrigUrl / reqObj.global_rank.length) >= 0.5)
		{
			isGlobalRankLegit = true;
		}
		else
		{
			isGlobalRankLegit = false;
		}
	}
	// One of the two sites request is not successful
	// If the requesting site is successful, we will assume there is an arbitrary global rank.
	// If the global rank is lesser than this arbitrary global rank, this means it is a possible legit requesting website.
	else if (reqObj.meta.status == 'Success')
	{
		// Compare both sites on global rank.
		for (var count=0; count < reqObj.global_rank.length; count++)
		{
			// If request object global_rank is lesser than or equal to possible original site, then it could be legit.
			if ((reqObj.global_rank[count].global_rank < arbitraryRank) || ((reqObj.global_rank[count].global_rank - arbitraryRank) < EPSILON))
			{
				numOfRankAgainstOrigUrl++;
			}
			else
			{
				// Greater than possible original site.
			}
		}
		
		// Check percentage of global rank more than 50%
		if ((numOfRankAgainstOrigUrl / reqObj.global_rank.length) >= 0.5)
		{
			isGlobalRankLegit = true;
		}
		else
		{
			isGlobalRankLegit = false;
		}
	}
	else
	{
		// Request failed.
		console.log("(GlobalRank) Requesting URL status: " + reqObj.meta.status);
		if (reqObj.meta.status == 'Error')
		{
			console.log("(GlobalRank) Requesting URL status: " + reqObj.meta.error_code + " - " + reqObj.meta.error_message);
		}
		
		console.log("(GlobalRank) Original URL status: " + posOrigObj.meta.status);
		if (posOrigObj.meta.status == 'Error')
		{
			console.log("(GlobalRank) Original URL status: " + posOrigObj.meta.error_code + " - " + posOrigObj.meta.error_message);
		}
	}
	
	return isGlobalRankLegit;
}

function checkWebsiteTraffic(reqUrl, posOrigUrl, apiKey)
{
	var EPSILON = 0.0001;
	var arbitraryTraffic=50000.00;
	var numOfVisitAgainstOrigUrl=0;
	var isTrafficHitsLegit=false;
	
	// Request for total traffic (Total Traffic API)
	var startDate="2018-08";
	var endDate="2018-10";
	var mainDomain=false;
	var granularity="monthly";
	
	// Requesting Website
	var reqApiUrl="https://api.similarweb.com/v1/website/"+reqUrl+"/total-traffic-and-engagement/visits?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&main_domain_only="+mainDomain+"&granularity="+granularity;
	
	// Possible Original Website
	var posOrigApiUrl="https://api.similarweb.com/v1/website/"+posOrigUrl+"/total-traffic-and-engagement/visits?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&main_domain_only="+mainDomain+"&granularity="+granularity;
	
	// Request for information for user requested website
	var reqXmlHttp = new XMLHttpRequest();
    reqXmlHttp.open("GET", reqApiUrl, false); // true for asynchronous 
    reqXmlHttp.send(null);
	var reqResponse = reqXmlHttp.responseText;
	var reqObj = JSON.parse(reqResponse);
	console.log(reqObj);
	
	// Request for information for possible original website
	var posOrigXmlHttp = new XMLHttpRequest();
    posOrigXmlHttp.open("GET", posOrigApiUrl, false); // true for asynchronous 
    posOrigXmlHttp.send(null);
	var posOrigResponse = posOrigXmlHttp.responseText;
	var posOrigObj = JSON.parse(posOrigResponse);
	console.log(posOrigObj);
	
	// Verify that both requests are successful
	// Compare both sites on traffic visits
	// If the request sites has greater or equal than the possible original site, it should be legit
	if ((reqObj.meta.status == 'Success') && (posOrigObj.meta.status == 'Success'))
	{				
		// Compare both sites on traffic visits.
		for (var count=0; count < reqObj.visits.length; count++)
		{
			// If request object visits is greater than or equal to possible original site, then it could be legit.
			if ((reqObj.visits[count].visits > posOrigObj.visits[count].visits) || ((reqObj.visits[count].visits - posOrigObj.visits[count].visits) < EPSILON))
			{
				numOfVisitAgainstOrigUrl++;
			}
			else
			{
				// Lesser than possible original site.
			}
		}
		
		// Check percentage of traffic hits is more than 50%
		if ((numOfVisitAgainstOrigUrl / reqObj.visits.length) >= 0.5)
		{
			isTrafficHitsLegit = true;
		}
		else
		{
			isTrafficHitsLegit = false;
		}
	}
	// One of the two sites request is not successful
	// If the requesting site is successful, we will assume there is an arbitrary traffic number.
	// If the traffic is more than this arbitrary number, this means it is a possible legit requesting website.
	else if (reqObj.meta.status == 'Success')
	{
		// Compare both sites on traffic visits.
		for (var count=0; count < reqObj.visits.length; count++)
		{
			// If request object visits is greater than or equal to possible original site, then it could be legit.
			if ((reqObj.visits[count].visits > arbitraryTraffic) || ((reqObj.visits[count].visits - arbitraryTraffic) < EPSILON))
			{
				numOfVisitAgainstOrigUrl++;
			}
			else
			{
				// Lesser than possible original site.
			}
		}
		
		// Check percentage of traffic hits is more than 50%
		if ((numOfVisitAgainstOrigUrl / reqObj.visits.length) >= 0.5)
		{
			isTrafficHitsLegit = true;
		}
		else
		{
			isTrafficHitsLegit = false;
		}
	}
	else
	{
		// Request failed.
		console.log("(TrafficHit) Requesting URL status: " + reqObj.meta.status);
		if (reqObj.meta.status == 'Error')
		{
			console.log("(TrafficHit) Requesting URL status: " + reqObj.meta.error_code + " - " + reqObj.meta.error_message);
		}
		
		console.log("(TrafficHit) Original URL status: " + posOrigObj.meta.status);
		if (posOrigObj.meta.status == 'Error')
		{
			console.log("(TrafficHit) Original URL status: " + posOrigObj.meta.error_code + " - " + posOrigObj.meta.error_message);
		}
	}
	
	return isTrafficHitsLegit;
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
		
		var userAction = confirm("Continue with redirect?\n\n"
								 + "Status code: " + details.statusCode + "\n"
								 + "Original URL: " + details.url + "\n"
								 + "Initiator: " + details.initiator + "\n"
								 + "Redirected URL: " + url + "\n"
								 + "WhoIs: " + checkDomain(url));
			  
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