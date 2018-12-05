#domain checks
import sys
import requests
from datetime import datetime

def days_between(d1, d2):
    d1 = datetime.strptime(d1, "%Y-%m-%d")
    d2 = datetime.strptime(d2, "%Y-%m-%d")
    return abs((d2 - d1).days)

whoIsApiKey = "at_d9ojxe6y7y6wt9YVpfB40EkhBtuWb"#"at_P21vZ2nfrHZp2olh3xD1fKa0dSZT9"#"at_iygUnzwANmj05b4tJww8O7dDwExkV"
whoIsUrl = "https://www.whoisxmlapi.com/whoisserver/WhoisService?"

def getDaysToExpiry(xml):
	expiry_date = xml.split("<expiresDateNormalized>")[1].split("</expiresDateNormalized>")[0][:10]
	print expiry_date
	now = datetime.now()
	now_string = now.strftime("%Y-%m-%d")
	days_to_expiry = days_between(expiry_date, now_string)
	return days_to_expiry

f = open(sys.argv[1], 'r')
p = open(sys.argv[2], 'a')

lines = f.readlines()

lines = lines[1000:1501]

#write headers
p.write("Domain Age, Domain Expiry, Registerer, Registrar\n")

for line in lines:
	towrite = ""
	url = str(line.split(",")[0])
	cleaned_url = url.split("//")[1]
	if cleaned_url[0:3].isdigit():
		continue
	base_url = str(cleaned_url.split("/")[0])
	print url
	apiUrl = whoIsUrl + "apiKey=" + whoIsApiKey + "&domainName=" + url
	domain_age = ""
	domain_expiry = ""
	registerer = ""
	registrar = ""
	r = None
	try: 
		r = requests.get(apiUrl)
		domain_age = r.content.split("<estimatedDomainAge>")[1].split("</estimatedDomainAge>")[0]
		domain_expiry = getDaysToExpiry(r.content)
		registrar = r.content.split("<registrarName>")[1].split("</registrarName>")[0].replace("\n", " ").replace("\r", "")
		registerer = r.content.split("<registrant>")[1].split("<country>")[1].split("</country")[0].replace("\n", " ").replace("\r", "")
		#registrar = r.content.split("<registrarName>")[1].split("</registrarName>")[0].replace("\n", " ").replace("\r", "")
		q = open("who_is_records/who_is_record_"+ str(base_url) + ".txt", "w")
		q.write(r.content)
		q.close()
	except:
		print "Unexpected error:", sys.exc_info()[0]
		registrar += " " + str(sys.exc_info()[0])
		if r:
			q = open("who_is_records/who_is_record_"+ str(base_url) + ".txt", "w")
			q.write(r.content)
			q.close()
	towrite += str(domain_age) + ", " + str(domain_expiry) + ", " + str(registerer) + ", " + str(registrar) + "\n"
	print towrite
	print lines.index(line)
	p.write(towrite)
p.close()

print "~ Domain checks completed ~"