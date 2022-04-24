import { GluegunToolbox } from 'gluegun'
import { getProgram, getSolanaConfig, getProvider } from '../utils'
import { getBoard, getBoardVault } from '../state'

module.exports = {
  name: 'get-board',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const config = await getSolanaConfig()
    const provider = await getProvider(config)
    const program = getProgram(provider)

    const boardId = parameters.first
    const board = await getBoard(program, parseInt(boardId, 10))

    if (board === null) {
      info(`Board not found.`)
      return
    }

    const boardVault = await getBoardVault(
      program,
      board.publicKey,
      board.boardVaultBump
    )

    info(`Board ID: ${boardId}`)
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
