use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Donation {
    pub donor: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: u64,
    #[max_len(64)]
    pub transaction_id: String,
}