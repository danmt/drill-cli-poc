import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { GluegunToolbox } from 'gluegun'
import { getProgram, getSolanaConfig, getProvider } from '../utils'
import { Octokit } from '@octokit/rest'

module.exports = {
  name: 'create-board',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const octokit = new Octokit()
    const config = await getSolanaConfig()
    const provider = await getProvider(config)
    const program = getProgram(provider)

    const [owner, repoName] = parameters.first.split('/')
    const lockTime = parameters.second
    const acceptedMint = parameters.third

    const repo = await octokit.rest.repos.get({ owner, repo: repoName })
    const boardId = repo.data.id

    info(`Creating board "${owner}/${repoName}" (${boardId}).`)

    const signature = await program.methods
      .initializeBoard(boardId, new BN(lockTime))
      .accounts({
        acceptedMint: new PublicKey(acceptedMint),
        authority: provider.wallet.publicKey,
      })
      .rpc()

    info(`Confirming signature: ${signature}`)

    await provider.connection.confirmTransaction(signature, 'confirmed')

    info(`Board "${owner}/${repoName}" (${boardId}).`)
  },
}
