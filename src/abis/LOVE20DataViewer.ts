
import { Abi } from 'abitype';

export const LOVE20DataViewerAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "actionInfosByIds",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "actionIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ActionInfo[]",
        "components": [
          {
            "name": "head",
            "type": "tuple",
            "internalType": "struct ActionHead",
            "components": [
              {
                "name": "id",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "author",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "createAtBlock",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "body",
            "type": "tuple",
            "internalType": "struct ActionBody",
            "components": [
              {
                "name": "minStake",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxRandomAccounts",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "whiteListAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "title",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "verificationRule",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "verificationKeys",
                "type": "string[]",
                "internalType": "string[]"
              },
              {
                "name": "verificationInfoGuides",
                "type": "string[]",
                "internalType": "string[]"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "actionInfosByPage",
    "inputs": [
      {
        "name": "tokenAddress",
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
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ActionInfo[]",
        "components": [
          {
            "name": "head",
            "type": "tuple",
            "internalType": "struct ActionHead",
            "components": [
              {
                "name": "id",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "author",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "createAtBlock",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "body",
            "type": "tuple",
            "internalType": "struct ActionBody",
            "components": [
              {
                "name": "minStake",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxRandomAccounts",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "whiteListAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "title",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "verificationRule",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "verificationKeys",
                "type": "string[]",
                "internalType": "string[]"
              },
              {
                "name": "verificationInfoGuides",
                "type": "string[]",
                "internalType": "string[]"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "actionRewardsByAccountByActionIdByRounds",
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
        "name": "actionId",
        "type": "uint256",
        "internalType": "uint256"
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
        "internalType": "struct RewardInfo[]",
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
    "name": "actionSubmits",
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
        "internalType": "struct ActionSubmitInfo[]",
        "components": [
          {
            "name": "submitter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "actionId",
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
    "name": "govData",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "govData_",
        "type": "tuple",
        "internalType": "struct GovData",
        "components": [
          {
            "name": "govVotes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "slAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "tokenAmountForSl",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "parentTokenAmountForSl",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "rewardAvailable",
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
        "internalType": "struct RewardInfo[]",
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
        "name": "stakeAddress_",
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
        "internalType": "struct JoinableActionDetail[]",
        "components": [
          {
            "name": "action",
            "type": "tuple",
            "internalType": "struct ActionInfo",
            "components": [
              {
                "name": "head",
                "type": "tuple",
                "internalType": "struct ActionHead",
                "components": [
                  {
                    "name": "id",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "author",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "createAtBlock",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              },
              {
                "name": "body",
                "type": "tuple",
                "internalType": "struct ActionBody",
                "components": [
                  {
                    "name": "minStake",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "maxRandomAccounts",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "whiteListAddress",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "title",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationRule",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationKeys",
                    "type": "string[]",
                    "internalType": "string[]"
                  },
                  {
                    "name": "verificationInfoGuides",
                    "type": "string[]",
                    "internalType": "string[]"
                  }
                ]
              }
            ]
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
      },
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct JoinedAction[]",
        "components": [
          {
            "name": "action",
            "type": "tuple",
            "internalType": "struct ActionInfo",
            "components": [
              {
                "name": "head",
                "type": "tuple",
                "internalType": "struct ActionHead",
                "components": [
                  {
                    "name": "id",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "author",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "createAtBlock",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              },
              {
                "name": "body",
                "type": "tuple",
                "internalType": "struct ActionBody",
                "components": [
                  {
                    "name": "minStake",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "maxRandomAccounts",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "whiteListAddress",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "title",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationRule",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationKeys",
                    "type": "string[]",
                    "internalType": "string[]"
                  },
                  {
                    "name": "verificationInfoGuides",
                    "type": "string[]",
                    "internalType": "string[]"
                  }
                ]
              }
            ]
          },
          {
            "name": "stakedAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votesNum",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votePercent",
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
            "name": "action",
            "type": "tuple",
            "internalType": "struct ActionInfo",
            "components": [
              {
                "name": "head",
                "type": "tuple",
                "internalType": "struct ActionHead",
                "components": [
                  {
                    "name": "id",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "author",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "createAtBlock",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              },
              {
                "name": "body",
                "type": "tuple",
                "internalType": "struct ActionBody",
                "components": [
                  {
                    "name": "minStake",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "maxRandomAccounts",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "whiteListAddress",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "title",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationRule",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationKeys",
                    "type": "string[]",
                    "internalType": "string[]"
                  },
                  {
                    "name": "verificationInfoGuides",
                    "type": "string[]",
                    "internalType": "string[]"
                  }
                ]
              }
            ]
          },
          {
            "name": "stakedAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votesNum",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votePercent",
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
    "name": "launchInfos",
    "inputs": [
      {
        "name": "addresses",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "launchInfos_",
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
        "name": "launchInfos_",
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
      },
      {
        "name": "parentTokenAddress",
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
    "name": "verifingActionsByAccount",
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
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct MyVerifyingAction[]",
        "components": [
          {
            "name": "action",
            "type": "tuple",
            "internalType": "struct ActionInfo",
            "components": [
              {
                "name": "head",
                "type": "tuple",
                "internalType": "struct ActionHead",
                "components": [
                  {
                    "name": "id",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "author",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "createAtBlock",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              },
              {
                "name": "body",
                "type": "tuple",
                "internalType": "struct ActionBody",
                "components": [
                  {
                    "name": "minStake",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "maxRandomAccounts",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "whiteListAddress",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "title",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationRule",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationKeys",
                    "type": "string[]",
                    "internalType": "string[]"
                  },
                  {
                    "name": "verificationInfoGuides",
                    "type": "string[]",
                    "internalType": "string[]"
                  }
                ]
              }
            ]
          },
          {
            "name": "myVotesNum",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalVotesNum",
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
    "name": "verifyingActions",
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
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct VerifyingAction[]",
        "components": [
          {
            "name": "action",
            "type": "tuple",
            "internalType": "struct ActionInfo",
            "components": [
              {
                "name": "head",
                "type": "tuple",
                "internalType": "struct ActionHead",
                "components": [
                  {
                    "name": "id",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "author",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "createAtBlock",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              },
              {
                "name": "body",
                "type": "tuple",
                "internalType": "struct ActionBody",
                "components": [
                  {
                    "name": "minStake",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "maxRandomAccounts",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "whiteListAddress",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "title",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationRule",
                    "type": "string",
                    "internalType": "string"
                  },
                  {
                    "name": "verificationKeys",
                    "type": "string[]",
                    "internalType": "string[]"
                  },
                  {
                    "name": "verificationInfoGuides",
                    "type": "string[]",
                    "internalType": "string[]"
                  }
                ]
              }
            ]
          },
          {
            "name": "votesNum",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "verificationScore",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "myVotesNum",
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
  },
  {
    "type": "function",
    "name": "votesNums",
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
        "name": "actionIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "votes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "votesNumsByActionIds",
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
        "name": "actionIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "votes",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  }
] as const satisfies Abi;
