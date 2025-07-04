import type { Abi, Address } from 'viem'
import { getTransactionCount, waitForTransactionReceipt } from 'viem/actions'
import { avalancheFuji, sepolia } from 'viem/chains'

import {
	fujiRpc,
	fujiWebsocket,
	privateKey,
	sepoliaRpc,
	sepoliaWebsocket
} from './config/const'
import { zkDaoContracts } from './config/contracts'
import { zkDaoContract } from './config/contracts/zkDao'
import { Wallet } from './config/wallet'

async function main() {
	const fujiWallet = new Wallet(
		avalancheFuji,
		`0x${privateKey}`,
		fujiRpc,
		fujiWebsocket,
		zkDaoContracts.fuji.address as Address,
		zkDaoContracts.fuji.abi as Abi
	)

	const sepoliaWallet = new Wallet(
		sepolia,
		`0x${privateKey}`,
		sepoliaRpc,
		sepoliaWebsocket,
		zkDaoContracts.sepolia.address as Address,
		zkDaoContracts.sepolia.abi as Abi
	)

	const fujiZkDao = new zkDaoContract(
		avalancheFuji,
		zkDaoContracts.fuji.address as Address,
		zkDaoContracts.fuji.abi as Abi,
		fujiRpc,
		fujiWallet.getWalletClient()
	)

	const sepoliaZkDao = new zkDaoContract(
		sepolia,
		zkDaoContracts.sepolia.address as Address,
		zkDaoContracts.sepolia.abi as Abi,
		sepoliaRpc,
		sepoliaWallet.getWalletClient()
	)

	fujiWallet.onPaidForDaoCreation(async args => {
		try {
			console.log('🟢 Creating DAO on Fuji...')
			const fujiWalletClient = fujiWallet.getWalletClient()
			const nonce = await getTransactionCount(fujiWalletClient, {
				address: fujiWallet.getAccount(),
				blockTag: 'pending'
			})

			const createDaoTx = await fujiZkDao.createDao(args, nonce)
			if (!createDaoTx) throw new Error('Failed to create DAO on Fuji')

			await waitForTransactionReceipt(fujiWalletClient, { hash: createDaoTx })

			console.log('✅ DAO created on Fuji, hash:', createDaoTx)

			console.log('🟢 Creating DAO on Sepolia...')
			const sepoliaCreateDaoTx = await sepoliaZkDao.createDao(args)
			if (!sepoliaCreateDaoTx)
				throw new Error('Failed to create DAO on Sepolia')

			await waitForTransactionReceipt(sepoliaWallet.getWalletClient(), {
				hash: sepoliaCreateDaoTx
			})

			console.log('✅ DAO created on Sepolia, hash:', sepoliaCreateDaoTx)
		} catch (error) {
			console.error('❌ Fuji Event Error:', error)
		}
	})

	const processedEvents = new Set<string>()

	sepoliaWallet.onPaidForDaoCreation(async args => {
		try {
			const eventId = `${args.creator}-${args.value}-${args.governorParams.name}`
			if (processedEvents.has(eventId)) return
			processedEvents.add(eventId)

			console.log('🟢 Creating DAO on Sepolia...')
			const sepoliaWalletClient = sepoliaWallet.getWalletClient()

			await enqueueTx(async () => {
				const nonce = await getTransactionCount(sepoliaWalletClient, {
					address: sepoliaWallet.getAccount(),
					blockTag: 'pending'
				})

				const createDaoTx = await sepoliaZkDao.createDao(args, nonce)
				await waitForTransactionReceipt(sepoliaWalletClient, {
					hash: createDaoTx
				})

				console.log('✅ DAO created on Sepolia, hash:', createDaoTx)
			})

			console.log('🟢 Creating DAO on Fuji...')
			const fujiCreateDaoTx = await fujiZkDao.createDao(args)
			await waitForTransactionReceipt(fujiWallet.getWalletClient(), {
				hash: fujiCreateDaoTx
			})
			console.log('✅ DAO created on Fuji, hash:', fujiCreateDaoTx)
		} catch (error) {
			console.error('❌ Error creating DAO:', error.message || error)
		}
	})
}

main().catch(error => {
	console.error('❌ Fatal Error:', error)
})

async function enqueueTx(fn: () => Promise<any>) {
	const pendingTxQueue: Promise<any>[] = []
	const last = pendingTxQueue[pendingTxQueue.length - 1] || Promise.resolve()
	const current = last.then(() => fn()).catch(() => {})
	pendingTxQueue.push(current)
	return current
}
