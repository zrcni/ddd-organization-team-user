import { User } from '../user'
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'

export class UserCreated implements IDomainEvent {
  public createdAt: Date
  public user: User

  constructor(user: User) {
    this.createdAt = new Date()
    this.user = user
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id
  }
}
