import { Schema, Model } from 'mongoose'
import fs from 'fs'
import path from 'path'
import config from '../config/config'
import { addHooks } from '../hooks'

const models: { [key: string]: Model<any> } = {}
let modelsLoaded = false

function createModels() {
  if (modelsLoaded) return

  fs.readdirSync(__dirname)
    .filter(
      filename =>
        filename.indexOf('.') !== 0 &&
        filename !== path.basename(__filename) &&
        filename.slice(-3) === '.ts',
    )
    .forEach(filename => {
      const createModel = require(path.join(__dirname, filename)).default

      const schemaName = filename.slice(0, -3)
      const model = createModel(config.connection, (schema: Schema) =>
        addHooks(schema, schemaName),
      )
      models[model.modelName] = model
    })

  modelsLoaded = true

  return models
}

createModels()

export { models }
