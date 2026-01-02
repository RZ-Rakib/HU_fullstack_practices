/**
 * Dialog component
 * @prop {boolean} open - boolean state for the dialog to show or hide
 * @prop {string} text - a string to show as dialog message
 * @prop {function} handleYes - a function that is handle Yes button
 * @prop {function} handleNO - a function that is handle the No button 
 */
const Dialog = ({ open, text, handleYes, handleNo }) => {
  if (!open) {
    return null
  }

  return (
    <div className="dialog">
      <div>
        <p>{text}</p>
        <div>
          <button className="yesBtn" onClick={handleYes}>Yes</button>
          <button className="noBtn" onClick={handleNo}>NO</button>
        </div>
      </div>
    </div>
  )
}

export default Dialog