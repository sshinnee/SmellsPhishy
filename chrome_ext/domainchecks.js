// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const whoIsApiKey = "at_chfU6P2qyK8tozeFQPH1of8epIY43";
const whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?";
var whoIsInfo = null;


// Make WhoIs API call to WhoIs service
function getWhoIsInfo(url) {
	var apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url;
	var xmlHttp = new XMLHttpRequest();
    
	xmlHttp.open("GET", apiUrl, false); // true for asynchronous 
    xmlHttp.send(null);
	whoIsInfo = xmlHttp.responseText;
	
	if (whoIsInfo.indexOf("SGNIC") > -1) {
		console.log("DOMAIN LOCATION = SG");
		return "sg";
	}
	else {
		console.log("DOMAIN LOCATION = GLOBAL");
		return "global";
	}
};

// Checks  that domain is > 1 month (31 days) old
function checkDomainAge(whoIsXml, domainLocation) {
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

// Perform domain-based checks
function checkDomain(url) {
	var totalChecks = 1;
	var passedChecks = 0;

	// Make WhoIs API call
	console.log("URL: " + url);
	var domainLocation = getWhoIsInfo(url);
	
	// Convert WhoIsInfo into XML
	var parser = new DOMParser();
	var whoIsXml = parser.parseFromString(whoIsInfo, "text/xml");
	
	// Pass through domain-related checks
	passedChecks += checkDomainAge(whoIsXml, domainLocation);
	
		
	//return results;
	if (passedChecks > (totalChecks/2))
		return true;
	else
		return false;
}