import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface OrganizationNameProps {
  name: string
}

export class OrganizationName extends ValueObject<OrganizationNameProps> {
  public static maxLength = 20
  public static minLength = 2

  get value(): string {
    return this.props.name
  }

  private constructor(props: OrganizationNameProps) {
    super(props)
  }

  public static create(props: OrganizationNameProps): Result<OrganizationName> {
    const organizationNameResult = Guard.againstNullOrUndefined(
      props.name,
      'name',
    )
    if (!organizationNameResult.succeeded) {
      return Result.fail<OrganizationName>(
        organizationNameResult.message as string,
      )
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name)
    if (!minLengthResult.succeeded) {
      return Result.fail<OrganizationName>(minLengthResult.message as string)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name)
    if (!maxLengthResult.succeeded) {
      return Result.fail<OrganizationName>(minLengthResult.message as string)
    }

    return Result.ok<OrganizationName>(new OrganizationName(props))
  }
}
