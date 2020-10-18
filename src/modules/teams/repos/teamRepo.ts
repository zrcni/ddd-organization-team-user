import { Team } from '../domain/team'

export interface ITeamRepo {
  exists(name: string): Promise<boolean>
  getTeamByTeamId(teamId: string): Promise<Team>
  getTeamsByOrganizationId(organizationId: string): Promise<Team[]>
  save(team: Team): Promise<void>
}
