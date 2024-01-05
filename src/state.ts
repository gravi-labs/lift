import fs from 'fs/promises'
import path from 'path'
import { NetworkVariant } from './config.js'
import { ensureDirExists, fileExists } from './utils.js'

const STATE_DIR = '.lift'
const STATE_FILE_LOCAL = 'state.local.json'
const STATE_FILE_SHARED = 'state.json'

type ContractAddress = string

export interface ContractState {
  code_id: number
  addresses: Record<string, ContractAddress>
}

function getStatePath(networkVariant: NetworkVariant) {
  const stateFile =
    networkVariant == NetworkVariant.Enum.Local
      ? STATE_FILE_LOCAL
      : STATE_FILE_SHARED
  return path.join(STATE_DIR, stateFile)
}

export function ensureStateDirExists() {
  return ensureDirExists(path.join(process.cwd(), STATE_DIR))
}

export class State {
  _state!: Record<string, Record<string, ContractState>>
  _networkVariant!: NetworkVariant

  async load(networkVariant: NetworkVariant) {
    this._networkVariant = networkVariant
    const statePath = getStatePath(networkVariant)
    await ensureStateDirExists()
    const stateExits = await fileExists(statePath)
    if (stateExits) {
      const data = await fs.readFile(statePath, 'utf8')
      this._state = JSON.parse(data)
    } else {
      this._state = {}
    }
  }

  async save() {
    const statePath = getStatePath(this._networkVariant)
    await fs.writeFile(statePath, JSON.stringify(this._state), 'utf8')
  }

  async addCodeId(networkName: string, contractName: string, codeId: number) {
    let networkState = this._state[networkName]
    if (!networkState) {
      networkState = {}
    }
    networkState[contractName] = { code_id: codeId, addresses: {} }
    this._state[networkName] = networkState
    await this.save()
  }

  async addContractAddress(
    networkName: string,
    contractName: string,
    contractAddress: ContractAddress,
    instance = 'default',
  ) {
    const networkState = this._state[networkName]
    if (networkState == null) {
      throw new Error('Invalid network')
    }

    const contractState = networkState[contractName]
    if (contractState == null) {
      throw new Error('Invalid contract')
    }

    contractState.addresses[instance] = contractAddress
    await this.save()
  }

  getContractState(
    networkName: string,
    contractName: string,
  ): ContractState | null {
    const networkState = this._state[networkName]
    if (networkState == null) {
      return null
    }

    const contractState = networkState[contractName]
    if (contractState == null) {
      return null
    }

    return contractState
  }
}

export default async function loadState(networkVariant: NetworkVariant) {
  const state = new State()
  await state.load(networkVariant)
  return state
}
