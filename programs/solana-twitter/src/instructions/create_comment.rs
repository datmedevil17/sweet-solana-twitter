use crate::constants::*;
use crate::errors::ErrorCode::*;
use crate::states::{ProgramState, Comment, Post};
use anchor_lang::prelude::*;

pub fn create_comment(
    ctx: Context<CreateCommentCtx>,
    post_id: u64,
    content: String,
) -> Result<()> {
    let comment = &mut ctx.accounts.comment;
    let post = &mut ctx.accounts.post;
    let state = &mut ctx.accounts.program_state;

    // Verify post exists and matches ID
    if post.post_id != post_id {
        return Err(PostNotFound.into());
    }

    // Check if post is deleted
    if post.is_deleted {
        return Err(PostDeleted.into());
    }

    // Validate content length
    if content.len() > MAX_COMMENT_LENGTH {
        return Err(CommentTooLong.into());
    }

    // Increment counters
    state.comment_count += 1;
    post.comments_count += 1;

    // Initialize comment
    comment.comment_id = state.comment_count;
    comment.post_id = post_id;
    comment.author = ctx.accounts.user.key();
    comment.content = content;
    comment.created_at = Clock::get()?.unix_timestamp as u64;
    comment.is_deleted = false;

    Ok(())
}

#[derive(Accounts)]
#[instruction(post_id: u64)]
pub struct CreateCommentCtx<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Comment::INIT_SPACE,
        seeds = [
            b"comment",
            (program_state.comment_count + 1).to_le_bytes().as_ref()
        ],
        bump
    )]
    pub comment: Account<'info, Comment>,
    
    #[account(
        mut,
        seeds = [
            b"post",
            post_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}