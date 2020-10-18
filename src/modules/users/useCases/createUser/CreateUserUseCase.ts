import { CreateUserDTO } from './CreateUserDTO'
import { CreateUserErrors } from './CreateUserErrors'
import { Either, Result, left, right } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { IUserRepo } from '../../repos/userRepo'
import { UseCase } from '../../../../shared/core/UseCase'
import { UserName } from '../../domain/userName'
import { User } from '../../domain/user'

type Response = Either<
  CreateUserErrors.UsernameTakenError | AppError.UnexpectedError | Result<any>,
  Result<void>
>

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<Response>> {
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  async execute(request: CreateUserDTO): Promise<Response> {
    const usernameOrError = UserName.create({ name: request.username })

    if (usernameOrError.isFailure) {
      return left(Result.fail<void>(usernameOrError.error)) as Response
    }

    const username: UserName = usernameOrError.getValue()

    try {
      try {
        const alreadyCreatedUserByUserName = await this.userRepo.getUserByUserName(
          username,
        )

        const userNameTaken = !!alreadyCreatedUserByUserName

        if (userNameTaken) {
          return left(
            new CreateUserErrors.UsernameTakenError(username.value),
          ) as Response
        }
        // eslint-disable-next-line no-empty
      } catch (err) {}

      const userOrError: Result<User> = User.create({ username })

      if (userOrError.isFailure) {
        return left(Result.fail<User>(userOrError.error.toString())) as Response
      }

      const user: User = userOrError.getValue()

      await this.userRepo.save(user)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response
    }
  }
}
