import { AddTeamMemberDTO } from './AddTeamMemberDTO'
import { UseCase } from '../../../../shared/core/UseCase'
import { AddTeamMemberResponse } from './AddTeamMemberResponse'
import { OrganizationService } from '../../domain/services/organizationService'

// WIP
export class AddTeamMember
  implements UseCase<AddTeamMemberDTO, Promise<AddTeamMemberResponse>> {
  private userRepo: IUserRepo
  private teamRepo: ITeamRepo
  private organizationRepo: IOrganizationRepo
  private organizationService: OrganizationService

  constructor(
    userRepo: IUserRepo,
    teamRepo: ITeamRepo,
    organizationRepo: IOrganizationRepo,
    organizationService: OrganizationService,
  ) {
    this.userRepo = userRepo
    this.teamRepo = teamRepo
    this.organizationRepo = organizationRepo
    this.organizationService = organizationService
  }

  public async execute(
    req: AddTeamMemberDTO,
  ): Promise<AddTeamMemberResponse> {
    // let member: Member
    // let post: Post
    // let comment: Comment
    // let existingVotesOnCommentByMember: CommentVote[]

    // try {
    //   try {
    //     member = await this.memberRepo.getMemberByUserId(req.userId)
    //   } catch (err) {
    //     return left(new DownvoteCommentErrors.MemberNotFoundError())
    //   }

    //   try {
    //     comment = await this.commentRepo.getCommentByCommentId(req.commentId)
    //   } catch (err) {
    //     return left(
    //       new DownvoteCommentErrors.CommentNotFoundError(req.commentId),
    //     )
    //   }

    //   try {
    //     post = await this.postRepo.getPostByPostId(comment.postId.id.toString())
    //   } catch (err) {
    //     return left(new DownvoteCommentErrors.PostNotFoundError(req.commentId))
    //   }

    //   existingVotesOnCommentByMember = await this.commentVotesRepo.getVotesForCommentByMemberId(
    //     comment.commentId,
    //     member.memberId,
    //   )

    //   const downVoteCommentResult = this.postService.downvoteComment(
    //     post,
    //     member,
    //     comment,
    //     existingVotesOnCommentByMember,
    //   )

    //   if (downVoteCommentResult.isLeft()) {
    //     return left(downVoteCommentResult.value)
    //   }

    //   await this.postRepo.save(post)

    //   return right(Result.ok<void>())
    // } catch (err) {
    //   return left(new AppError.UnexpectedError(err))
    // }
  }
}
