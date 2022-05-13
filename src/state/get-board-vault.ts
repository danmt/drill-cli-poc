import { BN, Program } from '@project-serum/anchor'
import { Account, getAccount } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { Drill } from '../program/drill'

export const getBoardVault = async (
  program: Program<Drill>,
  boardId: number
): Promise<Account> => {
  const [boardPublicKey] = await PublicKey.findProgramAddress(
    [
      Buffer.from('board', 'utf8'),
      new BN(boardId).toArrayLike(Buffer, 'le', 4),
    ],
    program.programId
  )
  const [boardVaultPublicKey] = await PublicKey.findProgramAddress(
    [Buffer.from('board_vault', 'utf8'), boardPublicKey.toBuffer()],
    program.programId
  )
  return await getAccount(program.provider.connection, boardVaultPublicKey)
}
