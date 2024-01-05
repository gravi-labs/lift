import { stringToPath } from '@cosmjs/crypto'
import {
  AccountData,
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
  OfflineSigner,
} from '@cosmjs/proto-signing'
import { Config } from './config.js'

export default async function loadAccount(
  config: Config,
  accountName: string,
): Promise<[OfflineSigner, AccountData]> {
  const configAccount = config.accounts[accountName]

  let options: Partial<DirectSecp256k1HdWalletOptions> = {
    prefix: config.account_prefix,
  }
  if (config.derivation_path) {
    options = {
      ...options,
      hdPaths: [stringToPath(config.derivation_path)],
    }
  }

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    configAccount.mnemonic,
    options,
  )
  const accounts = await wallet.getAccounts()
  const account = accounts[0]
  return [wallet, account]
}
