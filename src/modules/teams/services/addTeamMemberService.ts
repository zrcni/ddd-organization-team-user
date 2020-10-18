import { Organization } from '../../organizations/domain/organization'
import { Team } from '../domain/team'
import { User } from '../../users/domain/user'
import { TeamMemberRoles } from '../domain/teamMemberRoles'
import { AddTeamMemberResponse } from '../useCases/addTeamMember/AddTeamMemberResponse'
import { AddTeamMemberErrors } from '../useCases/addTeamMember/AddTeamMemberErrors'
import { left, right, Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { TeamMember } from '../domain/teamMember'
import { OrganizationTeamMembersCount } from '../../organizations/domain/organizationTeamMembersCount'

export class AddTeamMemberService {
  public addTeamMember(
    organization: Organization,
    team: Team,
    user: User,
    roles: TeamMemberRoles,
  ): AddTeamMemberResponse {
    if (!organization.id.equals(team.organizationId.id)) {
      return left(
        new AddTeamMemberErrors.TeamNotInOrganizationError(
          team.name.value,
          organization.name.value,
        ),
      )
    }

    const teamMemberLimitResult = Guard.lessThan(
      organization.maxTeamMembers.value,
      organization.teamMembersCount.value,
    )
    if (!teamMemberLimitResult.succeeded) {
      return left(
        new AddTeamMemberErrors.OrganizationMaxTeamMembersLimitReachedError(
          organization.name.value,
        ),
      )
    }

    const teamMember = TeamMember.create({
      userId: user.userId,
      roles,
    }).getValue()

    if (team.members.exists(teamMember)) {
      return left(new AddTeamMemberErrors.TeamMemberAlreadyExistsError())
    }

    team.addMember(teamMember)

    const updatedTeamMembersCount = OrganizationTeamMembersCount.create({
      value: team.members.getItems().length,
    }).getValue()

    organization.updateTeamMembersCount(updatedTeamMembersCount)

    return right(Result.ok(teamMember))
  }
}
