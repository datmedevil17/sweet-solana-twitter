import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import { TwitterPlatform } from "./twitter_platform";
import idl from "./twitter_platform.json";
import { getClusterURL } from "@/utils/helpers";

const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || "localhost";
const RPC_URL: string = getClusterURL(CLUSTER);

export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: unknown,
  sendTransaction: unknown
): Program<TwitterPlatform> | null => {
  if (!publicKey || !signTransaction) {
    console.log("Wallet not connected or missing signTransaction");
    return null;
  }

  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(
    connection,
    { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<TwitterPlatform>(idl as TwitterPlatform, provider);
};

export const getProviderReadonly = (): Program<TwitterPlatform> => {
  const connection = new Connection(RPC_URL, "confirmed");

  const walllet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
    signAllTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
  };

  const provider = new AnchorProvider(
    connection,
    walllet as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<TwitterPlatform>(idl as TwitterPlatform, provider);
};

export const createProfile = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  name: string,
  displayName: string,
  bio: string,
  profileImageUrl: string
): Promise<TransactionSignature> => {
  // Derive the program state PDA
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  // Derive the user profile PDA using the "user_profile" seed and user's public key
  const [userProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  // Execute the createProfile instruction
  const tx = await program.methods
    .createProfile(name, displayName, bio, profileImageUrl)
    .accountsPartial({
      programState: programStatePda,
      userProfile: userProfilePda,
      user: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  // Create connection and confirm transaction
  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

//1
export const updateProfile = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  displayName?: string,
  bio?: string,
  profileImageUrl?: string
): Promise<TransactionSignature> => {
  const [userProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .updateProfile(displayName || null, bio || null, profileImageUrl || null)
    .accountsPartial({
      userProfile: userProfilePda,
      user: publicKey,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const createPost = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  content: string,
  imageUrl?: string
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const [userProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  // Get current post count to generate post PDA
  const programState = await program.account.programState.fetch(
    programStatePda
  );
  const postId = programState.postCount.add(new BN(1));

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), postId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const tx = await program.methods
    .createPost(content, imageUrl || null)
    .accountsPartial({
      programState: programStatePda,
      userProfile: userProfilePda,
      post: postPda,
      user: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const createCollaborationPost = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  collaborator: PublicKey,
  content: string,
  imageUrl?: string
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const [authorProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  const [collaboratorProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), collaborator.toBuffer()],
    program.programId
  );

  // Get current post count to generate post PDA
  const programState = await program.account.programState.fetch(
    programStatePda
  );
  const postId = programState.postCount.add(new BN(1)); // Fixed: increment the count

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), postId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const tx = await program.methods
    .createCollaborationPost(collaborator, content, imageUrl || null)
    .accountsPartial({
      programState: programStatePda,
      authorProfile: authorProfilePda,
      collaboratorProfile: collaboratorProfilePda,
      post: postPda,
      author: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};
//2
export const deletePost = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  postId: number
): Promise<TransactionSignature> => {
  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), new BN(postId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const [userProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .deletePost(new BN(postId))
    .accountsPartial({
      post: postPda,
      userProfile: userProfilePda,
      user: publicKey,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const likePost = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  postId: number
): Promise<TransactionSignature> => {
  const [likePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("like"),
      publicKey.toBuffer(),
      new BN(postId).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), new BN(postId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const tx = await program.methods
    .likePost(new BN(postId))
    .accountsPartial({
      like: likePda,
      post: postPda,
      user: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const unlikePost = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  postId: number
): Promise<TransactionSignature> => {
  const [likePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("like"),
      publicKey.toBuffer(),
      new BN(postId).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), new BN(postId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const tx = await program.methods
    .unlikePost(new BN(postId))
    .accountsPartial({
      like: likePda,
      post: postPda,
      user: publicKey,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};
//3
export const createComment = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  postId: number,
  content: string
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), new BN(postId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  // Get current comment count to generate comment PDA
  const programState = await program.account.programState.fetch(
    programStatePda
  );
  const commentId = programState.commentCount;

  const [commentPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("comment"), new BN(commentId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const tx = await program.methods
    .createComment(new BN(postId), content)
    .accountsPartial({
      programState: programStatePda,
      comment: commentPda,
      post: postPda,
      user: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const deleteComment = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  commentId: number
): Promise<TransactionSignature> => {
  const [commentPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("comment"), new BN(commentId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  // First fetch the comment to get the post_id
  const comment = await program.account.comment.fetch(commentPda);

  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), new BN(comment.postId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const tx = await program.methods
    .deleteComment(new BN(commentId))
    .accountsPartial({
      comment: commentPda,
      post: postPda,
      user: publicKey,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};
//4
export const followUser = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  targetUser: PublicKey
): Promise<TransactionSignature> => {
  const [followPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("follow"), publicKey.toBuffer(), targetUser.toBuffer()],
    program.programId
  );

  const [followerProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  const [followingProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), targetUser.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .followUser(targetUser)
    .accountsPartial({
      follow: followPda,
      followerProfile: followerProfilePda,
      followingProfile: followingProfilePda,
      follower: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const unfollowUser = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  targetUser: PublicKey
): Promise<TransactionSignature> => {
  const [followPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("follow"), publicKey.toBuffer(), targetUser.toBuffer()],
    program.programId
  );

  const [followerProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), publicKey.toBuffer()],
    program.programId
  );

  const [followingProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), targetUser.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .unfollowUser(targetUser)
    .accountsPartial({
      follow: followPda,
      followerProfile: followerProfilePda,
      followingProfile: followingProfilePda,
      follower: publicKey,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};
//5
export const donateToCreator = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey,
  creator: PublicKey,
  amount: number
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const [donationPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("donation"), publicKey.toBuffer(), creator.toBuffer()],
    program.programId
  );

  const [creatorProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), creator.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .donateToCreator(creator, new BN(amount))
    .accountsPartial({
      programState: programStatePda,
      donation: donationPda,
      creatorProfile: creatorProfilePda,
      donor: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

// Fetch functions for reading data
export const fetchUserProfile = async (
  program: Program<TwitterPlatform>,
  userPublicKey: PublicKey
) => {
  const [userProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), userPublicKey.toBuffer()],
    program.programId
  );

  try {
    return await program.account.userProfile.fetch(userProfilePda);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchPost = async (
  program: Program<TwitterPlatform>,
  postId: number
) => {
  const [postPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), new BN(postId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  try {
    return await program.account.post.fetch(postPda);
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const fetchAllPosts = async (program: Program<TwitterPlatform>) => {
  try {
    return await program.account.post.all();
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
};

export const fetchAllUserProfiles = async (
  program: Program<TwitterPlatform>
) => {
  try {
    return await program.account.userProfile.all();
  } catch (error) {
    console.error("Error fetching all user profiles:", error);
    return [];
  }
};

export const fetchProgramState = async (program: Program<TwitterPlatform>) => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  try {
    return await program.account.programState.fetch(programStatePda);
  } catch (error) {
    console.error("Error fetching program state:", error);
    return null;
  }
};

export const fetchUserPosts = async (
  program: Program<TwitterPlatform>,
  userPublicKey: PublicKey
) => {
  try {
    const allPosts = await program.account.post.all();
    return allPosts.filter((post) => post.account.author.equals(userPublicKey));
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};
//6
export const fetchPostComments = async (
  program: Program<TwitterPlatform>,
  postId: number
) => {
  try {
    const allComments = await program.account.comment.all();
    return allComments.filter(
      (comment) => comment.account.postId.toNumber() === postId
    );
  } catch (error) {
    console.error("Error fetching post comments:", error);
    return [];
  }
};

export const fetchUserFollows = async (
  program: Program<TwitterPlatform>,
  userPublicKey: PublicKey
) => {
  try {
    const allFollows = await program.account.follow.all();
    return allFollows.filter((follow) =>
      follow.account.follower.equals(userPublicKey)
    );
  } catch (error) {
    console.error("Error fetching user follows:", error);
    return [];
  }
};

export const fetchUserFollowers = async (
  program: Program<TwitterPlatform>,
  userPublicKey: PublicKey
) => {
  try {
    const allFollows = await program.account.follow.all();
    return allFollows.filter((follow) =>
      follow.account.following.equals(userPublicKey)
    );
  } catch (error) {
    console.error("Error fetching user followers:", error);
    return [];
  }
};

export const checkIfLiked = async (
  program: Program<TwitterPlatform>,
  userPublicKey: PublicKey,
  postId: number
): Promise<boolean> => {
  const [likePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("like"),
      userPublicKey.toBuffer(),
      new BN(postId).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  try {
    await program.account.like.fetch(likePda);
    return true;
  } catch {
    return false;
  }
};

export const checkIfFollowing = async (
  program: Program<TwitterPlatform>,
  followerPublicKey: PublicKey,
  followingPublicKey: PublicKey
): Promise<boolean> => {
  const [followPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("follow"),
      followerPublicKey.toBuffer(),
      followingPublicKey.toBuffer(),
    ],
    program.programId
  );

  try {
    await program.account.follow.fetch(followPda);
    return true;
  } catch {
    return false;
  }
};

export const initializeProgram = async (
  program: Program<TwitterPlatform>,
  publicKey: PublicKey
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  console.log(program.programId);

  const tx = await program.methods
    .initialize()
    .accountsPartial({
      programState: programStatePda,
      deployer: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};
