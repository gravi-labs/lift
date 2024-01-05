import { Contract, WorkspaceContext } from '../context.js'

export default async function execute(
  context: WorkspaceContext,
  contract: Contract,
  msg: string,
) {
  const res = await context.client.execute(
    context.account.address,
    contract.address,
    JSON.parse(msg),
    'auto',
  )
  console.log(`Message executed, events:`, JSON.stringify(res.events, null, 4))
}
