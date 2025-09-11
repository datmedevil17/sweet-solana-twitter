use crate::errors::ErrorCode::*;
use crate::states::{Post, UserProfile};
use anchor_lang::prelude::*;

pub fn delete_post(ctx: Context<DeletePostCtx>, post_id: u64) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let user_profile = &mut ctx.accounts.user_profile;

    // Verify post exists and matches ID
    if post.post_id != post_id {
        return Err(PostNotFound.into());
    }

    // Verify user is the author or collaborator
    if post.author != ctx.accounts.user.key() && 
       post.collaborator != Some(ctx.accounts.user.key()) {
        return Err(CannotDeleteOthersPost.into());
    }

    // Check if post is already deleted
    if post.is_deleted {
        return Err(PostDeleted.into());
    }

    // Mark post as deleted
    post.is_deleted = true;
    post.updated_at = Clock::get()?.unix_timestamp as u64;

    // Decrement user's post count only if they are the original author
    if post.author == ctx.accounts.user.key() {
        user_profile.posts_count = user_profile.posts_count.saturating_sub(1);
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(post_id: u64)]
pub struct DeletePostCtx<'info> {
    #[account(
        mut,
        seeds = [
            b"post",
            post_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub post: Account<'info, Post>,
    
    #[account(
        mut,
        seeds = [
            b"user_profile",
            user.key().as_ref()
        ],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}