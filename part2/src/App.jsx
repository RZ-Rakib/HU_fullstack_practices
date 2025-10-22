import { useState, useEffect } from 'react'
import Note from './component/Note'
import noteService from './services/notes'
import Dialog from './component/Dialog'
import Notification from './component/Notification'
import Footer from './component/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(allObjects => {
        setNotes(allObjects)
      })
      .catch(error => {
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
        setErrorMessage(`Note ${createdObject.content} is created.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000);
        setNotes(prev => prev.concat(createdObject))
        setNewNote('')
      })
      .catch(error => {
        setErrorMessage(`Note ${newObject.content} is failed to send to server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000);
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
        setNotes(prev => prev.map(note => note.id === id ? updatedObject : note))
      })
      .catch(error => {
        setErrorMessage(`Note ${updatedNote.content} is already remoed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setNotes(prev => prev.filter(note => note.id !== id))
      })
  }
  const handleVotes = (id) => {
    const voteNote = notes.find(note => note.id === id)
    const updatedVoteNote = { ...voteNote, vote: (voteNote.vote ?? 0) + 1 }

    noteService
      .update(id, updatedVoteNote)
      .then(updatedNote => {
        setNotes(prev => prev.map(note => note.id === id ? updatedNote : note))
      })
      .catch(error => {
        setErrorMessage(`Note ${updatedNote.content} is already remoed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setNotes(prev => prev.filter(note => note.id !== id))
      })
  }
  // dialog handle functions
  const handleDelete = (note) => {
    console.log("note ==> ", note);
    setSelectedNote(note)
    setDialogOpen(true)

  }

  const handleYes = () => {
    console.log();

    if (selectedNote) {
      noteService
        .remove(selectedNote.id)
        .then(removedNote => {
          setErrorMessage(`${removedNote.content} is sucessfully removed`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000);
          setNotes(prev => prev.filter(note => note.id !== selectedNote.id))
          setDialogOpen(false)
          setSelectedNote(null)
        })
        .catch(error => {
          setErrorMessage(`Note ${updatedNote.content} is already removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          setNotes(prev => prev.filter(note => note.id !== selectedNote.id))
          setDialogOpen(false)
          setSelectedNote(null)
        })
    }
  }

  const handleNo = () => {
    setDialogOpen(false)
    setSelectedNote(null)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {noteToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)} handleVotes={() => handleVotes(note.id)}
            handleDelete={() => handleDelete(note)}
          />
        )}
      </ul>
      <Dialog
        open={dialogOpen}
        text={'Do you want to delete ?'}
        handleYes={handleYes}
        handleNo={handleNo}
      />
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNewNote} />
        <button type='submit'>save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App