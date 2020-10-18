import { Result } from '../../../../shared/core/Result'
import { UseCaseError } from '../../../../shared/core/UseCaseError'

export namespace CreateOrganizationErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, `User not found.`)
    }
  }

  export class OrganizationNameTaken extends Result<UseCaseError> {
    constructor(organizationName: string) {
      super(false, `Organization name ${organizationName} is already taken.`)
    }
  }
}
