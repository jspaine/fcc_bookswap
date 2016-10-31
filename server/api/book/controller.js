import Book from './model'
import User from '../user/model'

export default {
  index: async ctx => {
    const {limit, offset, country, user} = ctx.query
    let conditions = {}

    if (country) {
      const users = (await User.find({country}).lean())
        .map(user => user._id)
      conditions = {owner: {$in: users}}
    } else if (user) {
      conditions = {owner: user}
    }

    ctx.body = await Book.find(conditions)
      .skip(offset || 0)
      .limit(limit || 20)
      .populate('owner', '-role -provider')
  },

  create: async ctx => {
    ctx.body = await new Book({
      ...ctx.request.body,
      owner: ctx.state.user._id
    }).save()
  },

  delete: async ctx => {
    const book = await Book.findOne({_id: ctx.params.id})
    if (!book) return ctx.status = 404
    if (!ctx.state.user.role === 'admin' || ctx.state.user._id !== book.owner.toString()) {
      return ctx.status = 403
    }
    ctx.body = await book.remove()
  }
}
