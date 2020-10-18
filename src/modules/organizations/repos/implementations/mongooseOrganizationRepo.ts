import mongoose from 'mongoose'
import { IOrganizationRepo } from '../organizationRepo'
import { Organization } from '../../domain/organization'
import { OrganizationMap } from '../../mappers/organizationMap'
const ObjectId = mongoose.Types.ObjectId

export class MongooseOrganizationRepo implements IOrganizationRepo {
  private model: mongoose.Model<any>

  constructor(model: mongoose.Model<any>) {
    this.model = model
  }

  async exists(organizationId: string): Promise<boolean> {
    return this.model.exists({ _id: new ObjectId(organizationId) })
  }

  async getOrganizationByOrganizationId(
    organizationId: string,
  ): Promise<Organization> {
    const organization = await this.model
      .findOne({
        _id: new ObjectId(organizationId),
      })
      .exec()
    if (!organization) throw new Error('Organization not found.')
    return OrganizationMap.toDomain(organization)
  }

  async save(organization: Organization): Promise<void> {
    const exists = await this.exists(organization.id.toString())

    const rawOrganization = await OrganizationMap.toPersistence(organization)
    if (!exists) {
      await this.model.create(rawOrganization)
    } else {
      await this.model
        .updateOne({ _id: rawOrganization._id }, { $set: { rawOrganization } })
        .exec()
    }
  }
}
