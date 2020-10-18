import { Organization } from '../domain/organization'
import { User } from '../../users/domain/user'
import { left, right, Result } from '../../../shared/core/Result'
import { OrganizationTeamsCount } from '../domain/organizationTeamsCount'
import { OrganizationName } from '../domain/organizationName'
import { OrganizationMembers } from '../domain/organizationMembers'
import { OrganizationMember } from '../domain/organizationMember'
import { OrganizationMemberRoles } from '../domain/organizationMemberRoles'
import { OrganizationMaxTeams } from '../domain/organizationMaxTeams'
import { OrganizationMaxTeamMembers } from '../domain/organizationMaxTeamMembers'
import { OrganizationTeamMembersCount } from '../domain/organizationTeamMembersCount'
import { CreateOrganizationResponse } from '../useCases/createOrganization/CreateOrganizationResponse'

export class CreateOrganizationService {
  public createOrganization(
    user: User,
    name: OrganizationName,
  ): CreateOrganizationResponse {
    const organizationMembers = OrganizationMembers.create([
      OrganizationMember.create({
        userId: user.userId,
        roles: OrganizationMemberRoles.createDefault(),
      }).getValue(),
    ])

    const organizationOrError = Organization.create({
      name,
      members: organizationMembers,
      maxTeams: OrganizationMaxTeams.createDefault(),
      teamsCount: OrganizationTeamsCount.createDefault(),
      maxTeamMembers: OrganizationMaxTeamMembers.createDefault(),
      teamMembersCount: OrganizationTeamMembersCount.createDefault(),
    })
    if (organizationOrError.isFailure) {
      return left(organizationOrError)
    }

    const organization = organizationOrError.getValue()

    return right(Result.ok(organization))
  }
}
