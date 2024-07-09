// src/Web3Context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount } from '@web3modal/ethers5/react';
// import {useWeb3Modal} from '@web3modal/ethers5/react'
import { ethers } from 'ethers';
// import { abierc20, contracterc20 } from './pages/Launchpad/LaunchpadContract.js';


const API_KEY ="c5132b9c-d4bb-4dda-be1e-3b9c879c4527"
const Network_Name ="base-sepolia"
// Your Web3Modal configuration
const projectId = 'a0566b417a74c151a64e8e2f9c911652';
const metadata = {
    name: 'Element DLEX',
    description: 'Element DLEX is an innovative platform for lending and borrowing',
    url: 'https://www.divinedimension.io/',
    icons: ['https://testnet.divinedimension.io/static/media/logo-icon.cdce6297c02ec9b165cd0f543ffb50ef.svg']
  }
  const testnet = {
    chainId: 97,
    name: 'Sei Testnet',
    currency: 'SEI',
    explorerUrl: 'https://bsc-testnet-rpc.publicnode.com',
    rpcUrl: 'https://seitrace.com'
  }

  createWeb3Modal({
    ethersConfig: defaultConfig({ 
      metadata,
      defaultChainId: 97,
      enableEIP6963: true,
      enableInjected: true,
      enableCoinbase: true,
      rpcUrl: 'https://bsc-testnet-rpc.publicnode.com'
    }),
    chains: [testnet],
    projectId
  })

// Create a context
const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const [balances, setBalances] = useState({
    dime: 0.00,
    eth: 0.00
  });

  

//   const balanceOfTokens = async () => {
//     if (isConnected) {
//       try {
//         // const provider = ethers.getDefaultProvider(Network_Name, {
//         //   etherscan: API_KEY});
//         const provider = ethers.getDefaultProvider('https://bsc-testnet-rpc.publicnode.com');

//         // const dime = await getTokenBalance(address, DIME_Token_Address, DIME_Token_ABI);
//         const eth = await provider.getBalance(address);
        
//         // let dimeBalance = ethers.utils.formatUnits(dime, 9);
//         let etherBalance = ethers.utils.formatUnits(eth, 18);

//         // const signer = provider.getSigner();
//         // const erc20token = new web3.eth.Contract(abierc20, "0xf35A6D2F0f08638e6f09473Dd5f40e69b4889a8C");
//         const erc20token = new ethers.Contract(contracterc20,abierc20, provider);

//         const dime = await erc20token.balanceOf(address);

//         let dimeBalance = ethers.utils.formatUnits(dime, 18);

//         setBalances({
//           dime: parseFloat(dimeBalance).toFixed(2),
//           eth: parseFloat(etherBalance).toFixed(4)
//         });

//         console.log("Balances updated:", balances);
//       } catch (error) {
//         console.error("Error fetching token balances:", error);
//       }
//     }
//     else{
//       setBalances({
//         dime: 0.00,
//         eth: 0.00
//       });
//     }
//   };

//   useEffect(() => {
//       balanceOfTokens();
//   }, [isConnected, address]);

  return (
    <Web3Context.Provider value={{ address, balances }}>
      {children}
    </Web3Context.Provider>
  );
};

export const config = {
    chainId: 97,
    chainIdHex: '0x530',
    name: 'Sei Testnet',
    currency: 'SEI',
    explorerUrl: 'https://bsc-testnet-rpc.publicnode.com',
    rpcUrl: 'https://seitrace.com'
  }

export const ConnectWallet = async () => {
    const { open } = useWeb3Modal();
    await open();
  };
  
  export const ChangeNetwork = async (walletProvider) => {
    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === config.chainId) {
        try {
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: config.chainIdHex,
                chainName: config.chainName,
                rpcUrls: [config.rpcUrl],
                blockExplorerUrls: [config.explorerUrl],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      }
    }
  };
