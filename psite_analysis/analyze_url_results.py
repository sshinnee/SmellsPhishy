import sys

f = open(sys.argv[1], 'r')

lines = f.readlines()

shortened = 0
tlds = {}

for line in lines:
	tags = line.split(", ")
	if "T" in tags[4]:
		shortened += 1
	tld = tags[3]
	if tld in tlds:
		tlds[tld] += 1
	else:
		tlds[tld] = 1

print "Number of Shortened URLs: " + str(shortened)
print "Analysis of Top Level Domains: " + str(sorted({k: (x*100.0/1709, x) for k, x in tlds.iteritems()}.items(), key=lambda x: x[1], reverse=True))