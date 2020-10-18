import mongoose from 'mongoose'
import config from '../../../../../config'

const dbConfig = {
  dbName: 'dddb',
  mongodbConnectionString:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017,localhost:27016?replicaSet=ddd_replica&readPreference=secondaryPreferred',
}

const connection = mongoose.createConnection(dbConfig.mongodbConnectionString, {
  useCreateIndex: config.isDev,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbConfig.dbName,
})

connection.on('open', () => {
  console.info('[MongoDB] Connected to MongoDB via mongoose')
})

connection.on('close', () => {
  console.info('[MongoDB] Connection closed')
})

connection.on('disconnected', () => {
  console.info('[MongoDB] Connection disconnected')
})

connection.on('error', err => {
  console.error('[MongoDB] Connection error: ', err)
})

export default { connection }
