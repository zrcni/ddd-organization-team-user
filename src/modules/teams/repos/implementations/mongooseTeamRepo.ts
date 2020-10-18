import mongoose from 'mongoose'
import { ITeamRepo } from '../teamRepo'
import { Team } from '../../domain/team'
import { TeamMap } from '../../mappers/teamMap'
const ObjectId = mongoose.Types.ObjectId

export class MongooseTeamRepo implements ITeamRepo {
  private model: mongoose.Model<any>

  constructor(model: mongoose.Model<any>) {
    this.model = model
  }

  async exists(teamId: string): Promise<boolean> {
    return this.model.exists({ _id: new ObjectId(teamId) })
  }

  async getTeamByTeamId(teamId: string): Promise<Team> {
    const team = await this.model.findOne({ _id: new ObjectId(teamId) }).exec()
    if (!team) throw new Error('Team not found.')
    return TeamMap.toDomain(team)
  }

  async save(team: Team): Promise<void> {
    const exists = await this.exists(team.id.toString())

    const rawTeam = await TeamMap.toPersistence(team)
    if (!exists) {
      await this.model.create(rawTeam)
    } else {
      await this.model.updateOne({ _id: rawTeam._id }, { $set: { rawTeam } })
    }
  }
}
