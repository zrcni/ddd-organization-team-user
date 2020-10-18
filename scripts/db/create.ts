import { models } from '../../src/shared/infra/database/mongoose/models'
;(async () => {
  try {
    // MongoDB transactions cannot create collections.
    // A transaction will fail if it's the first operation on a collection.
    await Promise.all(
      Object.values(models).map(model => model.createCollection()),
    )
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
