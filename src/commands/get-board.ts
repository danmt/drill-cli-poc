import { GluegunToolbox } from 'gluegun'
import { getProgram, getSolanaConfig, getProvider } from '../utils'
import { getBoard, getBoardVault } from '../state'
import { Octokit } from '@octokit/rest'

module.exports = {
  name: 'get-board',
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
    const repo = await octokit.rest.repos.get({ owner, repo: repoName })
    const boardId = repo.data.id
    const board = await getBoard(program, boardId)

    if (board === null) {
      info(`Board not found.`)
      return
    }

    const boardVault = await getBoardVault(program, boardId)

    info(`Board: "${owner}/${repoName}" (${boardId})`)
    info(`Board Public Key: ${board.publicKey}`)
    info(`Authority: ${board.authority}`)
    info(`Accepted Mint: ${board.acceptedMint}`)
    info(`Lock Time (ms): ${board.lockTime.toString()}`)
    info(`Board Bump: ${board.boardBump}`)
    info(`Board Vault ATA: ${boardVault.address.toBase58()}`)
    info(`Board Vault Amount: ${boardVault.amount.toString()}`)
    info(`Board Vault Bump: ${board.boardVaultBump}`)
  },
}
