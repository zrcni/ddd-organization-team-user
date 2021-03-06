import { CreateTeamUseCase } from './CreateTeamUseCase'
import { CreateTeamDTO } from './CreateTeamDTO'
import { CreateTeamErrors } from './CreateTeamErrors'
import * as express from 'express'
import { BaseController } from '../../../../shared/infra/http/models/BaseController'

export class CreateTeamController extends BaseController {
  private useCase: CreateTeamUseCase

  constructor(useCase: CreateTeamUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateTeamDTO = {
      name: req.body.name,
      userId: req.body.userId,
      organizationId: req.body.organizationId,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateTeamErrors.UserNotFoundError:
          case CreateTeamErrors.OrganizationNotFoundError:
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
