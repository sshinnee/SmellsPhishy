from selenium import webdriver
import sys
import os

number_to_download = sys.argv[1]
file_to_copy_to = sys.argv[2]

existing_ps = next(os.walk('.'))[1]

f = open(file_to_copy_to, "a+")

driver = webdriver.Chrome()
driver.get("http://www.phishbank.org")

for i in range(0, int(number_to_download)):
	entry = driver.find_elements_by_xpath("//*[@id=\"entries\"]/div[" + str(i+2) + "]/div[2]/p")
	tags = entry[0].text.split("\n") 
	print "starting to download: " + str(tags[0])
	if tags[0] not in existing_ps:
		print "wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains " + str(tags[0]) + " " + str(tags[0])
		os.system("wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains " + str(tags[0]) + " " + str(tags[0]))
	print "downloaded: " + str(tags[0])
	f.write(tags[0] + ", " + tags[-1] + "\n")


