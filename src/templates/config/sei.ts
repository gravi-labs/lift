import { Config } from '../../config.js'
import type { DeepPartial } from '../../types.js'

const config: DeepPartial<Config> = {
  gas_price: '0.01usei',
  account_prefix: 'sei',
  networks: {
    local: {
      chain_id: 'sei-chain',
      network_variant: 'Local',
      rpc_endpoint: 'http://localhost:26657',
    },
    testnet: {
      chain_id: 'atlantic-2',
      network_variant: 'Shared',
      rpc_endpoint: 'https://rpc.atlantic-2.seinetwork.io',
    },
    mainnet: {
      chain_id: 'pacific-1',
      network_variant: 'Shared',
      rpc_endpoint: 'https://sei-rpc.polkachu.com',
    },
  },
  accounts: {
    test1: {
      mnemonic: '',
    },
  },
}
export default config
