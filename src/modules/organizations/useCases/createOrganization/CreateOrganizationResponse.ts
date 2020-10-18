import { Result, Either } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { CreateOrganizationErrors } from './CreateOrganizationErrors'
import { Organization } from '../../domain/organization'
import { CreateTeamErrors } from '../../../teams/useCases/createTeam/CreateTeamErrors'

export type CreateOrganizationResponse = Either<
  | CreateOrganizationErrors.UserNotFoundError
  | CreateTeamErrors.OrganizationMaximumTeamsLimitReachedError
  | AppError.UnexpectedError,
  Result<Organization>
>
