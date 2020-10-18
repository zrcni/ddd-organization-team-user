import { Mapper } from '../../../shared/infra/Mapper'
import { Team } from '../domain/team'
import { TeamDTO } from '../dtos/teamDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import mongoose from 'mongoose'
import { TeamMemberMap } from './teamMemberMap'
import { TeamName } from '../domain/teamName'
import { OrganizationId } from '../../organizations/domain/organizationId'
import { TeamMembers } from '../domain/teamMembers'
const ObjectId = mongoose.Types.ObjectId

export class TeamMap implements Mapper<Team> {
  public static toDTO(team: Team): TeamDTO {
    const teamMembers = team.members
      .getItems()
      .map(teamMember => TeamMemberMap.toDTO(teamMember))

    return {
      teamId: team.id.toString(),
      organizationId: team.organizationId.id.toString(),
      name: team.name.value,
      members: teamMembers,
      isDeleted: team.isDeleted,
    }
  }

  public static toDomain(raw: any): Team {
    const teamNameOrError = TeamName.create({ name: raw.name })

    const teamMembers = TeamMembers.create(
      raw.members
        ? raw.members.map((teamMember: any) =>
            TeamMemberMap.toDomain(teamMember),
          )
        : [],
    )
    const teamOrError = Team.create(
      {
        name: teamNameOrError.getValue(),
        organizationId: OrganizationId.create(
          new UniqueEntityID(raw.organizationId.toString()),
        ).getValue(),
        members: teamMembers,
        isDeleted: raw.isDeleted,
      },
      new UniqueEntityID(raw._id.toString()),
    )

    teamOrError.isFailure ? console.info(teamOrError.error) : ''

    return teamOrError.isSuccess
      ? teamOrError.getValue()
      : ((null as unknown) as Team)
  }

  public static toPersistence(team: Team): any {
    const teamMembers = team.members
      .getItems()
      .map(teamMember => TeamMemberMap.toPersistence(teamMember))

    return {
      _id: new ObjectId(team.id.toString()),
      organizationId: new ObjectId(team.organizationId.id.toString()),
      name: team.name.value,
      members: teamMembers,
      isDeleted: team.isDeleted,
    }
  }
}
