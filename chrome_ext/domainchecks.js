// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const whoIsApiKey = "at_15EUQMPZzFIfXQ3KY0zF3l34ge5Jq";
const whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?";
var whoIsInfo = null;
var whoIsXml = null;
var domainLocation = null;
var registrantWhoIsInfo = null;
var registrantWhoIsXml = null;
var registrantDomainLocation = null;
var checkDomainAgeResults = [0, "Domain Not Registered!"];
var checkDomainExpiryResults = [0, "Domain Not Registered!"];
var checkDomainRegistrantResults = [0, "Domain Not Registered!"];


// Make WhoIs API call to WhoIs service
function getWhoIsInfo(url, mode) {
	var apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url;
	var xmlHttp = new XMLHttpRequest();
    
	xmlHttp.open("GET", apiUrl, false); // true for asynchronous 
    xmlHttp.send(null);
	
	if (mode === 0) {
		whoIsInfo = xmlHttp.responseText;
		
		if (whoIsInfo.indexOf("No match for domain") > -1) {
			console.log("DOMAIN IS NOT REGISTERED!");
			domainLocation = "fail";
			return
		}
	
		if (whoIsInfo.indexOf("SGNIC") > -1)
			domainLocation = "sg";
		else 
			domainLocation = "global";
		
		console.log("DOMAIN LOCATION = " + domainLocation);
	}
	else {
		registrantWhoIsInfo = xmlHttp.responseText;
	
		if (registrantWhoIsInfo.indexOf("SGNIC") > -1)
			registrantDomainLocation = "sg";
		else
			registrantDomainLocation = "global";
		
		console.log("REGISTRANT DOMAIN LOCATION = " + registrantDomainLocation);
	}
}

// Checks  that domain is > 1 month (31 days) old
function checkDomainAge() {
	var registrationDateFromXml;
	
	try {
		if (domainLocation === "global" && whoIsInfo.indexOf("createdDate") > -1) 
			registrationDateFromXml= whoIsXml.getElementsByTagName("createdDate")[0].childNodes[0].nodeValue;
		else if (whoIsInfo.indexOf("registryData") > -1 && whoIsInfo.indexOf("createdDate") > -1)
			registrationDateFromXml= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("createdDate")[0].childNodes[0].nodeValue;
		else {
			checkDomainAgeResults = [0, "Unsupported WHOIS format"];
			return 0;
		}
	}
	catch {
		checkDomainExpiryResults = [0, "Unsupported WHOIS format"];
		return 0;
	}
	
	console.log("CREATED DATE: " + registrationDateFromXml);
	
	var today = new Date();
	var registrationDate = new Date(registrationDateFromXml);
	var msInDay = 24 * 60 * 60 * 1000;

	registrationDate.setHours(0,0,0,0);
	today.setHours(0,0,0,0);

	var domainAge = (+today - +registrationDate)/msInDay;
	
	if (domainAge > 31) {
		checkDomainAgeResults = [1, "Domain Age > 1 month"];
		return 1;
	}
	else {
		checkDomainAgeResults = [0, "Domain Age < 1 month"];
		return 0;
	}
}

