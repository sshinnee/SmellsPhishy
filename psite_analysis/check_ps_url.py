#url checks
import sys

redirecting_urls = ["goo.gl", "x.co", "bit.ly"]

f = open(sys.argv[1], 'r')
p = open(sys.argv[2], 'w')

lines = f.readlines()

#write headers
p.write("Total Length of URL, Length of Base URL, Number of Sub-Folders, Top-Level Domain, Is Redirecting URL\n")

for line in lines:
	url = str(line.split(",")[0])
	print "url: " + str(url)
	url = url.split("//")[1]
	base_url = str(url.split("/")[0])
	print "base url: "+ str(base_url)
	num_subfolders = len(url.split("/")) - 1
	print "number of subfolders: " + str(num_subfolders)
	tld = str("." + url.split("/")[0].split(".")[-1]) #str("." + url.split(".")[-1].split("/")[0])
	print "top level domain: " + str(tld)
	is_redirecting = "False"
	for x in redirecting_urls:
		if x in url:
			is_redirecting = "True: " + str(x) 
	towrite = ""
	#how long is the URL
	towrite += str(len(url)) + ", " + str(len(base_url)) + ", " + str(num_subfolders) + ", " + str(tld) + ", " + str(is_redirecting) + "\n"
	p.write(towrite)

p.close()

print "~ URL checks completed ~"

#number of sub-folders

#top-level domains

#is it a redirecting url: bit.ly or goo.gl

#contains "yahoo", "microsoft", "google", "apple", "comcast", "bank", "pay", "pal"