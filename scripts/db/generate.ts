import { userRepo } from '../../src/modules/users/repos'
import { DevDataGenerator } from '../../src/shared/infra/database/generators/DevDataGenerator'
;(async () => {
  try {
    const generator = new DevDataGenerator(userRepo)
    await generator.generate()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
