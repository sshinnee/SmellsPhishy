var checkContentResults = [0, "No Content Results!"];

function checkContent(url) {
	var strFormArray = phishingText.split("<form");
	var indForm;
	var likelyPhishing = false;
	var suspiciousWords = ["password", "login", "address", "userid", "username"];

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
}
