import { useState } from 'react'
import Note from './components/Note'

const App = ({notes}) => {
  const [ note, setNote ] = useState(notes)
  const [ newNote, setNewNote ] = useState('')
  const [ showAll, setShowAll ] = useState(true)

  const noteToShow = showAll
    ? note
    : note.filter(n => n.important)

  const handleNoteChange = (event) => {
    console.log('input value: ', event.target.value)
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const newObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1
    }
    setNote(note.concat(newObject))
    setNewNote('')
  }

  return (
    <div>
      <h1>Notes</h1>
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
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type='submit'> save </button>
      </form>
    </div>
  )
}

export default App