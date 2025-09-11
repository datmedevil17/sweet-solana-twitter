use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProgramState {
    pub initialized: bool,
    pub user_count: u64,
    pub post_count: u64,
    pub comment_count: u64,
    pub platform_fee: u64, // percentage fee for donations
    pub platform_address: Pubkey,
    pub total_donations: u64,
}