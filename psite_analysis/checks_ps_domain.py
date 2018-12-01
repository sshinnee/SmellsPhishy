#domain checks
import sys
import requests

whoIsApiKey = "at_iygUnzwANmj05b4tJww8O7dDwExkV"
whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?"

def getDaysToExpiry(xml):
	ex

f = open(sys.argv[1], 'r')
p = open(sys.argv[2], 'w')

lines = f.readlines()

lines = lines[:501]

#write headers
p.write("Domain Age, Domain Expiry, Registerer, Location\n")

for line in lines:
	towrite = ""
	url = str(line.split(",")[0])
	apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url
	domain_age = ""
	domain_expiry = ""
	registerer = ""
	country_code = ""
	try: 
		r = requests.get(apiUrl)
		domain_age = r.content.split("<estimatedDomainAge>")[1].split("</estimatedDomainAge>")[0]
		domain_expiry = getDaysToExpiry(r.content)
	except:
		print "Unexpected error:", sys.exc_info()[0]
	towrite += str(domain_age) + ", " + str(domain_expiry) + ", " + str(registerer) + ", " + str(country_code) + "\n"
	p.write(towrite)
p.close()