import type { Reading } from '../types'
import { toFahrenheit } from '../utils'
import styles from './ReadingsTable.module.css'


type ReadingsTableProps = {
    readings: Reading[]
}

function ReadingsTable({ readings }: ReadingsTableProps) {
    return (
        <section className={`card ${styles.readings}`}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.num}>Reading ID</th>
                  <th className={styles.num}>Device ID</th>
                  <th className={styles.num}>Temperature (°C)</th>
                  <th className={styles.num}>Temperature (°F)</th>
                  <th className={styles.num}>Humidity (%)</th>
                  <th className={styles.num}>Pressure (hPa)</th>
                  <th className={styles.num}>Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {readings.length === 0 ? (<tr><td colSpan={7}>No readings yet</td></tr>
                  ) : (readings.map(reading => (
                    <tr key={reading.reading_id}>
                      <td className={styles.num}>{reading.reading_id}</td>
                      <td className={styles.num}>{reading.device_id}</td>
                      <td className={styles.num}>{reading.temp_c.toFixed(2)}</td>
                      <td className={styles.num}>{toFahrenheit(reading.temp_c).toFixed(2)}</td>
                      <td className={styles.num}>{reading.humidity_pct.toFixed(2)}</td>
                      <td className={styles.num}>{reading.pressure_hpa.toFixed(2)}</td>
                      <td className={styles.num}>{new Date(reading.recorded_at).toLocaleString()}</td>
                    </tr>)
                    )
                  )
                }
              </tbody>
            </table>
          </div>
        </section>
    )
}

export default ReadingsTable