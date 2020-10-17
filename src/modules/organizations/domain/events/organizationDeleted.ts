import { Organization } from '../organization'
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'

export class OrganizationDeleted implements IDomainEvent {
  public createdAt: Date
  public organization: Organization

  constructor(organization: Organization) {
    this.createdAt = new Date()
    this.organization = organization
  }

  getAggregateId(): UniqueEntityID {
    return this.organization.id
  }
}
