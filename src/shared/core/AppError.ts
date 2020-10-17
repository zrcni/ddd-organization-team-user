import { Result } from './Result'
import { UseCaseError } from './UseCaseError'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err: any) {
      super(false, `An unexpected error occurred.`)
      console.info(`[AppError]: An unexpected error occurred`)
      console.error(err)
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err)
    }
  }
}