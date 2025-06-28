import type { AbiEvent, Address, Chain, Hex } from 'viem'
import {
	createPublicClient,
	createWalletClient,
	getAbiItem,
	http,
	webSocket
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import zkDaoJson from '@/assets/json/contracts/ethereum-sepolia/ZKDAO.json'
import type { PaidForDaoCreationEvent } from '@/models/paid-for-dao-creation-event.model'

export class Wallet {
	private publicClient
	private walletClient
	private account
	private chain: Chain

	constructor(chain: Chain, privateKey: Hex, rpc: string, websocket: string) {
		this.chain = chain
		this.account = privateKeyToAccount(privateKey)

		this.publicClient = createPublicClient({
			chain,
			transport: webSocket(websocket)
		})

		this.walletClient = createWalletClient({
			account: this.account,
			chain,
			transport: http(rpc)
		})
	}

	async onPaidForDaoCreation(
		callback: (event: PaidForDaoCreationEvent) => Promise<void>
	) {
		const event = getAbiItem({
			abi: zkDaoJson.abi,
			name: 'PaidForDaoCreation'
		}) as AbiEvent

		console.log(`🎧 Listening PaidForDaoCreation on ${this.chain.name}...`)

		await this.publicClient.watchEvent({
			address: zkDaoJson.address as Address,
			event,
			onLogs: async logs => {
				for (const log of logs) {
					const args = log.args as unknown as PaidForDaoCreationEvent
					console.log(
						'🧩  Event detected:',
						log.args,
						`on ${this.chain.name}...`
					)
					await callback(args)
				}
			}
		})
	}

	getWalletClient() {
		return this.walletClient
	}

	getAccount() {
		return this.account.address
	}
}
