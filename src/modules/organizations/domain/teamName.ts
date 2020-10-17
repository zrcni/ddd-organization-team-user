import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface TeamNameProps {
  name: string
}

export class TeamName extends ValueObject<TeamNameProps> {
  public static maxLength = 20
  public static minLength = 2

  get value(): string {
    return this.props.name
  }

  private constructor(props: TeamNameProps) {
    super(props)
  }

  public static create(props: TeamNameProps): Result<TeamName> {
    const teamNameResult = Guard.againstNullOrUndefined(props.name, 'name')
    if (!teamNameResult.succeeded) {
      return Result.fail<TeamName>(teamNameResult.message as string)
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name)
    if (!minLengthResult.succeeded) {
      return Result.fail<TeamName>(minLengthResult.message as string)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name)
    if (!maxLengthResult.succeeded) {
      return Result.fail<TeamName>(minLengthResult.message as string)
    }

    return Result.ok<TeamName>(new TeamName(props))
  }
}
