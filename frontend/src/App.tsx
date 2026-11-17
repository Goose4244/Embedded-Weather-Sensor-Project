import { useState } from 'react'
import {useEffect} from 'react'
import type {Reading} from './types'
import './App.css'

function App() {

  const [latestReadings, setLatestReadings] = useState<Reading[]>([])

  const loadLatestReading = async () => {
    const apiResponse = await fetch('http://127.0.0.1:8000/readings/?limit=10')
    const jsonApiResponse = await apiResponse.json()
    return jsonApiResponse

  }

/*
  const parseJsonToReading = async () => {
    const jsonApiResponse = await loadLatestReading()
    const latestReading = jsonApiResponse[0] as Reading
    return latestReading
  }
*/


  
  const temp_f = (temp_c: number) => {
    return (temp_c * 9/5) + 32
  }

  const refreshLatestReadings = async () => {
    const jsonApiResponse = await loadLatestReading()
    setLatestReadings(jsonApiResponse)
  }

  useEffect(() => {
    refreshLatestReadings()
    const intervalID = setInterval(refreshLatestReadings, 5000)

    return () => clearInterval(intervalID)
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
          onClick={refreshLatestReadings}
        >
          Click to fetch latest reading from API
        </button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Reading ID</th>
                <th>Device ID</th>
                <th>Temperature (°C)</th>
                <th>Temperature (°F)</th>
                <th>Humidity (%)</th>
                <th>Pressure (hPa)</th>
                <th>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {latestReadings.length === 0 ? (<tr><td colSpan={7}>No readings yet</td></tr>
                ) : (latestReadings.map(reading => (
                  <tr key={reading.reading_id}>
                    <td>{reading.reading_id}</td>
                    <td>{reading.device_id}</td>
                    <td>{reading.temp_c}</td>
                    <td>{temp_f(reading.temp_c)}</td>
                    <td>{reading.humidity_pct}</td>
                    <td>{reading.pressure_hpa}</td>
                    <td>{new Date(reading.recorded_at).toLocaleString()}</td>
                  </tr>)
                  )
                )
              }
            </tbody>
          </table>
        </div>
      </section>

    </>
  )
}

export default App
