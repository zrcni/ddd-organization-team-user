import { Team } from '../team'
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'

export class TeamCreated implements IDomainEvent {
  public createdAt: Date
  public team: Team

  constructor(team: Team) {
    this.createdAt = new Date()
    this.team = team
  }

  getAggregateId(): UniqueEntityID {
    return this.team.id
  }
}
