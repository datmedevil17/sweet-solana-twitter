use crate::constants::*;
use crate::errors::ErrorCode::*;
use crate::states::{ProgramState, UserProfile, Post};
use anchor_lang::prelude::*;

pub fn create_collaboration_post(
    ctx: Context<CreateCollaborationPostCtx>,
    collaborator: Pubkey,
    content: String,
    image_url: Option<String>,
) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let state = &mut ctx.accounts.program_state;
    let author_profile = &mut ctx.accounts.author_profile;
    let collaborator_profile = &ctx.accounts.collaborator_profile;

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

    // Verify collaborator profile exists
    if collaborator_profile.owner != collaborator {
        return Err(CollaboratorNotFound.into());
    }

    // Cannot collaborate with yourself
    if ctx.accounts.author.key() == collaborator {
        return Err(CannotFollowSelf.into()); // Reusing error for self-action
    }

    // Increment counters
    state.post_count += 1;
    author_profile.posts_count += 1;

    // Initialize collaboration post
    post.post_id = state.post_count;
    post.author = ctx.accounts.author.key();
    post.collaborator = Some(collaborator);
    post.content = content;
    post.image_url = image_url;
    post.likes_count = 0;
    post.comments_count = 0;
    post.created_at = Clock::get()?.unix_timestamp as u64;
    post.updated_at = post.created_at;
    post.is_deleted = false;
    post.is_collaboration = true;

    Ok(())
}

#[derive(Accounts)]
#[instruction(collaborator: Pubkey)]
pub struct CreateCollaborationPostCtx<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        mut,
        seeds = [
            b"user_profile",
            author.key().as_ref()
        ],
        bump
    )]
    pub author_profile: Account<'info, UserProfile>,
    
    #[account(
        seeds = [
            b"user_profile",
            collaborator.as_ref()
        ],
        bump
    )]
    pub collaborator_profile: Account<'info, UserProfile>,
    
    #[account(
        init,
        payer = author,
        space = ANCHOR_DISCRIMINATOR_SIZE + Post::INIT_SPACE,
        seeds = [
            b"post",
            (program_state.post_count + 1).to_le_bytes().as_ref()
        ],
        bump
    )]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub author: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}