import { Result } from '../../../../shared/core/Result'
import { UseCaseError } from '../../../../shared/core/UseCaseError'

export namespace AddTeamMemberErrors {
  export class TeamNotInOrganizationError extends Result<UseCaseError> {
    constructor(teamName: string, organizationName: string) {
      super(
        false,
        `Team ${teamName} is not a part of organization ${organizationName}`,
      )
    }
  }

  export class OrganizationMaxTeamMembersLimitReachedError extends Result<
    UseCaseError
  > {
    constructor(organizationName: string) {
      super(
        false,
        `Organization ${organizationName} has already reached the maximum team member limit.`,
      )
    }
  }
  export class TeamMemberAlreadyExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, `Team member already exists.`)
    }
  }
}
