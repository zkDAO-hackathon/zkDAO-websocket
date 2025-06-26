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
		const account = sepoliaWallet.getAccount()
		const createDaoTx = await sepoliaZkDao.createDao(event, account)

		await waitForTransactionReceipt(sepoliaWallet.getWalletClient(), {
			hash: createDaoTx
		})

		console.log('✅ DAO created, hash:', createDaoTx, `on ${sepolia.name}`)
	})
}

main().catch(error => {
	console.error('❌', error)
})
