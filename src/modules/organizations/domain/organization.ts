import { OrganizationName } from './organizationName'
import { OrganizationId } from './organizationId'
import { OrganizationCreated } from './events/organizationCreated'
import { OrganizationDeleted } from './events/organizationDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { OrganizationMembers } from './organizationMembers'
import { OrganizationMember } from './organizationMember'
import { OrganizationMemberAdded } from './events/organizationMemberAdded'
import { OrganizationMemberRemoved } from './events/organizationMemberRemoved'
import { OrganizationMaxTeams } from './organizationMaxTeams'
import { OrganizationMaxTeamMembers } from './organizationMaxTeamMembers'
import { OrganizationTeamMembersCount } from './organizationTeamMembersCount'
import { OrganizationTeamsCount } from './organizationTeamsCount'

interface OrganizationProps {
  name: OrganizationName
  members: OrganizationMembers
  maxTeams: OrganizationMaxTeams
  teamsCount: OrganizationTeamsCount
  maxTeamMembers: OrganizationMaxTeamMembers
  teamMembersCount: OrganizationTeamMembersCount
  isDeleted?: boolean
}

export class Organization extends AggregateRoot<OrganizationProps> {
  get organizationId(): OrganizationId {
    return OrganizationId.create(this._id).getValue()
  }

  get name(): OrganizationName {
    return this.props.name
  }

  get maxTeams(): OrganizationMaxTeams {
    return this.props.maxTeams
  }

  get teamsCount(): OrganizationTeamsCount {
    return this.props.teamsCount
  }

  get maxTeamMembers(): OrganizationMaxTeamMembers {
    return this.props.maxTeamMembers
  }

  get teamMembersCount(): OrganizationTeamMembersCount {
    return this.props.teamMembersCount
  }

  get members(): OrganizationMembers {
    return this.props.members
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

  public addMember(organizationMember: OrganizationMember): void {
    if (!this.props.members.exists(organizationMember)) {
      this.props.members.add(organizationMember)
      this.addDomainEvent(
        new OrganizationMemberAdded(organizationMember, this.organizationId),
      )
    }
  }

  public removeMember(organizationMember: OrganizationMember): void {
    if (this.props.members.exists(organizationMember)) {
      this.props.members.remove(organizationMember)
      this.addDomainEvent(
        new OrganizationMemberRemoved(organizationMember, this.organizationId),
      )
    }
  }

  public updateTeamsCount(teamsCount: OrganizationTeamsCount) {
    this.props.teamsCount = teamsCount
  }

  public updateTeamMembersCount(
    teamMembersCount: OrganizationTeamMembersCount,
  ) {
    this.props.teamMembersCount = teamMembersCount
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

    const maxTeams = props.maxTeams
      ? props.maxTeams
      : OrganizationMaxTeams.create({
          value: OrganizationMaxTeams.min,
        }).getValue()

    const maxTeamMembers = props.maxTeamMembers
      ? props.maxTeamMembers
      : OrganizationMaxTeamMembers.create({
          value: OrganizationMaxTeamMembers.min,
        }).getValue()

    const organization = new Organization(
      {
        ...props,
        maxTeams,
        maxTeamMembers,
        isDeleted: props.isDeleted ? props.isDeleted : false,
      },
      id,
    )

    organization.addDomainEvent(new OrganizationCreated(organization))

    return Result.ok<Organization>(organization)
  }
}
