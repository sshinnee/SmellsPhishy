// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const whoIsApiKey = "at_chfU6P2qyK8tozeFQPH1of8epIY43";
const whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?";
var whoIsInfo = null;
var whoIsXml = null;
var domainLocation = null;


// Make WhoIs API call to WhoIs service
function getWhoIsInfo(url) {
	var apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url;
	var xmlHttp = new XMLHttpRequest();
    
	xmlHttp.open("GET", apiUrl, false); // true for asynchronous 
    xmlHttp.send(null);
	whoIsInfo = xmlHttp.responseText;
	
	if (whoIsInfo.indexOf("SGNIC") > -1) {
		console.log("DOMAIN LOCATION = SG");
		domainLocation = "sg";
	}
	else {
		console.log("DOMAIN LOCATION = GLOBAL");
		domainLocation = "global";
	}
};

// Checks  that domain is > 1 month (31 days) old
function checkDomainAge(domainLocation) {
	var registrationDateFromXml;

	if (domainLocation === "global")
		registrationDateFromXml= whoIsXml.getElementsByTagName("createdDate")[0].childNodes[0].nodeValue;
	else
		registrationDateFromXml= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("createdDate")[0].childNodes[0].nodeValue;

	console.log("CREATED DATE: " + registrationDateFromXml);
	
	var today = new Date();
	var registrationDate = new Date(registrationDateFromXml);
	var msInDay = 24 * 60 * 60 * 1000;

	registrationDate.setHours(0,0,0,0);
	today.setHours(0,0,0,0);

	var domainAge = (+today - +registrationDate)/msInDay;
	
	if (domainAge > 31)
		return 1;
	else
		return 0;
}

// Checks  that expiry is more than 6 months (186 days) away
function checkDomainExpiry(domainLocation) {
	var expiryDateFromXml;

	if (domainLocation === "global")
		expiryDateFromXml= whoIsXml.getElementsByTagName("expiresDate")[0].childNodes[0].nodeValue;
	else
		expiryDateFromXml= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("expiresDate")[0].childNodes[0].nodeValue;

	console.log("EXPIRY DATE: " + expiryDateFromXml);
	
	var today = new Date();
	var expiryDate = new Date(expiryDateFromXml);
	var msInDay = 24 * 60 * 60 * 1000;

	expiryDate.setHours(0,0,0,0);
	today.setHours(0,0,0,0);

	var daysToExpiry = (+expiryDate - +today)/msInDay;
	
	if (daysToExpiry < 93)
		return 1;
	else
		return 0;
}

// Get the top level domain (TLD) from a URL
function getTLD(url) {
	var urlArray = url.split('/');
	var TLD = null;
	
	if (url.indexOf("http") === 0)
		TLD = urlArray[2];
	else
		TLD = urlArray[0];
	/*
	console.log("TLD[0]: " + urlArray[0]);
	console.log("TLD[1]: " + urlArray[1]);
	console.log("TLD[2]: " + urlArray[2]);
	console.log("TLD[3]: " + urlArray[3]);
	console.log("TLD[4]: " + urlArray[4]);
	console.log("TLD[5]: " + urlArray[5]);
	*/
	console.log("TLD: " + TLD);
	return TLD;
}

function checkDomainRegistrant() {
		var registrant;

	if (domainLocation === "global")
		registrant= whoIsXml.getElementsByTagName("registrant")[0].getElementsByTagName("organization")[0].childNodes[0].nodeValue;
	else
		registrant= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("registrant")[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
		registrant = (registrant.split(' \(SGNIC'))[0];

	console.log("REGISTRANT: " + registrant);
	
	var searchUrl = makeGoogleSearch(registrant);
	var searchTLD = getTLD(searchUrl);
	
	return 1;
}


// Perform domain-based checks
function checkDomain(url) {
	var totalChecks = 1;
	var passedChecks = 0;

	// Make WhoIs API call
	console.log("URL: " + url);
	getWhoIsInfo(url);
	
	// Convert WhoIsInfo into XML
	var parser = new DOMParser();
	whoIsXml = parser.parseFromString(whoIsInfo, "text/xml");
	
	// Pass through domain-related checks
	passedChecks += checkDomainAge();
	passedChecks += checkDomainExpiry();
	passedChecks += checkDomainRegistrant();
		
	//return results;
	if (passedChecks > (totalChecks/2))
		return true;
	else
		return false;
}