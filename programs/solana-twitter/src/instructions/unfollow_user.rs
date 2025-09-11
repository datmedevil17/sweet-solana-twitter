use crate::errors::ErrorCode::*;
use crate::states::{Follow, UserProfile};
use anchor_lang::prelude::*;

pub fn unfollow_user(ctx: Context<UnfollowUserCtx>, target_user: Pubkey) -> Result<()> {
    let follow = &ctx.accounts.follow;
    let follower_profile = &mut ctx.accounts.follower_profile;
    let following_profile = &mut ctx.accounts.following_profile;

    // Verify follow relationship exists
    if follow.follower != ctx.accounts.follower.key() || follow.following != target_user {
        return Err(NotFollowing.into());
    }

    // Update counts
    follower_profile.following_count = follower_profile.following_count.saturating_sub(1);
    following_profile.followers_count = following_profile.followers_count.saturating_sub(1);

    Ok(())
}

#[derive(Accounts)]
#[instruction(target_user: Pubkey)]
pub struct UnfollowUserCtx<'info> {
    #[account(
        mut,
        close = follower,
        seeds = [
            b"follow",
            follower.key().as_ref(),
            target_user.as_ref()
        ],
        bump
    )]
    pub follow: Account<'info, Follow>,
    
    #[account(
        mut,
        seeds = [
            b"user_profile",
            follower.key().as_ref()
        ],
        bump
    )]
    pub follower_profile: Account<'info, UserProfile>,
    
    #[account(
        mut,
        seeds = [
            b"user_profile",
            target_user.as_ref()
        ],
        bump
    )]
    pub following_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub follower: Signer<'info>,
}