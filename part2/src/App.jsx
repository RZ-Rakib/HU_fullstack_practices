import { useState, useEffect } from 'react'
import Note from './component/Note'
import noteService from './services/notes'
import loginService from './services/login'
import Dialog from './component/Dialog'
import Footer from './component/Footer'
import Notification from './component/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
      .catch(error => {
        console.log("error ==> ", error);
      })
  }
  useEffect(hook, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const noteToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const addNote = (event) => {
    event.preventDefault()

    if (notes.some(note => note.content.trim().toLowerCase() === newNote.trim().toLowerCase())) {
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
        setErrorMessage(error.response?.data?.error || 'Something went wrong')
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
        setErrorMessage(`${error.response.data.error}`)
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
        setErrorMessage(`${error.response.data.error}`)
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
    const deletedNoteContent = selectedNote.content
    if (selectedNote) {
      noteService
        .remove(selectedNote.id)
        .then(() => {
          setErrorMessage(`${deletedNoteContent} is sucessfully removed`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000);
          setNotes(prev => prev.filter(note => note.id !== selectedNote.id))
          setDialogOpen(false)
          setSelectedNote(null)
        })
        .catch(error => {
          setErrorMessage(`${error.response.data.error}`)
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')

    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNewNote} />
      <button type='submit'>save</button>
    </form>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}

      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {noteToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
            handleVotes={() => handleVotes(note.id)}
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

      <Footer />
    </div>
  )
}

export default App