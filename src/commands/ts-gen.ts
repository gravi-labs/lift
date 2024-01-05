import { TSBuilder, TSBuilderOptions } from '@cosmwasm/ts-codegen'
import { pascalCase } from 'change-case'
import { Contract, WorkspaceContext } from '../context.js'
import { schema } from './cargo.js'

const CODEGEN_DEFAULT_OPTIONS: TSBuilderOptions = {
  bundle: {
    bundleFile: 'index.ts',
    scope: 'contracts',
  },
  types: {
    enabled: true,
  },
  client: {
    enabled: true,
  },
  reactQuery: {
    enabled: true,
    optionalClient: true,
    version: 'v4',
    mutations: true,
    queryKeys: true,
    queryFactory: true,
  },
  recoil: {
    enabled: false,
  },
  messageComposer: {
    enabled: false,
  },
  messageBuilder: {
    enabled: false,
  },
  useContractsHooks: {
    enabled: false,
  },
}

export default async function tsGen(context: WorkspaceContext) {
  const { contracts: contractNames } = context.config['ts-gen']
  const contracts = contractNames.map((name) => new Contract(context, name))

  for (const contract of contracts) {
    await schema(contract.path)
  }

  const builder = new TSBuilder({
    contracts: contracts.map((contract) => ({
      name: pascalCase(contract.name),
      dir: contract.schemaPath,
    })),
    outPath: context.config['ts-gen'].out_path,
    options: CODEGEN_DEFAULT_OPTIONS,
  })
  await builder.build()
}
