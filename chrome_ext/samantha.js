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
    //console.log("returning response from httpGet: " + xmlHttp.responseText);
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
    //console.log("random blah: " + url);
    //return xmlHttp.responseText;
}

function makeGoogleSearch(phrase) {
	var query_phrase = phrase.replace(/\s+/g, "+");
	console.log("trying to read make google request for this: " + phrase.toString());
	var query = "http://www.google.com/search?q=" + query_phrase.toString();
	var google_hit_response = httpGet(query);//makeHTTPRequestASync(query);
	//console.log("google search response is: " + google_hit_response);

	var newurl = getTopHit(google_hit_response);
	//console.log("new url woot woot change applied: " + newurl.toString());

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
	phishingText = rawFile.responseText; //assigning responseText to phishingText
	console.log("assigned response text to global var phishingText");
	//console.log("this is the phishing text: " + phishingText);
	return title;//responseHeaders;//title;
}

function evaluateURL(url) {
	//[immediate flag]does the url have multiple '.' after '.com'?
	//[suspicious flag]suspicious domains [.VE, .CC, .TK, .PW, .GA, .CF, .GQ, .ML, .BD, .KE, .CENTER, .NG,
	//.PK, .RU] <- this list was gotten from https://docs.apwg.org/reports/APWG_Global_Phishing_Report_2015-2016.pdf
	//[slightly suspicious flag] [.TOP, .XYZ, .ONLINE, .WIN, .SITE, .LINK, .CLUB, .WEBSITE
	//.CENTER, .TRADE] 
	suspect_domains = [".VE", ".CC", ".TK", ".PW", ".GA", ".CF", ".GQ", ".ML", ".BD", ".KE", ".CENTER", ".NG", ".PK", ".RU"];
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
