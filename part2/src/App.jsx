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
      .catch(error => {
        alert(`Something went wrong to the server. failed fetching data${error}`)
        console.log("error ==> ", error);
      })
  }
  useEffect(hook, [])

  const noteToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const addNote = (event) => {
    event.preventDefault()
    const normalize = newNote.trim().toLowerCase()

    if (notes.some(note => note.content.toLowerCase() === normalize)) {
      alert(`${newNote} is already exist in the server.`)
      return
    }
    const newObject = {
      content: newNote,
      important: Math.random() < 0.5,
      vote: 0
    }
    noteService
      .create(newObject)
      .then(createdObject => {
        setNotes(notes.concat(createdObject))
        setNewNote('')
      })
      .catch(error => {
        alert(`failed to add new note`)
        console.log("error ==> ", error);
      })
  }

  const handleNewNote = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportance = (id) => {
    const note = notes.find(note => note.id === id)
    const updatedNote = { ...note, important: !note.important }

    noteService
      .update(id, updatedNote)
      .then(updatedObject => {
        setNotes(notes.map(note => note.id === id ? updatedObject : note))
      })
      .catch(error => {
        alert(`Error happend to update ${updatedNote}. ${error}`)
        setNotes(notes.filter(note => note.id !== id))
      })
  }
  const handleVotes = (id) => {
    const voteNote = notes.find(note => note.id === id)
    const updatedVoteNote = { ...voteNote, vote: (voteNote.vote ?? 0) + 1 }

    noteService
      .update(id, updatedVoteNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id === id ? updatedNote : note))
      })
      .catch(error => {
        console.log("error ==> ", error)
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
          <Note key={n.id} note={n} toggleImportance={() => toggleImportance(n.id)} handleVotes={() => handleVotes(n.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNewNote} />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App