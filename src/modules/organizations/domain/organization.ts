import { OrganizationName } from './organizationName'
import { OrganizationId } from './organizationId'
import { OrganizationCreated } from './events/organizationCreated'
import { OrganizationDeleted } from './events/organizationDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'

interface OrganizationProps {
  name: OrganizationName
  isDeleted?: boolean
}

export class Organization extends AggregateRoot<OrganizationProps> {
  get organizationId(): OrganizationId {
    return OrganizationId.create(this._id).getValue()
  }

  get name(): OrganizationName {
    return this.props.name
  }

  get isDeleted(): boolean {
    return this.props.isDeleted as boolean
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new OrganizationDeleted(this))
      this.props.isDeleted = true
    }
  }

  private constructor(props: OrganizationProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: OrganizationProps,
    id?: UniqueEntityID,
  ): Result<Organization> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
    ])

    if (!guardResult.succeeded) {
      return Result.fail<Organization>(guardResult.message as string)
    }

    const organization = new Organization(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
      },
      id,
    )

    organization.addDomainEvent(new OrganizationCreated(organization))

    return Result.ok<Organization>(organization)
  }
}
