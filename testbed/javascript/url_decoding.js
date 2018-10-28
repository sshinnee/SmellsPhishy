var dictionary = readDictionaryFile("wordlist.txt");

function displaySimilarURLs() {
	var input_urls_raw = document.getElementById('user_input').value;
	var input_urls = input_urls_raw.split('\n');
	console.log(input_urls);
	var output_urls_formatted = '';
	for (var i=0; i<input_urls.length; i++) {
		var output_url = identifySimilarURL(input_urls[i].toString());
		output_urls_formatted += output_url.toString() + '<br>';

	}
	document.getElementById('similar_urls').innerHTML = "List of Similar URLs:<br><br> " + output_urls_formatted;
}
function identifySimilarURL(url) {
	var newurl = readPageTitle(url);
	console.log("our new similar url: " + newurl.toString());
	// if (containsUnusualCharacters(url)) {
	// 	newurl = removeHomographs(url);
	// }
	//read page title
	//tokenize the url
	newurl = makeGoogleSearch(newurl);
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

function makeGoogleSearch(phrase) {
	console.log("trying to read this url now: " + url.toString());
	var title = "";
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", "http://www.google.com/search?q=" + phrase.toString(), false);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				text = rawFile.responseText;
				console.log("woot we are in google page");
			}
		}
	}
	rawFile.send();
	responseHeaders = rawFile.getAllResponseHeaders(); 
	////*[@id="rso"]/div/div/div[1]/div/div/div[1]/a
	////*[@id="rso"]/div/div/div[1]/div/div/div[1]/a
	console.log("response headers for this url: " + responseHeaders.toString());
	title = rawFile.responseText.toString().split("<title>")[1].split("</title>")[0];
	console.log("this is your page: \n" + title.toString());
	console.log("end of page");
	return title;//responseHeaders;//title;
}

function readDictionaryFile(filename) {
	var text = "";
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, false);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				text = rawFile.responseText;
				console.log("we actually got in here")
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