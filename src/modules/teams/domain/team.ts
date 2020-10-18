import { TeamName } from './teamName'
import { TeamId } from './teamId'
import { TeamCreated } from './events/teamCreated'
import { TeamDeleted } from './events/teamDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { OrganizationId } from '../../organizations/domain/organizationId'
import { TeamMembers } from './teamMembers'
import { TeamMember } from './teamMember'
import { TeamMemberAdded } from './events/teamMemberAdded'
import { TeamMemberRemoved } from './events/teamMemberRemoved'

interface TeamProps {
  name: TeamName
  organizationId: OrganizationId
  members: TeamMembers
  isDeleted?: boolean
}

export class Team extends AggregateRoot<TeamProps> {
  get teamId(): TeamId {
    return TeamId.create(this._id).getValue()
  }

  get name(): TeamName {
    return this.props.name
  }

  get organizationId(): OrganizationId {
    return this.props.organizationId
  }

  get members(): TeamMembers {
    return this.props.members
  }

  get isDeleted(): boolean {
    return this.props.isDeleted as boolean
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.props.isDeleted = true
      this.addDomainEvent(new TeamDeleted(this))
    }
  }

  public addMember(teamMember: TeamMember): void {
    if (!this.props.members.exists(teamMember)) {
      this.props.members.add(teamMember)
      this.addDomainEvent(new TeamMemberAdded(teamMember, this.teamId))
    }
  }

  public removeMember(teamMember: TeamMember): void {
    if (this.props.members.exists(teamMember)) {
      this.props.members.remove(teamMember)
      this.addDomainEvent(new TeamMemberRemoved(teamMember, this.teamId))
    }
  }

  private constructor(props: TeamProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: TeamProps, id?: UniqueEntityID): Result<Team> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
    ])

    if (!guardResult.succeeded) {
      return Result.fail<Team>(guardResult.message as string)
    }

    const team = new Team(
      {
        ...props,
        members: props.members ? props.members : TeamMembers.create(),
        isDeleted: props.isDeleted ? props.isDeleted : false,
      },
      id,
    )

    team.addDomainEvent(new TeamCreated(team))

    return Result.ok<Team>(team)
  }
}
