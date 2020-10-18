import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'

type OrganizationMemberRoleType = 'owner' | 'crowdmgr'

interface OrganizationMemberRoleProps {
  value: OrganizationMemberRoleType
}

export class OrganizationMemberRole extends ValueObject<
  OrganizationMemberRoleProps
> {
  private static validRoles: OrganizationMemberRoleType[] = [
    'owner',
    'crowdmgr',
  ]

  get value(): string {
    return this.props.value
  }

  private constructor(props: OrganizationMemberRoleProps) {
    super(props)
  }

  public static create(
    props: OrganizationMemberRoleProps,
  ): Result<OrganizationMemberRole> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'value')

    if (!nullGuardResult.succeeded) {
      return Result.fail<OrganizationMemberRole>(nullGuardResult.message as any)
    }

    const oneOfGuardResult = Guard.isOneOf(
      props.value,
      this.validRoles,
      'value',
    )

    if (!oneOfGuardResult.succeeded) {
      return Result.fail<OrganizationMemberRole>(
        oneOfGuardResult.message as any,
      )
    }

    return Result.ok<OrganizationMemberRole>(new OrganizationMemberRole(props))
  }
}
