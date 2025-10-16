import sys
import json

# Read all stdin then parse JSON
raw = sys.stdin.read()
try:
	data = json.loads(raw) if raw else {}
except json.JSONDecodeError:
	data = {}

# expect key 'number'
num = data.get("number", 0)
try:
	result = int(num) ** 2
except Exception:
	result = 0

print(json.dumps({"result": result}))