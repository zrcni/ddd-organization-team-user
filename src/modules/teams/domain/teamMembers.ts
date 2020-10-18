import { WatchedList } from '../../../shared/domain/WatchedList'
import { TeamMember } from './teamMember'

export class TeamMembers extends WatchedList<TeamMember> {
  private constructor(members: TeamMember[]) {
    super(members)
  }

  public compareItems(a: TeamMember, b: TeamMember): boolean {
    return a.equals(b)
  }

  public static create(members?: TeamMember[]): TeamMembers {
    return new TeamMembers(members ? members : [])
  }
}
