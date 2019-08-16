import pprint
def countscores():
	f = open("moviesstats.csv")
	fin = open("fin.csv","w")
	f.readline()
	lines = f.readlines()
	count = {}
	for line1 in lines:
		parts = line1.split(",")
		score = (parts[19])
		if score != "0":
			if score in count.keys():
				count[score] +=1
			else:
				count[score]= 1
		#fin.write(line1 + str(count[score]))
	f.close()
	fin.close()
	print(count)

def countlikes():
	f = open("moviesstats.csv")
	likes = {}
	f.readline()
	lines = f.readlines()
	for movie in lines:
		year = movie.split(",")[23].strip()
		try:
			if int(year) > 2016:
				continue
		except:
			continue
		if year != "0":
			# print(year)
			if year not in likes:
				likes[year] = {"Action":0,"Drama":0,"Comedy":0,"Horror":0}
			else:
				#Action, Comedy, Drama, Horror
				genres = movie.split(",")[9]
				likes1 = int(movie.split(",")[27])
				if "Action" in genres:
					likes[year]["Action"]+=likes1
				if "Drama" in genres:
					likes[year]["Drama"] += likes1
				if "Comedy" in genres:
					likes[year]["Comedy"] +=likes1
				if "Horror" in genres:
					likes[year]["Horror"] += likes1
	pprint.pprint(likes)
countscores()
