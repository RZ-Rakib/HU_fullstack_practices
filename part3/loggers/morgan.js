const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const { stream } = require('winston')
require('dotenv').config()

const logDirectory = path.join(__dirname, '../logs')
if(!fs.existsSync(logDirectory)){
  fs.mkdirSync(logDirectory)
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  {flags: 'a'}
)

const jsonFormat = (tokens, req, res) => JSON.stringify({
  time: tokens.date(req, res, 'iso'),
  method: tokens.method(req, res),
  url: tokens.url(req, res),
  status: tokens.status(req, res),
  response_time: `${tokens['response-time'](req, res)} ms`,
  content_length: tokens.res(req, res, 'content-length') || 0,
  user_agent: tokens['user-agent'](req, res),
})

const format = process.env.NODE_MODE === 'production' ? jsonFormat : 'dev'

const morganMiddleware = morgan(format, {stream: accessLogStream})

module.exports = morganMiddleware