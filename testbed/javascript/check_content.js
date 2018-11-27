var checkContentResults = [0, "No Content Results!"];

function displayPageContentChecks() {
	var input_urls_raw = document.getElementById('user_input').value;
	var input_urls = input_urls_raw.split('\n');
	console.log(input_urls);
	var output_urls_formatted = '';
	for (var i=0; i<input_urls.length; i++) {
		var output_url = checkContent(input_urls[i].toString());
		output_urls_formatted += output_url.toString() + '<br>';
		console.log("output urls are: " + output_urls_formatted);
	}
	document.getElementById('content_results').innerHTML = "Page Content Check:<br><br> " + output_urls_formatted;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log("returning response from httpGet: " + xmlHttp.responseText);
    return xmlHttp.responseText;
}

function checkContent(url) {
	var phishingText = httpGet(url);
	var strFormArray = phishingText.split("<form");
	var indForm;
	var likelyPhishing = false;
	var suspiciousWords = ["password", "login", "address", "userid", "username"];

	var return_string = "Checking Content of: " + url.toString() + "<br>";
	// Reset value
	checkContentResults = [0, "No Content Results!"];
	
	if (strFormArray.length > 1) {
		likelyPhishing = true;
		for (var i = 1; i < strFormArray.length; i++) {
			indForm = strFormArray[i].substr(0, strFormArray[i].indexOf("</form>"));
			//console.log("PK: " + indForm);

			for (var j = 0; j < suspiciousWords.length; j++) {
				if (indForm.toLowerCase().includes(suspiciousWords[j])) {
					likelyPhishing = true;
				}
			}
		}
	}

	console.log("PK: " + likelyPhishing);
	
	if (likelyPhishing)
	{
		checkContentResults = [0, "Form was detected"];
	}
	else
	{
		checkContentResults = [1, "Form was not detected"];
	}

	return return_string + checkContentResults[1].toString()
}
