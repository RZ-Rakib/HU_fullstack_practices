const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const notesRoutes = require('./controllers/notes')
const app = express()

logger.info('Server is connecting to Mongodb')

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('\'Mongodb\': Mongodb connected')
  })
  .catch(error => {
    logger.error(`'Mongodb': Error connecting to Mongodb, ${error.message}`)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRoutes)

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler)

module.exports = app