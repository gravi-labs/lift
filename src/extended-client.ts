import {
  HttpEndpoint,
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { CometClient, connectComet } from '@cosmjs/tendermint-rpc'

export default class ExtendedClient extends SigningCosmWasmClient {
  public getAllContractState(
    contractAddress: string,
    paginationKey?: Uint8Array,
  ) {
    return this.forceGetQueryClient().wasm.getAllContractState(
      contractAddress,
      paginationKey,
    )
  }

  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions = {},
  ): Promise<ExtendedClient> {
    const cometClient = await connectComet(endpoint)
    return ExtendedClient.createWithSigner(cometClient, signer, options)
  }

  /**
   * Creates an instance from a manually created Comet client.
   * Use this to use `Comet38Client` or `Tendermint37Client` instead of `Tendermint34Client`.
   */
  public static async createWithSigner(
    cometClient: CometClient,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions = {},
  ): Promise<ExtendedClient> {
    return new ExtendedClient(cometClient, signer, options)
  }
}
