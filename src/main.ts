import { waitForTransactionReceipt } from 'viem/actions'
import { avalancheFuji, sepolia } from 'viem/chains'

import {
	fujiRpc,
	fujiWebsocket,
	privateKey,
	sepoliaRpc,
	sepoliaWebsocket
} from './config/const'
import { Wallet } from './config/wallet'
import { zkDaoContract } from './config/zkDao'

async function main() {
	// Listening to events on Avalanche Fuji
	const fujiWallet = new Wallet(
		avalancheFuji,
		`0x${privateKey}`,
		fujiRpc,
		fujiWebsocket
	)

	const fujiZkDao = new zkDaoContract(
		avalancheFuji,
		fujiRpc,
		fujiWallet.getWalletClient()
	)

	await fujiWallet.onPaidForDaoCreation(async event => {
		try {
			// Create DAO on Avalanche Fuji
			console.log('🟢 Creating DAO on Fuji...')
			const account = fujiWallet.getAccount()
			const createDaoTx = await fujiZkDao.createDao(event, account)

			await waitForTransactionReceipt(fujiWallet.getWalletClient(), {
				hash: createDaoTx
			})

			console.log(
				'✅ DAO created, hash:',
				createDaoTx,
				`on ${avalancheFuji.name}`
			)

			// Create DAO on Sepolia
			console.log('🟢 Creating DAO on Sepolia...')
			const sepoliaCreateDaoTx = await sepoliaZkDao.createDao(event, account)

			await waitForTransactionReceipt(sepoliaWallet.getWalletClient(), {
				hash: sepoliaCreateDaoTx
			})

			console.log(
				'✅ DAO created on Sepolia, hash:',
				sepoliaCreateDaoTx,
				`on ${sepolia.name}`
			)
		} catch (error) {
			console.error('❌ Error creating DAO:', error)
		}
	})

	// Listening to events on Ethereum Sepolia
	const sepoliaWallet = new Wallet(
		sepolia,
		`0x${privateKey}`,
		sepoliaRpc,
		sepoliaWebsocket
	)

	const sepoliaZkDao = new zkDaoContract(
		sepolia,
		sepoliaRpc,
		sepoliaWallet.getWalletClient()
	)

	await sepoliaWallet.onPaidForDaoCreation(async event => {
		try {
			// Create DAO on Sepolia
			console.log('🟢 Creating DAO on Sepolia...')
			const account = sepoliaWallet.getAccount()
			const sepoliaCreateDaoTx = await sepoliaZkDao.createDao(event, account)

			await waitForTransactionReceipt(sepoliaWallet.getWalletClient(), {
				hash: sepoliaCreateDaoTx
			})

			console.log(
				'✅ DAO created, hash:',
				sepoliaCreateDaoTx,
				`on ${sepolia.name}`
			)

			// Create DAO on Fuji
			console.log('🟢 Creating DAO on Fuji...')
			const fujiCreateDaoTx = await fujiZkDao.createDao(event, account)

			await waitForTransactionReceipt(fujiWallet.getWalletClient(), {
				hash: fujiCreateDaoTx
			})

			console.log(
				'✅ DAO created on Fuji, hash:',
				fujiCreateDaoTx,
				`on ${avalancheFuji.name}`
			)
		} catch (error) {
			console.error('❌ Error creating DAO:', error)
		}
	})
}

main().catch(error => {
	console.error('❌', error)
})
