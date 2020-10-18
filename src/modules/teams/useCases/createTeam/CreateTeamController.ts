import { CreateTeam } from './CreateTeam'
import { CreateTeamDTO } from './CreateTeamDTO'
import { CreateTeamErrors } from './CreateTeamErrors'
import * as express from 'express'
import { BaseController } from '../../../../shared/infra/http/models/BaseController'

export class CreateTeamController extends BaseController {
  private useCase: CreateTeam

  constructor(useCase: CreateTeam) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateTeamDTO = {
      teamName: req.body.teamName,
      userId: req.body.userId,
      organizationId: req.params.organizationId,
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
