import { useState } from 'react'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
    </button>
)

const App = () => {
  const [ counter, setCounter ] = useState(0)

  
  const increaseTo0ne = () => {setCounter(counter + 1)}
  const decreaseTo0ne = () => {setCounter(counter - 1)}
  const reseToZero = () => {setCounter(0)}

  return (
    <div>
    <div>{counter}</div>
    <Button onClick={increaseTo0ne} text='plus'/>
    <Button onClick={decreaseTo0ne} text='minus'/>
    <Button onClick={reseToZero} text='zero'/>
    </div>
  )
}

export default App