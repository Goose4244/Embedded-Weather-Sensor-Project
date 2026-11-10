from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from typing import Annotated
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_session

app = FastAPI()

class PostedReadings(BaseModel):
    device_id: int
    temp_c: float
    humidity_pct: float
    pressure_hpa: float

class RetrievedReadings(BaseModel):
    reading_id: int
    temp_c: float
    humidity_pct: float
    pressure_hpa: float
    recorded_at: datetime


@app.post("/readings/")
async def post_item(Readings: PostedReadings):
    return Readings

@app.get("/readings/")
async def get_item() -> RetrievedReadings:
    return RetrievedReadings(
        reading_id=1, temp_c=22.5, humidity_pct=40,
        pressure_hpa=975, recorded_at=datetime.now()
    )

@app.get("/dbcheck")
def db_check(session: Annotated[Session, Depends(get_session)]):
    return {"result": session.execute(text("SELECT 1")).scalar()}