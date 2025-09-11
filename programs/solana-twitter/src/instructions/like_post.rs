use crate::constants::ANCHOR_DISCRIMINATOR_SIZE;
use crate::errors::ErrorCode::*;
use crate::states::{Like, Post};
use anchor_lang::prelude::*;

pub fn like_post(ctx: Context<LikePostCtx>, post_id: u64) -> Result<()> {
    let like = &mut ctx.accounts.like;
    let post = &mut ctx.accounts.post;

    // Verify post exists and matches ID
    if post.post_id != post_id {
        return Err(PostNotFound.into());
    }

    // Check if post is deleted
    if post.is_deleted {
        return Err(PostDeleted.into());
    }

    // Initialize like
    like.user = ctx.accounts.user.key();
    like.post_id = post_id;
    like.created_at = Clock::get()?.unix_timestamp as u64;

    // Increment like count
    post.likes_count += 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(post_id: u64)]
pub struct LikePostCtx<'info> {
    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Like::INIT_SPACE,
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
    
    pub system_program: Program<'info, System>,
}