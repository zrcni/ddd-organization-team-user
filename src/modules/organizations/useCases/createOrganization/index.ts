import { CreateOrganizationUseCase } from './CreateOrganizationUseCase'
import { CreateOrganizationController } from './CreateOrganizationController'
import { organizationRepo } from '../../../organizations/repos'
import { userRepo } from '../../../users/repos'
import { teamRepo } from '../../../teams/repos'
import { createOrganizationService } from '../../services'
import {
  createTeamService,
  addTeamMemberService,
} from '../../../teams/services'

const createOrganizationUseCase = new CreateOrganizationUseCase(
  userRepo,
  organizationRepo,
  teamRepo,
  createOrganizationService,
  createTeamService,
  addTeamMemberService,
)
const createOrganizationController = new CreateOrganizationController(
  createOrganizationUseCase,
)

export { createOrganizationUseCase, createOrganizationController }
