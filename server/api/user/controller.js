import jwt from 'jsonwebtoken'

import User from './model'
import config from '../../config'

export default {
  index: async (ctx) => {
    const {ids} = ctx.query
    if (ids && ids.length) {
      ctx.body = await User.find({_id: {'$in': ids}})
    } else {
      ctx.body = await User.find()
    }
  },

  show: async (ctx) => {
    if (ownOrAdmin(ctx.params, ctx.state.user)) {
      const user = await User.findOne({ _id: ctx.params.id })
      if (!user) {
        return ctx.status = 404
      }
      ctx.body = user
    } else {
      ctx.status = 403
    }
  },

  create: async (ctx) => {
    const newUser = new User(ctx.request.body)
    const existingUsers = await User.find({
      username: newUser.username
    })

    if (existingUsers.length === 0) {
      const user = await newUser.save()
      const token = jwt.sign({ _id: user._id, role: user.role}, config.secrets.token)

      ctx.body = {
        id: user._id,
        token
      }
    } else {
      ctx.status = 500
      ctx.body = {error: 'username taken'}
    }
  },

  del: async (ctx) => {
    if (ownOrAdmin(ctx.params, ctx.state.user)) {
      ctx.body = await User.findOneAndRemove({ _id: ctx.params.id })
      ctx.status = 200
    } else {
      ctx.status = 403
    }
  },

  me: async (ctx) => {
    const user = await User.findOne({ _id: ctx.state.user._id })
    ctx.body = user
  },

  update: async (ctx) => {
    if (ownOrAdmin(ctx.params, ctx.state.user)) {
      const {body} = ctx.request
      const user = await User.findOne({ _id: ctx.params.id })
      // user.password = body.password || user.password
      // user.area = body.area || user.area
      user.country = body.country || user.country
      ctx.body = await user.save()
    } else {
      ctx.status = 403
    }
  }
}

function ownOrAdmin(target, user) {
  return user.role === 'admin' || user._id === target.id
}
