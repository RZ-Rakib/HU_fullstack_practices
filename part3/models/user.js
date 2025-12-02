const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [2, 'minimum length 2 charecters'],
    required: [true, 'username required'],
    unique: true
  },
  name: {
    type: String,
    minlength: [2, 'minimum length 2 charecters'],
    required: [true, 'name required'],
  },
  passwordHash:{
    type: String,
    required: [true, 'passward required'],
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User