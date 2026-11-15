export type Reading = {
    reading_id: number;
    device_id: number;
    temp_c: number;
    humidity_pct: number;
    pressure_hpa: number;
    recorded_at: string;
}