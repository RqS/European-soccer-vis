import sys
import json

i = open(sys.argv[1], 'r')
o = open(sys.argv[2], 'w')

countries = ["spain", "england", "turkey", "france", "italy", "germany", "portugal", "netherlands"]

def get_value(s):
	return s.replace(",", "").replace("Mill.", "0000").replace("Th.", "000").replace("EUR", "").replace(" ", "")
lst = []
for line in i:
	line = json.loads(line)
	if "league level" in line and "country" in line and line["league level"] == "First tier" and line["country"].lower() in countries and "players" in line:
		result = {}
		result["players"] = []
		total_value = 0
		for a_player in line["players"]:
			new_player = a_player
			new_player["market value"] = get_value(a_player["market value"]) if "market value" in a_player else "unknown"
			if "market value" in a_player and a_player["market value"].isdigit():
				total_value = total_value + int(get_value(a_player["market value"]))  
			else:
				print a_player["market value"]
			result["players"].append(new_player)
		result["country"] = line["country"]
		result["name"] = line["name"] if "name" in line else "unknown"
		result["current transfer record"] = line["current transfer record"]
		result["total market value"] = total_value
		lst.append(result)

output_dict = dict()
for ele in lst:
	if ele["country"] not in output_dict:
		output_dict[ele["country"]] = dict()
	output_dict[ele["country"]][ele["name"]] = {"current transfer record": ele["current transfer record"], "players": ele["players"], "total market value": ele["total market value"]}
json.dump(output_dict, o)

i.close()
o.close()