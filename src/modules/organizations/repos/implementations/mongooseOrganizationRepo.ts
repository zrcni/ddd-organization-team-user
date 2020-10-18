import mongoose from 'mongoose'
import { IOrganizationRepo } from '../organizationRepo'
import { Organization } from '../../domain/organization'
import { OrganizationMap } from '../../mappers/organizationMap'
const ObjectId = mongoose.Types.ObjectId

export class MongooseOrganizationRepo implements IOrganizationRepo {
  private models: any

  constructor(models: any) {
    this.models = models
  }

  async exists(organizationId: string): Promise<boolean> {
    const OrganizationModel = this.models.Organization
    return OrganizationModel.exists({ _id: new ObjectId(organizationId) })
  }

  async getOrganizationByOrganizationId(
    organizationId: string,
  ): Promise<Organization> {
    const OrganizationModel = this.models.Organization
    const organization = await OrganizationModel.findOne({
      _id: new ObjectId(organizationId),
    }).exec()
    if (!organization) throw new Error('Organization not found.')
    return OrganizationMap.toDomain(organization)
  }

  async save(organization: Organization): Promise<void> {
    const OrganizationModel = this.models.Organization
    const exists = await this.exists(organization.id.toString())

    const rawOrganization = await OrganizationMap.toPersistence(organization)
    if (!exists) {
      await OrganizationModel.create(rawOrganization)
    } else {
      await OrganizationModel.updateOne({
        _id: rawOrganization._id,
        $set: { rawOrganization },
      })
    }
  }
}
