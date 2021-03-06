import { Organization } from '../domain/organization'

export interface IOrganizationRepo {
  exists(name: string): Promise<boolean>
  getOrganizationByOrganizationId(organizationId: string): Promise<Organization>
  save(organization: Organization): Promise<void>
}
