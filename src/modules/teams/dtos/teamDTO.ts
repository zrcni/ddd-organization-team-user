import { TeamMemberDTO } from './teamMemberDTO'

export interface TeamDTO {
  teamId: string
  name: string
  organizationId: string
  members: TeamMemberDTO[]
  isDeleted?: boolean
}
