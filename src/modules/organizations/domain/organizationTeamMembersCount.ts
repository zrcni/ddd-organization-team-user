import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface OrganizationTeamMembersCountProps {
  value: number
}

export class OrganizationTeamMembersCount extends ValueObject<
  OrganizationTeamMembersCountProps
> {
  public static min = 0

  get value(): number {
    return this.props.value
  }

  private constructor(props: OrganizationTeamMembersCountProps) {
    super(props)
  }

  public static create(
    props: OrganizationTeamMembersCountProps,
  ): Result<OrganizationTeamMembersCount> {
    const maxTeamsResult = Guard.againstNullOrUndefined(props.value, 'value')
    if (!maxTeamsResult.succeeded) {
      return Result.fail<OrganizationTeamMembersCount>(
        maxTeamsResult.message as string,
      )
    }

    const greaterThanResult = Guard.greaterThan(this.min, props.value)
    if (!greaterThanResult.succeeded) {
      return Result.fail<OrganizationTeamMembersCount>(
        greaterThanResult.message as string,
      )
    }

    return Result.ok<OrganizationTeamMembersCount>(
      new OrganizationTeamMembersCount(props),
    )
  }
}
