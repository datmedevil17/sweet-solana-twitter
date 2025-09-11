#![allow(unexpected_cfgs)]
#![allow(deprecated)]
use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;

declare_id!("5KHS8ooUAF2bYEKZTmj8jKRZmea3gXed5FPyVtQKn2bu");

#[program]
pub mod twitter_platform {
    use super::*;

    pub fn initialize(ctx: Context<InitializeCtx>) -> Result<()> {
        initialize::initialize(ctx)
    }

    pub fn create_profile(
        ctx: Context<CreateProfileCtx>,
        username: String,
        display_name: String,
        bio: String,
        profile_image_url: String,
    ) -> Result<()> {
        create_profile::create_profile(ctx, username, display_name, bio, profile_image_url)
    }

    pub fn create_post(
        ctx: Context<CreatePostCtx>,
        content: String,
        image_url: Option<String>,
    ) -> Result<()> {
        create_post::create_post(ctx, content, image_url)
    }

    pub fn delete_post(ctx: Context<DeletePostCtx>, post_id: u64) -> Result<()> {
        delete_post::delete_post(ctx, post_id)
    }

    pub fn follow_user(ctx: Context<FollowUserCtx>, target_user: Pubkey) -> Result<()> {
        follow_user::follow_user(ctx, target_user)
    }

    pub fn unfollow_user(ctx: Context<UnfollowUserCtx>, target_user: Pubkey) -> Result<()> {
        unfollow_user::unfollow_user(ctx, target_user)
    }

    pub fn like_post(ctx: Context<LikePostCtx>, post_id: u64) -> Result<()> {
        like_post::like_post(ctx, post_id)
    }

    pub fn unlike_post(ctx: Context<UnlikePostCtx>, post_id: u64) -> Result<()> {
        unlike_post::unlike_post(ctx, post_id)
    }

    pub fn create_comment(
        ctx: Context<CreateCommentCtx>,
        post_id: u64,
        content: String,
    ) -> Result<()> {
        create_comment::create_comment(ctx, post_id, content)
    }

    pub fn donate_to_creator(
        ctx: Context<DonateToCreatorCtx>,
        creator: Pubkey,
        amount: u64,
    ) -> Result<()> {
        donate_to_creator::donate_to_creator(ctx, creator, amount)
    }

    pub fn create_collaboration_post(
        ctx: Context<CreateCollaborationPostCtx>,
        collaborator: Pubkey,
        content: String,
        image_url: Option<String>,
    ) -> Result<()> {
        create_collaboration_post::create_collaboration_post(ctx, collaborator, content, image_url)
    }

     pub fn update_profile(
        ctx: Context<UpdateProfileCtx>,
        display_name: Option<String>,
        bio: Option<String>,
        profile_image_url: Option<String>,
    ) -> Result<()> {
        update_profile::update_profile(ctx, display_name, bio, profile_image_url)
    }

    pub fn delete_comment(ctx: Context<DeleteCommentCtx>, comment_id: u64) -> Result<()> {
        delete_comment::delete_comment(ctx, comment_id)
    }
}