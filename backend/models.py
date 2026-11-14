from datetime import datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Device(Base):
    __tablename__ = "devices"

    device_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    device_created_at: Mapped[datetime] = mapped_column(server_default=func.now())

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    reading_id: Mapped[int] = mapped_column(primary_key=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("devices.device_id"))
    temp_c: Mapped[float]
    humidity_pct: Mapped[float]
    pressure_hpa: Mapped[float]
    recorded_at: Mapped[datetime] = mapped_column(server_default=func.now())