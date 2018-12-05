#page checks
import sys
import requests

f = open(sys.argv[1], 'r')
p = open(sys.argv[2], 'w')

lines = f.readlines()

trigger_words = ["login", "password", "pw", "phone", "account", "number"]

#write headers
p.write("Contains Forms, Contains Trigger Words, Headers, Cookies, Status Code\n")

for line in lines:
	towrite = ""
	url = str(line.split(",")[0])
	print url
	contains_forms = "False"
	contains_trigger_words = "False"
	content = ""
	try: 
		r = requests.get(url, timeout=5)
		if "<form" in r.content:
			contains_forms = "True"
		for word in trigger_words:
			if word in r.content.lower():
				contains_trigger_words = "True: " + str(word)
		content = "Headers: " +  str(r.headers) + ", Content: " + str(r.cookies) + ", Status Code: " + str(r.status_code)
	except:
		contains_forms += " " + sys.exc_info()[0]
		contains_trigger_words += " " + sys.exc_info()[0]
		print "Unexpected error:", sys.exc_info()[0]
	#print lines.index(line)
	towrite += str(contains_forms) + ", " + str(contains_trigger_words) + ", " + str(content) + "\n"
	p.write(towrite)
p.close()

print "~ Content checks completed ~"
