import { GasPrice } from '@cosmjs/stargate'
import { Command, program } from 'commander'
import path from 'path'
import loadAccount from './account.js'
import build from './commands/build.js'
import execute from './commands/execute.js'
import init from './commands/init.js'
import instantiate from './commands/instantiate.js'
import queryState from './commands/query-state.js'
import query from './commands/query.js'
import runScript from './commands/script.js'
import tsGen from './commands/ts-gen.js'
import upload from './commands/upload.js'
import loadConfig from './config.js'
import { Contract, WorkspaceContext } from './context.js'
import ExtendedClient from './extended-client.js'
import loadState from './state.js'

interface WorkspaceOptions {
  network: string
  account?: string
}

interface ContractOptions extends WorkspaceOptions {
  instance: string
}

interface QueryOptions extends ContractOptions {
  msg: string
}

interface ExecuteOptions extends ContractOptions {
  msg: string
}

async function createContext(
  options: WorkspaceOptions,
): Promise<WorkspaceContext> {
  // load config
  const config = await loadConfig()
  const network = config.networks[options.network]

  // load state
  const state = await loadState(network.network_variant)

  if (!options.account) {
    options.account = Object.keys(config.accounts)[0]
  }

  // load account
  const [signer, account] = await loadAccount(config, options.account)

  // connect client
  const client = await ExtendedClient.connectWithSigner(
    network.rpc_endpoint,
    signer,
    { gasPrice: GasPrice.fromString(config.gas_price) },
  )

  // create context
  return new WorkspaceContext(
    options.network,
    config,
    state,
    signer,
    account,
    client,
  )
}

function getContract(
  context: WorkspaceContext,
  contractName: string,
  options: ContractOptions,
) {
  return new Contract(context, contractName, options.instance)
}

process.on('uncaughtException', (err) => {
  console.error(err.message)
  process.exit(1)
})

program.name('lift').version('0.1.0')

function defineWorkspaceCommand(command: Command) {
  command.option(
    '-n, --network <NETWORK_NAME>',
    'Name of the network to use',
    'local',
  )
  command.option(
    '-a, --account <ACCOUNT_NAME>',
    'Name of the account to use as transaction signer',
  )
  return command
}

function defineContractCommand(command: Command) {
  defineWorkspaceCommand(command)
  command.option(
    '-i, --instance <CONTRACT_INSTANCE>',
    'Contract instance name',
    'default',
  )
  return command
}

program
  .command('init <CHAIN>')
  .description('Initialize config')
  .action(async (chain: string) => {
    init(chain)
  })

defineWorkspaceCommand(program.command('build'))
  .description('Build and optimize workspace contracts')
  .action(async (options: WorkspaceOptions) => {
    const context = await createContext(options)
    build(context)
  })

defineWorkspaceCommand(program.command('upload <CONTRACT>'))
  .description('Upload contract')
  .action(async (contractName: string, options: ContractOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    upload(context, contract)
  })

defineContractCommand(program.command('instantiate <CONTRACT>'))
  .description('Instantiate contract')
  .action(async (contractName: string, options: ContractOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    instantiate(context, contract)
  })

defineContractCommand(program.command('execute <CONTRACT>'))
  .description('Execute contract message')
  .requiredOption('-m, --msg <MSG>', 'execute message')
  .action(async (contractName: string, options: ExecuteOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    execute(context, contract, options.msg)
  })

defineContractCommand(program.command('query <CONTRACT>'))
  .description('Query data from contract')
  .requiredOption('-m, --msg <MSG>', 'query message')
  .action(async (contractName: string, options: QueryOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    query(context, contract, options.msg)
  })

defineContractCommand(program.command('state <CONTRACT>'))
  .description('Dump contract state')
  .action(async (contractName: string, options: ContractOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    queryState(context, contract)
  })

defineWorkspaceCommand(program.command('ts-gen'))
  .description('Generate TypeScript type definitions and clients')
  .action(async (options: ContractOptions) => {
    const context = await createContext(options)
    tsGen(context)
  })

defineWorkspaceCommand(program.command('script <SCRIPT> [CONTRACT]'))
  .description('Run a script with workspace context and optionally contract')
  .action(
    async (
      scriptPath: string,
      contractName: string | undefined,
      options: ContractOptions,
    ) => {
      const context = await createContext(options)
      const contract = contractName
        ? getContract(context, contractName, options)
        : undefined
      runScript(context, contract, path.join(process.cwd(), scriptPath))
    },
  )

program.parse()
