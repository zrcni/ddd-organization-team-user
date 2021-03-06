import { Entity } from '../../../shared/domain/Entity'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Guard } from '../../../shared/core/Guard'
import { UserId } from '../../users/domain/userId'
import { TeamMemberRoles } from './teamMemberRoles'
import { TeamMemberRole } from './teamMemberRole'

export interface TeamMemberProps {
  userId: UserId
  roles: TeamMemberRoles
}

export class TeamMember extends Entity<TeamMemberProps> {
  get userId(): UserId {
    return this.props.userId
  }

  get roles(): TeamMemberRoles {
    return this.props.roles
  }

  private constructor(props: TeamMemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: TeamMemberProps): Result<TeamMember> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.roles, argumentName: 'roles' },
    ])

    if (!nullGuard.succeeded) {
      return Result.fail<TeamMember>(nullGuard.message as any)
    } else {
      const roles = props.roles ? props.roles : TeamMemberRoles.createDefault()

      const defaultTeamMemberProps: TeamMemberProps = {
        ...props,
        roles,
      }

      const teamMember = new TeamMember(
        defaultTeamMemberProps,
        new UniqueEntityID(props.userId.id.toString()),
      )

      return Result.ok<TeamMember>(teamMember)
    }
  }
}
