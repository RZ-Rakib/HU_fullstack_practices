/**
 * @prop {object} note - this object contains content and important
 * @prop {function} toggleImportance - an event handler function 
 * to toggle important
 * @prop {function} handleVotes - an function to handle vote by increasing 1 vote after each sucessfull vote pressing by the button
 */
const Note = ({ note, toggleImportance, handleVotes }) => {
  const label =
    note.important === true
      ? 'make not important'
      : 'make important'

  return (
    <div>
      <li>
        {note.content}{' '}
        <button onClick={toggleImportance}>{label}</button>
        {' '}{note.vote} Votes
        <button onClick={handleVotes}>👍</button>
      </li>
    </div>
  )
}

export default Note