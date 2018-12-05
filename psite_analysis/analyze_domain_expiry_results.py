import sys

p = open(sys.argv[4], 'w')

lines = []

for i in range(0, 3):
	f = open(sys.argv[i+1], 'r')
	lines += f.readlines()

total_number_processed = 0
total_error = 0
total_duplicates_abandoned = 0
domain_expiry_values = {}
previous_domain_expiry_value = None
more_than_3_months = 0
less_than_3_months = 0

for line in lines:
	tags = line.split(", ")
	domain_expiry_value = None
	try:
		domain_expiry_value = int(tags[1])
	except ValueError:
		print "Error on line " + str(lines.index(line)) + ": " + str(line)
		total_error += 1
		continue
	#take out duplicates
	if previous_domain_expiry_value == domain_expiry_value:
		total_duplicates_abandoned += 1
		continue
	if domain_expiry_value in domain_expiry_values:
		domain_expiry_values[domain_expiry_value] += 1
	else:
		domain_expiry_values[domain_expiry_value] = 1
	if domain_expiry_value > 93:
		more_than_3_months += 1
	else:
		less_than_3_months += 1
	total_number_processed += 1
	previous_domain_expiry_value = domain_expiry_value

p.write("Domain Expiry, Frequency\n")

for item in sorted(domain_expiry_values.items(), key=lambda x: x[0]):
	p.write(str(item[0]) + ", " + str(item[1]) + "\n")

p.close()

print "Total Number of Domain Expiries Retrieved Successfully: " + str(total_number_processed)
print "Total Number of Duplicates Abandoned: " + str(total_duplicates_abandoned)
print "Total Number of Domain Expiries Not Retrieved Successfully: " + str(total_error)
print "Total Number of Domain Expiries Less Than Three Months: " + str(less_than_3_months)
print "Total Number of Domain Expiries More Than Three Months: " + str(more_than_3_months)