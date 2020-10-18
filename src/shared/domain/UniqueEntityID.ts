import { Types } from 'mongoose'
import { Identifier } from './Identifier'
const ObjectId = Types.ObjectId

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : new ObjectId().toString())
  }
}
