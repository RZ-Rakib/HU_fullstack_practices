import { useState, useImperativeHandle } from "react";

const Toggleable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisible = () => {
    setVisible(!visible)
  }
  useImperativeHandle(props.ref, () => {
    return { toggleVisible }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisible}> {props.buttonLabel} </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisible}> cancel </button>
      </div>
    </div>
  )
}

export default Toggleable