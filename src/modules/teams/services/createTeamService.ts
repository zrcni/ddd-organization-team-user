import { Organization } from '../../organizations/domain/organization'
import { Team } from '../domain/team'
import { User } from '../../users/domain/user'
import { left, right, Result, Either } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { TeamMembers } from '../domain/teamMembers'
import { TeamName } from '../domain/teamName'
import { OrganizationTeamsCount } from '../../organizations/domain/organizationTeamsCount'
import { CreateTeamErrors } from '../useCases/createTeam/CreateTeamErrors'

type CreateTeamResult = Either<
  CreateTeamErrors.OrganizationMaximumTeamsLimitReachedError,
  Result<Team>
>

export class CreateTeamService {
  public createTeam(
    organization: Organization,
    teamName: TeamName,
  ): CreateTeamResult {
    const maxTeamsResult = Guard.lessThan(
      organization.maxTeams.value,
      organization.teamsCount.value,
    )
    if (!maxTeamsResult.succeeded) {
      return left(
        new CreateTeamErrors.OrganizationMaximumTeamsLimitReachedError(),
      )
    }

    const teamOrError = Team.create({
      name: teamName,
      organizationId: organization.organizationId,
      members: TeamMembers.create([]),
    })
    if (teamOrError.isFailure) {
      return left(teamOrError)
    }

    const updatedTeamsCount = OrganizationTeamsCount.create({
      value: organization.teamsCount.value + 1,
    }).getValue()
    organization.updateTeamsCount(updatedTeamsCount)

    const team = teamOrError.getValue()

    return right(Result.ok(team))
  }
}
