import mongoose from 'mongoose'
import { ITeamRepo } from '../teamRepo'
import { Team } from '../../domain/team'
import { TeamMap } from '../../mappers/teamMap'
const ObjectId = mongoose.Types.ObjectId

export class MongooseTeamRepo implements ITeamRepo {
  private models: any

  constructor(models: any) {
    this.models = models
  }

  async exists(teamId: string): Promise<boolean> {
    const TeamModel = this.models.Team
    return TeamModel.exists({ _id: new ObjectId(teamId) })
  }

  async getTeamByTeamId(teamId: string): Promise<Team> {
    const TeamModel = this.models.Team
    const team = await TeamModel.findOne({ _id: new ObjectId(teamId) }).exec()
    if (!team) throw new Error('Team not found.')
    return TeamMap.toDomain(team)
  }

  async save(team: Team): Promise<void> {
    const TeamModel = this.models.Team
    const exists = await this.exists(team.id.toString())

    const rawTeam = await TeamMap.toPersistence(team)
    if (!exists) {
      await TeamModel.create(rawTeam)
    } else {
      await TeamModel.updateOne({ _id: rawTeam._id, $set: { rawTeam } })
    }
  }
}
