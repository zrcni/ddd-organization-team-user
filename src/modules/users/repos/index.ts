import models from '../../../shared/infra/database/mongoose/models'
import { MongooseUserRepo } from './implementations/mongooseUserRepo'

const userRepo = new MongooseUserRepo(models)

export { userRepo }
