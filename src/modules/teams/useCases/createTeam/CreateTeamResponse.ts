import { Result, Either } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { CreateTeamErrors } from './CreateTeamErrors'
import { Team } from '../../domain/team'

export type CreateTeamResponse = Either<
  | CreateTeamErrors.UserNotFoundError
  | CreateTeamErrors.OrganizationNotFoundError
  | AppError.UnexpectedError,
  Result<Team>
>
