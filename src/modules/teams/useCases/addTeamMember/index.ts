import { AddTeamMember } from './AddTeamMember'
import { AddTeamMemberController } from './AddTeamMemberController'
import { userRepo } from '../../../users/repos'
import { teamRepo } from '../../repos'
import { organizationRepo } from '../../../organizations/repos'
import { addTeamMemberService } from '../../services'

const addTeamMemberUseCase = new AddTeamMember(
  userRepo,
  teamRepo,
  organizationRepo,
  addTeamMemberService,
)
const addTeamMemberController = new AddTeamMemberController(
  addTeamMemberUseCase,
)

export { addTeamMemberUseCase, addTeamMemberController }
