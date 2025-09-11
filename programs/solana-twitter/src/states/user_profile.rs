use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub owner: Pubkey,
    pub user_id: u64,
    #[max_len(20)]
    pub username: String,
    #[max_len(50)]
    pub display_name: String,
    #[max_len(160)]
    pub bio: String,
    #[max_len(256)]
    pub profile_image_url: String,
    pub followers_count: u64,
    pub following_count: u64,
    pub posts_count: u64,
    pub created_at: u64,
    pub total_donations_received: u64,
    pub is_verified: bool,
}