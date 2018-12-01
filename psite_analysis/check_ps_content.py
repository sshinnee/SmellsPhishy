#page checks
import sys
import requests

f = open(sys.argv[1], 'r')
p = open(sys.argv[2], 'w')

lines = f.readlines()

trigger_words = ["login", "password", "pw", "phone", "account", "number"]

#write headers
p.write("Contains Forms, Contains Trigger Words\n")

for line in lines:
	towrite = ""
	url = str(line.split(",")[0])
	print url
	contains_forms = "False"
	contains_trigger_words = "False"
	try: 
		r = requests.get(url)
		if "<form" in r.content:
			contains_forms = "True"
		for word in trigger_words:
			if word in r.content.lower():
				contains_trigger_words = "True: " + str(word)
	except:
		print "Unexpected error:", sys.exc_info()[0]
	towrite += str(contains_forms) + ", " + str(contains_trigger_words) + "\n"
	p.write(towrite)
p.close()

print "~ URL checks completed ~"
