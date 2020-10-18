import { Schema } from 'mongoose'
import { UniqueEntityID } from '../../../../domain/UniqueEntityID'
import { DomainEvents } from '../../../../domain/events/DomainEvents'

export default function addHooks(schema: Schema, modelName: string) {
  schema.post('save', (document, next) => {
    dispatchEventsCallback(document)
    next()
  })

  schema.post('remove', (document, next) => {
    dispatchEventsCallback(document)
    next()
  })

  schema.post('updateOne', (document, next) => {
    dispatchEventsCallback(document)
    next()
  })

  schema.post('deleteOne', (document, next) => {
    dispatchEventsCallback(document)
    next()
  })

  console.info(`${modelName} model hooks setup`)
}

function dispatchEventsCallback(document: any, primaryKeyField = '_id') {
  const aggregateId = new UniqueEntityID(document[primaryKeyField])
  DomainEvents.dispatchEventsForAggregate(aggregateId)
}
