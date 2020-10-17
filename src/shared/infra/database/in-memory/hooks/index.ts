import { UniqueEntityID } from '../../../../domain/UniqueEntityID'
import { DomainEvents } from '../../../../domain/events/DomainEvents'
import { database } from '..'

function dispatchEventsCallback(obj: any, primaryKeyField = 'id') {
  const aggregateId = new UniqueEntityID(obj[primaryKeyField])
  DomainEvents.dispatchEventsForAggregate(aggregateId)
}

database.onCreate(obj => dispatchEventsCallback(obj))
database.onUpdate(obj => dispatchEventsCallback(obj))
database.onDelete(obj => dispatchEventsCallback(obj))
