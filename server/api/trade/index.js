import Router from 'koa-router'

import controller from './controller'
import auth from '~/lib/authService'

const router = new Router()

router.get('/', auth.isAuthenticated, controller.index)
router.post('/', auth.isAuthenticated, controller.create)
// router.post('/:id/offer', auth.isAuthenticated, controller.offer)
// router.post('/:id/accept', auth.isAuthenticated, controller.accept)
// router.post('/:id/cancel', auth.isAuthenticated, controller.cancel)
router.put('/:id', auth.isAuthenticated, controller.update)
router.del('/:id', auth.isAuthenticated, controller.delete)

export default router
