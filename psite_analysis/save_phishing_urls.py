import requests
import sys

url = "https://www.phishtank.com/phish_detail.php?phish_id="
f = open(sys.argv[1], 'a')

for i in range(5860000, 5861708): #(ranges done: [600, 708])
	try: 
		r = requests.get(url + str(i))
		website_name = r.content.split("<span style=\"word-wrap:break-word;\"><b>")[1].split("</b>")[0]
		reporter = r.content.split("<b><a href=\"user.php?username=")[1].split("\">")[0]
		print "phishing site " + str(i) + ": " + str(website_name) + ", reported by: " + str(reporter)
		f.write(str(website_name) + ", " + str(reporter) +  "\n")
		print "recorded"
	except:
		print "Unexpected error:", sys.exc_info()[0]

print "recording completed" 