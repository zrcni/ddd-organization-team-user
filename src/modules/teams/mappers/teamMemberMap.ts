import { Mapper } from '../../../shared/infra/Mapper'
import { TeamMember } from '../domain/teamMember'
import { TeamMemberDTO } from '../dtos/teamMemberDTO'
import { TeamMemberRoles } from '../domain/teamMemberRoles'
import { TeamMemberRole } from '../domain/teamMemberRole'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

export class TeamMemberMap implements Mapper<TeamMember> {
  public static toDTO(teamMember: TeamMember): TeamMemberDTO {
    const roles = teamMember.roles
      .getItems()
      .map(teamMemberRole => teamMemberRole.value)

    return {
      userId: teamMember.userId.id.toString(),
      roles,
    }
  }

  public static toDomain(raw: any): TeamMember {
    const teamMemberRoles = TeamMemberRoles.create(
      raw.roles
        ? raw.roles.map((role: any) =>
            TeamMemberRole.create({ value: role }).getValue(),
          )
        : [],
    )

    const teamMemberOrError = TeamMember.create({
      userId: raw.userId.toString(),
      roles: teamMemberRoles,
    })

    teamMemberOrError.isFailure ? console.info(teamMemberOrError.error) : ''

    return teamMemberOrError.isSuccess
      ? teamMemberOrError.getValue()
      : ((null as unknown) as TeamMember)
  }

  public static toPersistence(teamMember: TeamMember): any {
    const roles = teamMember.roles
      .getItems()
      .map(teamMemberRole => teamMemberRole.value)

    return {
      userId: new ObjectId(teamMember.userId.id.toString()),
      roles,
    }
  }
}
