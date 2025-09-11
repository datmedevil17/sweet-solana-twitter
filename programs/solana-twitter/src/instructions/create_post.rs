use crate::constants::*;
use crate::errors::ErrorCode::*;
use crate::states::{ProgramState, UserProfile, Post};
use anchor_lang::prelude::*;

pub fn create_post(
    ctx: Context<CreatePostCtx>,
    content: String,
    image_url: Option<String>,
) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let state = &mut ctx.accounts.program_state;
    let user_profile = &mut ctx.accounts.user_profile;

    // Validate content length
    if content.len() > MAX_POST_CONTENT_LENGTH {
        return Err(PostContentTooLong.into());
    }

    // Validate image URL if provided
    if let Some(ref url) = image_url {
        if url.len() > MAX_IMAGE_URL_LENGTH {
            return Err(ImageUrlTooLong.into());
        }
    }

    // Increment counters
    state.post_count += 1;
    user_profile.posts_count += 1;

    // Initialize post
    post.post_id = state.post_count;
    post.author = ctx.accounts.user.key();
    post.collaborator = None;
    post.content = content;
    post.image_url = image_url;
    post.likes_count = 0;
    post.comments_count = 0;
    post.created_at = Clock::get()?.unix_timestamp as u64;
    post.updated_at = post.created_at;
    post.is_deleted = false;
    post.is_collaboration = false;

    Ok(())
}

#[derive(Accounts)]
pub struct CreatePostCtx<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        seeds = [
            b"user_profile",
            user.key().as_ref()
        ],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Post::INIT_SPACE,
        seeds = [
            b"post",
            (program_state.post_count + 1).to_le_bytes().as_ref()
        ],
        bump
    )]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}