use crate::constants::ANCHOR_DISCRIMINATOR_SIZE;
use crate::errors::ErrorCode::*;
use crate::states::{Follow, UserProfile};
use anchor_lang::prelude::*;

pub fn follow_user(ctx: Context<FollowUserCtx>, target_user: Pubkey) -> Result<()> {
    let follow = &mut ctx.accounts.follow;
    let follower_profile = &mut ctx.accounts.follower_profile;
    let following_profile = &mut ctx.accounts.following_profile;

    // Cannot follow yourself
    if ctx.accounts.follower.key() == target_user {
        return Err(CannotFollowSelf.into());
    }

    // Verify target user profile exists
    if following_profile.owner != target_user {
        return Err(ProfileNotFound.into());
    }

    // Initialize follow relationship
    follow.follower = ctx.accounts.follower.key();
    follow.following = target_user;
    follow.created_at = Clock::get()?.unix_timestamp as u64;

    // Update counts
    follower_profile.following_count += 1;
    following_profile.followers_count += 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(target_user: Pubkey)]
pub struct FollowUserCtx<'info> {
    #[account(
        init,
        payer = follower,
        space = ANCHOR_DISCRIMINATOR_SIZE + Follow::INIT_SPACE,
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
    
    pub system_program: Program<'info, System>,
}