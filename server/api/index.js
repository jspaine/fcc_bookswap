import Router from 'koa-router'

import auth from './auth'
import book from './book'
import search from './search'
import trade from './trade'
import user from './user'

const router = new Router({
  prefix: '/api'
})

router.use('/auth', auth.routes())
router.use('/book', book.routes())
router.use('/search', search.routes())
router.use('/trade', trade.routes())
router.use('/user', user.routes())

export default router
