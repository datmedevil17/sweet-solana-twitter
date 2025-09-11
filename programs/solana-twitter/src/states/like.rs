use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Like {
    pub user: Pubkey,
    pub post_id: u64,
    pub created_at: u64,
}