import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'

type TeamMemberRoleType = 'agent' | 'lead'

interface TeamMemberRoleProps {
  value: TeamMemberRoleType
}

export class TeamMemberRole extends ValueObject<TeamMemberRoleProps> {
  private static validRoles: TeamMemberRoleType[] = ['agent', 'lead']

  get value(): string {
    return this.props.value
  }

  private constructor(props: TeamMemberRoleProps) {
    super(props)
  }

  public static create(props: TeamMemberRoleProps): Result<TeamMemberRole> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'value')

    if (!nullGuardResult.succeeded) {
      return Result.fail<TeamMemberRole>(nullGuardResult.message as any)
    }

    const oneOfGuardResult = Guard.isOneOf(
      props.value,
      this.validRoles,
      'value',
    )

    if (!oneOfGuardResult.succeeded) {
      return Result.fail<TeamMemberRole>(oneOfGuardResult.message as any)
    }

    return Result.ok<TeamMemberRole>(new TeamMemberRole(props))
  }
}
