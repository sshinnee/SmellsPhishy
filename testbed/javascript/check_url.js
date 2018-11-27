var suspicious_tlds = [".VE", ".CC", ".TK", ".PW", ".GA", ".CF", ".GQ", ".ML", ".BD", ".KE", ".CENTER", ".NG", ".PK", ".RU"];
var unusual_domains = [".TOP", ".XYZ", ".ONLINE", ".WIN", ".SITE", ".LINK", ".CLUB", ".WEBSITE", ".CENTER", ".TRADE"];
// ., %, ?, / were excluded because they are more common
var special_characters = ['!', '@', '#', '$', '%', 'ˆ', 'ˆ', '*', '(', ')', '˜', '`', '-', ':', ';', '\'', '"', '<', ',', '>', '|'];
var common_punctuation = ['.', '%', '?', '+', '&', '_', '=', '/'];

function displayURLChecks(url) {
	var input_urls_raw = document.getElementById('user_input').value;
	var input_urls = input_urls_raw.split('\n');
	console.log(input_urls);
	var output_urls_formatted = '';
	for (var i=0; i<input_urls.length; i++) {
		var output_url = evaluateURL(input_urls[i].toString());
		output_urls_formatted += output_url.toString() + '<br>';
		console.log("output urls are: " + output_urls_formatted);
	}
	document.getElementById('url_results').innerHTML = "List of URL Results:<br><br> " + output_urls_formatted;
}

function evaluateURL(url) {
	//[immediate flag]does the url have multiple '.' after '.com'?
	//[suspicious flag]suspicious domains [.VE, .CC, .TK, .PW, .GA, .CF, .GQ, .ML, .BD, .KE, .CENTER, .NG,
	//.PK, .RU] <- this list was gotten from https://docs.apwg.org/reports/APWG_Global_Phishing_Report_2015-2016.pdf
	//[slightly suspicious flag] [.TOP, .XYZ, .ONLINE, .WIN, .SITE, .LINK, .CLUB, .WEBSITE
	//.CENTER, .TRADE] 
	var clean = true;
	var return_string = "<br>evaluating: " + url.toString() + "<br>";
	url = url.toUpperCase();
	console.log(url);
	var url_parts = url.split('\.');
	console.log(url_parts);
	var url_folders = url_parts[url_parts.length-1].split("/");
	var first_domain = url_parts[0];
	//homograph check
	if (url.includes("xn--") || !isAsciiPrintable(url)) {
		return_string += "URL Flag: url contains homographs<br>";
	}
	//unsual punctuations for first domain
	for (i=0; i<common_punctuation.length; i++) {
		if (first_domain.includes(common_punctuation[i])) {
			return_string += "URL Flag: an unusual character " + common_punctuation[i] + " was found in your first domain. <br>";
		}
	}
	var com_split = url.split(".COM");
	if (com_split[com_split.length-1].split(".").length > 1) {
		return_string += "URL Flag: some other domains after .com, which is unusual<br>";
	}
	//special character check
	for (i=0; i<special_characters.length; i++) {
		if (url.includes(special_characters[i])) {
			return_string += "URL Flag: an unusual character " + special_characters[i] + " was found in your url. <br>";
		}
	}
	//suspicious domains
	for (i=0; i<suspicious_tlds.length; i++) {
		if (url.includes(suspicious_tlds[i])) {
			return_string += "URL Flag: a suspicious domain " + suspicious_tlds[i] + " was found in your url. <br>";
		}
	}
	//unusual domains
	for (i=0; i<unusual_domains.length; i++) {
		if (url.includes(unusual_domains[i])) {
			return_string += "URL Flag: an unusual domain " + unusual_domains[i] + " was found in your url. <br>";
		}
	}

	if (clean) {
		return_string += "Congratulations! No URL Flags found. <br>";
	}
	return_string += "Your URL has " + url_parts.length.toString() + " domains and "+ url_folders.length.toString() + " trailing folders.";
	return return_string;
}

function isAsciiPrintable(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
/*    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
*/
    if (!(code > 31 && code < 127)) {
      return false;
    }
  }
  return true;
};
