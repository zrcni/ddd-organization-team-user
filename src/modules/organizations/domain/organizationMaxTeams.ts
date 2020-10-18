import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface OrganizationMaxTeamsProps {
  value: number
}

export class OrganizationMaxTeams extends ValueObject<
  OrganizationMaxTeamsProps
> {
  public static min = 1
  public static max = 25

  get value(): number {
    return this.props.value
  }

  private constructor(props: OrganizationMaxTeamsProps) {
    super(props)
  }

  public static create(
    props: OrganizationMaxTeamsProps,
  ): Result<OrganizationMaxTeams> {
    const maxTeamsResult = Guard.againstNullOrUndefined(props.value, 'value')
    if (!maxTeamsResult.succeeded) {
      return Result.fail<OrganizationMaxTeams>(maxTeamsResult.message as string)
    }

    const rangeResult = Guard.inRange(props.value, this.min, this.max, 'value')
    if (!rangeResult.succeeded) {
      return Result.fail<OrganizationMaxTeams>(rangeResult.message as string)
    }

    return Result.ok<OrganizationMaxTeams>(new OrganizationMaxTeams(props))
  }

  public static createDefault(): OrganizationMaxTeams {
    return this.create({ value: 2 }).getValue()
  }
}
