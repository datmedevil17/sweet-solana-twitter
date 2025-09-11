use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Program is already initialized")]
    AlreadyInitialized,
    
    #[msg("Username is too long")]
    UsernameTooLong,
    
    #[msg("Display name is too long")]
    DisplayNameTooLong,
    
    #[msg("Bio is too long")]
    BioTooLong,
    
    #[msg("Post content is too long")]
    PostContentTooLong,
    
    #[msg("Comment is too long")]
    CommentTooLong,
    
    #[msg("Image URL is too long")]
    ImageUrlTooLong,
    
    #[msg("Username already exists")]
    UsernameAlreadyExists,
    
    #[msg("Profile not found")]
    ProfileNotFound,
    
    #[msg("Post not found")]
    PostNotFound,
    
    #[msg("Comment not found")]
    CommentNotFound,
    
    #[msg("Cannot follow yourself")]
    CannotFollowSelf,
    
    #[msg("Already following user")]
    AlreadyFollowing,
    
    #[msg("Not following user")]
    NotFollowing,
    
    #[msg("Already liked post")]
    AlreadyLiked,
    
    #[msg("Not liked post")]
    NotLiked,
    
    #[msg("Unauthorized action")]
    Unauthorized,
    
    #[msg("Invalid donation amount")]
    InvalidDonationAmount,
    
    #[msg("Cannot donate to yourself")]
    CannotDonateToSelf,
    
    #[msg("Collaborator not found")]
    CollaboratorNotFound,
    
    #[msg("Post is deleted")]
    PostDeleted,
    
    #[msg("Cannot delete someone else's post")]
    CannotDeleteOthersPost,
}