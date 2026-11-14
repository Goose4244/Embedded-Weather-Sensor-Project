from fastapi import FastAPI
from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import datetime
from typing import Annotated
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_session
from models import SensorReading

app = FastAPI()

class PostedIn(BaseModel):
    device_id: int
    temp_c: float
    humidity_pct: float
    pressure_hpa: float

class ReadingOut(BaseModel):
    reading_id: int
    temp_c: float
    humidity_pct: float
    pressure_hpa: float
    recorded_at: datetime
    model_config = ConfigDict(from_attributes=True)


@app.post("/readings/", status_code=201)
def post_item(session: Annotated[Session, Depends(get_session)], readings: PostedIn) -> ReadingOut:
    sensor_reading_row = SensorReading(**readings.model_dump())
    session.add(sensor_reading_row)
    session.commit()
    session.refresh(sensor_reading_row)
    return sensor_reading_row

@app.get("/readings/")
async def get_item() -> ReadingOut:
    return ReadingOut(
        reading_id=1, temp_c=22.5, humidity_pct=40,
        pressure_hpa=975, recorded_at=datetime.now()
    )

@app.get("/dbcheck")
def db_check(session: Annotated[Session, Depends(get_session)]):
    return {"result": session.execute(text("SELECT 1")).scalar()}