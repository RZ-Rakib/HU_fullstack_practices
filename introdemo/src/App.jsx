import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseTo0ne = () => {setCounter(counter +1)}

  const reseToZero = () => {setCounter(0)}

  return (
    <div>
    <div>{counter}</div>
    <button onClick={increaseTo0ne}>
      plus
    </button>
    <button onClick={reseToZero} >
      reset
    </button>
    </div>
  )
}

export default App