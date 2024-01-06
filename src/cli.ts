#!/usr/bin/env node
import { program } from 'commander'
import fs from 'fs'
import path from 'path'
import build from './commands/build.js'
import execute from './commands/execute.js'
import init from './commands/init.js'
import instantiate from './commands/instantiate.js'
import queryState from './commands/query-state.js'
import query from './commands/query.js'
import runScript from './commands/script.js'
import {
  TASK_TEMPLATE_CONTRACT,
  createTask,
  getTasksPath,
} from './commands/task.js'
import tsGen from './commands/ts-gen.js'
import upload from './commands/upload.js'
import {
  ContractOptions,
  WorkspaceOptions,
  createContext,
  getContract,
} from './context.js'
import { contractCommand, workspaceCommand } from './task.js'

interface QueryOptions extends ContractOptions {
  msg: string
}

interface ExecuteOptions extends ContractOptions {
  msg: string
}

process.on('uncaughtException', (err) => {
  console.error(err.message)
  process.exit(1)
})

program.name('lift').version('0.1.0')

program
  .command('init <CHAIN>')
  .description('Initialize config')
  .action(async (chain: string) => {
    init(chain)
  })

workspaceCommand(program.command('build'))
  .description('Build and optimize workspace contracts')
  .action(async (options: WorkspaceOptions) => {
    const context = await createContext(options)
    build(context)
  })

workspaceCommand(program.command('upload <CONTRACT>'))
  .description('Upload contract')
  .action(async (contractName: string, options: ContractOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    upload(context, contract)
  })

contractCommand(program.command('instantiate'))
  .description('Instantiate contract')
  .action(async (contractName: string, options: ContractOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    instantiate(context, contract)
  })

contractCommand(program.command('execute'))
  .description('Execute contract message')
  .requiredOption('-m, --msg <MSG>', 'execute message')
  .action(async (contractName: string, options: ExecuteOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    execute(context, contract, options.msg)
  })

contractCommand(program.command('query'))
  .description('Query data from contract')
  .requiredOption('-m, --msg <MSG>', 'query message')
  .action(async (contractName: string, options: QueryOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    query(context, contract, options.msg)
  })

contractCommand(program.command('state'))
  .description('Dump contract state')
  .action(async (contractName: string, options: ContractOptions) => {
    const context = await createContext(options)
    const contract = getContract(context, contractName, options)
    queryState(context, contract)
  })

workspaceCommand(program.command('ts-gen'))
  .description('Generate TypeScript type definitions and clients')
  .action(async (options: ContractOptions) => {
    const context = await createContext(options)
    tsGen(context)
  })

workspaceCommand(program.command('script <SCRIPT> [CONTRACT]'))
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

program
  .command('task:new <NAME>')
  .description('Create new task')
  .action(async (name: string) => {
    createTask(name)
  })

program
  .command('task:new:contract <NAME>')
  .description('Create new contract task')
  .action(async (name: string) => {
    createTask(name, TASK_TEMPLATE_CONTRACT)
  })

const taskRunCommand = program.command('task:run').description('Run task')

const tasksPath = getTasksPath()
if (fs.existsSync(tasksPath)) {
  const ext = '.js'
  for (const taskFileName of fs.readdirSync(tasksPath)) {
    if (taskFileName.endsWith(ext)) {
      const taskName = path.basename(taskFileName, ext)
      taskRunCommand.command(taskName, `${taskName} task`, {
        executableFile: path.join(tasksPath, taskFileName),
      })
    }
  }
}

program.parseAsync()
