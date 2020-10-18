import { CreateOrganizationDTO } from './CreateOrganizationDTO'
import { UseCase } from '../../../../shared/core/UseCase'
import { CreateOrganizationResponse } from './CreateOrganizationResponse'
import { IUserRepo } from '../../../users/repos/userRepo'
import { left, right, Result } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { CreateOrganizationErrors } from './CreateOrganizationErrors'
import { IOrganizationRepo } from '../../repos/organizationRepo'
import { OrganizationName } from '../../domain/organizationName'
import { User } from '../../../users/domain/user'
import { CreateOrganizationService } from '../../services/createOrganizationService'
import { CreateTeamService } from '../../../teams/services/createTeamService'
import { TeamName } from '../../../teams/domain/teamName'
import { ITeamRepo } from '../../../teams/repos/teamRepo'
import { OrganizationMember } from '../../domain/organizationMember'
import { OrganizationMemberRoles } from '../../domain/organizationMemberRoles'
import { OrganizationMemberRole } from '../../domain/organizationMemberRole'
import { TeamMemberRole } from '../../../teams/domain/teamMemberRole'
import { TeamMemberRoles } from '../../../teams/domain/teamMemberRoles'
import { AddTeamMemberService } from '../../../teams/services/addTeamMemberService'
import { OrganizationTeamsCount } from '../../domain/organizationTeamsCount'

export class CreateOrganizationUseCase
  implements
    UseCase<CreateOrganizationDTO, Promise<CreateOrganizationResponse>> {
  private userRepo: IUserRepo
  private organizationRepo: IOrganizationRepo
  private teamRepo: ITeamRepo
  private createOrganizationService: CreateOrganizationService
  private createTeamService: CreateTeamService
  private addTeamMemberService: AddTeamMemberService

  constructor(
    userRepo: IUserRepo,
    organizationRepo: IOrganizationRepo,
    teamRepo: ITeamRepo,
    createOrganizationService: CreateOrganizationService,
    createTeamService: CreateTeamService,
    addTeamMemberService: AddTeamMemberService,
  ) {
    this.userRepo = userRepo
    this.organizationRepo = organizationRepo
    this.teamRepo = teamRepo
    this.createOrganizationService = createOrganizationService
    this.createTeamService = createTeamService
    this.addTeamMemberService = addTeamMemberService
  }

  public async execute(
    req: CreateOrganizationDTO,
  ): Promise<CreateOrganizationResponse> {
    let user: User

    try {
      try {
        user = await this.userRepo.getUserByUserId(req.userId)
      } catch (err) {
        return left(new CreateOrganizationErrors.UserNotFoundError())
      }

      const organizationNameOrError = OrganizationName.create({
        name: req.name,
      })
      if (organizationNameOrError.isFailure) {
        return left(organizationNameOrError)
      }

      const alreadyCreatedOrganizationByOrganizationName = await this.organizationRepo.exists(
        req.name,
      )
      const organizationNameTaken = !!alreadyCreatedOrganizationByOrganizationName
      if (organizationNameTaken) {
        return left(
          new CreateOrganizationErrors.OrganizationNameTaken(req.name),
        )
      }

      const organizationName = organizationNameOrError.getValue()

      const organizationOrError = this.createOrganizationService.createOrganization(
        user,
        organizationName,
      )
      if (organizationOrError.isLeft()) {
        return left(organizationOrError.value)
      }

      const organization = organizationOrError.value.getValue()

      // add organization member
      const organizationMemberRoles = OrganizationMemberRoles.create([
        OrganizationMemberRole.create({ value: 'owner' }).getValue(),
      ])
      const organizationMember = OrganizationMember.create({
        userId: user.userId,
        roles: organizationMemberRoles,
      }).getValue()

      organization.addMember(organizationMember)

      const teamName = TeamName.create({
        name: organizationName.value,
      }).getValue()

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

      const updatedTeamsCount = OrganizationTeamsCount.create({
        value: organization.teamsCount.value + 1,
      }).getValue()
      organization.updateTeamsCount(updatedTeamsCount)

      await this.organizationRepo.save(organization)
      await this.teamRepo.save(team)

      return right(Result.ok(organization))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
