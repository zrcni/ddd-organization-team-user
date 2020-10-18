import { WatchedList } from '../../../shared/domain/WatchedList'
import { TeamMemberRole } from './teamMemberRole'

// TODO: figure out where to requirement of at least one role
export class TeamMemberRoles extends WatchedList<TeamMemberRole> {
  private constructor(roles: TeamMemberRole[]) {
    super(roles)
  }

  public compareItems(a: TeamMemberRole, b: TeamMemberRole): boolean {
    return a.equals(b)
  }

  public static create(roles?: TeamMemberRole[]): TeamMemberRoles {
    return new TeamMemberRoles(roles ? roles : [])
  }

  public static createDefault(): TeamMemberRoles {
    const defaultRoles = [TeamMemberRole.create({ value: 'agent' }).getValue()]
    return TeamMemberRoles.create(defaultRoles)
  }
}
