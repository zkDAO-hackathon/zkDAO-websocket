export const zkdaoAbi = [
	{
		type: 'event',
		name: 'PaidForDaoCreation',
		inputs: [
			{
				name: 'tokenParams',
				type: 'tuple',
				components: [
					{ name: 'name', type: 'string' },
					{ name: 'symbol', type: 'string' }
				],
				indexed: false
			},
			{
				name: 'minDelay',
				type: 'uint256',
				indexed: false
			},
			{
				name: 'governorParams',
				type: 'tuple',
				components: [
					{ name: 'name', type: 'string' },
					{ name: 'description', type: 'string' },
					{ name: 'logo', type: 'string' },
					{ name: 'votingDelay', type: 'uint48' },
					{ name: 'votingPeriod', type: 'uint32' },
					{ name: 'proposalThreshold', type: 'uint256' },
					{ name: 'quorumFraction', type: 'uint256' }
				],
				indexed: false
			},
			{
				name: 'to',
				type: 'address[]',
				indexed: false
			},
			{
				name: 'amounts',
				type: 'uint256[]',
				indexed: false
			},
			{
				name: 'value',
				type: 'uint256',
				indexed: false
			}
		]
	}
] as const
