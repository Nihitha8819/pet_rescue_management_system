import requests
import json

url = 'http://localhost:8000/api/auth/signup'
data = {
    'name': 'Test User API',
    'email': 'apitest@example.com',
    'phone': '+1234567890',
    'password': 'testpass123',
    'user_type': 'adopter'
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")  # First 500 chars
    if response.status_code >= 400:
        print("\n=== ERROR DETAILS ===")
        try:
            error_json = response.json()
            print(json.dumps(error_json, indent=2))
        except:
            print("Could not parse error as JSON")
except Exception as e:
    print(f"Exception: {e}")
