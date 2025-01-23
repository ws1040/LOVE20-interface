
import { Abi } from 'abitype';

export const LOVE20DataViewerAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "initSetter_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "govRewardsByAccountByRounds",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "startRound",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "endRound",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "rewards",
        "type": "tuple[]",
        "internalType": "struct GovReward[]",
        "components": [
          {
            "name": "round",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "minted",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "unminted",
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
    "name": "init",
    "inputs": [
      {
        "name": "launchAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "submitAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "voteAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "joinAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "verifyAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "mintAddress_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "initSetter",
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
    "name": "joinAddress",
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
    "name": "joinableActions",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "round",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct JoinableAction[]",
        "components": [
          {
            "name": "actionId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votesNum",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "joinedAmount",
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
    "name": "joinedActions",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct JoinedAction[]",
        "components": [
          {
            "name": "actionId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stakedAmount",
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
    "name": "mintAddress",
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
    "name": "setInitSetter",
    "inputs": [
      {
        "name": "newInitSetter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitAddress",
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
            "name": "parentTokenSymbol",
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
            "name": "parentTokenSymbol",
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
            "name": "parentTokenSymbol",
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
    "name": "verificationInfosByAccount",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "actionId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "verificationKeys",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "verificationInfos",
        "type": "string[]",
        "internalType": "string[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verificationInfosByAction",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "round",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "actionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "verificationInfos",
        "type": "tuple[]",
        "internalType": "struct VerificationInfo[]",
        "components": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "infos",
            "type": "string[]",
            "internalType": "string[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifiedAddressesByAction",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "round",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "actionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct VerifiedAddress[]",
        "components": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "score",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "reward",
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
    "name": "verifyAddress",
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
    "name": "voteAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  }
] as const satisfies Abi;
