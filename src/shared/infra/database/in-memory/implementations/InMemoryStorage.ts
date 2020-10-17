import { EventEmitter } from 'events'

interface InMemoryObject {
  id: string
}

class InMemoryStorage<T extends InMemoryObject> {
  private emitter: EventEmitter
  private data: Record<string, T> = {}

  constructor() {
    this.emitter = new EventEmitter()
  }

  create(obj: T) {
    if (obj.id in this.data) {
      throw new Error(`Object already exists: ${obj.id}`)
    }
    this.data[obj.id] = { ...obj }
    this.emitter.emit('create', { ...this.data[obj.id] })
    return { ...this.data[obj.id] }
  }

  findOne(id: string) {
    const obj = this.data[id]
    return obj ? { ...obj } : null
  }

  updateOne(id: string, obj: T) {
    if (id in this.data) {
      throw new Error(`Object does not exist: ${id}`)
    }
    this.data[id] = { ...obj }
    this.emitter.emit('update', { ...this.data[id] })
    return { ...this.data[id] }
  }

  deleteOne(id: string) {
    if (id in this.data) {
      delete this.data[id]
      this.emitter.emit('delete', { ...this.data[id] })
      return 1
    }
    return 0
  }

  onCreate(cb: (data: T) => void) {
    this.emitter.on('create', cb)
  }

  onUpdate(cb: (data: T) => void) {
    this.emitter.on('update', cb)
  }

  onDelete(cb: (data: T) => void) {
    this.emitter.on('delete', cb)
  }
}

type StorageEvent = 'create' | 'update' | 'delete'

export default InMemoryStorage
