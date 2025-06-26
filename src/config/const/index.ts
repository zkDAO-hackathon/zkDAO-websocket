import { ensureEnvVar } from '@/utils'

export const privateKey = ensureEnvVar(
	process.env.WALLET_PRIVATE_KEY,
	'WALLET_PRIVATE_KEY'
)

export const fujiRpc = ensureEnvVar(
	process.env.AVALANCHE_FUJI_RPC_URL,
	'AVALANCHE_FUJI_RPC_URL'
)

export const fujiWebsocket = ensureEnvVar(
	process.env.AVALANCHE_FUJI_WS_URL,
	'AVALANCHE_FUJI_WS_URL'
)

export const sepoliaRpc = ensureEnvVar(
	process.env.ETHEREUM_SEPOLIA_RPC_URL,
	'ETHEREUM_SEPOLIA_RPC_URL'
)

export const sepoliaWebsocket = ensureEnvVar(
	process.env.ETHEREUM_SEPOLIA_WS_URL,
	'ETHEREUM_SEPOLIA_WS_URL'
)
