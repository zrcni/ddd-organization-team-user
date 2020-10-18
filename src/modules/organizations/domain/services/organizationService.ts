import { TeamMember } from '../../../teams/domain/teamMember'
import { Team } from '../../../teams/domain/team'
import { Organization } from '../organization'
import { Result, right, left } from '../../../../shared/core/Result'
import { AddTeamMemberErrors } from '../../useCases/addTeamMember/AddTeamMemberErrors'
import { AddTeamMemberResponse } from '../../useCases/addTeamMember/AddTeamMemberResponse'
import { Guard } from '../../../../shared/core/Guard'
import { User } from '../../../users/domain/user'
import { TeamMemberRoles } from '../../../teams/domain/teamMemberRoles'

export class OrganizationService {
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
      team.members.currentItems.length,
    )
    if (!teamMemberLimitResult.succeeded) {
      return left(
        new AddTeamMemberErrors.OrganizationMaxTeamMembersLimitReachedError(
          organization.name.value,
        ),
      )
    }

    const teamMemberOrError = TeamMember.create({
      userId: user.userId,
      roles
    })

    if (teamMemberOrError.isFailure) {
      return left(teamMemberOrError)
    }

    const teamMember = teamMemberOrError.getValue()

    if (team.members.exists(teamMember)) {
      return left(new AddTeamMemberErrors.TeamMemberAlreadyExistsError())
    }

    team.addMember(teamMember)

    return right(Result.ok<TeamMember>(teamMember))
  }
}
