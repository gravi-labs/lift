import { Contract, WorkspaceContext } from '../context.js'

export default async function query(
  context: WorkspaceContext,
  contract: Contract,
  msg: string,
) {
  const res = await context.client.queryContractSmart(
    contract.address,
    JSON.parse(msg),
  )
  console.log(res)
}
