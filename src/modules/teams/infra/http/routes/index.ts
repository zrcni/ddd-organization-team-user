import express from 'express'
import { addTeamMemberController } from '../../../useCases/addTeamMember'
import { createTeamController } from '../../../useCases/createTeam'

const teamRouter = express.Router()

teamRouter.post('/', (req, res) => createTeamController.execute(req, res))
teamRouter.post('/:teamId/members', (req, res) =>
  addTeamMemberController.execute(req, res),
)

export { teamRouter }
