import { useState } from 'react'
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
          <p>Latest Reading: {latestReading ? JSON.stringify(latestReading) : "No reading fetched yet"}</p>
        </div>
      </section>

    </>
  )
}

export default App
