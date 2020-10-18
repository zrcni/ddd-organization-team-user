import { Entity } from '../../../shared/domain/Entity'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Guard } from '../../../shared/core/Guard'
import { UserId } from '../../users/domain/userId'
import { OrganizationId } from './organizationId'
import { OrganizationMemberId } from './organizationMemberId'
import { OrganizationMemberRoles } from './organizationMemberRoles'

export interface OrganizationMemberProps {
  organizationMemberId: OrganizationMemberId
  userId: UserId
  organizationId: OrganizationId
  roles: OrganizationMemberRoles
}

export class OrganizationMember extends Entity<OrganizationMemberProps> {
  get organizationMemberId(): UserId {
    return OrganizationMemberId.create(this._id).getValue()
  }

  get userId(): OrganizationId {
    return this.props.organizationId
  }

  get organizationId(): OrganizationId {
    return this.props.organizationId
  }

  get roles(): OrganizationMemberRoles {
    return this.props.roles
  }

  private constructor(props: OrganizationMemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: OrganizationMemberProps,
    id?: UniqueEntityID,
  ): Result<OrganizationMember> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.roles, argumentName: 'roles' },
      { argument: props.organizationId, argumentName: 'organizationId' },
    ])

    if (!nullGuard.succeeded) {
      return Result.fail<OrganizationMember>(nullGuard.message as any)
    } else {
      const organizationMember = new OrganizationMember({ ...props }, id)

      return Result.ok<OrganizationMember>(organizationMember)
    }
  }
}
