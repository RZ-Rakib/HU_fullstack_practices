import { useState } from 'react'

const History = ({allClicks}) => {
  if (allClicks.length === 0) {
    return (
      <div> This application is used by pressing the button</div>
    )
  }
  
  return (
    <div> button press history: {allClicks.join(' ')}</div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)


  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    console.log('left after', updatedLeft)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    console.log('right before', right)
    const updatedRight = right + 1
    setRight(updatedRight)
    console.log('right after', updatedRight)
    setTotal(left + updatedRight)
  }

  return(
    <div>
      {left}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      {right}
      <p>total {total}</p>
      <History allClicks={allClicks}/>
    </div>
  )
}
console.log();

export default App