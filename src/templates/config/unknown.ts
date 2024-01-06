import { Config } from '../../config.js'
import type { DeepPartial } from '../../types.js'

const config: DeepPartial<Config> = {
  gas_price: '',
  account_prefix: '',
  networks: {
    local: {
      chain_id: '',
      network_variant: 'Local',
      rpc_endpoint: 'http://localhost:26657',
    },
    testnet: {
      chain_id: '',
      network_variant: 'Shared',
      rpc_endpoint: '',
    },
    mainnet: {
      chain_id: '',
      network_variant: 'Shared',
      rpc_endpoint: '',
    },
  },
  accounts: {
    test1: {
      mnemonic: '',
    },
  },
}
export default config
