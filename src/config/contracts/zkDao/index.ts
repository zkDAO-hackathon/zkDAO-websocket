import type { Abi, Address, Chain, WalletClient } from 'viem'
import { createPublicClient, getContract, http } from 'viem'
import { estimateFeesPerGas, writeContract } from 'viem/actions'

import type { PaidForDaoCreationEvent } from '@/models/paid-for-dao-creation-event.model'

export class zkDaoContract {
	private publicClient: ReturnType<typeof createPublicClient>
	private walletClient: WalletClient
	private address: Address
	private abi: Abi

	constructor(
		chain: Chain,
		address: Address,
		abi: Abi,
		transport: string,
		walletClient: WalletClient
	) {
		this.publicClient = createPublicClient({
			chain: chain,
			transport: http(transport)
		})

		this.walletClient = walletClient
		this.address = address
		this.abi = abi
	}

	private getWriteContract() {
		return getContract({
			address: this.address,
			abi: this.abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient
			}
		})
	}

	// =========================
	//        WRITE METHODS
	// =========================

	async createDao(params: PaidForDaoCreationEvent, nonce?: number) {
		try {
			const fees = await estimateFeesPerGas(this.publicClient)

			return writeContract(this.walletClient, {
				address: this.address,
				abi: this.abi,
				functionName: 'createDao',
				args: [
					params.tokenParams,
					params.minDelay,
					params.governorParams,
					params.to,
					params.amounts,
					params.creator
				],
				nonce,
				maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
				maxFeePerGas: fees.maxFeePerGas,
				chain: this.publicClient.chain
			})
		} catch (error) {
			console.error('❌', error)
		}
	}
}
