
import { Abi } from 'abitype';

export const LOVE20TokenViewerAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "childTokensByPage",
    "inputs": [
      {
        "name": "parentTokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "init",
    "inputs": [
      {
        "name": "launchAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "stakeAddress_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "initialized",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "launchAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "launchedChildTokensByPage",
    "inputs": [
      {
        "name": "parentTokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "launchedTokensByPage",
    "inputs": [
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "launchingChildTokensByPage",
    "inputs": [
      {
        "name": "parentTokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "launchingTokensByPage",
    "inputs": [
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "participatedTokensByPage",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "stakeAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenDetail",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "tokenInfo",
        "type": "tuple",
        "internalType": "struct TokenInfo",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "symbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "decimals",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "parentTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "parentTokenSymbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "parentTokenName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "slAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "stAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "uniswapV2PairAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "initialStakeRound",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "launchInfo",
        "type": "tuple",
        "internalType": "struct LaunchInfo",
        "components": [
          {
            "name": "parentTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "parentTokenFundraisingGoal",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "secondHalfMinBlocks",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "launchAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "startBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "secondHalfStartBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "hasEnded",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "participantCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalContributed",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalExtraRefunded",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenDetailBySymbol",
    "inputs": [
      {
        "name": "symbol",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "tokenInfo",
        "type": "tuple",
        "internalType": "struct TokenInfo",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "symbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "decimals",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "parentTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "parentTokenSymbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "parentTokenName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "slAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "stAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "uniswapV2PairAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "initialStakeRound",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "launchInfo",
        "type": "tuple",
        "internalType": "struct LaunchInfo",
        "components": [
          {
            "name": "parentTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "parentTokenFundraisingGoal",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "secondHalfMinBlocks",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "launchAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "startBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "secondHalfStartBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "hasEnded",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "participantCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalContributed",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalExtraRefunded",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenDetails",
    "inputs": [
      {
        "name": "tokenAddresses",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "tokenInfos",
        "type": "tuple[]",
        "internalType": "struct TokenInfo[]",
        "components": [
          {
            "name": "tokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "symbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "decimals",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "parentTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "parentTokenSymbol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "parentTokenName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "slAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "stAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "uniswapV2PairAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "initialStakeRound",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "launchInfos",
        "type": "tuple[]",
        "internalType": "struct LaunchInfo[]",
        "components": [
          {
            "name": "parentTokenAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "parentTokenFundraisingGoal",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "secondHalfMinBlocks",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "launchAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "startBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "secondHalfStartBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "endBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "hasEnded",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "participantCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalContributed",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalExtraRefunded",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenPairInfoWithAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "pairInfo",
        "type": "tuple",
        "internalType": "struct PairInfoWithAccount",
        "components": [
          {
            "name": "pairAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "balanceOfToken",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "balanceOfParentToken",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "allowanceOfToken",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "allowanceOfParentToken",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "pairReserveToken",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "pairReserveParentToken",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokensByPage",
    "inputs": [
      {
        "name": "start",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "end",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  }
] as const satisfies Abi;
