import config from '../../config'
import Trade from './model'
import User from '../user/model'
import Book from '../book/model'

export default {
  index: async (ctx) => {
    let res
    if (ctx.query.id) {
      try {
        res = await Trade.find({_id: ctx.query.id})
      } catch (err) {
        if (err.name === 'CastError') {
          return ctx.status = 404
        }
        throw err
      }
    } else {
      res = await Trade.find({
        '$or': [
          {from: ctx.state.user._id},
          {to: ctx.state.user._id}
        ]
      })
        .populate('from to fromBook toBook')
    }

    ctx.body = await Trade.populate(res, 'from to fromBook toBook')
  },

  create: async (ctx) => {
    const {body} = ctx.request
    ctx.body = await new Trade({
      to: body.toBook.owner._id,
      toBook: body.toBook,
      from: ctx.state.user._id
    })
      .save()
  },

  update: async ctx => {
    const {body} = ctx.request
    const trade = await Trade.findById(ctx.params.id)
    if (body.completed && trade.fromBook && trade.toBook) {
      const {from, to} = trade
      const fromBook = await Book.findById(trade.fromBook)
      const toBook = await Book.findById(trade.toBook)
      fromBook.owner = to
      toBook.owner = from
      trade.completed = true
      await fromBook.save()
      await toBook.save()
      await trade.save()
      ctx.body = await Trade.findById(trade._id)
        .populate('fromBook toBook')
    } else {
      trade.fromBook = body.fromBook || trade.fromBook
      trade.cancelledBy = set(body.cancelledBy, trade.cancelledBy)
      trade.rejected = set(body.rejected, trade.rejected)
      ctx.body = await trade.save()
    }
  },

  delete: async (ctx) => {
    const trade = await Trade.findById(ctx.params.id)
    const {user} = ctx.state
    if (user.role !== 'admin' || trade.from !== user._id || trade.to !== user._id) {
      return ctx.status = 403
    }
    ctx.body = await Trade.findOneAndRemove({_id: trade._id})
  }
}

function ownOrAdmin(target, user) {
  return user.role === 'admin' || user._id === target.id
}

function set(a, b) {
  return a === undefined ? b : a
}
