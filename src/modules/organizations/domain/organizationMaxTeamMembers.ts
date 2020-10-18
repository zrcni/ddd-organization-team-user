import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface OrganizationMaxTeamMembersProps {
  value: number
}

export class OrganizationMaxTeamMembers extends ValueObject<
  OrganizationMaxTeamMembersProps
> {
  public static min = 4
  public static max = 50

  get value(): number {
    return this.props.value
  }

  private constructor(props: OrganizationMaxTeamMembersProps) {
    super(props)
  }

  public static create(
    props: OrganizationMaxTeamMembersProps,
  ): Result<OrganizationMaxTeamMembers> {
    const maxTeamsResult = Guard.againstNullOrUndefined(props.value, 'value')
    if (!maxTeamsResult.succeeded) {
      return Result.fail<OrganizationMaxTeamMembers>(
        maxTeamsResult.message as string,
      )
    }

    const rangeResult = Guard.inRange(props.value, this.min, this.max, 'value')
    if (!rangeResult.succeeded) {
      return Result.fail<OrganizationMaxTeamMembers>(
        rangeResult.message as string,
      )
    }

    return Result.ok<OrganizationMaxTeamMembers>(
      new OrganizationMaxTeamMembers(props),
    )
  }

  public static createDefault(): OrganizationMaxTeamMembers {
    return this.create({ value: 4 }).getValue()
  }
}
