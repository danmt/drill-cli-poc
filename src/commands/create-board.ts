import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { GluegunToolbox } from 'gluegun'
import { getProgram, getSolanaConfig, getProvider } from '../utils'

module.exports = {
  name: 'create-board',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const config = await getSolanaConfig()
    const provider = await getProvider(config)
    const program = getProgram(provider)

    const boardId = parameters.first
    const lockTime = parameters.second
    const acceptedMint = parameters.third

    info(`Creating board ${boardId}`)

    const signature = await program.methods
      .initializeBoard(parseInt(boardId, 10), new BN(lockTime))
      .accounts({
        acceptedMint: new PublicKey(acceptedMint),
        authority: provider.wallet.publicKey,
      })
      .rpc()

    info(`Confirming signature: ${signature}`)

    await provider.connection.confirmTransaction(signature, 'confirmed')

    info(`Board (ID:${boardId}) created.`)
  },
}
