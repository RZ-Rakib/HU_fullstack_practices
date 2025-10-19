/**
 * @prop {object} note - this object contains content and important
 * @prop {function} toggleImportance - an event handler function 
 * to toggle important
 * @prop {function} handleVotes - a function to handle vote by increasing 1 vote after each sucessfull vote pressing by the button
 * @prop {function} handleDelete - a function that delete a object by id from the database
 */
const Note = ({ note, toggleImportance, handleVotes, handleDelete }) => {
  const label =
    note.important === true
      ? 'make not important'
      : 'make important'

  return (
    <div>
      <li>
        {note.content}{' '}
        <button onClick={toggleImportance}>{label}</button>
      </li>
      {note.vote} Votes
      <button onClick={handleVotes}>👍</button>{' '}
      < button onClick={handleDelete}>Delete</button>
    </div >
  )
}

export default Note