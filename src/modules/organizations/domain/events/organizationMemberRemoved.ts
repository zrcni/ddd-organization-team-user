import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { OrganizationMember } from '../organizationMember'
import { OrganizationId } from '../organizationId'

export class OrganizationMemberRemoved implements IDomainEvent {
  public createdAt: Date
  public organizationMember: OrganizationMember
  public organizationId: OrganizationId

  constructor(
    organizationMember: OrganizationMember,
    organizationId: OrganizationId,
  ) {
    this.createdAt = new Date()
    this.organizationMember = organizationMember
    this.organizationId = organizationId
  }

  getAggregateId(): UniqueEntityID {
    return this.organizationId.id
  }
}
