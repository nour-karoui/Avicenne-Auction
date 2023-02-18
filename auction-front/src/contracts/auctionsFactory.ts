export const AuctionsFactoryABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "openAuctions",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "totalAuctions",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "totalAuctionsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_nftAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startingPrice",
                "type": "uint256"
            }
        ],
        "name": "createNewAuction",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_nftAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "state",
                "type": "bool"
            }
        ],
        "name": "setAuctionState",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getAuctionAddressByIndex",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

export const AuctionsFactoryAddress = '0x0A7d3097b711795d2D1E48a422dD4930d3d6a921';
// export const AuctionsFactoryAddress = '0xAdF35751d3970FA64351c861b9791fD554DBD5a5';