/**
 * Note component
 * @prop {Object} note - Note object containing content and importance
 * @prop {Function} toggleImportance - Function to toggle the importance of the note
 */
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note