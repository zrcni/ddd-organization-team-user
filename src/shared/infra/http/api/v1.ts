import express from 'express'
import { userRouter } from '../../../../modules/users/infra/http/routes'
import { teamRouter } from '../../../../modules/teams/infra/http/routes'
import { organizationRouter } from '../../../../modules/organizations/infra/http/routes'

const v1Router = express.Router()

v1Router.get('/', (req, res) => {
  return res.json({ message: 'ok' })
})

v1Router.use('/users', userRouter)
v1Router.use('/teams', teamRouter)
v1Router.use('/organizations', organizationRouter)

export { v1Router }
