import config from '../../src/shared/infra/database/mongoose/config/config'
;(async () => {
  try {
    await config.connection.dropDatabase()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
