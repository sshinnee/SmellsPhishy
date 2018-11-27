// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Debug
//var reqUrl="http://www.bankofamerica.concerninglife.com/";
//var posUrl="https://www.google.com/";
//var reqUrl="https://www.bankofamerica.com/";
//console.log(reqUrl);
//console.log(posUrl);
//checkPageStats(reqUrl, posUrl);

// backupApiKey="1308633d61e8496d9200a6a2303e81a1";
var pageStatsApiKey="ce17f518e2514b768d5b3a96ec3240b5";
var urlGlobalRankThreshold = 10; // Threshold: possible url rank +- 10 ranks.
var urlVisitThresholdPercentage = 0.5; // requestingUrlVisits Threshold: +- 0.5*possibleOriginalUrlVisits

var isTrafficHitsLegit = [0, "No Traffic Hits!"];
var isGlobalRankLegit = [0, "No Global Rank!"];

function displaySiteStatistics() {
		var input_urls_raw = document.getElementById('user_input').value;
	var input_urls = input_urls_raw.split('\n');
	console.log(input_urls);
	var output_urls_formatted = '';
	for (var i=0; i<input_urls.length; i++) {
		var output_url = getGlobalRank(input_urls[i].toString());
		output_urls_formatted += output_url.toString() + '<br>';
		output_url = getWebsiteTraffic(input_urls[i].toString());
		output_urls_formatted += output_url.toString() + '<br>';
		console.log("output urls are: " + output_urls_formatted);
	}
	document.getElementById('site_results').innerHTML = "List of Site Results:<br><br> " + output_urls_formatted;
}

// Obtain global rank of a particular url from API call.
function getGlobalRank(url)
{
	// Request for global rank (Global and Country Rank)
	var startDate="2018-10";
	var endDate="2018-10";
	var mainDomain=false;

	url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]
	
	var return_string = "Global Rank of " + url.toString() + ":<br>";
	// Requesting Website
	var reqApiUrl="https://api.similarweb.com/v1/website/"+url+"/global-rank/global-rank?api_key="+pageStatsApiKey+"&start_date="+startDate+"&end_date="+endDate+"&main_domain_only="+mainDomain;
	
	// Request for information for user requested website
	var reqXmlHttp = new XMLHttpRequest();
    reqXmlHttp.open("GET", reqApiUrl, false); // true for asynchronous 
    reqXmlHttp.send(null);
	var reqResponse = reqXmlHttp.responseText;
	var reqObj = JSON.parse(reqResponse);
	
	console.log("Global Rank: " + url);
	console.log(reqObj);
	
	return_string += "<br>" + reqResponse.toString() + "<br>";
	return return_string;
}

// Obtain web traffic of a particular url from API call.
function getWebsiteTraffic(url)
{	
	// Request for total traffic (Total Traffic API)
	var startDate="2018-10";
	var endDate="2018-10";
	var mainDomain=false;
	var granularity="monthly";

	url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]
	
	var return_string = "Traffic Rank of " + url.toString() + ":<br>";
	// Requesting Website
	var reqApiUrl="https://api.similarweb.com/v1/website/"+url+"/total-traffic-and-engagement/visits?api_key="+pageStatsApiKey+"&start_date="+startDate+"&end_date="+endDate+"&main_domain_only="+mainDomain+"&granularity="+granularity;
	
	// Request for information for user requested website
	var reqXmlHttp = new XMLHttpRequest();
    reqXmlHttp.open("GET", reqApiUrl, false); // true for asynchronous 
    reqXmlHttp.send(null);
	var reqResponse = reqXmlHttp.responseText;
	var reqObj = JSON.parse(reqResponse);
	
	console.log("Website Traffic: " + url);
	console.log(reqObj);

	//return_string += reqObj.toString();
	
	return_string += "<br>" + reqResponse.toString() + "<br>";
	return return_string;
	//return reqObj;
}