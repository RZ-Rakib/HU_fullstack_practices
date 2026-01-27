import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import Dialog from './components/Dialog'
import Footer from './components/Footer'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)
  const noteFromRef = useRef()

  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
      .catch(error => {
        console.log('error ==> ', error)
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

  const addNote = async (newNote) => {

    if (notes.some(note => note.content.trim().toLowerCase() === newNote.content.trim().toLowerCase())) {
      setNotificationMessage(`${newNote} is already exist in the server.`)
      return
    }

    try {
      noteFromRef.current.toggleVisible()

      const response = await noteService.create(newNote)

      setNotificationMessage(`${response.content} created successfully`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
      setNotes(prev => prev.concat(response))

    } catch (error) {
      setNotificationMessage(error.response?.data?.error || 'Something went wrong')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
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
        setNotificationMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setNotificationMessage(null)
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
        setNotificationMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)
        setNotes(prev => prev.filter(note => note.id !== id))
      })
  }

  // dialog handle functions
  const handleDelete = (note) => {
    setSelectedNote(note)
    setDialogOpen(true)
  }

  const handleYes = () => {
    const deletedNoteContent = selectedNote.content
    if (selectedNote) {
      noteService
        .remove(selectedNote.id)
        .then(() => {
          setNotificationMessage(`${deletedNoteContent} is sucessfully removed`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
          setNotes(prev => prev.filter(note => note.id !== selectedNote.id))
          setDialogOpen(false)
          setSelectedNote(null)
        })
        .catch(error => {
          setNotificationMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setNotificationMessage(null)
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

  // login form handle functions
  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)

      setUser(user)
      setNotificationMessage(`Welcome ${user.username}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)

    } catch {
      setNotificationMessage('Wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
    }
  }

  const loginForm = () => {
    return (
      <Toggleable buttonLabel='log in' >
        <LoginForm
          userLogin={handleLogin}
        />
      </Toggleable>
    )
  }

  const noteForm = () => {
    return (
      <Toggleable buttonLabel='new note' ref={noteFromRef}>
        <NoteForm
          createNote={addNote}
        />
      </Toggleable>
    )
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={notificationMessage} />
      <hr />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
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