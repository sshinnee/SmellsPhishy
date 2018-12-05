import sys

f = open(sys.argv[1], 'r')
p = open(sys.argv[2], 'w')
q = open(sys.argv[3], 'w')
r = open(sys.argv[4], 'w')

lines = f.readlines()

total_lengths = {}
base_lengths = {}
nums_sub_folders = {}

for line in lines[1:]:
	#print line
	tags = line.split(", ")
	total_length = int(tags[0])
	base_length = int(tags[1])
	num_sub_folders = int(tags[2])
	if total_length in total_lengths:
		total_lengths[total_length] += 1
	else:
		total_lengths[total_length] = 1

	if base_length in base_lengths:
		base_lengths[base_length] += 1
	else:
		base_lengths[base_length] = 1

	if num_sub_folders in nums_sub_folders:
		nums_sub_folders[num_sub_folders] += 1
	else:
		nums_sub_folders[num_sub_folders] = 1

p.write("Total Length, Frequency\n")

for item in sorted(total_lengths.items(), key=lambda x: x[0]):
	p.write(str(item[0]) + ", " + str(item[1]) + "\n")

p.close()

q.write("Base Length, Frequency\n")

for item in sorted(base_lengths.items(), key=lambda x: x[0]):
	q.write(str(item[0]) + ", " + str(item[1]) + "\n")
	
q.close()

r.write("Number of Sub-Folders, Frequency\n")

for item in sorted(nums_sub_folders.items(), key=lambda x: x[0]):
	r.write(str(item[0]) + ", " + str(item[1]) + "\n")
	
r.close()


