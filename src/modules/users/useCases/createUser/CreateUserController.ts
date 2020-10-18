import { CreateUserUseCase } from './CreateUserUseCase'
import { CreateUserDTO } from './CreateUserDTO'
import { CreateUserErrors } from './CreateUserErrors'
import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import { TextUtils } from '../../../../shared/utils/TextUtils'
import * as express from 'express'

export class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase

  constructor(useCase: CreateUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    let dto: CreateUserDTO = req.body as CreateUserDTO

    dto = {
      username: TextUtils.sanitize(dto.username),
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateUserErrors.UsernameTakenError:
            return this.conflict(res, error.errorValue())
          default:
            return this.fail(res, error.errorValue())
        }
      } else {
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
