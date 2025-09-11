use crate::errors::ErrorCode::*;
use crate::states::{Like, Post};
use anchor_lang::prelude::*;

pub fn unlike_post(ctx: Context<UnlikePostCtx>, post_id: u64) -> Result<()> {
    let like = &ctx.accounts.like;
    let post = &mut ctx.accounts.post;

    // Verify like exists and matches user and post
    if like.user != ctx.accounts.user.key() || like.post_id != post_id {
        return Err(NotLiked.into());
    }

    // Verify post exists
    if post.post_id != post_id {
        return Err(PostNotFound.into());
    }

    // Decrement like count
    post.likes_count = post.likes_count.saturating_sub(1);

    Ok(())
}

#[derive(Accounts)]
#[instruction(post_id: u64)]
pub struct UnlikePostCtx<'info> {
    #[account(
        mut,
        close = user,
        seeds = [
            b"like",
            user.key().as_ref(),
            post_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub like: Account<'info, Like>,
    
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
}