import type { Address, Chain, WalletClient } from 'viem'
import { createPublicClient, getContract, http } from 'viem'

import zkDaoJson from '@/assets/json/contracts/ethereum-sepolia/MockZKDAO.json'
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

	async createDao(createDaoParams: PaidForDaoCreationEvent, account: Address) {
		const contract = this.getWriteContract()

		if (typeof contract.write.createDao !== 'function') {
			throw new Error('createDao function is not available on the contract.')
		}

		return contract.write.createDao(
			[
				createDaoParams.tokenParams,
				createDaoParams.minDelay,
				createDaoParams.governorParams,
				createDaoParams.to,
				createDaoParams.amounts
			],
			{
				account: account
			}
		)
	}
}
