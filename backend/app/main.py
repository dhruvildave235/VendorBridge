from fastapi import FastAPI

from app.database import Base,engine
from app.routers import auth

Base.metadata.create_all(bind=engine)

app=FastAPI(
    title="VendorBridge ERP"
)

app.include_router(auth.router)

@app.get("/")
def home():
    return {
        "message":"VendorBridge ERP API Running"
    }