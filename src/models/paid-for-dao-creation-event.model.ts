import type { Address } from 'viem'

export interface PaidForDaoCreationEvent {
	tokenParams: {
		name: string
		symbol: string
	}
	minDelay: bigint
	governorParams: {
		name: string
		description: string
		logo: string
		votingDelay: bigint
		votingPeriod: bigint
		proposalThreshold: bigint
		quorumFraction: bigint
	}
	to: Address[]
	amounts: bigint[]
	value: bigint
}
