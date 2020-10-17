import { UniqueEntityID } from '../UniqueEntityID'

export interface IDomainEvent {
  createdAt: Date
  getAggregateId(): UniqueEntityID
}
