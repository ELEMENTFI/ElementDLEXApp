import React, { createContext, useContext, useState, useEffect } from 'react';
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers5/react';

const projectId = 'a0566b417a74c151a64e8e2f9c911652';
const metadata = {
    name: 'Element DLEX',
    description: 'Element DLEX is an innovative platform for lending and borrowing',
    url: 'https://www.divinedimension.io/',
    icons: ['https://testnet.divinedimension.io/static/media/logo-icon.cdce6297c02ec9b165cd0f543ffb50ef.svg']
  }
  const testnet = {
    chainId: 1328,
    name: 'Sei Testnet',
    currency: 'SEI',
    explorerUrl: 'https://evm-rpc-testnet.sei-apis.com',
    rpcUrl: 'https://seitrace.com'
  }

  createWeb3Modal({
    ethersConfig: defaultConfig({ 
      metadata,
      defaultChainId: 1328,
      enableEIP6963: true,
      enableInjected: true,
      enableCoinbase: true,
      rpcUrl: 'https://evm-rpc-testnet.sei-apis.com'
    }),
    chains: [testnet],
    projectId
  });

  export const ConnectWallet = async () => {
    const { open } = useWeb3Modal();
    await open();
  };

  export const config = {
    chainId: 1328,
    chainIdHex: '0x530',
    name: 'Sei Testnet',
    currency: 'SEI',
    explorerUrl: 'https://seitrace.com/',
    rpcUrl: 'https://evm-rpc-testnet.sei-apis.com'
  }
  
  export const ChangeNetwork = async (walletProvider) => {
    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainIdHex }],
      });
    } catch (switchError) {
      // Error code 4902 indicates the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: config.chainIdHex,
                chainName: config.name,
                rpcUrls: [config.rpcUrl],
                blockExplorerUrls: [config.explorerUrl],
                nativeCurrency: {
                  name: config.currency,
                  symbol: config.currency,
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add the network to MetaMask:', addError);
        }
      } else {
        console.error('Failed to switch the network in MetaMask:', switchError);
      }
    }
  };
  
  
  
  