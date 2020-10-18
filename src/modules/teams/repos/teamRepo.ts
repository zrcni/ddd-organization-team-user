import { Team } from '../domain/team'

export interface ITeamRepo {
  exists(teamId: string): Promise<boolean>
  getTeamByTeamId(teamId: string): Promise<Team>
  save(team: Team): Promise<void>
}
