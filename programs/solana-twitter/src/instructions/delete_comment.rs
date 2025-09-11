use crate::errors::ErrorCode::*;
use crate::states::{Comment, Post};
use anchor_lang::prelude::*;

pub fn delete_comment(ctx: Context<DeleteCommentCtx>, comment_id: u64) -> Result<()> {
    let comment = &mut ctx.accounts.comment;
    let post = &mut ctx.accounts.post;

    // Verify comment exists and matches ID
    if comment.comment_id != comment_id {
        return Err(CommentNotFound.into());
    }

    // Verify user is the author of the comment
    if comment.author != ctx.accounts.user.key() {
        return Err(Unauthorized.into());
    }

    // Check if comment is already deleted
    if comment.is_deleted {
        return Err(CommentNotFound.into());
    }

    // Mark comment as deleted
    comment.is_deleted = true;

    // Decrement post's comment count
    post.comments_count = post.comments_count.saturating_sub(1);

    Ok(())
}

#[derive(Accounts)]
#[instruction(comment_id: u64)]
pub struct DeleteCommentCtx<'info> {
    #[account(
        mut,
        seeds = [
            b"comment",
            comment_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub comment: Account<'info, Comment>,
    
    #[account(
        mut,
        seeds = [
            b"post",
            comment.post_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}