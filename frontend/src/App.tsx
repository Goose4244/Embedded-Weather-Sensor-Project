import { useState } from 'react'
import {useEffect} from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type {Reading} from './types'
import ReadingsTable from './components/ReadingsTable'
import { toFahrenheit } from './utils'
import './App.css'
import './index.css'

function App() {

  const [latestReadings, setLatestReadings] = useState<Reading[]>([])

  const loadLatestReading = async () => {
    const apiResponse = await fetch('http://127.0.0.1:8000/readings/?limit=50')
    const jsonApiResponse = await apiResponse.json()
    return jsonApiResponse

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
      
      <header className="header">
        <h1>Embedded Weather Sensor Dashboard</h1>
        <p className="live">Last updated: {new Date().toLocaleString()}</p>
      </header>

      <main className="page">
        <section className="hero">
          {latestReading ?

          <>
          <div>
            <p className="temp_f">{toFahrenheit(latestReading.temp_c).toFixed(1)} °F</p>
            <p className="temp_c">{latestReading.temp_c.toFixed(1)} °C</p>
          </div>

          <dl className="stats">
            <div>
              <dt>Humidity</dt>
              <dd>{latestReading.humidity_pct.toFixed(1)}%</dd>
            </div>

            <div>
              <dt>Pressure</dt>
              <dd>{latestReading.pressure_hpa.toFixed(1)} hPa</dd>
            </div>

            <div>
              <dt>Sensor Status</dt>
              <dd>Online</dd>
            </div>
          </dl>
          </>

          : <p>No readings yet</p>}

        </section>

        <section className="card chart">
          <div className="top">
            <div>
              <h2>{chartLabels[chartDataKey].name} Chart</h2>
            </div>
            <div className="range">
              <button type="button" onClick={() => setChartDataKey("temp_c")} aria-pressed={chartDataKey === 'temp_c'}>Temperature</button>
              <button type="button" onClick={() => setChartDataKey("humidity_pct")} aria-pressed={chartDataKey === 'humidity_pct'}>Humidity</button>
              <button type="button" onClick={() => setChartDataKey("pressure_hpa")} aria-pressed={chartDataKey === 'pressure_hpa'}>Pressure</button>
            </div>
          </div>

          <div className="chartBox">
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
        </section>

        <ReadingsTable readings={latestReadings}/>
      </main>

      <footer>
        <p>@2026 SH's Weather Dashboard</p>
      </footer>

    </>
  )
}

export default App
