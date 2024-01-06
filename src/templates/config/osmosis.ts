import { Config } from '../../config.js'
import type { DeepPartial } from '../../types.js'

const config: DeepPartial<Config> = {
  gas_price: '0.025uosmo',
  account_prefix: 'osmo',
  networks: {
    local: {
      chain_id: 'localosmosis',
      network_variant: 'Local',
      rpc_endpoint: 'http://localhost:26657',
    },
    testnet: {
      chain_id: 'osmo-test-5',
      network_variant: 'Shared',
      rpc_endpoint: 'https://rpc.osmotest5.osmosis.zone',
    },
    mainnet: {
      chain_id: 'osmosis-1',
      network_variant: 'Shared',
      rpc_endpoint: 'https://rpc.osmosis.zone:443',
    },
  },
  accounts: {
    test1: {
      mnemonic:
        'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
    },
    test2: {
      mnemonic:
        'quality vacuum heart guard buzz spike sight swarm shove special gym robust assume sudden deposit grid alcohol choice devote leader tilt noodle tide penalty',
    },
    test3: {
      mnemonic:
        'symbol force gallery make bulk round subway violin worry mixture penalty kingdom boring survey tool fringe patrol sausage hard admit remember broken alien absorb',
    },
    test4: {
      mnemonic:
        'bounce success option birth apple portion aunt rural episode solution hockey pencil lend session cause hedgehog slender journey system canvas decorate razor catch empty',
    },
    test5: {
      mnemonic:
        'second render cat sing soup reward cluster island bench diet lumber grocery repeat balcony perfect diesel stumble piano distance caught occur example ozone loyal',
    },
  },
}
export default config
