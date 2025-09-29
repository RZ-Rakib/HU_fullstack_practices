import { useState } from "react"
import Note from "./component/Note"

const App = (props) => {
  const [notes, setNote] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const noteToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  
  const addNote = (event) => {
    event.preventDefault()
    const newObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }
    setNote(notes.concat(newObject))
    setNewNote('')
  }

  const handleNewNote = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1> Notes </h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {noteToShow.map(note => 
          <Note key={note.id} note={note}/>
        )}
      </ul>
      <form onSubmit={addNote} >
        <input value={newNote} onChange={handleNewNote}/>
        <button type="submit"> save</button>
      </form>
    </div>
  )
}

export default App