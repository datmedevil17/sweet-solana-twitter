use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Post {
    pub post_id: u64,
    pub author: Pubkey,
    pub collaborator: Option<Pubkey>, // for collaboration posts
    #[max_len(280)]
    pub content: String,
    #[max_len(256)]
    pub image_url: Option<String>,
    pub likes_count: u64,
    pub comments_count: u64,
    pub created_at: u64,
    pub updated_at: u64,
    pub is_deleted: bool,
    pub is_collaboration: bool,
}