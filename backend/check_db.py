from sqlalchemy import create_engine, inspect
from app.config import DATABASE_URL

def check_tables():
    print(f"Connecting to: {DATABASE_URL}")
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Tables found:", tables)

if __name__ == "__main__":
    check_tables()
