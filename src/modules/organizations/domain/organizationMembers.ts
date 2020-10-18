import { WatchedList } from '../../../shared/domain/WatchedList'
import { OrganizationMember } from './organizationMember'

export class OrganizationMembers extends WatchedList<OrganizationMember> {
  private constructor(members: OrganizationMember[]) {
    super(members)
  }

  public compareItems(a: OrganizationMember, b: OrganizationMember): boolean {
    return a.equals(b)
  }

  public static create(members?: OrganizationMember[]): OrganizationMembers {
    return new OrganizationMembers(members ? members : [])
  }
}
