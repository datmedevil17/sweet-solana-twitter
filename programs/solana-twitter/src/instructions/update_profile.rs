use crate::constants::*;
use crate::errors::ErrorCode::*;
use crate::states::UserProfile;
use anchor_lang::prelude::*;

pub fn update_profile(
    ctx: Context<UpdateProfileCtx>,
    display_name: Option<String>,
    bio: Option<String>,
    profile_image_url: Option<String>,
) -> Result<()> {
    let profile = &mut ctx.accounts.user_profile;

    // Verify user owns the profile
    if profile.owner != ctx.accounts.user.key() {
        return Err(Unauthorized.into());
    }

    // Update display name if provided
    if let Some(name) = display_name {
        if name.len() > MAX_DISPLAY_NAME_LENGTH {
            return Err(DisplayNameTooLong.into());
        }
        profile.display_name = name;
    }

    // Update bio if provided
    if let Some(bio_text) = bio {
        if bio_text.len() > MAX_BIO_LENGTH {
            return Err(BioTooLong.into());
        }
        profile.bio = bio_text;
    }

    // Update profile image URL if provided
    if let Some(image_url) = profile_image_url {
        if image_url.len() > MAX_IMAGE_URL_LENGTH {
            return Err(ImageUrlTooLong.into());
        }
        profile.profile_image_url = image_url;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateProfileCtx<'info> {
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