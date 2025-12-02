const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Note = require('../models/note')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

describe('When there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
  })

  test('all notes returned as JSON', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('content-type', /application\/json/)

  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(c => c.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('success with a specific id', async () => {
      const notesAtStart = await helper.noteInDb()
      const noteToShow = notesAtStart[0]

      const finalNote = await api
        .get(`/api/notes/${noteToShow.id}`)
        .expect(200)
        .expect('content-type', /application\/json/)

      assert.deepStrictEqual(finalNote.body, noteToShow)
    })

    test('fails with statuscode 404 if note doesnot exist', async () => {
      const testId = await helper.nonExistingId()

      await api
        .get(`/api/notes/${testId}`)
        .expect(404)
    })

    test('fails with a statuscoide 400 if id invalid', async () => {
      const invalidId = '87548375943ewhejs876587'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('success with valid data', async () => {
      const newObject = {
        content: 'Rakib is lazy',
        important: false
      }

      await api
        .post('/api/notes')
        .send(newObject)
        .expect(201)
        .expect('content-type', /application\/json/)

      const notesAtEnd = await helper.noteInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(note => note.content)
      assert(contents.includes('Rakib is lazy'))

    })

    test('fails with statuscode 400 if data invalid', async () => {
      const newObject = {
        important: false
      }

      await api
        .post('/api/notes')
        .send(newObject)
        .expect(400)

      const notesAtEnd = await helper.noteInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a new note', () => {
    test('success with statuscode 204 if id is valid', async () => {
      const notesAtStart = await helper.noteInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.noteInDb()

      const contents = notesAtEnd.map(n => n.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })

    test('fails with statuscode 404 if id is valid and no note found', async () => {
      const testId = await helper.nonExistingId()

      await api
        .delete(`/api/notes/${testId}`)
        .expect(404)
    })

    test('fails with statuscpde 400 if id is invalid', async () => {
      const invalidId = 'dlfjiru87567489579284'

      await api
        .delete(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })
})

describe('When there is initially some users are saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('1234qwer', 10)
    const newUser = new User({
      username: 'rkb',
      name: 'Rakib zaman',
      passwordHash
    })

    await newUser.save()
  })

  test('creation sucess with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newObject = {
      username: 'rakibba',
      name: 'Md Rakib',
      password: '12324dcsff'
    }

    await api
      .post('/api/users')
      .send(newObject)
      .expect(201)
      .expect('content-type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newObject.username))
  })

  test('creation fails with proper satuscode and message if a username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newObject = {
      username: 'rakibba',
      name: 'Md Rakib',
      password: '12324dcsff'
    }

    const result = await api
      .post('/api/user')
      .send(newObject)
      .expect(400)
      .expect('content-type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username must be unique'))

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
