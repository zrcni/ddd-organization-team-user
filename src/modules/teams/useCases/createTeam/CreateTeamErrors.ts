import { Result } from '../../../../shared/core/Result'
import { UseCaseError } from '../../../../shared/core/UseCaseError'

export namespace CreateTeamErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, `User not found.`)
    }
  }

  export class OrganizationNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, `Organization not found.`)
    }
  }

  export class OrganizationMaximumTeamsLimitReachedError extends Result<
    UseCaseError
  > {
    constructor() {
      super(false, `Organization has reached the maximum team limit.`)
    }
  }
}
