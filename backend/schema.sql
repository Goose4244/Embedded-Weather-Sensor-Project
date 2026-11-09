create table devices (
device_id int generated always as identity primary key,
name text not null default 'Room',
device_created_at timestamptz not null default now()
);

create table sensor_readings (
reading_id bigint generated always as identity primary key,
device_id int not null,
temp_c real constraint temp_range check (temp_c between -18 and 100),
humidity_pct real constraint humidity_range check (humidity_pct between 0 and 100),
pressure_hpa real constraint pressure_range check (pressure_hpa between 300 and 1100),
recorded_at timestamptz not null default now(),
foreign key (device_id) references devices(device_id) 
on delete cascade
);