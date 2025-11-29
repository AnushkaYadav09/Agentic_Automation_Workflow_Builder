from app.main import app
import json

def print_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "name": route.name,
            "methods": list(route.methods)
        })
    print(json.dumps(routes, indent=2))

if __name__ == "__main__":
    print_routes()
