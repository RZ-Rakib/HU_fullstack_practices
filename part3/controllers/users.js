const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const User = require('../models/user')


usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const newUser = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await newUser.save()

    logger.info('new user saved successfullly')
    return res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User
      .find({})
      .populate('notes', { content: 1, important: 1, id: 0 })

    logger.info('users fetched successfully')
    res.json(users)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
