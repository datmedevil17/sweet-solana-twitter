use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Follow {
    pub follower: Pubkey,
    pub following: Pubkey,
    pub created_at: u64,
}