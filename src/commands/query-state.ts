import { Model } from 'cosmjs-types/cosmwasm/wasm/v1/types'
import { Contract, WorkspaceContext } from '../context.js'

function deserializeState(acc: Record<string, string>, model: Model) {
  const key = Buffer.from(model.key).toString()
  acc[key] = Buffer.from(model.value).toString()
  return acc
}

export default async function queryState(
  context: WorkspaceContext,
  contract: Contract,
) {
  const data = await context.client.getAllContractState(contract.address)
  console.log(data.models.reduce(deserializeState, {}))
}
