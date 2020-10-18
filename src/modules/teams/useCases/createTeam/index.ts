import { CreateTeam } from './CreateTeam'
import { CreateTeamController } from './CreateTeamController'
import { teamRepo } from '../../repos'
import { organizationRepo } from '../../../organizations/repos'
import { userRepo } from '../../../users/repos'
import { createTeamService } from '../../services'

const createTeamUseCase = new CreateTeam(
  userRepo,
  teamRepo,
  organizationRepo,
  createTeamService,
)
const createTeamController = new CreateTeamController(createTeamUseCase)

export { createTeamUseCase, createTeamController }
