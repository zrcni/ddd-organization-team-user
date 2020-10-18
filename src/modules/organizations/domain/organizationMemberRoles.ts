import { WatchedList } from '../../../shared/domain/WatchedList'
import { OrganizationMemberRole } from './organizationMemberRole'

// TODO: figure out where to requirement of at least one role
export class OrganizationMemberRoles extends WatchedList<
  OrganizationMemberRole
> {
  private constructor(roles: OrganizationMemberRole[]) {
    super(roles)
  }

  public compareItems(
    a: OrganizationMemberRole,
    b: OrganizationMemberRole,
  ): boolean {
    return a.equals(b)
  }

  public static create(
    roles?: OrganizationMemberRole[],
  ): OrganizationMemberRoles {
    return new OrganizationMemberRoles(roles ? roles : [])
  }

  public static createDefault(): OrganizationMemberRoles {
    const defaultRoles = [
      OrganizationMemberRole.create({ value: 'owner' }).getValue(),
    ]
    return OrganizationMemberRoles.create(defaultRoles)
  }
}
