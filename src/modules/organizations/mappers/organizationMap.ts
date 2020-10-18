import { Mapper } from '../../../shared/infra/Mapper'
import { Organization } from '../domain/organization'
import { OrganizationDTO } from '../dtos/organizationDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import mongoose from 'mongoose'
import { OrganizationMemberMap } from './organizationMemberMap'
import { OrganizationName } from '../domain/organizationName'
import { OrganizationMembers } from '../domain/organizationMembers'
import { OrganizationMaxTeamMembers } from '../domain/organizationMaxTeamMembers'
import { OrganizationMaxTeams } from '../domain/organizationMaxTeams'
import { OrganizationTeamMembersCount } from '../domain/organizationTeamMembersCount'
const ObjectId = mongoose.Types.ObjectId

export class OrganizationMap implements Mapper<Organization> {
  public static toDTO(organization: Organization): OrganizationDTO {
    const organizationMembers = organization.members
      .getItems()
      .map(organizationMember =>
        OrganizationMemberMap.toDTO(organizationMember),
      )

    return {
      organizationId: organization.id.toString(),
      name: organization.name.value,
      members: organizationMembers,
      maxTeamMembers: organization.maxTeamMembers.value,
      teamMembersCount: organization.teamMembersCount.value,
      maxTeams: organization.maxTeams.value,
      isDeleted: organization.isDeleted,
    }
  }

  public static toDomain(raw: any): Organization {
    const organizationNameOrError = OrganizationName.create({ name: raw.name })

    const organizationMembers = OrganizationMembers.create(
      raw.members
        ? raw.members.map((organizationMember: any) =>
            OrganizationMemberMap.toDomain(organizationMember),
          )
        : [],
    )

    const maxTeamMembers = OrganizationMaxTeamMembers.create({
      value: raw.maxTeamMembers,
    }).getValue()

    const teamMembersCount = OrganizationTeamMembersCount.create({
      value: raw.teamMembersCount,
    }).getValue()

    const maxTeams = OrganizationMaxTeams.create({
      value: raw.maxTeams,
    }).getValue()

    const organizationOrError = Organization.create(
      {
        name: organizationNameOrError.getValue(),
        maxTeamMembers,
        teamMembersCount,
        maxTeams,
        members: organizationMembers,
        isDeleted: raw.isDeleted,
      },
      new UniqueEntityID(raw._id.toString()),
    )

    organizationOrError.isFailure ? console.info(organizationOrError.error) : ''

    return organizationOrError.isSuccess
      ? organizationOrError.getValue()
      : ((null as unknown) as Organization)
  }

  public static toPersistence(organization: Organization): any {
    const organizationMembers = organization.members
      .getItems()
      .map(organizationMember =>
        OrganizationMemberMap.toPersistence(organizationMember),
      )

    return {
      _id: new ObjectId(organization.id.toString()),
      name: organization.name.value,
      maxTeamMembers: organization.maxTeamMembers.value,
      teamMembersCount: organization.teamMembersCount.value,
      maxTeams: organization.maxTeams.value,
      members: organizationMembers,
      isDeleted: organization.isDeleted,
    }
  }
}
