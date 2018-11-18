var dictionary = readDictionaryFile("wordlist.txt");

function displaySimilarURLs() {
	var input_urls_raw = document.getElementById('user_input').value;
	var input_urls = input_urls_raw.split('\n');
	console.log(input_urls);
	var output_urls_formatted = '';
	for (var i=0; i<input_urls.length; i++) {
		var output_url = identifySimilarURL(input_urls[i].toString());
		output_urls_formatted += output_url.toString() + '<br>';
		console.log("output urls are: " + output_urls_formatted);
	}
	document.getElementById('similar_urls').innerHTML = "List of Similar URLs:<br><br> " + output_urls_formatted;
}
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

function getGoogleHit() {
	var aElems = document.getElementsByTagName("cite");
	console.log("first citation element"+aElems[0]);
	// for (var i=0; i<aElems.length; ++i) {
	//     var classesArr = aElems[i].className.split(/\s+/),
	//         classesObj = {};
	//     for (var j=0; j<classesArr.length; ++j) {
	//         classesObj[classesArr[i]] = true;
	//     }
	//     if (classesObj.hasOwnProperty("title") && classesObj.hasOwnProperty("loggedin")) {
	//         // action
	//     }
	// }
}

function getTopHit(response) {
	var el = document.createElement( 'html' );
	el.innerHTML = response;
	console.log("inside top hit function: ");
	var newurl = el.querySelectorAll('cite.iUh30')[0].outerHTML.split(">")[1].split("<")[0];
	console.log("new url from top hit function is: " + newurl);
	return newurl;//getElementByXpath('//*[@id="rso"]/div[1]/div/div/link');//"not implemented yet";
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
	var rawFile = new XMLHttpRequest();
	var query = "http://www.google.com/search?q=" + query_phrase.toString();
	var google_hit_response = httpGet(query);//makeHTTPRequestASync(query);
	console.log("google search response is: " + google_hit_response);

	var newurl = getTopHit(google_hit_response);
	//var querywindow = window.open(query, "_blank");
	//var google_key = "AIzaSyAtYqyizGNGx5fpMb9egZKjruQrDI4g1zU";
	//console.log("we are in this window: " + querywindow.document.baseURI.toString());
	//var newurl = querywindow.document.querySelectorAll('cite.iUh30');
	//var newurl = getGoogleHit();
	//var newurl = $x('//*[@id="rso"]/div[1]/div/div/link)//getElementByXpath('//*[@id="rso"]/div[1]/div/div/link');
	//document.getElementsByClassName("iUh30");
	////*[@id="rso"]/div[1]/div/div/div/div/div[1]/a/div/cite
	console.log("new url woot woot change applied: " + newurl.toString());
	//../phishing_sites/smalldoll.ga/login-yahoo-verify/index2.php
	//rawFile.open("https://www.googleapis.com/customsearch/v1?key=" + google_key + "&cx=012822220640327100223:c8gjadm06xo" + "&q=" + query_phrase.toString(), false);
	//rawFile.open("GET", "http://www.google.com/search?q=" + phrase.toString(), false);
	// rawFile.onreadystatechange = function () {
	// 	if (rawFile.readyState === 4) {
	// 		if (rawFile.status === 200 || rawFile.status == 0) {
	// 			text = rawFile.responseText;
	// 			console.log("woot we are in google page");
	// 		}
	// 	}
	// }
	// rawFile.send();
	// responseHeaders = rawFile.getAllResponseHeaders(); 
	// ////*[@id="rso"]/div/div/div[1]/div/div/div[1]/a
	// ////*[@id="rso"]/div/div/div[1]/div/div/div[1]/a
	// ////*[@id="rso"]/div[1]/div/div[1]/div/div/div[1]/a/div/cite
	// console.log("response headers for this url: " + "http://www.google.com/search?q=" + phrase.toString() + responseHeaders.toString());
	// //title = rawFile.responseText.toString().split("<title>")[1].split("</title>")[0];
	// top_hit = rawFile.responseText.split("cite class=\"iUh30\">")[1].split("</cite>")[0];
	// console.log("this is your top hit: \n" + top_hit.toString());
	// console.log("end of page");
	return newurl;//responseHeaders;//title;
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
	rawFile.send();
	responseHeaders = rawFile.getAllResponseHeaders();
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