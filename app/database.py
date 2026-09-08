# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Masukkan connection string milikmu di sini (sudah diganti passwordnya)
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.yjliblrwsxbzobrniyck:%23Bismillah123%401@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()