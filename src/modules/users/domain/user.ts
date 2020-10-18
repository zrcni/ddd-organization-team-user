import { UserName } from './userName'
import { UserId } from './userId'
import { UserCreated } from './events/userCreated'
import { UserDeleted } from './events/userDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'

interface UserProps {
  username: UserName
  isAdmin?: boolean
  isDeleted?: boolean
  isNew?: boolean
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue()
  }

  get username(): UserName {
    return this.props.username
  }

  get isDeleted(): boolean {
    return this.props.isDeleted as boolean
  }

  get isAdmin(): boolean {
    return this.props.isAdmin as boolean
  }

  get isNew(): boolean {
    return this.props.isNew as boolean
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this))
      this.props.isDeleted = true
    }
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.username, argumentName: 'username' },
    ])

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message as any)
    }

    const isNewUser = !id

    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
        isAdmin: props.isAdmin ? props.isAdmin : false,
        isNew: isNewUser,
      },
      id,
    )

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user))
    }

    return Result.ok<User>(user)
  }
}
