import { TeamName } from './teamName'
import { TeamId } from './teamId'
import { TeamCreated } from './events/teamCreated'
import { TeamDeleted } from './events/teamDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { OrganizationId } from '../../organizations/domain/organizationId'

interface TeamProps {
  name: TeamName
  organizationId: OrganizationId
  isDeleted?: boolean
}

export class Team extends AggregateRoot<TeamProps> {
  get teamId(): TeamId {
    return TeamId.create(this._id).getValue()
  }

  get name(): TeamName {
    return this.props.name
  }

  get isDeleted(): boolean {
    return this.props.isDeleted as boolean
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new TeamDeleted(this))
      this.props.isDeleted = true
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
        isDeleted: props.isDeleted ? props.isDeleted : false,
      },
      id,
    )

    team.addDomainEvent(new TeamCreated(team))

    return Result.ok<Team>(team)
  }
}
