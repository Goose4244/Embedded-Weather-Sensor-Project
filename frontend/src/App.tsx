import { useState } from 'react'
import {useEffect} from 'react'
import type {Reading} from './types'
import './App.css'

function App() {

  const [latestReading, setLatestReading] = useState<Reading | null>(null)
  const loadLatestReading = async () => {
    const apiResponse = await fetch('http://127.0.0.1:8000/readings/?limit=1')
    const jsonApiResponse = await apiResponse.json()
    return jsonApiResponse

  }

  const parseJsonToReading = async () => {
    const jsonApiResponse = await loadLatestReading()
    const latestReading = jsonApiResponse[0] as Reading
    return latestReading
  }

  const lastUpdatedTime = latestReading ? new Date(latestReading.recorded_at).toLocaleString() : null
  const temp_f = latestReading ? ((latestReading.temp_c * 9/5) + 32).toFixed(1) : null

  const refreshLatestReading = async () => {
    const parsedJsonResponse = await parseJsonToReading()
    setLatestReading(parsedJsonResponse)
  }

  useEffect(() => {
    refreshLatestReading()
  }, [])


  return (
    <>
      <section id="center">
        <div>
          <h1>Embedded Weather Sensor Dashboard</h1>
        </div>
        <div>
        <button
          type="button"
          className="counter"
          onClick={async () => {
            const parsedJsonResponse = await parseJsonToReading()
            setLatestReading(parsedJsonResponse)
          }}
        >
          Click to fetch latest reading from API
        </button>
        </div>
        <div>
          <p>Reading ID: {latestReading ? latestReading.reading_id : "No reading fetched yet"}</p>
          <p>Device ID: {latestReading ? latestReading.device_id : "No reading fetched yet"}</p>
          <p>Temperature (°C): {latestReading ? latestReading.temp_c.toFixed(1) : "No reading fetched yet"}</p>
          <p>Temperature (°F): {latestReading ? temp_f : "No reading fetched yet"}</p>
          <p>Humidity (%): {latestReading ? latestReading.humidity_pct.toFixed(1) : "No reading fetched yet"}</p>
          <p>Pressure (hPa): {latestReading ? latestReading.pressure_hpa.toFixed(1) : "No reading fetched yet"}</p>
          <p>Latest Reading: {latestReading ? lastUpdatedTime : "No reading fetched yet"}</p>
        </div>
      </section>

    </>
  )
}

export default App
