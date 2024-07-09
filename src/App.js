import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import ElementProtocol from './components/HomePage';
import HomeV2 from './components/HomePageV2';
import HomePageBanking from './components/HomePageBanking';
import SwapPage from './components/Swap';
import Stake from './components/Stake';
import Stakebox from './components/Stakebox';
import FarmStaking from './components/FarmStaking';
import Farm from './components/Farm';
import Vaults from './components/Vaults';
import Launchpad from './components/Launchpad';
import Pool from './components/Pool';
import Bridge from './components/Bridge';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard/Dashboard';
import Bond from './components/Dashboard/Bond';
import SingleStake from './components/Dashboard/Stake';
import SwapTau from './components/Dashboard/SwapTau';
import Element from './components/Element';
import Home from './components/ElementProtocol';
import Mint from './components/Dashboard/Mint';
import Redeem from './components/Dashboard/Redeem';
import Buyback from './components/Dashboard/Buyback';
import Recollateraloze from './components/Dashboard/Recollateraloze';
import MoneyMarket from './components/MoneyMarket';
import MoneyMarketV2 from './components/MoneyMarketV2';
import MoneyMarketOrder from './components/MoneyMarketOrder';
import MoneyMarketOrderV2 from './components/MoneyMarketOrderV2';
import AccountVerifier from "./components/AccountVerifier";
import { useWeb3ModalAccount, createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';


const projectId = 'a0566b417a74c151a64e8e2f9c911652'



const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}
const testnet = {
  chainId: 97,
  name: 'BNB Smart Chain Testnet',
  currency: 'tBNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://bsc-testnet-rpc.publicnode.com'
}

createWeb3Modal({
  ethersConfig: defaultConfig({ 
    metadata,
    defaultChainId:  97,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com'
  }),
  chains: [testnet],
  projectId
});

function App() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  console.log("app.js",address, chainId);
  return (
   
    <Router>
       
      <Switch>
        <Route path="/borrow-card">
          <MoneyMarketOrderV2 />
        </Route>
        <Route path="/lending-card">
          <MoneyMarketOrder />
        </Route>
        <Route path="/borrow">
          <MoneyMarketV2 />
        </Route>
        <Route path="/lending">
          <MoneyMarket />
        </Route>
        <Route path="/features">
          <ElementProtocol />
        </Route>
        <Route path="/mint">
          <Mint />
        </Route>
        <Route path="/buyback">
          <Buyback />
        </Route>
        <Route path="/recollateraloze">
          <Recollateraloze />
        </Route>
        <Route path="/redeem">
          <Redeem />
        </Route>
        {/* <Route path="/banking">
          <HomePageBanking />
        </Route> */}
        <Route path="/element">
          <Element />
        </Route>
        <Route path="/single-stake">
          <SingleStake />
        </Route>
        <Route path="/swap-tau">
          <SwapTau />
        </Route>        
        <Route path="/bond">
          <Bond />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/analytics">
          <Analytics />
        </Route>
        <Route path="/bridge">
          <Bridge />
        </Route>
        <Route path="/pool">
          <Pool />
        </Route>
        <Route path="/swap">
          <SwapPage />
        </Route>
        <Route path="/launchpad">
          <Launchpad />
        </Route>
        <Route path="/vaults">
          <Vaults />
        </Route>
        <Route path="/farm">
          <Farm />
        </Route>
        <Route path="/stake">
          <Stake />
        </Route>
        <Route path="/stakebox">
          <Stakebox />
        </Route>
        <Route path="/FarmStaking">
          <FarmStaking />
        </Route>
       
        <Route path="/elemcurrency">
          <HomeV2 />
        </Route>
        <Route path="/">
          <AccountVerifier />
        </Route>
        {/* <Route path="/">
          <Home />
        </Route> */}
      </Switch>
      
     
    </Router>
  );
}

export default App;