import mongoose from 'mongoose'
import { checkPasswordStrength } from './util.js'
import validator from 'validator'
import bcrypt from 'bcrypt'

mongoose.set('toJSON', {
  virtuals : true,
  transform: (doc, converted) => {
    delete converted._id
    delete converted.__v
  },
})

const userSchema = new mongoose.Schema({
  username: {
    type     : String,
    unique   : true,
    trim     : true,
    required : [true, 'Username is required'],
    minLength: [3, 'Username must be at least 3 characters long'],
    maxLength: [20, 'Username must be at most 20 characters long'],
  },
  password: {
    type     : String,
    required : [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters long'],
    validate : {
      validator: checkPasswordStrength,
    },
  },
  email   : {
    type     : String,
    unique   : true,
    trim     : true,
    lowercase: true,
    select   : false,
    required : [true, 'Email is required'],
    validator: {
      validator: validator.isEmail,
      message  : 'Email is not valid',
    },
  },
})

const whisperSchema = new mongoose.Schema({
  author      : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message     : String,
  updatedDate : {
    type   : Date,
    default: Date.now,
  },
  creationDate: {
    type   : Date,
    default: Date.now,
  },
})

whisperSchema.pre('save', function (next) {
  this.updatedDate = Date.now()
  next()
})

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, salt)
  }
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this
  return await bcrypt.compare(candidatePassword, user.password)
}

export const Whisper = mongoose.model('Whisper', whisperSchema)
export const User = mongoose.model('User', userSchema);