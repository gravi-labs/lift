import { SpawnOptionsWithoutStdio, spawn as spawnCallback } from 'child_process'
import fs from 'fs/promises'

export function spawn(
  command: string,
  args?: readonly string[],
  options?: SpawnOptionsWithoutStdio,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawnCallback(command, args, options)
    child.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    child.stderr.on('data', (data) => {
      console.error(data.toString())
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

export async function fileExists(file: string) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

export async function ensureDirExists(dir: string) {
  try {
    await fs.access(dir, fs.constants.F_OK)
  } catch {
    await fs.mkdir(dir)
  }
}
