import { CreateTeamDTO } from './CreateTeamDTO'
import { UseCase } from '../../../../shared/core/UseCase'
import { CreateTeamResponse } from './CreateTeamResponse'
import { IUserRepo } from '../../../users/repos/userRepo'
import { left, right, Result } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { CreateTeamErrors } from './CreateTeamErrors'
import { ITeamRepo } from '../../repos/teamRepo'
import { IOrganizationRepo } from '../../../organizations/repos/organizationRepo'
import { Organization } from '../../../organizations/domain/organization'
import { TeamName } from '../../domain/teamName'
import { User } from '../../../users/domain/user'
import { CreateTeamService } from '../../services/createTeamService'
import { TeamMemberRoles } from '../../domain/teamMemberRoles'
import { TeamMemberRole } from '../../domain/teamMemberRole'
import { AddTeamMemberService } from '../../services/addTeamMemberService'

export class CreateTeamUseCase
  implements UseCase<CreateTeamDTO, Promise<CreateTeamResponse>> {
  private userRepo: IUserRepo
  private teamRepo: ITeamRepo
  private organizationRepo: IOrganizationRepo
  private createTeamService: CreateTeamService
  private addTeamMemberService: AddTeamMemberService

  constructor(
    userRepo: IUserRepo,
    teamRepo: ITeamRepo,
    organizationRepo: IOrganizationRepo,
    createTeamService: CreateTeamService,
    addTeamMemberService: AddTeamMemberService,
  ) {
    this.userRepo = userRepo
    this.teamRepo = teamRepo
    this.organizationRepo = organizationRepo
    this.createTeamService = createTeamService
    this.addTeamMemberService = addTeamMemberService
  }

  public async execute(req: CreateTeamDTO): Promise<CreateTeamResponse> {
    let user: User
    let organization: Organization

    try {
      try {
        user = await this.userRepo.getUserByUserId(req.userId)
      } catch (err) {
        return left(new CreateTeamErrors.UserNotFoundError())
      }

      try {
        organization = await this.organizationRepo.getOrganizationByOrganizationId(
          req.organizationId,
        )
      } catch (err) {
        return left(new CreateTeamErrors.OrganizationNotFoundError())
      }

      const teamNameOrError = TeamName.create({ name: req.name })
      if (teamNameOrError.isFailure) {
        return left(teamNameOrError)
      }

      const teamName = teamNameOrError.getValue()
      const teamOrError = this.createTeamService.createTeam(
        organization,
        teamName,
      )

      if (teamOrError.isLeft()) {
        return left(teamOrError.value)
      }

      const team = teamOrError.value.getValue()

      const memberRoles = TeamMemberRoles.create([
        TeamMemberRole.create({ value: 'agent' }).getValue(),
        TeamMemberRole.create({ value: 'lead' }).getValue(),
      ])

      const addTeamMemberResult = this.addTeamMemberService.addTeamMember(
        organization,
        team,
        user,
        memberRoles,
      )

      if (addTeamMemberResult.isLeft()) {
        return left(addTeamMemberResult.value)
      }

      await this.teamRepo.save(team)
      await this.organizationRepo.save(organization)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
