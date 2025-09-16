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

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)


  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)
    const updateLeft = left + 1
    setLeft(updateLeft)
    console.log('left after', updateLeft)
    setTotal(left + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    console.log('right before', right)
    const updateRight = right + 1
    setRight(updateRight)
    console.log('right after', updateRight)
    setTotal(left + right)
  }

  return(
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>total {total}</p>
      <History allClicks={allClicks}/>
    </div>
  )

}

export default App