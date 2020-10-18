import express from 'express'
import { addTeamMemberController } from '../../../useCases/addTeamMember'

const teamRouter = express.Router()

teamRouter.post('/:teamId/members', (req, res) => addTeamMemberController.execute(req, res))

export { teamRouter }
