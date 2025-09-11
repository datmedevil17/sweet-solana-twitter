use crate::constants::*;
use crate::errors::ErrorCode::*;
use crate::states::{ProgramState, UserProfile, Donation};
use anchor_lang::prelude::*;

pub fn donate_to_creator(
    ctx: Context<DonateToCreatorCtx>,
    creator: Pubkey,
    amount: u64,
) -> Result<()> {
    // Get the donation key before borrowing mutably
    let donation_key = ctx.accounts.donation.key();
    
    let donation = &mut ctx.accounts.donation;
    let creator_profile = &mut ctx.accounts.creator_profile;
    let state = &mut ctx.accounts.program_state;
    let donor = &ctx.accounts.donor;

    // Cannot donate to yourself
    if donor.key() == creator {
        return Err(CannotDonateToSelf.into());
    }

    // Validate minimum donation amount (0.02 SOL)
    if amount < MIN_DONATION_AMOUNT {
        return Err(InvalidDonationAmount.into());
    }

    // Verify creator profile exists
    if creator_profile.owner != creator {
        return Err(ProfileNotFound.into());
    }

    // Calculate platform fee
    let platform_fee = (amount * state.platform_fee) / 100;
    let creator_amount = amount - platform_fee;

    // Transfer SOL to creator
    let creator_transfer = anchor_lang::solana_program::system_instruction::transfer(
        &donor.key(),
        &creator,
        creator_amount,
    );
    
    let creator_result = anchor_lang::solana_program::program::invoke(
        &creator_transfer,
        &[donor.to_account_info(), creator_profile.to_account_info()],
    );

    if let Err(e) = creator_result {
        msg!("Creator donation transfer failed: {:?}", e);
        return Err(e.into());
    }

    // Transfer platform fee if applicable
    if platform_fee > 0 {
        let platform_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &donor.key(),
            &state.platform_address,
            platform_fee,
        );
        
        let platform_result = anchor_lang::solana_program::program::invoke_signed(
            &platform_transfer,
            &[donor.to_account_info()],
            &[],
        );

        if let Err(e) = platform_result {
            msg!("Platform fee transfer failed: {:?}", e);
            return Err(e.into());
        }
    }

    // Record donation
    donation.donor = donor.key();
    donation.recipient = creator;
    donation.amount = amount;
    donation.timestamp = Clock::get()?.unix_timestamp as u64;
    donation.transaction_id = donation_key.to_string(); // Use the pre-captured key

    // Update stats
    creator_profile.total_donations_received += creator_amount;
    state.total_donations += amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction(creator: Pubkey)]
pub struct DonateToCreatorCtx<'info> {
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    
    #[account(
        init,
        payer = donor,
        space = ANCHOR_DISCRIMINATOR_SIZE + Donation::INIT_SPACE,
        seeds = [
            b"donation",
            donor.key().as_ref(),
            creator.as_ref(),
        ],
        bump
    )]
    pub donation: Account<'info, Donation>,
    
    #[account(
        mut,
        seeds = [
            b"user_profile",
            creator.as_ref()
        ],
        bump
    )]
    pub creator_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub donor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}