import { writeFile } from 'fs/promises'
import json2toml from 'json2toml'
import path from 'path'
import { CONFIG_NAME } from '../config.js'
import { ensureStateDirExists } from '../state.js'
import getTemplate from '../templates/config/index.js'

export default async function init(chain: string) {
  const template = getTemplate(chain)
  template.name = path.basename(process.cwd())
  template['ts-gen'] = { contracts: [] }
  const toml = json2toml(template, { newlineAfterSection: true })
  await writeFile(path.join(process.cwd(), CONFIG_NAME), toml.trim())
  await ensureStateDirExists()
}
