import { User } from '../domain/user'
import { UserName } from '../domain/userName'

export interface IUserRepo {
  exists(userId: string): Promise<boolean>
  getUserByUserId(userId: string): Promise<User>
  getUserByUserName(username: UserName | string): Promise<User>
  save(user: User): Promise<void>
}
