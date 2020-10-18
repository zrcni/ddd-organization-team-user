import { AddTeamMember } from './AddTeamMember'
import { AddTeamMemberController } from './AddTeamMemberController'
import { userRepo } from '../../../users/repos'
import { teamRepo } from '../../repos'
import { organizationRepo } from '../../../organizations/repos'
import { organizationService } from '../../../organizations/domain/services'

const addTeamMemberUseCase = new AddTeamMember(
  userRepo,
  teamRepo,
  organizationRepo,
  organizationService,
)
const addTeamMemberController = new AddTeamMemberController(
  addTeamMemberUseCase,
)

export { addTeamMemberUseCase, addTeamMemberController }
