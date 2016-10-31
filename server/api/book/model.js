import mongoose from 'mongoose'

const {Schema} = mongoose

const BookSchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  description: String,
  authors: [{
    type: String,
    required: true
  }],
  description: String,
  imageSm: String,
  imageLg: String,
  categories: [String]
}, {
  timestamps: true
})

BookSchema.index({
  createdAt: -1
})

export default mongoose.model('Book', BookSchema)
