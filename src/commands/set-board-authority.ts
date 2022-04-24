import { PublicKey } from '@solana/web3.js'
import { GluegunToolbox } from 'gluegun'
import { getProgram, getSolanaConfig, getProvider } from '../utils'

module.exports = {
  name: 'set-board-authority',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const config = await getSolanaConfig()
    const provider = await getProvider(config)
    const program = getProgram(provider)

    const boardId = parameters.first
    const newAuthority = parameters.second

    info(`Set board authority ${boardId}`)

    const signature = await program.methods
      .setBoardAuthority(parseInt(boardId, 10))
      .accounts({
        authority: provider.wallet.publicKey,
        newAuthority: new PublicKey(newAuthority),
      })
      .rpc()

    info(`Confirming signature: ${signature}`)

    await provider.connection.confirmTransaction(signature, 'confirmed')

    info(`${newAuthority} is the new Auhority of Board (ID:${boardId}).`)
  },
}
