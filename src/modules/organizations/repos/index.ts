import models from '../../../shared/infra/database/mongoose/models'
import { MongooseOrganizationRepo } from './implementations/mongooseOrganizationRepo'

const organizationRepo = new MongooseOrganizationRepo(models)

export { organizationRepo }
