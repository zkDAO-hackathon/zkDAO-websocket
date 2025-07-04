import fujiZkDaoJson from '@/assets/json/contracts/avalanache-fuji/ZKDAO.json'
import sepoliaZkDaoJson from '@/assets/json/contracts/ethereum-sepolia/ZKDAO.json'

export const zkDaoContracts = {
	sepolia: {
		address: sepoliaZkDaoJson.address,
		abi: sepoliaZkDaoJson.abi
	},
	fuji: {
		address: fujiZkDaoJson.address,
		abi: fujiZkDaoJson.abi
	}
}
