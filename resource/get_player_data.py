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
	if "league level" in line and "country" in line["league level"] and "level" in line["league level"] and line["league level"]["level"] == "First tier" and line["league level"]["country"].lower() in countries and "current market value" in line and get_value(line["current market value"]["value"]).isdigit() and "transfer history" in line and "position" in line and "age" in line and line["age"].isdigit():
		result = {}
		if "name in home country" in line:
			result["name in home country"] = line["name in home country"]
		if "date of birth" in line:
			result["date of birth"] = line["date of birth"]
		this_transfer_history = []
		this_market_value = {}
		for a_record in line["transfer history"]:
			if "market value" in a_record and get_value(a_record["market value"]).isdigit() and "season" in a_record:
				this_market_value[a_record["season"]] = get_value(a_record["market value"])
			if "season" in a_record and "moving to" in a_record and "moving from" in a_record and "country" in a_record["moving to"] and "country" in a_record["moving from"] and a_record["moving to"]["country"].lower() in countries and a_record["moving from"]["country"].lower() in countries and "transfer fee" in a_record and get_value(a_record["transfer fee"]).isdigit():
				this_transfer_history.append({"moving to": a_record["moving to"], "moving from": a_record["moving from"], "transfer fee": get_value(a_record["transfer fee"]), "season": a_record["season"]})
		result["transfer history"] = this_transfer_history
		result["market value"] = this_market_value
		if this_transfer_history or this_market_value:
			result["club country"] = line["league level"]["country"]
			result["position"] = line["position"]
			result["current market value"] = get_value(line["current market value"]["value"])
			result["club name"] = line["current club"]
			result["age"] = line["age"]
			result["name"] = line["name"]
			result["club name"] = line["current club"]
		lst.append(result)

json.dump(lst, o)

i.close()
o.close()