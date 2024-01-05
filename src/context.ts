import { AccountData, OfflineSigner } from '@cosmjs/proto-signing'
import path from 'path'
import type { Config } from './config.js'
import ExtendedClient from './extended-client.js'
import type { State } from './state.js'

export class WorkspaceContext {
  network: string
  config: Config
  state: State
  signer: OfflineSigner
  account: AccountData
  client: ExtendedClient

  constructor(
    network: string,
    config: Config,
    state: State,
    signer: OfflineSigner,
    account: AccountData,
    client: ExtendedClient,
  ) {
    this.network = network
    this.config = config
    this.state = state
    this.signer = signer
    this.account = account
    this.client = client
  }
}

export class Contract {
  name: string
  instance: string
  context: WorkspaceContext

  constructor(
    context: WorkspaceContext,
    name: string,
    instance: string = 'default',
  ) {
    this.context = context
    this.name = name
    this.instance = instance
  }

  get path() {
    return path.join(
      process.cwd(),
      this.context.config.wasm.contract_dir,
      this.name,
    )
  }

  get address() {
    const instanceContractAddress = this.state.addresses[this.instance]
    if (!instanceContractAddress) {
      throw new Error("Contract instance doesn't exist")
    }
    return instanceContractAddress
  }

  get schemaPath() {
    return path.join(this.path, 'schema')
  }

  get artifactPath() {
    return path.join(process.cwd(), 'artifacts', `${this.name}.wasm`)
  }

  get state() {
    const contractState = this.context.state.getContractState(
      this.context.network,
      this.name,
    )
    if (!contractState) {
      throw new Error("Contract state doesn't exist")
    }
    return contractState
  }

  addCodeId(codeId: number) {
    return this.context.state.addCodeId(this.context.network, this.name, codeId)
  }

  addContractAddress(contractAddress: string) {
    return this.context.state.addContractAddress(
      this.context.network,
      this.name,
      contractAddress,
      this.instance,
    )
  }
}
