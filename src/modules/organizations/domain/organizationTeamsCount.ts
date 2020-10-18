import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface OrganizationTeamsCountProps {
  value: number
}

export class OrganizationTeamsCount extends ValueObject<
  OrganizationTeamsCountProps
> {
  public static min = 0

  get value(): number {
    return this.props.value
  }

  private constructor(props: OrganizationTeamsCountProps) {
    super(props)
  }

  public static create(
    props: OrganizationTeamsCountProps,
  ): Result<OrganizationTeamsCount> {
    const maxTeamsResult = Guard.againstNullOrUndefined(props.value, 'value')
    if (!maxTeamsResult.succeeded) {
      return Result.fail<OrganizationTeamsCount>(
        maxTeamsResult.message as string,
      )
    }

    const greaterThanResult = Guard.greaterThan(this.min, props.value)
    if (!greaterThanResult.succeeded) {
      return Result.fail<OrganizationTeamsCount>(
        greaterThanResult.message as string,
      )
    }

    return Result.ok<OrganizationTeamsCount>(new OrganizationTeamsCount(props))
  }

  public static createDefault(): OrganizationTeamsCount {
    return this.create({ value: 0 }).getValue()
  }
}
