export function truncateAddress(address: string): string {
  if (!address) {
    throw new Error('Invalid address')
  }

  const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`
  return truncated
}

export const getClusterURL = (cluster: string): string => {
  const clusterUrls: Record<string, string> = {
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
    'testnet': 'https://api.testnet.solana.com',
    'devnet': process.env.NEXT_PUBLIC_SHYFT_API_KEY && process.env.NEXT_PUBLIC_SHYFT_API_KEY !== 'your_shyft_api_key_here'
      ? `https://devnet-rpc.shyft.to?api_key=${process.env.NEXT_PUBLIC_SHYFT_API_KEY}`
      : 'https://api.devnet.solana.com',
    'localhost': 'http://127.0.0.1:8899',
  }

  return clusterUrls[cluster] || clusterUrls['devnet']
}
