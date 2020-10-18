import express from 'express'
import { createOrganizationController } from '../../../useCases/createOrganization'

const organizationRouter = express.Router()

organizationRouter.post('/', (req, res) =>
  createOrganizationController.execute(req, res),
)

export { organizationRouter }