// Checks  that expiry is more than 6 months (186 days) away
function checkDomainExpiry() {
	var expiryDateFromXml;
	
	try {
		if (domainLocation === "global" && whoIsInfo.indexOf("expiresDate") > -1)
			expiryDateFromXml= whoIsXml.getElementsByTagName("expiresDate")[0].childNodes[0].nodeValue;
		else if (whoIsInfo.indexOf("registryData") > -1 && whoIsInfo.indexOf("expiresDate") > -1)
			expiryDateFromXml= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("expiresDate")[0].childNodes[0].nodeValue;
		else {
			checkDomainExpiryResults = [0, "Unsupported WHOIS format"];
			return 0;
		}
	}
	catch {
		checkDomainExpiryResults = [0, "Unsupported WHOIS format"];
		return 0;
	}
	
	console.log("EXPIRY DATE: " + expiryDateFromXml);
	
	var today = new Date();
	var expiryDate = new Date(expiryDateFromXml);
	var msInDay = 24 * 60 * 60 * 1000;

	expiryDate.setHours(0,0,0,0);
	today.setHours(0,0,0,0);

	var daysToExpiry = (+expiryDate - +today)/msInDay;
	
	if (daysToExpiry > 93) {
		checkDomainExpiryResults = [1, "Domain Expires After > 3 months"];
		return 1;
	}
	else {
		checkDomainExpiryResults = [0, "Domain Expires After < 3 months"];
		return 0;
	}
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
	var registrant = null;
	var registrantRegistrant = null;
	
	try {
		if (domainLocation === "global" && whoIsInfo.indexOf("organization") > -1) {
			registrant= whoIsXml.getElementsByTagName("registrant")[0].getElementsByTagName("organization")[0].childNodes[0].nodeValue;
		}
		else if (whoIsInfo.indexOf("registryData") > -1 && whoIsInfo.indexOf("registrant") > -1 && whoIsInfo.indexOf("name") > -1) {
			registrant= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("registrant")[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			registrant = (registrant.split(' \(SGNIC'))[0];
		}
		else {
			checkDomainRegistrantResults = [0, "Unsupported WHOIS format"];
			return 0;
		}
	}
	catch {
		checkDomainRegistrantResults = [0, "Unsupported WHOIS format"];
		return 0;
	}

	console.log("REGISTRANT: " + registrant);
	
	var searchUrl = makeGoogleSearch(registrant);
	var searchTLD = getTLD(searchUrl);
	
	// Get registrant's website WhoIs records
	getWhoIsInfo(searchTLD, 1);
	// Convert Registrant's WhoIsInfo into XML
	var parser = new DOMParser();
	registrantWhoIsXml = parser.parseFromString(registrantWhoIsInfo, "text/xml");
	
	console.log(registrantWhoIsXml);
	
	try {
		if (registrantDomainLocation === "global" && whoIsInfo.indexOf("registrant") > -1 && whoIsInfo.indexOf("organization") > -1) {
			registrantRegistrant = registrantWhoIsXml.getElementsByTagName("registrant")[0].getElementsByTagName("organization")[0].childNodes[0].nodeValue;
		}
		else if (whoIsInfo.indexOf("registryData") > -1 && whoIsInfo.indexOf("registrant") > -1 && whoIsInfo.indexOf("name") > -1) {
			registrantRegistrant = registrantWhoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("registrant")[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			registrantRegistrant = (registrantRegistrant.split(' \(SGNIC'))[0];
		}
		else {
			checkDomainRegistrantResults = [0, "Unsupported WHOIS format"];
			return 0;
		}
	}
	catch {
		checkDomainRegistrantResults = [0, "Unsupported WHOIS format"];
			return 0;
	}
	
	console.log("REGISTRANT'S REGISTRANT: " + registrantRegistrant);
	
	if (registrant === registrantRegistrant) {
		console.log("REGISTRANT VERIFIED");
		checkDomainRegistrantResults = [1, "Domain Registrant Verified"];
		return 1;
	}
	else {
		console.log("REGISTRANT UNVERIFIED");
		checkDomainRegistrantResults = [0, "Domain Registrant Unverified"];
		return 0;
	}
}

// Perform domain-based checks
function checkDomain(url) {
	var totalChecks = 3;
	var passedChecks = 0;

	// Reset all variables (not sure whether this is persistent through calls)
	whoIsInfo = null;
	whoIsXml = null;
	domainLocation = null;
	registrantWhoIsInfo = null;
	registrantWhoIsXml = null;
	registrantDomainLocation = null;
	checkDomainAgeResults  = [0, "Domain Not Registered!"];
	checkDomainExpiryResults  = [0, "Domain Not Registered!"];
	checkDomainRegistrantResults = [0, "Domain Not Registered!"];
	
	// Make WhoIs API call
	console.log("URL: " + url);
	getWhoIsInfo(url, 0);
	
	// Pass through checks only if domain is registered
	if (domainLocation !== "fail") {
		// Convert WhoIsInfo into XML
		var parser = new DOMParser();
		whoIsXml = parser.parseFromString(whoIsInfo, "text/xml");
		
		// Pass through domain-related checks
		passedChecks += checkDomainAge();
		passedChecks += checkDomainExpiry();
		passedChecks += checkDomainRegistrant();
	}
	
		//return results;
	if (passedChecks > (totalChecks/2))
		return true;
	else
		return false;
}