import sys

f = open(sys.argv[1], 'r')
q = open(sys.argv[2], 'w')

lines = f.readlines()

for line in lines:
	line = line.replace('(', "").replace(")", "")
	print line
	q.write(line)