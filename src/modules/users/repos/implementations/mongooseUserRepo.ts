import mongoose from 'mongoose'
import { IUserRepo } from '../userRepo'
import { User } from '../../domain/user'
import { UserMap } from '../../mappers/userMap'
import { UserName } from '../../domain/userName'
const ObjectId = mongoose.Types.ObjectId

export class MongooseUserRepo implements IUserRepo {
  private model: mongoose.Model<any>

  constructor(model: mongoose.Model<any>) {
    this.model = model
  }

  async exists(userId: string): Promise<boolean> {
    return this.model.exists({ _id: new ObjectId(userId) })
  }

  async getUserByUserName(username: UserName | string): Promise<User> {
    const user = await this.model
      .findOne({
        username: username instanceof UserName ? username.value : username,
      })
      .exec()
    if (!user) throw new Error('User not found')
    return UserMap.toDomain(user)
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.model.findOne({ _id: new ObjectId(userId) }).exec()
    if (!user) throw new Error('User not found.')
    return UserMap.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const exists = await this.exists(user.id.toString())

    const rawUser = await UserMap.toPersistence(user)
    if (!exists) {
      await this.model.create(rawUser)
    } else {
      await this.model
        .updateOne({ _id: rawUser._id }, { $set: { rawUser } })
        .exec()
    }
  }
}
