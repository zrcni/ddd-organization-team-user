import { Entity } from '../../../shared/domain/Entity'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Guard } from '../../../shared/core/Guard'
import { UserId } from '../../users/domain/userId'
import { OrganizationId } from './organizationId'
import { OrganizationMemberId } from './organizationMemberId'
import { OrganizationMemberRoles } from './organizationMemberRoles'

export interface OrganizationMemberProps {
  userId: UserId
  roles: OrganizationMemberRoles
}

export class OrganizationMember extends Entity<OrganizationMemberProps> {
  get userId(): OrganizationId {
    return this.props.userId
  }

  get roles(): OrganizationMemberRoles {
    return this.props.roles
  }

  private constructor(props: OrganizationMemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: OrganizationMemberProps,
  ): Result<OrganizationMember> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.roles, argumentName: 'roles' },
    ])

    if (!nullGuard.succeeded) {
      return Result.fail<OrganizationMember>(nullGuard.message as any)
    } else {
      const organizationMember = new OrganizationMember(
        { ...props },
        new UniqueEntityID(props.userId.id.toString()),
      )

      return Result.ok<OrganizationMember>(organizationMember)
    }
  }
}
