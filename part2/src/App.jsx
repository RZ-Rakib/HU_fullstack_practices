import { useState, useEffect } from 'react'
import Note from './component/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    noteService
      .getAll()
      .then(allObjects => {
        setNotes(allObjects)
      })
  }
  useEffect(hook, [])

  const noteToShow = showAll
    ? notes
    : notes.filter(n => n.important === true)

  const addNote = (event) => {
    event.preventDefault()
    const newObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService
      .create(newObject)
      .then(createdObject => {
        setNotes(notes.concat(createdObject))
        setNewNote('')
      })

  }

  const handleNewNote = (event) => {
    setNewNote(event.target.value)
    console.log("event.target.value ==> ", event.target.value);
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const updatedNote = { ...note, important: !note.important }

    noteService
      .update(id, updatedNote)
      .then(updatedObject => {
        setNotes(notes.map(n => n.id === id ? updatedObject : n))
      })

  }

  return (
    <div>
      <h2>Notes</h2>
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {noteToShow.map(n =>
          <Note key={n.id} note={n} toggleImportance={() => toggleImportance(n.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNewNote} />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App