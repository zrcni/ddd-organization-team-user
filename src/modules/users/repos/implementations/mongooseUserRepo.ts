import mongoose from 'mongoose'
import { IUserRepo } from '../userRepo'
import { User } from '../../domain/user'
import { UserMap } from '../../mappers/userMap'
const ObjectId = mongoose.Types.ObjectId

export class MongooseUserRepo implements IUserRepo {
  private models: any

  constructor(models: any) {
    this.models = models
  }

  async exists(userId: string): Promise<boolean> {
    const UserModel = this.models.User
    return UserModel.exists({ _id: new ObjectId(userId) })
  }

  async getUserByUserId(userId: string): Promise<User> {
    const UserModel = this.models.User
    const user = await UserModel.findOne({ _id: new ObjectId(userId) }).exec()
    if (!user) throw new Error('User not found.')
    return UserMap.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const UserModel = this.models.User
    const exists = await this.exists(user.id.toString())

    const rawUser = await UserMap.toPersistence(user)
    if (!exists) {
      await UserModel.create(rawUser)
    } else {
      await UserModel.updateOne({ _id: rawUser._id, $set: { rawUser } })
    }
  }
}
