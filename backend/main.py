from fastapi import FastAPI, Query
from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import datetime
from typing import Annotated
from fastapi import Depends
from sqlalchemy import text, select
from sqlalchemy.orm import Session
from database import get_session
from models import SensorReading

app = FastAPI()

class ReadingIn(BaseModel):
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
def post_item(session: Annotated[Session, Depends(get_session)], readings: ReadingIn) -> ReadingOut:
    sensor_reading_row = SensorReading(**readings.model_dump())
    session.add(sensor_reading_row)
    session.commit()
    session.refresh(sensor_reading_row)
    return sensor_reading_row

@app.get("/readings/")
def get_item(session: Annotated[Session, Depends(get_session)], limit: Annotated[int, Query(ge=1, le=1000)] = 100, 
             device_id: int | None = None, since: datetime | None = None) -> list[ReadingOut]:

    statement = select(SensorReading)
    if device_id is not None:
        statement = statement.where(SensorReading.device_id == device_id)
    if since is not None:
        statement = statement.where(SensorReading.recorded_at >= since)
    statement = statement.order_by(SensorReading.recorded_at.desc()).limit(limit)

    sensor_reading_rows = session.execute(statement).scalars().all()
    return sensor_reading_rows

@app.get("/dbcheck")
def db_check(session: Annotated[Session, Depends(get_session)]):
    return {"result": session.execute(text("SELECT 1")).scalar()}