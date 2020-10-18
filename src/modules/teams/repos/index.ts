import { models } from '../../../shared/infra/database/mongoose/models'
import { MongooseTeamRepo } from './implementations/mongooseTeamRepo'

const teamRepo = new MongooseTeamRepo(models.Team)

export { teamRepo }
