
import { Abi } from 'abitype';

export const LOVE20SubmitAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "originBlocks",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "phaseBlocks",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "SUBMIT_MIN_PER_THOUSAND",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "actionIdsByAuthor",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "author",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "actionInfo",
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
      }
    ],
    "outputs": [
      {
        "name": "",
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
                "name": "maxStake",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxRandomAccounts",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "whiteList",
                "type": "address[]",
                "internalType": "address[]"
              },
              {
                "name": "action",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "consensus",
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
                "name": "maxStake",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxRandomAccounts",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "whiteList",
                "type": "address[]",
                "internalType": "address[]"
              },
              {
                "name": "action",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "consensus",
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
      },
      {
        "name": "reverse",
        "type": "bool",
        "internalType": "bool"
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
                "name": "maxStake",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "maxRandomAccounts",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "whiteList",
                "type": "address[]",
                "internalType": "address[]"
              },
              {
                "name": "action",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "consensus",
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
    "name": "actionNum",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "canSubmit",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "accountAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
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
    "name": "currentRound",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "stakeAddress_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "submitMinPerThousand",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "isInWhiteList",
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
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isSubmitted",
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
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "originBlocks",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "phaseBlocks",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "roundByBlockNumber",
    "inputs": [
      {
        "name": "blockNumber",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "submit",
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
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitNewAction",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "actionBody",
        "type": "tuple",
        "internalType": "struct ActionBody",
        "components": [
          {
            "name": "maxStake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maxRandomAccounts",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "whiteList",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "action",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "consensus",
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
    ],
    "outputs": [
      {
        "name": "actionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ActionCreate",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "round",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "author",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "actionId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "actionBody",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct ActionBody",
        "components": [
          {
            "name": "maxStake",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maxRandomAccounts",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "whiteList",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "action",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "consensus",
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
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ActionSubmit",
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "round",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "submitter",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "actionId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ActionIdNotExist",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadyInitialized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AlreadySubmitted",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotSubmitAction",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MaxRandomAccountsZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MaxStakeZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOneSubmitPerRound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundNotStarted",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StartGreaterThanEnd",
    "inputs": []
  }
] as const satisfies Abi;
