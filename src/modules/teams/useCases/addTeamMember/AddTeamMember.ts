import { AddTeamMemberDTO } from './AddTeamMemberDTO'
import { UseCase } from '../../../../shared/core/UseCase'
import { AddTeamMemberResponse } from './AddTeamMemberResponse'
import { IUserRepo } from '../../../users/repos/userRepo'
import { User } from '../../../users/domain/user'
import { left, right } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { AddTeamMemberErrors } from './AddTeamMemberErrors'
import { ITeamRepo } from '../../repos/teamRepo'
import { IOrganizationRepo } from '../../../organizations/repos/organizationRepo'
import { Team } from '../../domain/team'
import { Organization } from '../../../organizations/domain/organization'
import { TeamMemberRoles } from '../../domain/teamMemberRoles'
import { TeamMemberRole } from '../../domain/teamMemberRole'
import { TeamMemberService } from '../../services/teamMemberService'

export class AddTeamMember
  implements UseCase<AddTeamMemberDTO, Promise<AddTeamMemberResponse>> {
  private userRepo: IUserRepo
  private teamRepo: ITeamRepo
  private organizationRepo: IOrganizationRepo
  private teamMemberService: TeamMemberService

  constructor(
    userRepo: IUserRepo,
    teamRepo: ITeamRepo,
    organizationRepo: IOrganizationRepo,
    teamMemberService: TeamMemberService,
  ) {
    this.userRepo = userRepo
    this.teamRepo = teamRepo
    this.organizationRepo = organizationRepo
    this.teamMemberService = teamMemberService
  }

  public async execute(req: AddTeamMemberDTO): Promise<AddTeamMemberResponse> {
    let user: User
    let team: Team
    let organization: Organization

    try {
      try {
        user = await this.userRepo.getUserByUserId(req.userId)
      } catch (err) {
        return left(new AddTeamMemberErrors.UserNotFoundError())
      }

      try {
        team = await this.teamRepo.getTeamByTeamId(req.teamId)
      } catch (err) {
        return left(new AddTeamMemberErrors.TeamNotFoundError())
      }

      try {
        organization = await this.organizationRepo.getOrganizationByOrganizationId(
          team.organizationId.id.toString(),
        )
      } catch (err) {
        return left(new AddTeamMemberErrors.OrganizationNotFoundError())
      }

      const teamMemberRoles = TeamMemberRoles.create([
        TeamMemberRole.create({ value: 'agent' }).getValue(),
      ])

      const addTeamMemberResult = this.teamMemberService.addTeamMember(
        organization,
        team,
        user,
        teamMemberRoles,
      )

      if (addTeamMemberResult.isLeft()) {
        return left(addTeamMemberResult.value)
      }

      return right(addTeamMemberResult.value)
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
