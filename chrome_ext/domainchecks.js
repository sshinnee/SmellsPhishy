// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const whoIsApiKey = "at_chfU6P2qyK8tozeFQPH1of8epIY43";
const whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?";
var whoIsInfo = null;
var whoIsXml = null;
var domainLocation = null;
var registrantWhoIsInfo = null;
var registrantWhoIsXml = null;
var registrantDomainLocation = null;
var checkDomainAgePassed = 0;
var checkDomainExpiryPassed = 0;
var checkDomainRegistrantPassed = 0;


// Make WhoIs API call to WhoIs service
function getWhoIsInfo(url, mode) {
	try {
		var apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url;
		var xmlHttp = new XMLHttpRequest();
	    
		xmlHttp.open("GET", apiUrl, false); // true for asynchronous 
	    xmlHttp.send(null);
		
		if (mode === 0) {
			whoIsInfo = xmlHttp.responseText;
		
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
			
			console.log("REGISTRANT LOCATION = " + registrantDomainLocation);
		}
	} catch (err) {
		console.log("there was an error in getWhoIsInfo " + err.toString());
	}
}

// Checks  that domain is > 1 month (31 days) old
function checkDomainAge() {

	try {
		var registrationDateFromXml;
		//alert("inside domain age check");
		console.log("inside check domain age");
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

		console.log("domain age is: " + domainAge.toString());
		
		if (domainAge > 31) {
			checkDomainAgePassed = 1;
			return 1;
		}
		else {
			return 0;
		}
	} catch (err) {
		console.log("there was an error in checkDomainAge " + err.toString());
		return 0;
	}
}

// Checks  that expiry is more than 6 months (186 days) away
function checkDomainExpiry() {

	try {
		var expiryDateFromXml;

		if (domainLocation === "global") {
			expiryDateFromXml= whoIsXml.getElementsByTagName("expiresDate")[0].childNodes[0].nodeValue;
		} else {
			expiryDateFromXml= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("expiresDate")[0].childNodes[0].nodeValue;
		}

		console.log("EXPIRY DATE: " + expiryDateFromXml);
		
		var today = new Date();
		var expiryDate = new Date(expiryDateFromXml);
		var msInDay = 24 * 60 * 60 * 1000;

		expiryDate.setHours(0,0,0,0);
		today.setHours(0,0,0,0);

		var daysToExpiry = (+expiryDate - +today)/msInDay;

		console.log("days to expiry: " + str(daysToExpiry))
		
		if (daysToExpiry < 93) {
			checkDomainExpiryPassed = 1;
			return 1;
		}
		else {
			return 0;
		}
	} catch (err) {
		console.log("there was an error in checkDomainExpiry " + err.toString());
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

	try {
		var registrant = null;
		var registrantRegistrant = null;
		
		if (domainLocation === "global") {
			registrant= whoIsXml.getElementsByTagName("registrant")[0].getElementsByTagName("organization")[0].childNodes[0].nodeValue;
		}
		else {
			registrant= whoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("registrant")[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			registrant = (registrant.split(' \(SGNIC'))[0];
		}

		console.log("REGISTRANT: " + registrant);
		
		var searchUrl = makeGoogleSearch(registrant);
		var searchTLD = getTLD(searchUrl);
		
		// Get registrant's website WhoIs records
		getWhoIsInfo(url, 1);
		// Convert Registrant's WhoIsInfo into XML
		var parser = new DOMParser();
		registrantWhoIsXml = parser.parseFromString(registrantWhoIsInfo, "text/xml");
		
		console.log(registrantWhoIsXml);
		
		if (registrantDomainLocation === "global") {
			registrantRegistrant = registrantWhoIsXml.getElementsByTagName("registrant")[0].getElementsByTagName("organization")[0].childNodes[0].nodeValue;
		}
		else {
			registrantRegistrant = registrantWhoIsXml.getElementsByTagName("registryData")[0].getElementsByTagName("registrant")[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			registrantRegistrant = (registrantRegistrant.split(' \(SGNIC'))[0];
		}
		
		console.log("REGISTRANT'S REGISTRANT: " + registrantRegistrant);
		
		if (registrant === registrantRegistrant) {
			console.log("REGISTRANT VERIFIED");
			checkDomainRegistrantPassed = 1;
			return 1;
		}
		else {
			console.log("REGISTRANT UNVERIFIED");
			return 0;
		}
	} catch (err) {
		console.log("there was an error in checkDomainRegistrant " + err.toString());
		return 0;
	}
}

// Perform domain-based checks
function checkDomain(url) {
	var totalChecks = 1;
	var passedChecks = 0;

	//alert("check domain starting");

	// Reset all variables (not sure whether this is persistent through calls)
	whoIsInfo = null;
	whoIsXml = null;
	domainLocation = null;
	registrantWhoIsInfo = null;
	registrantWhoIsXml = null;
	registrantDomainLocation = null;
	checkDomainAgePassed = 0;
	checkDomainExpiryPassed = 0;
	checkDomainRegistrantPassed = 0;

	// Make WhoIs API call
	console.log("URL: " + url);
	getWhoIsInfo(url, 0);
	
	// Convert WhoIsInfo into XML
	var parser = new DOMParser();
	whoIsXml = parser.parseFromString(whoIsInfo, "text/xml");
	
	// Pass through domain-related checks
	console.log("checking domain age");
	passedChecks += checkDomainAge();
	console.log("checking domain expiry");
	passedChecks += checkDomainExpiry();
	console.log("checking domain registrant")
	passedChecks += checkDomainRegistrant();
		
	//return results;
	if (passedChecks > (totalChecks/2))
		return true;
	else
		return false;
}