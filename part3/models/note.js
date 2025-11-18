const mongoose = require('mongoose')
const winston = require('../loggers/winston')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
  .then(() => {
    winston.info('\'Mongodb\': Mongodb connected')
  })
  .catch(error => {
    winston.error(`'Mongodb': Error connecting to Mongodb, ${error.message}`)
  })

const noteSchema = new mongoose.Schema({

  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)