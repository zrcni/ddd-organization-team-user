import { Model, MongooseFilterQuery, Types, ClientSession } from 'mongoose'
const ObjectId = Types.ObjectId

type Filter = MongooseFilterQuery<any>

interface IDocument {
  _id: typeof ObjectId
}

export interface IMongoDBRepositoryWithTransactions {
  findOne(conditions: Filter): Promise<IDocument>
  findMany(conditions: Filter): Promise<IDocument[]>
  updateOne(conditions: Filter, document: IDocument): Promise<IDocument>
  create(doc: IDocument): Promise<IDocument>
  exists(conditions: Filter): Promise<boolean>
}

export class MongoDBRepositoryWithTransactions
  implements IMongoDBRepositoryWithTransactions {
  private model: Model<any>
  private session?: ClientSession

  constructor(model: Model<any>, session?: ClientSession) {
    this.model = model
    this.session = session
  }

  exists(conditions: Filter) {
    return this.model.exists(conditions)
  }

  findOne(conditions: Filter) {
    const query = this.model.findOne(conditions)
    if (this.session) query.session(this.session)
    return query.exec()
  }

  findMany(conditions: Filter) {
    const query = this.model.find(conditions)
    if (this.session) query.session(this.session)
    return query.exec()
  }

  updateOne(conditions: Filter, document: IDocument) {
    const query = this.model.updateOne(conditions, { $set: document })
    if (this.session) query.session(this.session)
    return query.exec()
  }

  create(document: IDocument) {
    const doc = new this.model(document)
    return this.session // prettier-ignore
      ? doc.save({ session: this.session })
      : doc.save()
  }
}
