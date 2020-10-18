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

export class CreateTeam
  implements UseCase<CreateTeamDTO, Promise<CreateTeamResponse>> {
  private userRepo: IUserRepo
  private teamRepo: ITeamRepo
  private organizationRepo: IOrganizationRepo
  private createTeamService: CreateTeamService

  constructor(
    userRepo: IUserRepo,
    teamRepo: ITeamRepo,
    organizationRepo: IOrganizationRepo,
    createTeamService: CreateTeamService,
  ) {
    this.userRepo = userRepo
    this.teamRepo = teamRepo
    this.organizationRepo = organizationRepo
    this.createTeamService = createTeamService
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

      const teamNameOrError = TeamName.create({ name: req.teamName })
      if (teamNameOrError.isFailure) {
        return left(teamNameOrError)
      }

      const teamName = teamNameOrError.getValue()
      const teamOrError = this.createTeamService.createTeam(
        organization,
        user,
        teamName,
      )

      if (teamOrError.isLeft()) {
        return left(teamOrError.value)
      }

      const team = teamOrError.value.getValue()

      await this.teamRepo.save(team)
      await this.organizationRepo.save(organization)

      return right(Result.ok(team))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
