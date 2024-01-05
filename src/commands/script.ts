import { Contract, WorkspaceContext } from '../context.js'

export interface Script<T> {
  default: (
    context: WorkspaceContext,
    contract: Contract | undefined,
  ) => Promise<T>
}

function loadScript<T>(scriptPath: string): Promise<Script<T>> {
  return import(scriptPath)
}

export default async function runScript<T = void>(
  context: WorkspaceContext,
  contract: Contract | undefined,
  scriptPath: string,
) {
  const script = await loadScript<T>(scriptPath)
  return script.default(context, contract)
}
