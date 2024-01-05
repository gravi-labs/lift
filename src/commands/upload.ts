import fs from 'fs/promises'
import { Contract, WorkspaceContext } from '../context.js'

export default async function upload(
  context: WorkspaceContext,
  contract: Contract,
) {
  const artifact = await fs.readFile(contract.artifactPath)
  const res = await context.client.upload(
    context.account.address,
    artifact,
    'auto',
    contract.name,
  )
  await contract.addCodeId(res.codeId)
  console.log(`Uploaded contract code id: ${res.codeId}`)
}
