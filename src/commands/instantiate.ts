import fs from 'fs/promises'
import path from 'path'
import { Contract, WorkspaceContext } from '../context.js'
import { fileExists } from '../utils.js'
import runScript from './script.js'

const INSTANTIATE_MSGS_DIR = 'instantiate-msgs'

async function getJSONInstantiateMsg(
  contract: Contract,
): Promise<unknown | null> {
  const instantiateMsgBase = path.join(contract.path, INSTANTIATE_MSGS_DIR)
  const instantiateMsgPath = path.join(
    instantiateMsgBase,
    `${contract.instance}.json`,
  )

  try {
    const msgData = await fs.readFile(instantiateMsgPath, 'utf8')
    return JSON.parse(msgData)
  } catch (err) {
    const cwd = process.cwd()
    console.error(err)
    console.log(
      `You must specify instantiate message JSON at ${path.relative(
        cwd,
        instantiateMsgPath,
      )} or JS script that generates JSON message at ${path.relative(
        cwd,
        path.join(instantiateMsgBase, `${contract.instance}.js`),
      )}, for more info check README`,
    )
    return null
  }
}

async function getJSInstantiateMsg(
  context: WorkspaceContext,
  contract: Contract,
): Promise<unknown | null> {
  const instantiateMsgScriptPath = path.join(
    contract.path,
    INSTANTIATE_MSGS_DIR,
    `${contract.instance}.js`,
  )
  const exists = await fileExists(instantiateMsgScriptPath)
  if (!exists) {
    return null
  }

  try {
    const msg = await runScript<unknown>(
      context,
      contract,
      instantiateMsgScriptPath,
    )
    return msg
  } catch (err) {
    console.error(err)
    return null
  }
}

export default async function instantiate(
  context: WorkspaceContext,
  contract: Contract,
) {
  let msg = await getJSInstantiateMsg(context, contract)
  if (!msg) {
    msg = await getJSONInstantiateMsg(contract)
    if (!msg) {
      return
    }
  }

  const codeId = contract.state.code_id
  const res = await context.client.instantiate(
    context.account.address,
    codeId,
    msg,
    contract.name,
    'auto',
  )
  await contract.addContractAddress(res.contractAddress)
  console.log(`Instantiated contract address: ${res.contractAddress}`)
}
