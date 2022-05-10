import { BN, Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { DrillProgramPoc } from '../program/drill_program_poc'

export interface Bounty {
  publicKey: PublicKey
  boardId: number
  bountyBump: number
  bountyHunter: string | null
  id: number
  bountyVaultBump: number
  claimedAt: Date | null
  closedAt: Date | null
  isClaimed: boolean
  isClosed: boolean
}

export const getBounty = async (
  program: Program<DrillProgramPoc>,
  boardId: number,
  bountyId: number
): Promise<Bounty | null> => {
  const [boardPublicKey] = await PublicKey.findProgramAddress(
    [
      Buffer.from('board', 'utf8'),
      new BN(boardId).toArrayLike(Buffer, 'le', 4),
    ],
    program.programId
  )
  const [bountyPublicKey] = await PublicKey.findProgramAddress(
    [
      Buffer.from('bounty', 'utf8'),
      boardPublicKey.toBuffer(),
      new BN(bountyId).toArrayLike(Buffer, 'le', 4),
    ],
    program.programId
  )
  const bountyAccount = await program.account.bounty.fetchNullable(
    bountyPublicKey
  )

  if (bountyAccount === null) {
    return null
  }

  return {
    publicKey: bountyPublicKey,
    boardId: bountyAccount.boardId,
    id: bountyAccount.bountyId,
    bountyBump: bountyAccount.bountyBump,
    bountyHunter: bountyAccount.bountyHunter,
    bountyVaultBump: bountyAccount.bountyVaultBump,
    claimedAt: bountyAccount.claimedAt
      ? new Date(bountyAccount.claimedAt.toNumber() * 1000)
      : null,
    closedAt: bountyAccount.closedAt
      ? new Date(bountyAccount.closedAt.toNumber() * 1000)
      : null,
    isClaimed: bountyAccount.isClaimed,
    isClosed: bountyAccount.isClosed,
  }
}
