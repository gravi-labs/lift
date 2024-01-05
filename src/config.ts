import fs from 'fs/promises'
import toml from 'toml'
import { z } from 'zod'

export const CONFIG_NAME = 'Lift.toml'

function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
      return [key, undefined]
    }),
  )
}

export const NetworkVariant = z.enum(['Local', 'Shared'])
export type NetworkVariant = z.infer<typeof NetworkVariant>

const Network = z.object({
  chain_id: z.string(),
  network_variant: NetworkVariant,
  rpc_endpoint: z.string(),
})
export type Network = z.infer<typeof Network>

const Account = z.object({
  mnemonic: z.string(),
})
export type Account = z.infer<typeof Account>

const Wasm = z.object({
  contract_dir: z.string().default('contracts'),
  optimizer_version: z.string().default('0.12.13'),
})

export type Wasm = z.infer<typeof Wasm>

const TsCodegen = z.object({
  out_path: z.string().default('app/src/contracts'),
  contracts: z.string().array(),
})
export type TsCodegen = z.infer<typeof TsCodegen>

const Config = z.object({
  name: z.string(),
  gas_price: z.string(),
  account_prefix: z.string(),
  derivation_path: z.string().optional(),
  networks: z.record(z.string(), Network),
  accounts: z.record(z.string(), Account),
  wasm: Wasm.default(getDefaults(Wasm)),
  'ts-gen': TsCodegen,
})

export type Config = z.infer<typeof Config>

export default async function loadConfig(): Promise<Config> {
  const configStr = await fs.readFile(`./${CONFIG_NAME}`, 'utf8')
  try {
    return Config.parse(toml.parse(configStr))
  } catch (err) {
    console.error('Config parsing error')
    throw err
  }
}
