# Lift

The aim of Lift is to have unified and chain agnostic tool that helps with local development and production deployment of CosmWasm smart contracts and dApps.

## Commands

```
Usage: lift [options] [command]

Options:
  -V, --version                         output the version number
  -h, --help                            display help for command

Commands:
  init <CHAIN>                          Initialize config
  build [options]                       Build and optimize workspace contracts
  upload [options] <CONTRACT>           Upload contract
  instantiate [options] <CONTRACT>      Instantiate contract
  execute [options] <CONTRACT>          Execute contract message
  query [options] <CONTRACT>            Query data from contract
  state [options] <CONTRACT>            Dump contract state
  ts-gen [options]                      Generate TypeScript type definitions and clients
  script [options] <SCRIPT> [CONTRACT]  Run a script with workspace context and optionally contract
  task:new <name>                       Create new task
  task:new:contract <name>              Create new contract task
  task:run                              Run task
  help [command]                        display help for command
```

General arguments for most of the commands:

* `-n / --network <NETWORK_NAME>`: Name of the network to use, based on networks defined in Lift.toml config (default: `local`)
* `-a / --account <ACCOUNT_NAME>`: Name of the account to use as transaction signer, based on accounts defined in Lift.toml config (default: first account defined in Lift.toml config)


### `lift init <CHAIN>`

Initialize lift config

Arguments:

* `<CHAIN>` Chain name - sei, osmosis, neutron, injective


### `lift build`

Build and optimize workspace contracts


### `lift upload <CONTRACT>`

Upload contract to the chain

Arguments:

* `<CONTRACT>` Name of the contract to upload


### `lift instantiate <CONTRACT>`

Instantiate contract

Arguments:

* `<CONTRACT>` Name of the contract to instantiate
* `-i / --instance <CONTRACT_INSTANCE>`: Contract instance name, could be used in case you want to create more than one contract instance (default: `default`)


### `lift execute <CONTRACT>`

Execute contract message

Arguments:

* `<CONTRACT>` Name of the contract 
* `-m / --msg <MSG>`: Execute message
* `-i / --instance <CONTRACT_INSTANCE>`: Contract instance name (default: `default`)


### `lift query <CONTRACT>`

Query data from contract

Arguments:

* `<CONTRACT>` Name of the contract 
* `-m / --msg <MSG>`: Query message
* `-i / --instance <CONTRACT_INSTANCE>`: Contract instance name (default: `default`)


### `lift state <CONTRACT>`

Dump contract state

Arguments:

* `<CONTRACT>` Name of the contract 
* `-i / --instance <CONTRACT_INSTANCE>`: Contract instance name (default: `default`)


### `lift ts-gen`

Generate TypeScript type definitions and clients based on contracts defined in the `Lift.toml` config, `[ts-gen]` section


### `lift task:new <NAME>`

Create new task

Arguments:

* `<NAME>` Task name


### `lift task:new:contract <NAME>`

Create new contract task

Arguments:

* `<NAME>` Task name


### `lift task:run <NAME> [CONTRACT]`

Run task

Arguments:

* `<NAME>` Task name
* `[CONTRACT]` Optional contract name

## Configuration

### Lift.toml

```toml
name = 'the-game'
gas_price = '0.01usei'
account_prefix = 'sei'

[networks.local]
chain_id = 'sei-chain'
network_variant = 'Local'
rpc_endpoint = 'http://localhost:26657'

[networks.testnet]
chain_id = 'atlantic-2'
network_variant = 'Shared'
rpc_endpoint = 'https://rpc.atlantic-2.seinetwork.io'

[networks.mainnet]
chain_id = 'pacific-1'
network_variant = 'Shared'
rpc_endpoint = 'https://sei-rpc.polkachu.com'

[accounts.test1]
mnemonic = 'famous vast bullet upgrade dynamic raven help mistake omit enrich kitchen learn clutch code rule wood cream crystal work enable hamster ticket general mouse'

[accounts.test2]
mnemonic = 'primary trash mirror husband food sand lake razor expire pair ocean tackle carpet offer regret space small fantasy fiscal orphan coral key panda void'

[wasm]
contract_dir = 'contracts'
optimizer_version = '0.12.13'

[ts-gen]
out_path = 'app/src/contracts'
contracts = ["counter", "the-game"]
```

## State

State is stored in `.lift` folder of your repository.

Local state is stored in `.lift/state.local.json` file and it's recommend to add `state.local.json` file to `.gitignore` since it's machine specific.

Shared state is stored in `.lift/state.json` file

## Tasks

Lift supports custom tasks for implementing custom logic or executing multiple commands.
Tasks are located in the `tasks` folder of your repository.

### General Task

```js
import { task } from '@gravi-labs/lift'

task((context) => {
  console.log('Hello from task!')
})
```

### Contract task

```js
import { contractTask } from '@gravi-labs/lift'

contractTask((context, contract) => {
  console.log('Hello from contract task!')
})
```

### Task with custom command line arguments

```js
import { task, workspaceCommand } from '@gravi-labs/lift'

const command = workspaceCommand()
command.option('-l, --log', 'log')

task(command, (context) => {
  const options = command.opts()
  if (options.log) {
    console.log('Hello from task!')
  }
})
```

## TODO

- app template - scaffold a template smart contract and frontend
- integrate chain-registry (https://github.com/cosmos/chain-registry)
- interactive console
- multichain dApp support
- plugins
    - load tasks from plugin
    - load other smart contracts (nft, dex, money market)
    - load mainnet / testnet contract state 