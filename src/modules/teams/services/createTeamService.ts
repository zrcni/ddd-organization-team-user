import { Organization } from '../../organizations/domain/organization'
import { Team } from '../domain/team'
import { User } from '../../users/domain/user'
import { TeamMemberRoles } from '../domain/teamMemberRoles'
import { CreateTeamResponse } from '../useCases/createTeam/CreateTeamResponse'
import { CreateTeamErrors } from '../useCases/createTeam/CreateTeamErrors'
import { left, right, Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { TeamMembers } from '../domain/teamMembers'
import { TeamMember } from '../domain/teamMember'
import { TeamName } from '../domain/teamName'
import { OrganizationTeamsCount } from '../../organizations/domain/organizationTeamsCount'

export class CreateTeamService {
  public createTeam(
    organization: Organization,
    user: User,
    teamName: TeamName,
  ): CreateTeamResponse {
    const maxTeamsResult = Guard.lessThan(
      organization.maxTeams.value,
      organization.teamsCount.value,
    )
    if (!maxTeamsResult.succeeded) {
      return left(
        new CreateTeamErrors.OrganizationMaximumTeamsLimitReachedError(),
      )
    }

    const members = TeamMembers.create([
      TeamMember.create({
        userId: user.userId,
        roles: TeamMemberRoles.createDefault(),
      }).getValue(),
    ])

    const teamOrError = Team.create({
      name: teamName,
      organizationId: organization.organizationId,
      members,
    })
    if (teamOrError.isFailure) {
      return left(teamOrError.error)
    }

    const updatedTeamsCount = OrganizationTeamsCount.create({
      value: organization.teamsCount.value + 1,
    }).getValue()
    organization.updateTeamsCount(updatedTeamsCount)

    const team = teamOrError.getValue()

    return right(Result.ok(team))
  }
}
