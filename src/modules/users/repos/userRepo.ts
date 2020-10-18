import { User } from '../domain/user'

export interface IUserRepo {
  exists(userId: string): Promise<boolean>
  getUserByUserId(userId: string): Promise<User>
  save(user: User): Promise<void>
}
