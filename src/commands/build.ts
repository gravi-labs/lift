import path from 'path'
import { WorkspaceContext } from '../context.js'
import { spawn } from '../utils.js'

export function optimize(optimizerVersion: string): Promise<void> {
  const cwd = process.cwd()
  const basename = path.basename(cwd)
  return spawn('docker', [
    'run',
    '--rm',
    '-v',
    `${cwd}:/code`,
    '--mount',
    `type=volume,source=${basename}_cache,target=/code/target`,
    '--mount',
    'type=volume,source=registry_cache,target=/usr/local/cargo/registry1',
    `cosmwasm/workspace-optimizer:${optimizerVersion}`,
  ])
}

export default async function build(context: WorkspaceContext) {
  await optimize(context.config.wasm.optimizer_version)
}
