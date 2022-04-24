import { AnchorProvider, Wallet } from '@project-serum/anchor'
import { Connection, Keypair } from '@solana/web3.js'
import { SolanaConfig } from './get-solana-config'

export const getProvider = async (
  config: SolanaConfig
): Promise<AnchorProvider> => {
  const secretKey = await import(config.keypairPath)
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey))
  const connection = new Connection(config.rpcUrl, config.commitment)
  const wallet = new Wallet(keypair)
  return new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
}
