import { OrganizationMemberDTO } from './organizationMemberDTO'

export interface OrganizationDTO {
  organizationId: string
  name: string
  members: OrganizationMemberDTO[]
  maxTeams: number
  maxTeamMembers: number
  isDeleted?: boolean
}
