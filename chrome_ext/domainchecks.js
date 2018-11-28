// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const whoIsApiKey = "at_UpfusZDlQq9mgyVaW7d9bQXxY2DnN";//"at_15EUQMPZzFIfXQ3KY0zF3l34ge5Jq";
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

function getDayDifference(date1, date2) {
	//assumes date1 and date2 are Date Objects
	var one_day_ms=1000*60*60*24;

	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	var diff = (date1_ms-date2_ms)*1.0/one_day_ms

	console.log("diff between " + date1.toDateString() + " " + date2.toDateString() + " is: " + diff.toString() + " days");
	return parseInt(diff)
}

// Make WhoIs API call to WhoIs service
function getWhoIsInfo(url) {
	try {
		var apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url;
		var xmlHttp = new XMLHttpRequest();
	    
		xmlHttp.open("GET", apiUrl, false); // true for asynchronous 
	    xmlHttp.send(null);
		
		console.log(xmlHttp.responseText);

		return xmlHttp.responseText;
		
	} catch (err) {
		console.log("there was an error in getWhoIsInfo " + err.toString());
		return "";
	}
};

// Checks  that domain is > 1 month (31 days) old
function checkDomainAge(xml_info) {
	try {
		//alert("inside domain age check");
		console.log("inside check domain age");
		var registration_date = xml_info.split("<registryData>")[1].split("<createdDateNormalized>")[1].substring(0, 10);
		console.log("this is our raw registration date: " + registration_date.toString());

		//create a new Date object
		var registration_date_obj = new Date(parseInt(registration_date.substring(0, 4)), parseInt(registration_date.substring(5, 7))-1, parseInt(registration_date.substring(8, 10)));
		
		console.log("this is our registration date from date object: " + registration_date_obj.toString());

		var todays_date = new Date();

		console.log("this is today's date: " + todays_date.toString());
		
		var domain_age = getDayDifference(todays_date, registration_date_obj);

		if (domain_age > 31) {
			checkDomainAgePassed = 1;
			checkDomainAgeResults = [1, "domain age is: " + domain_age.toString() + " days (passed)"];
			return 1;
		}
		else {
			checkDomainAgeResults = [0, "domain age is: " + domain_age.toString() + " days (failed)"];
			return 0;
		}
	} catch (err) {
		console.log("there was an error in checkDomainAge " + err.toString());
		return [0, "- " + getErrorMessage(xml_info)];
	}
}

// Checks  that expiry is more than 6 months (186 days) away
function checkDomainExpiry(xml_info) {
	try {
		//alert("inside domain expiry check");
		console.log("inside check domain expiry");
		var expiration_date = xml_info.split("<registryData>")[1].split("<expiresDateNormalized>")[1].substring(0, 10);
		console.log("this is our raw expiry date: " + expiration_date.toString());

		//create a new Date object
		var expiration_date_obj = new Date(parseInt(expiration_date.substring(0, 4)), parseInt(expiration_date.substring(5, 7))-1, parseInt(expiration_date.substring(8, 10)));
		
		console.log("this is our expiration date from date object: " + expiration_date_obj.toString());

		var todays_date = new Date();

		console.log("this is today's date: " + todays_date.toString());
		
		var days_to_expiry = getDayDifference(expiration_date_obj, todays_date);

		if (days_to_expiry > 93) {
			checkDomainExpiryPassed = 1;
			checkDomainExpiryResults = [1, "days to expiry: " + days_to_expiry.toString() + " days (passed)"];
			return 1
		}
		else {
			checkDomainExpiryResults = [0, "days to expiry: " + days_to_expiry.toString() + " days (failed)"];
			return 0;
		}
	} catch (err) {
		console.log("there was an error in checkDomainExpiry " + err.toString());
		checkDomainExpiryResults = [0, "- " + getErrorMessage(xml_info)];
		return 0;
	}
}

function getErrorMessage(xml_info) {
	try {
		var error_message = xml_info.split("<dataError>")[1].split("</dataError>")[0];
		return error_message;
	} catch (err) {
		console.log("there was an error getting the error message");
		return "";
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
	var domainPopUpText = "";
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
	var whoIsInfo = getWhoIsInfo(url);

	console.log("checking domain age");
	var domainAgeResult = checkDomainAge(whoIsInfo);
	passedChecks += checkDomainAgeResults[0];
	domainPopUpText += "<br>" + checkDomainAgeResults[1];

	console.log("checking domain expiry");
	var domainExpiryResult = checkDomainExpiry(whoIsInfo);
	passedChecks += checkDomainExpiryResults[0];
	domainPopUpText += "<br>" + checkDomainExpiryResults[1];

	console.log("checking domain registrant")

	checkDomainRegistrant();

	//var domainRegistrantResult = checkDomainRegistrantInfo(whoIsInfo, ["registrant", "technicalContact", "administrativeContact"]);
	
	passedChecks += checkDomainRegistrantResults[0];
	domainPopUpText += "<br>" + checkDomainRegistrantResults[1];

	console.log(domainPopUpText);
	//return results;
	if (passedChecks > (totalChecks/2))
		return true;
	else
		return false;
}