import { useState } from 'react'
import {useEffect} from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type {Reading} from './types'
import './App.css'

function App() {

  const [latestReadings, setLatestReadings] = useState<Reading[]>([])

  const loadLatestReading = async () => {
    const apiResponse = await fetch('http://127.0.0.1:8000/readings/?limit=10')
    const jsonApiResponse = await apiResponse.json()
    return jsonApiResponse

  }

  
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

  const latestReading = latestReadings[0]
  const oldToNewReadings = latestReadings.toReversed()
  const [chartDataKey, setChartDataKey] = useState<'temp_c' | 'humidity_pct' | 'pressure_hpa'>("temp_c")

  const chartLabels = {
  temp_c: { name: 'Temperature', unit: '°C' },
  humidity_pct: { name: 'Humidity', unit: '%' },
  pressure_hpa: { name: 'Pressure', unit: ' hPa' },
}

  return (
    <>
      
      <header>
        <h1>Embedded Weather Sensor Dashboard</h1>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </header>

      <main>
        <section className="weatherHero">
          {latestReading ?

          <>
          <div>
            <p>{temp_f(latestReading.temp_c || 0)} °F</p>
            <p>{latestReading.temp_c} °C</p>
          </div>

          <dl>
            <div>
              <dt>Humidity</dt>
              <dd>{latestReading.humidity_pct}%</dd>
            </div>

            <div>
              <dt>Pressure</dt>
              <dd>{latestReading.pressure_hpa} hPa</dd>
            </div>

            <div>
              <dt>Sensor Status</dt>
              <dd>Online</dd>
            </div>
          </dl>
          </>

          : <p>No readings yet</p>}

        </section>

        <section className="card weatherChart">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oldToNewReadings}>
                <CartesianGrid strokeDasharray="1 1"/>
                <XAxis dataKey="recorded_at" tickFormatter={(time) => new Date(time).toLocaleTimeString()}/>
                <YAxis domain={['auto', 'auto']} unit={chartLabels[chartDataKey].unit} />
                <Tooltip/>
                <Line type="monotone" dataKey={chartDataKey} name={chartLabels[chartDataKey].name} stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <button type="button" onClick={() => setChartDataKey("temp_c")}>Temperature</button>
            <button type="button" onClick={() => setChartDataKey("humidity_pct")}>Humidity</button>
            <button type="button" onClick={() => setChartDataKey("pressure_hpa")}>Pressure</button>
          </div>
        </section>

        <section className="card weatherTable">
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
      </main>

      <footer>
        <p>@2026 SH's Weather Dashboard</p>
      </footer>

    </>
  )
}

export default App
