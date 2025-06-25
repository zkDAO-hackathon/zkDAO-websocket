import { createPublicClient, getAbiItem, webSocket } from 'viem'
import { localhost } from 'viem/chains'

import { zkdaoAbi } from '@/assets/abis/MockZKDAO'

const CONTRACT_ADDRESS = '0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0'
const WEBSOCKET_URL = 'ws://127.0.0.1:8545'

const client = createPublicClient({
	chain: localhost,
	transport: webSocket(WEBSOCKET_URL)
})

async function listenToPaidForDaoCreation() {
	console.log('🎧 Escuchando PaidForDaoCreation...')
	const event = getAbiItem({ abi: zkdaoAbi, name: 'PaidForDaoCreation' })

	const unwatch = await client.watchEvent({
		address: CONTRACT_ADDRESS,
		event,
		onLogs: logs => {
			for (const log of logs) {
				const { tokenParams, minDelay, governorParams, to, amounts, value } =
					log.args

				console.log('📝 Evento detectado:', log)

				console.log('📩 DAO pago detectado:')
				if (tokenParams) {
					console.log('Token Name:', tokenParams.name)
					console.log('Symbol:', tokenParams.symbol)
				} else {
					console.log('Token Params are undefined')
				}
				console.log('Min Delay:', minDelay?.toString())
				console.log('Governor:', governorParams?.name)
				console.log('Recipients:', to)
				console.log(
					'Amounts:',
					amounts?.map(x => x.toString())
				)
				console.log('Value sent:', value?.toString())
			}
		}
	})
}

listenToPaidForDaoCreation()
