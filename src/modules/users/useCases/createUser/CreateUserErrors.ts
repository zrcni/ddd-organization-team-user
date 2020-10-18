import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CreateUserErrors {
  export class UsernameTakenError extends Result<UseCaseError> {
    constructor(username: string) {
      super(false, `The username ${username} was already taken`)
    }
  }
}
