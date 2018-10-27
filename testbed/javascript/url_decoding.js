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
	return url + " hello";
}

function evaluateURL(url) {
	return;
}

function sanitizeURL(url) {
	var flags = [];
	if url.containsUnusualCharacters() {
		flags.push(['uc']);
	} else {
		return;
	}
}

function removeHomographs(url) {
	return;
}