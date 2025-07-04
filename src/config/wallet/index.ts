import type { Abi, AbiEvent, Address, Chain, Hex } from 'viem'
import {
	createPublicClient,
	createWalletClient,
	getAbiItem,
	http,
	webSocket
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import type { PaidForDaoCreationEvent } from '@/models/paid-for-dao-creation-event.model'

export class Wallet {
	private publicClient
	private walletClient
	private account
	private abi: Abi
	private address: Address
	private chain: Chain

	constructor(
		chain: Chain,
		privateKey: Hex,
		rpc: string,
		websocket: string,
		address: Address,
		abi: Abi
	) {
		this.chain = chain
		this.account = privateKeyToAccount(privateKey)
		this.address = address
		this.abi = abi

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
		try {
			const event = getAbiItem({
				abi: this.abi,
				name: 'PaidForDaoCreation'
			}) as AbiEvent

			console.log(`🎧 Listening PaidForDaoCreation on ${this.chain.name}...`)

			this.publicClient.watchEvent({
				address: this.address,
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
		} catch (error) {
			console.error('❌', error)
			process.exit(1)
		}
	}

	getWalletClient() {
		return this.walletClient
	}

	getAccount() {
		return this.account.address
	}
}
