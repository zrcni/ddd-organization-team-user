import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { TeamMember } from '../teamMember'
import { TeamId } from '../teamId'

export class TeamMemberAdded implements IDomainEvent {
  public createdAt: Date
  public teamMember: TeamMember
  public teamId: TeamId

  constructor(
    teamMember: TeamMember,
    teamId: TeamId,
  ) {
    this.createdAt = new Date()
    this.teamMember = teamMember
    this.teamId = teamId
  }

  getAggregateId(): UniqueEntityID {
    return this.teamId.id
  }
}
