import { IUserRepo } from '../../../../../modules/users/repos/userRepo'
import { User } from '../../../../../modules/users/domain/user'
import { UserName } from '../../../../../modules/users/domain/userName'

export class DevDataGenerator {
  userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  async generate() {
    const user = this.createAdminUser()
    await this.userRepo.save(user)
  }

  private createAdminUser() {
    return User.create({
      username: UserName.create({ name: 'Tester' }).getValue(),
      isAdmin: true,
    }).getValue()
  }
}
