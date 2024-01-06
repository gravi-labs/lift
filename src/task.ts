import { Command } from 'commander'
import {
  Contract,
  ContractOptions,
  WorkspaceContext,
  createContext,
  getContract,
} from './context.js'

export function workspaceCommand(command?: Command) {
  if (!command) {
    command = new Command()
  }
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

export function contractCommand(command?: Command) {
  if (!command) {
    command = new Command()
  }
  command.argument('<CONTRACT>')
  workspaceCommand(command)
  command.option(
    '-i, --instance <CONTRACT_INSTANCE>',
    'Contract instance name',
    'default',
  )
  return command
}

type TaskFn = (context: WorkspaceContext, contract?: Contract) => void

export async function task(command: Command | TaskFn, taskFn: TaskFn) {
  if (typeof command === 'function') {
    taskFn = command
    command = workspaceCommand()
  }

  command.parse(process.argv)
  const options = command.opts<ContractOptions>()
  const context = await createContext({
    network: options.network,
    account: options.account,
  })

  if (options.instance && command.args.length > 0) {
    const contract = getContract(context, command.args[0], options)
    taskFn(context, contract)
    return
  }

  taskFn(context)
}

export function contractTask(command: Command | TaskFn, taskFn: TaskFn) {
  if (typeof command === 'function') {
    taskFn = command
    command = contractCommand()
  }
  return task(command, taskFn)
}
