import { GluegunToolbox } from 'gluegun'
import { getProgram, getSolanaConfig, getProvider } from '../utils'
import { Octokit } from '@octokit/rest'
import { getBounty, getBountyVault } from '../state'

module.exports = {
  name: 'get-bounty',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const octokit = new Octokit()
    const config = await getSolanaConfig()
    const provider = await getProvider(config)
    const program = getProgram(provider)

    const [owner, repoName, bountyId] = parameters.first.split('/')
    const repo = await octokit.rest.repos.get({ owner, repo: repoName })
    const boardId = repo.data.id
    const bounty = await getBounty(program, boardId, parseInt(bountyId))

    if (bounty === null) {
      info(`Bounty not found.`)
      return
    }

    const bountyVault = await getBountyVault(
      program,
      boardId,
      parseInt(bountyId)
    )

    info(`Bounty: ${owner}/${repoName}/${boardId} (${bountyId})`)
    info(`Bounty Public Key: ${bounty.publicKey}`)
    info(`Bounty Bump: ${bounty.bountyBump}`)
    info(`Bounty Hunter: ${bounty.bountyHunter}`)
    info(`Bounty Vault ATA: ${bountyVault.address.toBase58()}`)
    info(`Bounty Vault Amount: ${bountyVault.amount.toString()}`)
    info(`Bounty Vault Bump: ${bounty.bountyVaultBump}`)
    if (bounty.isClosed) {
      info(`Bounty Closed At: ${bounty.closedAt}`)
    }
  },
}
