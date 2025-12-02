const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {

    content: 'HTML is easy',
    important: true
  },
  {
    content: 'CSS is hard',
    important: true
  }
]

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
const nonExistingId = async () => {
  const newNote = new Note({ content: 'Hello from Gym' })
  await newNote.save()
  await newNote.deleteOne()

  return newNote._id.toString()
}

module.exports = {
  initialNotes, notesInDb, nonExistingId, usersInDb
}