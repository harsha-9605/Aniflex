import urllib.request
import json

data = json.dumps({'email': 'aharsharoyal965@gmail.com', 'password': 'harsha75an'}).encode()
req = urllib.request.Request('http://localhost:8000/auth/login', data=data, headers={'Content-Type':'application/json'})

try:
    response = urllib.request.urlopen(req)
    print("SUCCESS:", response.read().decode())
except Exception as e:
    print("FAILURE:", e)
    if hasattr(e, 'read'):
        print("DETAILS:", e.read().decode())
