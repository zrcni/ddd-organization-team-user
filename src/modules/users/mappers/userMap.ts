import { Mapper } from '../../../shared/infra/Mapper'
import { User } from '../domain/user'
import { UserDTO } from '../dtos/userDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { UserName } from '../domain/userName'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      userId: user.id.toString(),
      username: user.username.value,
      isAdmin: user.isAdmin,
      isDeleted: user.isDeleted,
    }
  }

  public static toDomain(raw: any): User {
    const userNameOrError = UserName.create({ name: raw.username })

    const userOrError = User.create(
      {
        username: userNameOrError.getValue(),
        isAdmin: raw.isAdmin,
        isDeleted: raw.isDeleted,
      },
      new UniqueEntityID(raw._id.toString()),
    )

    userOrError.isFailure ? console.info(userOrError.error) : ''

    return userOrError.isSuccess
      ? userOrError.getValue()
      : ((null as unknown) as User)
  }

  public static toPersistence(user: User): any {
    return {
      _id: new ObjectId(user.id.toString()),
      username: user.username.value,
      isAdmin: user.isAdmin,
      isDeleted: user.isDeleted,
    }
  }
}
