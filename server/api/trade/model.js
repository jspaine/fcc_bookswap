import mongoose from 'mongoose'

const {Schema} = mongoose

const TradeSchema = new Schema({
  from: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fromBook: {
    type: Schema.ObjectId,
    ref: 'Book'
  },
  toBook: {
    type: Schema.ObjectId,
    ref: 'Book',
    required: true
  },
  cancelledBy: {
    type: Schema.ObjectId,
    ref: 'User',
    default: null
  },
  rejected: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('Trade', TradeSchema)
