'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { getClusterURL } from '@/utils/helpers'

// Default styles that can be overridden by your app

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const network = WalletAdapterNetwork.Devnet
  const cluster = process.env.NEXT_PUBLIC_CLUSTER || 'devnet'
  
  const endpoint = useMemo(() => {
    // Use custom RPC URL if available, otherwise fall back to default
    if (process.env.NEXT_PUBLIC_RPC_URL) {
      return process.env.NEXT_PUBLIC_RPC_URL
    }
    
    // Try to get cluster URL, fallback to clusterApiUrl
    try {
      return getClusterURL(cluster)
    } catch (error) {
      console.warn('Failed to get cluster URL, using default:', error)
      return clusterApiUrl(network)
    }
  }, [network, cluster])

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}