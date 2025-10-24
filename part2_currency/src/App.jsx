import { useState, useEffect } from 'react'
import currencyService from './services/currency.js'

const App = () => {
  const [value, setValue] = useState('')
  const [currency, setCurrency] = useState(null)
  const [rates, setRates] = useState({})

  useEffect(() => {
    if (currency) {
      currencyService
        .getCurrency(currency)
        .then(currentRates => {
          setRates(currentRates.conversion_rates)
        })
    }
  }, [currency])

  const handleSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  return (
    <div>
      <form onSubmit={handleSearch}>
        Currency: <input value={value} onChange={handleChange} />
        <button type='submit'>Exchange rate</button>
      </form>
      {/* {JSON.stringify(rates, null, 2)} */}
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {rates && Object.entries(rates).map(([currency, rate]) => (
            <tr key={currency}>
              <td>{currency}</td>
              <td>{rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App