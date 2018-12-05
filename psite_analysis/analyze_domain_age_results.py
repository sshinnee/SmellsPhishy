import sys

p = open(sys.argv[4], 'w')

lines = []

for i in range(0, 3):
	f = open(sys.argv[i+1], 'r')
	lines += f.readlines()

total_number_processed = 0
total_error = 0
total_duplicates_abandoned = 0
domain_age_values = {}
previous_domain_age_value = None
more_than_1_month = 0
less_than_1_month = 0

for line in lines:
	tags = line.split(", ")
	domain_age_value = None
	try:
		domain_age_value = int(tags[0])
	except ValueError:
		print "Error on line " + str(lines.index(line)) + ": " + str(line)
		total_error += 1
		continue
	#take out duplicates
	if previous_domain_age_value == domain_age_value:
		total_duplicates_abandoned += 1
		continue
	if domain_age_value in domain_age_values:
		domain_age_values[domain_age_value] += 1
	else:
		domain_age_values[domain_age_value] = 1
	if domain_age_value > 31:
		more_than_1_month += 1
	else:
		less_than_1_month += 1
	total_number_processed += 1
	previous_domain_age_value = domain_age_value

p.write("Domain Age, Frequency\n")

for item in sorted(domain_age_values.items(), key=lambda x: x[0]):
	p.write(str(item[0]) + ", " + str(item[1]) + "\n")

p.close()

print "Total Number of Domain Ages Retrieved Successfully: " + str(total_number_processed)
print "Total Number of Duplicates Abandoned: " + str(total_duplicates_abandoned)
print "Total Number of Domain Ages Not Retrieved Successfully: " + str(total_error)
print "Total Number of Domain Ages Less Than One Month: " + str(less_than_1_month)
print "Total Number of Domain Ages More Than One Month: " + str(more_than_1_month)