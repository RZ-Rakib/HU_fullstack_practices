import { useState } from 'react'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
    </button>
)
const Display = ({counter}) => <div>{counter}</div>

const App = () => {
  const [ counter, setCounter ] = useState(0)
  console.log('Rendering with counter value', counter)

  
  const increaseTo0ne = () => {
    console.log('inceasing, value before,', counter)
    setCounter(counter + 1)
  }

  const decreaseTo0ne = () => {
    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }

  const reseToZero = () => {
    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  return (
    <div>
    <Display counter={counter}/>
    <Button onClick={increaseTo0ne} text='plus'/>
    <Button onClick={decreaseTo0ne} text='minus'/>
    <Button onClick={reseToZero} text='zero'/>
    </div>
  )
}

export default App