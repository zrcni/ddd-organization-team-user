import { AddTeamMember } from './AddTeamMember'
import { AddTeamMemberController } from './AddTeamMemberController'
import { userRepo } from '../../../users/repos'
import { teamRepo } from '../../repos'
import { organizationRepo } from '../../../organizations/repos'
import { teamMemberService } from '../../services'

const addTeamMemberUseCase = new AddTeamMember(
  userRepo,
  teamRepo,
  organizationRepo,
  teamMemberService,
)
const addTeamMemberController = new AddTeamMemberController(
  addTeamMemberUseCase,
)

export { addTeamMemberUseCase, addTeamMemberController }
