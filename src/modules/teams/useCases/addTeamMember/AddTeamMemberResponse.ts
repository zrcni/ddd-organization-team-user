import { Result, Either } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { AddTeamMemberErrors } from './AddTeamMemberErrors'
import { TeamMember } from '../../../teams/domain/teamMember'

export type AddTeamMemberResponse = Either<
  | AddTeamMemberErrors.OrganizationMaxTeamMembersLimitReachedError
  | AddTeamMemberErrors.TeamNotInOrganizationError
  | AddTeamMemberErrors.TeamMemberAlreadyExistsError
  | AppError.UnexpectedError,
  Result<TeamMember>
>
