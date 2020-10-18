import { Entity } from '../../../shared/domain/Entity'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Guard } from '../../../shared/core/Guard'
import { UserId } from '../../users/domain/userId'
import { TeamId } from './teamId'
import { TeamMemberId } from './teamMemberId'
import { TeamMemberRoles } from './teamMemberRoles'
import { TeamMemberRole } from './teamMemberRole'

export interface TeamMemberProps {
  teamMemberId: TeamMemberId
  userId: UserId
  teamId: TeamId
  roles: TeamMemberRoles
}

export class TeamMember extends Entity<TeamMemberProps> {
  get teamMemberId(): UserId {
    return TeamMemberId.create(this._id).getValue()
  }

  get userId(): TeamId {
    return this.props.teamId
  }

  get teamId(): TeamId {
    return this.props.teamId
  }

  get roles(): TeamMemberRoles {
    return this.props.roles
  }

  private constructor(props: TeamMemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: TeamMemberProps,
    id?: UniqueEntityID,
  ): Result<TeamMember> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.roles, argumentName: 'roles' },
      { argument: props.teamId, argumentName: 'teamId' },
    ])

    if (!nullGuard.succeeded) {
      return Result.fail<TeamMember>(nullGuard.message as any)
    } else {
      const roles = props.roles
        ? props.roles
        : TeamMemberRoles.create([
            TeamMemberRole.create({ value: 'agent' }).getValue(),
          ])

      const defaultTeamMemberProps: TeamMemberProps = {
        ...props,
        roles,
      }

      const teamMember = new TeamMember(defaultTeamMemberProps, id)

      return Result.ok<TeamMember>(teamMember)
    }
  }
}
