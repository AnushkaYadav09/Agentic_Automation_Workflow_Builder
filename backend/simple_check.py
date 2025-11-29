import urllib.request
import json

def check():
    try:
        with urllib.request.urlopen("http://localhost:8000/") as response:
            print(f"Root status: {response.status}")
            print(response.read().decode())
    except Exception as e:
        print(f"Root failed: {e}")

    try:
        req = urllib.request.Request("http://localhost:8000/workflows/", method="POST")
        req.add_header('Content-Type', 'application/json')
        data = json.dumps({"name": "Test", "definition": {}}).encode()
        with urllib.request.urlopen(req, data=data) as response:
            print(f"Workflow status: {response.status}")
            print(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Workflow failed: {e.code} {e.reason}")
        print(e.read().decode())
    except Exception as e:
        print(f"Workflow failed: {e}")

if __name__ == "__main__":
    check()
