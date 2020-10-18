import { OrganizationMemberDTO } from './organizationMemberDTO'

export interface OrganizationDTO {
  organizationId: string
  name: string
  members: OrganizationMemberDTO[]
  maxTeams: number
  teamsCount: number
  maxTeamMembers: number
  teamMembersCount: number
  isDeleted?: boolean
}
