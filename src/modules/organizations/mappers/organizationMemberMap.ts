import { Mapper } from '../../../shared/infra/Mapper'
import { OrganizationMember } from '../domain/organizationMember'
import { OrganizationMemberDTO } from '../dtos/organizationMemberDTO'
import { OrganizationMemberRoles } from '../domain/organizationMemberRoles'
import { OrganizationMemberRole } from '../domain/organizationMemberRole'
import mongoose from 'mongoose'
import { UserId } from '../../users/domain/userId'
const ObjectId = mongoose.Types.ObjectId

export class OrganizationMemberMap implements Mapper<OrganizationMember> {
  public static toDTO(
    organizationMember: OrganizationMember,
  ): OrganizationMemberDTO {
    const roles = organizationMember.roles
      .getItems()
      .map(organizationMemberRole => organizationMemberRole.value)

    return {
      userId: organizationMember.userId.id.toString(),
      roles,
    }
  }

  public static toDomain(raw: any): OrganizationMember {
    const organizationMemberRoles = OrganizationMemberRoles.create(
      raw.roles
        ? raw.roles.map((role: any) =>
            OrganizationMemberRole.create({ value: role }).getValue(),
          )
        : [],
    )

    const userId = UserId.create(raw.userId.toString()).getValue()
    const organizationMemberOrError = OrganizationMember.create({
      userId,
      roles: organizationMemberRoles,
    })

    organizationMemberOrError.isFailure
      ? console.info(organizationMemberOrError.error)
      : ''

    return organizationMemberOrError.isSuccess
      ? organizationMemberOrError.getValue()
      : ((null as unknown) as OrganizationMember)
  }

  public static toPersistence(organizationMember: OrganizationMember): any {
    const roles = organizationMember.roles
      .getItems()
      .map(organizationMemberRole => organizationMemberRole.value)

    return {
      userId: new ObjectId(organizationMember.userId.id.toString()),
      roles,
    }
  }
}
