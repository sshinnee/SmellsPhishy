import sys

f = open(sys.argv[1], 'r')

lines = f.readlines()

number_of_valid_lines = 0
number_of_forms = 0
number_of_triggers = 0

for line in lines:
	if line[0] == "<":
		continue
	else:
		number_of_valid_lines += 1
		tags = line.split(",")
		if tags[0][0] == "T":
			number_of_forms += 1
		if tags[1][1] == "T":
			number_of_triggers += 1

print "Number of Valid Lines: " + str(number_of_valid_lines)
print "Number of Forms: " + str(number_of_forms)
print "Number of Triggers: " + str(number_of_triggers)

print "% of Forms: " + str(number_of_forms*100.0/number_of_valid_lines)
print "% of Triggers: " + str(number_of_triggers*100.0/number_of_valid_lines)