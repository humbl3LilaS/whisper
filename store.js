import { Whisper } from './schema.js'

export const getAll = async () => await Whisper.find()

export const getById = async (id) => await Whisper.findById({ _id: id })

export const create = async (message) => {
  const whisper = new Whisper({ message })
  await whisper.save()
  return whisper
}

export const updateById = async (id, message) => {
  await Whisper.findOneAndUpdate({ _id: id }, { message }, { new: false })
}

export const deleteById = async (id) => {
  await Whisper.deleteOne({ _id: id })
}
