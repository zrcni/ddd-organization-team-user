import express from 'express'
import { teamRouter } from '../../../../modules/teams/infra/http/routes'

const v1Router = express.Router()

v1Router.get('/', (req, res) => {
  return res.json({ message: 'ok' })
})

v1Router.use('/teams', teamRouter)

export { v1Router }
