var slo=null;
var sola = Array();
var prev = 0;
var cur = 1;
var timi=null

$(document).ready(function() {
	sol = document.getElementById('slidy').getElementsByTagName('img')
	var sho = document.getElementById('slidya').getElementsByTagName('a');
	for(var i=1;i<sho.length-1;i++)sola.push(sho[i])		
	for(var i=1;i<sol.length;i++)sol[i].style.display = 'none';
	timi = window.setInterval('doslide()',2500);
})

function doslide()
{
	$(sol[prev]).fadeOut(500);
	$(sol[cur]).fadeIn(500);
	sola[prev].className = 'number'
	sola[cur].className = 'number select'
	
	prev = cur++;
	if(cur>sol.length-1)
	{
		cur=0;
		prev= sol.length-1;
	}
}

function prevnext(mode)
{
	window.clearInterval(timi);timi=null;
	
	if(mode)
	{
		if(cur>sol.length-1)
		{
			cur=0;
			prev= sol.length-1;
		}
		doslide();		
	}
	else
	{
		cur--;
		prev--;
		
		if(prev<0)
		{
			cur=0;
			prev= sol.length-1;
		}
		if(cur<0)
		{
			cur=sol.length-1;
			prev=cur-1 ;		
		}

		$(sol[cur]).fadeOut(500);
		$(sol[prev]).fadeIn(500);
		sola[cur].className = 'number'
		sola[prev].className = 'number select'	
	}
	timi = window.setInterval('doslide()',2000)
}

function thisisit(aiyo)
{
	cur = aiyo
	window.clearInterval(timi);timi=null;
	
	$(sol[cur]).fadeIn(500);
	$(sol[prev]).fadeOut(500);
	sola[cur].className = 'number select'
	sola[prev].className = 'number'	
	
	prev=cur
	++cur;
	if(prev<0)prev = sol.length-1;
	timi = window.setInterval('doslide()',2000)		
}
