import { CreateTeamUseCase } from './CreateTeamUseCase'
import { CreateTeamController } from './CreateTeamController'
import { teamRepo } from '../../repos'
import { organizationRepo } from '../../../organizations/repos'
import { userRepo } from '../../../users/repos'
import { createTeamService, addTeamMemberService } from '../../services'

const createTeamUseCase = new CreateTeamUseCase(
  userRepo,
  teamRepo,
  organizationRepo,
  createTeamService,
  addTeamMemberService,
)
const createTeamController = new CreateTeamController(createTeamUseCase)

export { createTeamUseCase, createTeamController }
