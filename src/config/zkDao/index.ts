import type { Address, Chain, WalletClient } from 'viem'
import { createPublicClient, getContract, http, parseGwei } from 'viem'
import { writeContract } from 'viem/actions'

import zkDaoJson from '@/assets/json/contracts/ethereum-sepolia/ZKDAO.json'
import type { PaidForDaoCreationEvent } from '@/models/paid-for-dao-creation-event.model'

export class zkDaoContract {
	private publicClient: ReturnType<typeof createPublicClient>
	private walletClient: WalletClient

	constructor(chain: Chain, transport: string, walletClient: WalletClient) {
		this.publicClient = createPublicClient({
			chain: chain,
			transport: http(transport)
		})

		this.walletClient = walletClient
	}

	private getWriteContract() {
		return getContract({
			address: zkDaoJson.address as Address,
			abi: zkDaoJson.abi,
			client: {
				public: this.publicClient,
				wallet: this.walletClient
			}
		})
	}

	// =========================
	//        WRITE METHODS
	// =========================

	async createDao(params: PaidForDaoCreationEvent) {
		return writeContract(this.walletClient, {
			address: zkDaoJson.address as Address,
			abi: zkDaoJson.abi,
			functionName: 'createDao',
			args: [
				params.tokenParams,
				params.minDelay,
				params.governorParams,
				params.to,
				params.amounts,
				params.creator
			],
			maxFeePerGas: parseGwei('1'), // 1 gwei ≈ 0.003 ETH total
			maxPriorityFeePerGas: parseGwei('1'), // 1 gwei (propina)
			chain: this.publicClient.chain
		})
	}
}
