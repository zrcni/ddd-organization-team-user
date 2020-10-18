import { AddTeamMemberUseCase } from './AddTeamMemberUseCase'
import { AddTeamMemberDTO } from './AddTeamMemberDTO'
import { AddTeamMemberErrors } from './AddTeamMemberErrors'
import * as express from 'express'
import { BaseController } from '../../../../shared/infra/http/models/BaseController'

export class AddTeamMemberController extends BaseController {
  private useCase: AddTeamMemberUseCase

  constructor(useCase: AddTeamMemberUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: AddTeamMemberDTO = {
      userId: req.body.userId,
      teamId: req.params.teamId,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case AddTeamMemberErrors.UserNotFoundError:
          case AddTeamMemberErrors.TeamNotFoundError:
          case AddTeamMemberErrors.OrganizationNotFoundError:
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
