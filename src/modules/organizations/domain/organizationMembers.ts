import { WatchedList } from '../../../shared/domain/WatchedList'
import { OrganizationMember } from './organizationMember'
import { UserId } from '../../users/domain/userId'

export class OrganizationMembers extends WatchedList<OrganizationMember> {
  private constructor(members: OrganizationMember[]) {
    super(members)
  }

  public has(userId: UserId) {
    const members = this.getItems()
    return members.some(member => member.userId.equals(userId))
  }

  public compareItems(a: OrganizationMember, b: OrganizationMember): boolean {
    return a.equals(b)
  }

  public static create(members?: OrganizationMember[]): OrganizationMembers {
    return new OrganizationMembers(members ? members : [])
  }
}
