import Router from 'koa-router'

import controller from './controller'
import auth from '../../lib/authService'

const router = new Router()

router.get('/', auth.isAuthenticated, controller.index)
router.post('/', controller.create)
router.get('/me', auth.isAuthenticated, controller.me)
router.put('/:id', auth.isAuthenticated, controller.update)
router.get('/:id', auth.isAuthenticated, controller.show)
router.del('/:id', auth.isAuthenticated, controller.del)

export default router
