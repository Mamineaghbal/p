from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = 'sqlite:///instance/function_analysis.db'

if not os.path.exists('instance'):
    os.makedirs('instance')

engine = create_engine(DATABASE_URL, echo=False)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Function(Base):
    __tablename__ = 'functions'
    id = Column(Integer, primary_key=True)
    expression = Column(String, nullable=False)
    parsed_expr = Column(String)
    type = Column(String, default="function")
    variable = Column(String, default="x")
    domain = Column(String, default="ℝ")
    domain_from = Column(String, default="ℝ")
    domain_to = Column(String, default="ℝ")
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def save_function(data):
    db = SessionLocal()
    try:
        func = Function(**data)
        db.add(func)
        db.commit()
        return func.id
    finally:
        db.close()

def get_all_functions():
    db = SessionLocal()
    try:
        return db.query(Function).order_by(Function.created_at.desc()).all()
    finally:
        db.close()

def get_function_by_id(func_id):
    db = SessionLocal()
    try:
        return db.query(Function).filter(Function.id == func_id).first()
    finally:
        db.close()

def update_function(func_id, data):
    db = SessionLocal()
    try:
        func = db.query(Function).filter(Function.id == func_id).first()
        if func:
            for key, value in data.items():
                setattr(func, key, value)
            db.commit()
    finally:
        db.close()

def delete_function(func_id):
    db = SessionLocal()
    try:
        func = db.query(Function).filter(Function.id == func_id).first()
        if func:
            db.delete(func)
            db.commit()
    finally:
        db.close()