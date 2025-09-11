use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Comment {
    pub comment_id: u64,
    pub post_id: u64,
    pub author: Pubkey,
    #[max_len(140)]
    pub content: String,
    pub created_at: u64,
    pub is_deleted: bool,
}