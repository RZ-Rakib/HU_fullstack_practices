/**
 * @prop {object} note - this object contains content and important
 * @prop {function} toggleImportance - an event handler function to toggle important
 */
const Note = ({ note, toggleImportance }) => {
  const label =
    note.important === true
      ? 'make not important'
      : 'make important'

  return (
    <div>
      <li>
        {note.content}-
        <button onClick={toggleImportance}>{label}</button>
      </li>
    </div>
  )
}

export default Note