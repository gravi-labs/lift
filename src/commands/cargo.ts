import { spawn } from '../utils.js'

export function schema(contractPath: string): Promise<void> {
  return spawn('cargo', ['schema'], { cwd: contractPath })
}
