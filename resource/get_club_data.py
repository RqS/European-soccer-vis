import sys
import json

i = open(sys.argv[1], 'r')
o = open(sys.argv[2], 'w')

countries = ["spain", "england", "turkey", "france", "italy", "germany", "portugal"]

def get_value(s):
	return s.replace(",", "").replace("Mill.", "0000").replace("Th.", "000").replace("EUR", "").replace(" ", "")
lst = []
for line in i:
	line = json.loads(line)
	if "league level" in line and "country" in line and line["league level"] == "First tier" and line["country"].lower() in countries and "players" in line:
		result = {}
		print line
		result["players"] = []
		for a_player in line["players"]:
			new_player = a_player
			new_player["market value"] = get_value(a_player["market value"]) if "market value" in a_player else "unknown"
			result["players"].append(new_player)
		result["country"] = line["country"]
		result["name"] = line["name"] if "name" in line else "unknown"
		result["current transfer record"] = line["current transfer record"]
		lst.append(result)

json.dump(lst, o)

i.close()
o.close()