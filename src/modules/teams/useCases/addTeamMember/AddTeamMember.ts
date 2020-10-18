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
import { AddTeamMemberService } from '../../services/addTeamMemberService'

export class AddTeamMember
  implements UseCase<AddTeamMemberDTO, Promise<AddTeamMemberResponse>> {
  private userRepo: IUserRepo
  private teamRepo: ITeamRepo
  private organizationRepo: IOrganizationRepo
  private addTeamMemberService: AddTeamMemberService

  constructor(
    userRepo: IUserRepo,
    teamRepo: ITeamRepo,
    organizationRepo: IOrganizationRepo,
    addTeamMemberService: AddTeamMemberService,
  ) {
    this.userRepo = userRepo
    this.teamRepo = teamRepo
    this.organizationRepo = organizationRepo
    this.addTeamMemberService = addTeamMemberService
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

      const addTeamMemberResult = this.addTeamMemberService.addTeamMember(
        organization,
        team,
        user,
        TeamMemberRoles.createDefault(),
      )

      if (addTeamMemberResult.isLeft()) {
        return left(addTeamMemberResult.value)
      }

      await this.teamRepo.save(team)
      await this.organizationRepo.save(organization)

      return right(addTeamMemberResult.value)
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
