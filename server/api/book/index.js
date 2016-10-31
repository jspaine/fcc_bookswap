import Router from 'koa-router'

import controller from './controller'
import auth from '~/lib/authService'

const router = new Router()

router.get('/', controller.index)
router.post('/', auth.isAuthenticated, controller.create)
router.del('/:id', auth.isAuthenticated, controller.delete)

export default router
