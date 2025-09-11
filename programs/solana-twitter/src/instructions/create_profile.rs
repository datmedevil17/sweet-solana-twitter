use crate::constants::*;
use crate::errors::ErrorCode::*;
use crate::states::{ProgramState, UserProfile};
use anchor_lang::prelude::*;

pub fn create_profile(
    ctx: Context<CreateProfileCtx>,
    username: String,
    display_name: String,
    bio: String,
    profile_image_url: String,
) -> Result<()> {
    let profile = &mut ctx.accounts.user_profile;
    let state = &mut ctx.accounts.program_state;

    // Validate input lengths
    if username.len() > MAX_USERNAME_LENGTH {
        return Err(UsernameTooLong.into());
    }
    if display_name.len() > MAX_DISPLAY_NAME_LENGTH {
        return Err(DisplayNameTooLong.into());
    }
    if bio.len() > MAX_BIO_LENGTH {
        return Err(BioTooLong.into());
    }
    if profile_image_url.len() > MAX_IMAGE_URL_LENGTH {
        return Err(ImageUrlTooLong.into());
    }

    // Increment user count and assign user ID
    state.user_count += 1;
    
    // Initialize profile
    profile.owner = ctx.accounts.user.key();
    profile.user_id = state.user_count;
    profile.username = username;
    profile.display_name = display_name;
    profile.bio = bio;
    profile.profile_image_url = profile_image_url;
    profile.followers_count = 0;
    profile.following_count = 0;
    profile.posts_count = 0;
    profile.created_at = Clock::get()?.unix_timestamp as u64;
    profile.total_donations_received = 0;
    profile.is_verified = false;

    Ok(())
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct CreateProfileCtx<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + UserProfile::INIT_SPACE,
        seeds = [
            b"user_profile",
            user.key().as_ref()
        ],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}