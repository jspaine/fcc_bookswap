import Router from 'koa-router'

import controller from './controller'
import auth from '../../lib/authService'

const router = new Router()

router.get('/', auth.isAuthenticated, controller.search)

export default router
