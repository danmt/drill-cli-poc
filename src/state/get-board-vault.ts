import { Program } from '@project-serum/anchor'
import { Account, getAccount } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { DrillProgramPoc } from '../program/drill_program_poc'

export const getBoardVault = async (
  program: Program<DrillProgramPoc>,
  boardPublicKey: PublicKey,
  bump: number
): Promise<Account> => {
  const boardVaultPublicKey = await PublicKey.createProgramAddress(
    [
      Buffer.from('board_vault', 'utf8'),
      boardPublicKey.toBuffer(),
      new Uint8Array([bump]),
    ],
    program.programId
  )
  return await getAccount(program.provider.connection, boardVaultPublicKey)
}
