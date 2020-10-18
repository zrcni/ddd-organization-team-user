import { CreateOrganizationUseCase } from './CreateOrganizationUseCase'
import { CreateOrganizationDTO } from './CreateOrganizationDTO'
import { CreateOrganizationErrors } from './CreateOrganizationErrors'
import * as express from 'express'
import { BaseController } from '../../../../shared/infra/http/models/BaseController'

export class CreateOrganizationController extends BaseController {
  private useCase: CreateOrganizationUseCase

  constructor(useCase: CreateOrganizationUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateOrganizationDTO = {
      name: req.body.name,
      userId: req.body.userId,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateOrganizationErrors.UserNotFoundError:
            return this.notFound(res, error.errorValue())
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
