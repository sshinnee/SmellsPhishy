// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const whoIsApiKey = "at_chfU6P2qyK8tozeFQPH1of8epIY43";
const whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?";

function displayDomainChecks() {
	var input_urls_raw = document.getElementById('user_input').value;
	var input_urls = input_urls_raw.split('\n');
	console.log(input_urls);
	var output_urls_formatted = '';
	for (var i=0; i<input_urls.length; i++) {
		var output_url = checkDomain(input_urls[i].toString())[1];
		output_urls_formatted += output_url.toString() + '<br>';
		console.log("output urls are: " + output_urls_formatted);
	}
	document.getElementById('domain_results').innerHTML = "List of Domain Results: <br><br> " + output_urls_formatted;
}

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
			return [1, "domain age is: " + domain_age.toString() + " days (passed)"];
		}
		else {
			return [0, "domain age is: " + domain_age.toString() + " days (failed)"];
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
			return [1, "days to expiry: " + days_to_expiry.toString() + " days (passed)"];
		}
		else {
			return [0, "days to expiry: " + days_to_expiry.toString() + " days (failed)"];
		}
	} catch (err) {
		console.log("there was an error in checkDomainExpiry " + err.toString());
		return [0, "- " + getErrorMessage(xml_info)];
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

function checkDomainRegistrant(xml_info) {
	try {
		var registrant = xml_info.split("<registrant>")[1].split("<name>")[1].split("</name>")[0];
		// var searchUrl = makeGoogleSearch(registrant);
		// var searchTLD = getTLD(searchUrl);

		console.log("this is the registrant: " + registrant.toString());

		return [0.5, "this is the registrant: " + registrant.toString()];
		
		// // Get registrant's website WhoIs records
		// var registrant_whoisinfo = getWhoIsInfo(url);
		// var registrant_of_registrant = registrant_whoisinfo.split("<registrant>")[1].split("<name>")[1].split("</name>");
		// if (registrant === registrant_of_registrant) {
		// 	checkDomainRegistrantPassed = 1;
		// 	console.log("REGISTRANT VERIFIED");
		// 	return [1, "REGISTRANT VERIFIED: " + registrant_of_registrant.toString()];
		// }
		// else {
		// 	console.log("REGISTRANT UNVERIFIED");
		// 	return [0, "REGISTRANT UNVERIFIED: " + registrant_of_registrant.toString()];
		// }
	} catch (err) {
		console.log("there was an error in checkDomainRegistrant " + err.toString());
		return [0, "- " + getErrorMessage(xml_info)];
	}
}

function checkDomainRegistrant(xml_info) {
	try {
		var registrant = xml_info.split("<registrant>")[1].split("<name>")[1].split("</name>")[0];
		// var searchUrl = makeGoogleSearch(registrant);
		// var searchTLD = getTLD(searchUrl);

		console.log("this is the registrant: " + registrant.toString());

		return [0.5, "this is the registrant: " + registrant.toString()];
		
	} catch (err) {
		console.log("there was an error in checkDomainRegistrant " + err.toString());
		return [0, "- " + getErrorMessage(xml_info)];
	}
}

function checkDomainRegistrantInfo(xml_info, details) {
	var to_return;
	try {
		for (i=0; i<details.length; i++) {
			var nice_name = details[i].charAt(0).toUpperCase() + details[i].substring(1);
			to_return += "<br>" + nice_name.toString() + "<br>" + xml_info.split("<" + details[i].toString() + ">")[1].split("<rawText>")[1].split("</rawText>")[0];//.replace(/nice_name/g, "<br>" + nice_name.substring());
		}
		//var registrant = xml_info.split("<registrant>")[1].split("<rawText>")[1].split("</rawText>")[0];

		// var searchUrl = makeGoogleSearch(registrant);
		// var searchTLD = getTLD(searchUrl);

		console.log("More Information about the registrant: " + to_return.toString());

		return [0.5, "More Information about the registrant: " + to_return.toString()];

	} catch (err) {
		console.log("there was an error in checkDomainRegistrant " + err.toString());
		return [0, "- " + getErrorMessage(xml_info)];
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

// Perform domain-based checks
function checkDomain(url) {
	var totalChecks = 1;
	var passedChecks = 0;
	var domainPopUpText = "";

	//alert("check domain starting");
	// Make WhoIs API call
	console.log("URL: " + url);
	var whoIsInfo = getWhoIsInfo(url);
	
	// Convert WhoIsInfo into XML
	// var parser = new DOMParser();
	// var whoIsXml = parser.parseFromString(whoIsInfo, "text/xml");
	
	// Pass through domain-related checks
	console.log("checking domain age");
	var domainAgeResult = checkDomainAge(whoIsInfo);
	passedChecks += domainAgeResult[0];
	domainPopUpText += "<br>" + domainAgeResult[1];

	console.log("checking domain expiry");
	var domainExpiryResult = checkDomainExpiry(whoIsInfo);
	passedChecks += domainExpiryResult[0];
	domainPopUpText += "<br>" + domainExpiryResult[1];

	console.log("checking domain registrant")

	var domainRegistrantResult = checkDomainRegistrantInfo(whoIsInfo, ["registrant", "technicalContact", "administrativeContact]");

	passedChecks += domainRegistrantResult[0];
	domainPopUpText += "<br>" + domainRegistrantResult[1];
		
	//return results;
	if (passedChecks > (totalChecks/2))
		return [true, domainPopUpText];
	else
		return [false, domainPopUpText];
}