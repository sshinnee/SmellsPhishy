function load_options() 
{
	chrome.storage.sync.get(['global_storage'], function(item)
	{
		document.getElementById('global_switch').checked = item.global_storage;
	});
	
	chrome.storage.sync.get(['punycode_storage'], function(item)
	{
		document.getElementById('punycode_switch').checked = item.punycode_storage;
	});
	
	chrome.storage.sync.get(['redirectcode_storage'], function(item)
	{
		document.getElementById('redirectcode_switch').checked = item.redirectcode_storage;
	});
}

window.addEventListener('load', function load(event) {	
	load_options();
	
	document.getElementById('global_switch').onchange = function() 
	{
		chrome.storage.sync.set({
			global_storage: document.getElementById('global_switch').checked
		}, function() {
			// Update status to let user know options were saved.
			//alert("Options saved");
		});
	};
	
	document.getElementById('punycode_switch').onchange = function() 
	{
		chrome.storage.sync.set({
			punycode_storage: document.getElementById('punycode_switch').checked
		}, function() {
			// Update status to let user know options were saved.
			//alert("Options saved");
		});
	};
		
	document.getElementById('redirectcode_switch').onchange = function() 
	{
		chrome.storage.sync.set({
			redirectcode_storage: document.getElementById('redirectcode_switch').checked
		}, function() {
			// Update status to let user know options were saved.
			//alert("Options saved");
		});
	}; 
});