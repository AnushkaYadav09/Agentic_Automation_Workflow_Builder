from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = ""

def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
        return idinfo      # contains email, name, picture
    except Exception as e:
        return None
