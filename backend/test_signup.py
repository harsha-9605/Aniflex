import urllib.request
import json
req = urllib.request.Request('http://localhost:8000/auth/signup', data=json.dumps({'email':'z@z.com', 'password':'z', 'name':'z'}).encode(), headers={'Content-Type':'application/json'})
print(urllib.request.urlopen(req).read())
