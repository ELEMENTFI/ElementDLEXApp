import React from 'react';
import { Button, Col, Container, Modal, Row, Breadcrumb } from 'react-bootstrap';
import ButtonLoad from 'react-bootstrap-button-loader';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import Layout from './Layouts/LayoutInner';
import {
    Link
  } from "react-router-dom";
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import FilterDropdown from './Snippets/FilterDropdown';

import elem from '../assets/images/elem-original.png';
import tau from '../assets/images/tau-original.png';
import Llogo from '../assets/images/L logo.png';
import Plogo from '../assets/images/P logo.png'
import FilterDropdown2 from './Snippets/FilterDropdown2';
// const animatedComponents = makeAnimated();
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk, { Algod,base64 } from "algosdk";
import appcss from '../App.css';
import fireDb from '../firebasefile';

import cmblogo from '../assets/images/modal-logo-new.png';

import { useEffect,useState } from "react";
import config from "../configurl";

import axios from 'axios';
import {callapiforuserslist,postusertx,postuserdetail} from './apicallfunction';
import { createpair,createtxhash,createtpairhistory,getpairedtokens,updatepairhistory } from './apicallfunction';
import { priceOfCoin1,priceOfCoin2,find_balance,find_balance_escrow,convert1,convert2,readingLocalstate,assetName,decodLocalState } from './formula';
import { assert1Reserve,assert2Reserve,assert3Reserve,asset1_price,rewardasset3,rewardasset1,rewardasset2 } from './formula';

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'; 
import { PancakeFactoryV2Address, PancakeFactoryV2ABI, PancakeRouterV2Address, PancakeRouterV2ABI, PancakePairV2ABI, ERC20ABI, WSEIAddress } from '../abi';
import { ethers } from 'ethers';
import { Sidebar } from './Snippets/sidebar';
import { createLiqlistFirebase } from '../firebasefunctions';

const myAlgoWallet = new MyAlgoConnect();
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
let appID_global = 57691024;
let data = `#pragma version 4
    
// Element Pool LogicSig


// This code should be read in conjunction with validator_approval.teal.
// The validation logic is split between these two programs.

// ensure ASSET_ID_1 > ASSET_ID_2
int Token1   
int Token2   
>
assert

txn CloseRemainderTo
global ZeroAddress
==
assert

txn AssetCloseTo
global ZeroAddress
==
assert

txn RekeyTo
global ZeroAddress
==
assert

global GroupSize
int 1
>
assert

// ensure gtxn 1 is ApplicationCall to Validator App
gtxn 1 Sender
txn Sender
==
assert

gtxn 1 TypeEnum
int appl // ApplicationCall
==
assert

gtxn 1 ApplicationID
int appId
==
assert

// Bootstrap?
gtxn 1 OnCompletion
int OptIn
==
gtxn 1 NumAppArgs
int 3
==
&&
gtxna 1 ApplicationArgs 0
byte "bootstrap"
==
&&
bnz bootstrap


// The remaining operations (Mint/Burn/Swap/Redeem/Fees) must all have OnCompletion=NoOp
gtxn 1 OnCompletion
int NoOp
==
assert

// Swap?
gtxn 1 NumAppArgs
int 2
==
gtxna 1 ApplicationArgs 0
byte "swap"
==
&&
bnz swap


// The remaining operations (Mint/Burn/Redeem/Fees) must all have NumAppArgs=1
gtxn 1 NumAppArgs
int 1
==
assert

// Mint?
gtxna 1 ApplicationArgs 0
byte "mint"
==
bnz mint


// Burn?
gtxna 1 ApplicationArgs 0
byte "burn"
==
bnz burn

// Redeem?
gtxna 1 ApplicationArgs 0
byte "redeem"
==
bnz redeem

// Fees?
gtxna 1 ApplicationArgs 0
byte "fees"
==
bnz redeem_fees

err


bootstrap:
    // Ensure group size is correct 4 or 5:
    // 0: Pay Fees (signed by Pooler)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Creation (signed by Pool LogicSig)
    // 3: Asset Optin (signed by Pool LogicSig)
    // If asset 2 is an ASA:
    // (4): Asset Optin (signed by Pool LogicSig)
    int 5 // 5 if asset 2 is an ASA
    int 4 // 4 if asset 2 is Algo
    int Token2
    int 0 // Algo
    ==
    select
    global GroupSize
    ==
    assert

    gtxna 1 ApplicationArgs 1
    btoi
    int Token1
    ==
    gtxna 1 ApplicationArgs 2
    btoi
    int Token2
    ==
    &&
    assert

    // ensure sender (signer) of AssetConfig tx is same as sender of app call
    gtxn 2 Sender
    txn Sender
    ==
    assert

    // ensure gtxn 2 is type AssetConfig
    gtxn 2 TypeEnum
    int acfg
    ==
    assert

    // ensure a new asset is being created
    gtxn 2 ConfigAsset
    int 0
    ==
    assert

       // ensure asset total amount is max int
          gtxn 2 ConfigAssetTotal
          int 0
          > // inverse of 0 is max int
          assert


    // ensure decimals is 6
    gtxn 2 ConfigAssetDecimals
    int 6
    ==
    assert

    // ensure default frozen is false
    gtxn 2 ConfigAssetDefaultFrozen
    int 0
    ==
    assert

    // ensure unit name is 'TM1POOL'
    gtxn 2 ConfigAssetUnitName
    byte "ELEMPOOL"
    ==
    assert

    // ensure asset name begins with 'Element Pool '
    // the Validator app ensures the name ends with "{asset1_unit_name}-{asset2_unit_name}"
    gtxn 2 ConfigAssetName
    substring 0 13
    byte "Element Pool "
    ==
    assert

    // ensure asset url is 'https://Element.org'
    gtxn 2 ConfigAssetURL
    byte "https://Element.org"
    ==
    assert

    // ensure no asset manager address is set
    gtxn 2 ConfigAssetManager
    global ZeroAddress
    ==
    assert

    // ensure no asset reserve address is set
    gtxn 2 ConfigAssetReserve
    global ZeroAddress
    ==
    assert

    // ensure no asset freeze address is set
    gtxn 2 ConfigAssetFreeze
    global ZeroAddress
    ==
    assert

    // ensure no asset clawback address is set
    gtxn 2 ConfigAssetClawback
    global ZeroAddress
    ==
    assert

    // Asset 1 optin
    // Ensure optin txn is signed by the same sig as this txn
    gtxn 3 Sender
    txn Sender
    ==
    assert

    // ensure txn type is AssetTransfer
    gtxn 3 TypeEnum
    int axfer
    ==
    assert

    // ensure the asset id is the same as asset 1
    gtxn 3 XferAsset
    int Token1
    ==
    assert

    // ensure the receiver is the sender
    gtxn 3 AssetReceiver
    txn Sender
    ==
    assert

    // ensure the amount is 0 for Optin
    gtxn 3 AssetAmount
    int 0
    ==
    assert

    // if asset 2 is not 0 (Algo), it needs an optin
    int Token2
    int 0
    !=
    bnz bootstrap__non_algo

    gtxn 1 Fee
    gtxn 2 Fee
    +
    gtxn 3 Fee
    +
    store 1 // fee_total
    b check_fees


    bootstrap__non_algo:
    // verify 5th txn is asset 2 optin txn
    gtxn 4 Sender
    txn Sender
    ==
    assert
    gtxn 4 TypeEnum
    int axfer
    ==
    assert

    // ensure the asset id is the same as asset 2
    gtxn 4 XferAsset
    int Token2   
    ==
    assert

    // ensure the receiver is the sender
    gtxn 4 AssetReceiver
    txn Sender
    ==
    assert

    // ensure the amount is 0 for Optin
    gtxn 4 AssetAmount
    int 0
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    gtxn 3 Fee
    +
    gtxn 4 Fee
    +
    store 1 // fee_total
    b check_fees

mint:
    // Mint Checks:
    //
    // # ensure group size is 5
    // global GroupSize == 5

    // 	# ensure transaction fees are covered by txn 0
    // 	# ensure Pool is not paying the fee
    // 	gtxn 0 Sender != txn Sender
    // 	gtxn 0 Receiver == txn Sender
    // 	gtxn 0 Amount >= (gtxn 1 Fee + gtxn 4 Fee)

    // 	# verify the receiver of the liquidity token asset is the one whose local state is updated
    // 	gtxna 1 Accounts 1 != txn Sender
    // 	gtxna 1 Accounts 1 == gtxn 4 AssetReceiver

    // 	# from Pooler to Pool asset 1
    // 	gtxn 2 Sender (Pooler) != txn Sender (Pool)
    // 	gtxn 2 AssetReceiver (Pool) == txn Sender (Pool)
    // 	gtxn 2 Sender (Pooler) == gtxn 3 Sender (Pooler)

    // 	# from Pooler to Pool asset 2
    // 	txn Sender (Pool) == (gtxn 3 AssetReceiver or gtxn 3 Receiver) (Pool)


    // 	# from Pool to Pooler liquidity token
    // 	gtxn 4 AssetReceiver (Pooler) == gtxn 2 Sender (Poooler)
    // 	gtxn 4 Sender (Pool) == txn Sender (Pool)


    // ensure group size is 5:
    // 0: Pay Fees (signed by Pooler)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pooler)
    // 3: Asset Transfer/Pay (signed by Pooler)
    // 4: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 5
    ==
    assert

    // verify the receiver of the asset is the one whose local state is updated
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    gtxna 1 Accounts 1
    gtxn 4 AssetReceiver
    ==
    assert

    // verify txn 2 is AssetTransfer from Pooler to Pool
    gtxn 2 Sender
    txn Sender
    !=
    assert

    gtxn 2 AssetReceiver
    txn Sender
    ==
    assert

    gtxn 3 Sender
    gtxn 2 Sender
    ==
    assert

    // verify txn 3 is AssetTransfer from Pooler to Pool
    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    == // check if Algo
    select
    txn Sender
    ==
    assert

    // verify txn 4 is AssetTransfer from Pool to Pooler
    gtxn 4 Sender
    txn Sender
    ==
    assert

    gtxn 4 AssetReceiver
    gtxn 2 Sender
    ==
    assert

    gtxn 1 Fee
    gtxn 4 Fee
    +
    store 1 // fee_total
    b check_fees


burn:
    // Burn Checks:
    //
    // # ensure group size is 5
    // global GroupSize == 5

    // # ensure transaction fees are covered by txn 0
    // # ensure Pool is not paying the fee
    // gtxn 0 Sender != txn Sender
    // gtxn 0 Receiver == txn Sender
    // gtxn 0 Amount >= (gtxn 1 Fee + gtxn 2 Fee gtxn 3 Fee)

    // # ensure the calculated amounts are not 0
    // calculated_asset1_out != 0
    // calculated_asset2_out != 0

    // # verify the receiver of the assets is the one whose local state is updated
    // gtxna 1 Accounts 1 != txn Sender
    // gtxna 1 Accounts 1 == gtxn 2 AssetReceiver
    // gtxna 1 Accounts 1 == (gtxn 3 AssetReceiver or gtxn 3 Receiver)

    // # from Pool to Pooler asset 1
    // gtxn 2 Sender (Pooler) == txn Sender (Pool)
    // gtxn 2 AssetReceiver (Pool) == gtxn 4 Sender (Pool)
    // gtxn 3 Sender (Pool) == txn Sender (Pool)

    // # from Pool to Pooler asset 2
    // gtxn 4 Sender (Pooler) == (gtxn 3 AssetReceiver or gtxn 3 Receiver) (Pool)


    // # from Pooler to Pool liquidity token
    // gtxn 4 Sender (Pooler) != txn Sender (Pool)
    // gtxn 4 AssetReceiver == txn Sender (Pool)

    // ensure group size is 5:
    // 0: Pay Fees (signed by Pooler)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pool LogicSig)
    // 3: Asset Transfer/Pay (signed by Pool LogicSig)
    // 4: Asset Transfer/Pay (signed by Pooler)
    global GroupSize
    int 5
    ==
    assert

    // verify the receiver of the assets is the one whose local state is updated
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    gtxna 1 Accounts 1
    gtxn 2 AssetReceiver
    ==
    assert

    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    ==
    select
    gtxna 1 Accounts 1
    ==
    assert

    // 2: AssetTransfer - from Pool to Pooler asset 1
    gtxn 2 Sender
    txn Sender
    ==
    assert

    gtxn 2 AssetReceiver
    gtxn 4 Sender
    ==
    assert

    gtxn 3 Sender
    txn Sender
    ==
    assert

    // 3: AssetTransfer - from Pool to Pooler asset 2
    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    == // if algo
    select
    gtxn 4 Sender
    ==
    assert

    // 4: AssetTransfer - from Pooler to Pool liquidity token
    gtxn 4 Sender
    txn Sender
    !=
    assert

    gtxn 4 AssetReceiver
    txn Sender
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    gtxn 3 Fee
    +
    store 1 // fee_total
    b check_fees


swap:
    // ensure group size is 4:
    // 0: Pay Fees (signed by Swapper)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Swapper)
    // 3: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 5
    ==
    assert

    //  ensure accounts[1] is not Pool
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    // ensure the sender of asset in is the one whose local state is updated
    gtxn 2 Sender
    gtxna 1 Accounts 1
    ==
    assert

    // ensure txn 2 sender is not the Pool
    gtxn 2 Sender
    txn Sender
    !=
    assert

    // ensure txn 3 sender is the Pool
    gtxn 3 Sender
    txn Sender
    ==
    assert

    // ensure txn 2 receiver is Pool
    gtxn 2 AssetReceiver
    gtxn 2 Receiver
    gtxn 2 TypeEnum
    int pay
    == // if Algo
    select
    txn Sender
    ==
    assert

    // ensure txn 3 receiver is Swapper (sender of txn 2)
    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    == // if Algo
    select
    gtxn 2 Sender
    ==
    assert

    gtxn 1 Fee
    gtxn 3 Fee
    +
    store 1 // fee_total
    b check_fees


redeem:
    // ensure group size is 3:
    // 0: Pay Fees (signed by Swapper)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 3
    ==
    assert

    //  ensure accounts[1] is not Pool
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    // ensure the receiver of the asset is the one whose local state is updated
    gtxn 2 AssetReceiver
    gtxn 2 Receiver
    gtxn 2 TypeEnum
    int pay
    == // if algo
    select
    gtxna 1 Accounts 1
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    store 1 // fee_total
    b check_fees


redeem_fees:
    // ensure group size is 3:
    // 0: Pay Fees (signed by User)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 3
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    store 1 // fee_total
    b check_fees



check_fees:
    // ensure gtxn 0 amount covers all fees
     // ensure Pool is not paying the fee
    gtxn 0 Sender
    txn Sender
    !=
    assert

     // ensure Pool is receiving the fee
    gtxn 0 Receiver
    txn Sender
    ==
    assert

    gtxn 0 Amount
    load 1 // fee_total
    >=
    return`;
const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";

const token = {
    'X-API-key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl',
}
// const express = require('express');
// const app = express();
// const cors = require('cors');
// app.use(express.json());
// app.use(cors());
let indexerClient = new algosdk.Indexer(token, baseServer, port);
function PoolPage() {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://evm-rpc-testnet.sei-apis.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    const [ swapamount1, setSwapamount1 ] = useState("");
    const [ swapamount2, setSwapamount2 ] = useState("");
    const [ liqamount1, setLiqamount1 ] = useState("");
    const [ liqamount2, setLiqamount2 ] = useState("");
    const [ slippage, setSlippage ] = useState(0.01);
    const [allowance1, setAllowance1] = useState("");
    const [allowance2, setAllowance2] = useState("");
    const [allowancePair, setAllowancePair] = useState("");
    const [allowanceLiq1, setAllowanceLiq1] = useState("");
    const [allowanceLiq2, setAllowanceLiq2] = useState("");
    const [ token1, setToken1 ] = useState("");
    const [ token2, setToken2 ] = useState("");
    const [ tokenName1, setTokenName1 ] = useState("");
    const [ tokenName2, setTokenName2 ] = useState("");
    const [ tokenDecimals1, setTokenDecimals1 ] = useState(18);
    const [ tokenDecimals2, setTokenDecimals2 ] = useState(18);
    const [ tokenbal1, setTokenbal1 ] = useState(0.0);
    const [ tokenbal2, setTokenbal2 ] = useState(0.0);
    const [ ethbal, setEthbal ] = useState(0.0);
    const [ remLiquidity, setRemLiquidity ] = useState(0.0);
    const [ liquidityval1, setliquidityval1 ] = useState(0.0);
    const [ liquidityval2, setliquidityval2 ] = useState(0.0);
    const [ liquidityval11, setliquidityval11 ] = useState(0.0);
    const [ liquidityval22, setliquidityval22 ] = useState(0.0);
    const [ liquidbal, setliquidbal ] = useState(0.0);
    const [ liquidbal1, setliquidbal1 ] = useState(0.0);
    const [ liquidbal2, setliquidbal2] = useState(0.0);
    const [ userPairs, setUserPairs ] = useState([]);
    const[loader, setLoader] = useState(false);
    const[loader1, setLoader1] = useState(false);
    const[loader2, setLoader2] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [showNoLiquidity, setShowNoLiquidity] = useState(false);
    

    const [show, setShow] = React.useState(false);
    const [liquidity, setLiquidity] = React.useState(false);
    const [pair, setPair] = React.useState(false);
    const [remove, setRemove] = React.useState(false);
    const [manage, setManage] = React.useState(false);
    const [dbcheck, setdbcheck] = React.useState(false);
    const [input1, setValue] = React.useState('0.0');
    const [input2, setValue1] = React.useState('0.0');
    const[vs1,setvs1]=useState("");
    const[vs2,setvs2]=useState("")
    const[pc1 ,setpc1]= useState("");
    const[pc2 ,setpc2]= useState("");
    const [appId,setAppId] = useState("");
    const[as1,setas1] = useState([]);
    const[as2,setas2] = useState([]);
    const[as3,setas3] = useState([]);
    const[rstate,setrstate]= useState([]);
    const [AssetId1,setAssetId1] = useState("");
    const [AssetId2,setAssetId2] = useState("");
    const[aprice,setaprice]= useState([]);
    const[pooledValue,setpooladdedValue] = useState("");
    const[esdata,setesdata]=useState("");

    const[ass1,setAssets1]= React.useState("");
    const[assn1,setAssetsn1]= React.useState("");

    const[balanceid1,setbamalanceid1]= useState("");
    const[balanceid2,setbamalanceid2]= useState("");
    // let a = [];
    
    const[amount1Out,setamount1Out]= useState([]);
    const[amount2Out,setamount2Out]= useState([]);
    const[gvprice,setgivenprice]=useState("");
    const[amount2Value,setamount2] = useState("");
    const[amount1Value,setamount1] = useState("");
    const[samount1,setsAmount1] = useState("");
    const[samount2,setsAmount2] = useState("");
    const[liquidityamount,setliquidityamount]=useState("");
    const[a1balance,setas1balance]=useState("");
    const[a2balance,setas2balance]=useState("");
    const[excessb,setexcessb] = useState("");
    const[assn,setAssetsn]= React.useState("");
    const[ass,setAssets]= React.useState("");
    const [algoPrice, setAlgoPrice] = useState("");
    const [usdcPrice, setUsdcPrice] = useState("");
    const[pr1,setpr1]= useState("");
    const[pr2,setpr2]= useState("");

    const[tk1,sett1] = useState("");
    const[tk2,sett2] = useState("");
    const[swapopt,setoswapopt]= useState(false);
    const[esc,setesc]= useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLiquidiy = () => {setLiquidity(!liquidity); setPair(false)};
    const handlePair = () => {setLiquidity(!liquidity); setPair(!pair)};
    const handleManage = () => {setManage(!manage); setShow(!show)};
    const handleRemove = () => setRemove(!remove);
    
    const [showOptInButton, setShowOptInButton] = React.useState(false);
    const [showMintButton, setShowMintButton] = React.useState(false);
    const [s1, sets1] = useState("");
    const [s2, sets2] = useState("");
    const [ilt, setilt] = useState("");
    const[dbdata,setdbdata] = useState([]);
    const[asPrice,setasprice] = useState([]);
    const[unclaimed_protocol_fees,setunclaimed_protocol_fees]= useState("");
    const[outstanding_asset1_amount,setoutstanding_asset1_amount]= useState("")
    const[outstanding_asset2_amount,setoutstanding_asset2_amount]= useState("")
    const[outstanding_liquidity_amount,setoutstanding_liquidity_amount]= useState("")

    const[id1Token,setTokenId1] = useState("");
    const[id2Token,setTokenId2] = useState("");
    const[logovalue1,setlogo1] = useState("");
    const[logovalue2,setlogo2] = useState("");
    // console.log("dbdata",dbdata)
    // useEffect(() =>{ufirst()},[])

    // useEffect(() =>{callp()},[])

    const [token, setToken] = useState([]);
   

    const ufirst =() =>{
      if(dbdata.length <= 0){
        first();
        
       
     }
     checkbalan();
     
    ////console.log("tk1",tk1)
     
    }
    const callp1 =() =>{
      if(tk1){
        // console.log("tk1")
         call_price1();
      }
    }
    const callp2 =() =>{
      if(tk2){
         call_price2();
      }
    }
    
    const call_price1 =async()=>{
      let p1;
      
      if(tk1 === "Algo"){
        p1 =  algoPrice;
       
      }
      else if(tk1 === "USDC"){
        
        p1 = usdcPrice;
       
      }
     
      setpr1(p1);
    }
    const call_price2 =async()=>{
      let p2;
      if(tk2 === "Algo"){
       p2 = algoPrice;
      }
      else if(tk2 === "USDC"){
        p2 = usdcPrice;
      }
    
      setpr2(p2);
    }
    
    const first = async() =>{
     
      // let capi = await callapiforuserslist();

      // setToken(capi)
      let capi = await getpairedtokens()
    setToken(capi);
      if(capi){
        let tokendata = capi;
        // setdbdata(e.data);
       
        let arrayvalue =[];
        let arrayvalue1 =[];
        let arrayvalue2 =[];
        let assetprice =[];
        let edata=[];
        let arvaluearray=[];
        for(let i=0;i<tokendata.length ; i++){
         
          let a1,a2,b1,b2,b3,b4;
          if(tokendata[i].profileURL === localStorage.getItem("walletAddress")){
            if(tokendata[i].algoAddress === "26YB76MYZHKHCGRAJLQRMVFSEI5OUR5W22WW7ABODC5JXLG4JPL3U5OYIA"){

            }
            else{
          // if(e.data[i].profileURL){
            edata.push(tokendata[i])
          
            // const assets = await indexerClient.lookupAssetByID(e.data[i].accountType).do();
            // const assets2 = await indexerClient.lookupAssetByID(e.data[i].profileName).do();
            // setas1(assets.asset.params.name);
            // arrayvalue.push(assets.asset.params.name)
            // arrayvalue1.push(assets2.asset.params.name)
            a1 = await readingLocalstate(algodClient,tokendata[i].algoAddress);
            //console.log("values",tokendata[i]);
            
            // console.log("name",assert1Reserve(await readingLocalstate(algodClient,tokendata[i].algoAddress)))
            // arrayvalue.push(assert1Reserve(a1))
            // // console.log("as1",as1)
            // // a2 = await readingLocalstate(algodClient,tokendata[i].algoAddress);
            // arrayvalue1.push(assert2Reserve(a1))
            // console.log("enetering values")
            // arrayvalue2.push(assert3Reserve(a1))
            // assetprice.push(asset1_price(assert1Reserve(a1),assert2Reserve(a1)))
            // console.log("enetering values")

            b1 = assert1Reserve(a1);
            b2 = assert2Reserve(a1);
            b3 = assert3Reserve(a1);
            //console.log("a1",b1,b2,b3)
            b4 = asset1_price(assert1Reserve(a1),assert2Reserve(a1));
            //console.log("a1",b4)
            }
          }
          
          if(b1 === undefined & b2  === undefined & b3 === undefined & b4 === undefined){
           
          }
          else{
            arvaluearray = {
              "a1":b1,"a2":b2,"a3":b3,"a4":b4
            };
            arrayvalue.push(arvaluearray);
          }
         
           console.log("arvaluearray",arvaluearray)
          
          // arrayvalue1.push(b2);
          // arrayvalue2.push(b3);
          // assetprice.push(b4);
         
          
        }
        //console.log("coming",arrayvalue)
        setas1(arrayvalue);
        //console.log("arrayvalue1",arrayvalue)

      //  setas2(arrayvalue1);
      //  setas3(arrayvalue2);
      //  console.log("assetprice",assetprice)
      //  setasprice(assetprice);

       setdbdata(edata)
       //console.log("edata",edata)
       
      };
      let pk1 = await priceOfCoin1();
      setAlgoPrice(pk1);
      
   
    let pk2 = await priceOfCoin2();

    setUsdcPrice(pk2);
    
    }
   

    
    async function readLocalState(client, account, index1,asset1,asset2,asset3){
        let accountInfoResponse = await readingLocalstate(client,account);
        
        for(let i=0;i<15;i++){
          let keys = accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'];
          // console.log("keys",keys)
          if(keys === "czE="){
           sets1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           
          }
          if(keys === "czI="){
              sets2(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           
          }
          if(keys === "aWx0"){
              setilt(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            
            } 
          if(keys === "cA=="){
            setunclaimed_protocol_fees(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           
          } 
          if(keys.slice(0,2) === "bw"){
            let a1 = decodLocalState(String(keys));
           
            if(decodLocalState(keys) === asset1){
              setoutstanding_asset1_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              
            } 
            if(decodLocalState(keys) === asset2){
              setoutstanding_asset2_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
             
            } 
            if(decodLocalState(keys) === asset3){
              setoutstanding_liquidity_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           
            }
          }          
         
          // let a2 = decodLocalState(asset2);
          // let a3 = decodLocalState(asset3);
          // if(decodLocalState(keys) === asset1){
          //   setoutstanding_asset1_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
          //   console.log("outstanding",  outstanding_asset1_amount  )
          // } 
          // if(keys === a2){
          //   setoutstanding_asset2_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
          //   console.log("ilt", outstanding_asset2_amount )
          // } 
          // if(keys === a3){
          //   setoutstanding_liquidity_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
          //   console.log("ilt",outstanding_liquidity_amount )
          // } 
        }
      //   for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      //     if (accountInfoResponse['apps-local-state'][i].id == index1) {
      //         console.log("Application's global state:");
      //         for (let n = 0; n < accountInfoResponse['apps-local-state'][i]['key-value'].length; n++) {
      //            // console.log(accountInfoResponse['apps-local-state'][i]['key-value']);
      //             let enc = accountInfoResponse['apps-local-state'][i]['key-value'][n];
      //             if(enc['key'] === "czE="){
      //               sets1(enc.value.uint)
      //               console.log("s1",s1)
      //             }
      //             if(enc['key'] === "czI="){
      //               sets2(enc.value.uint)
      //               console.log("s2",s2)
      //             }
      //             if(enc['key'] === "aWx0"){
      //               setilt(enc.value.uint)
      //             }                  
      //         }
              
      //     }
      // }
    }
    // useEffect(() =>{},[s1,s2])
    const waitForConfirmation = async function (algodclient, txId) {
        let status = await algodclient.status().do();
        let lastRound = status["last-round"];
        while (true) {
          const pendingInfo = await algodclient
            .pendingTransactionInformation(txId)
            .do();
          if (
            pendingInfo["confirmed-round"] !== null &&
            pendingInfo["confirmed-round"] > 0
          ) {
            //Got the completed Transaction
            // console.log(
            //   "Transaction " +
            //     txId +
            //     " confirmed in round " +
            //     pendingInfo["confirmed-round"]
            // );
            break;
          }
          lastRound++;
          await algodclient.statusAfterBlock(lastRound).do();
        }
      };

      const checkbalan = async()=>{
        //console.log("balance",id1Token)
        let s1 = await find_balance(id1Token);
        setbamalanceid1(s1);
       
        let s2 = await find_balance(id2Token);
        setbamalanceid2(s2);
        //console.log("balance",s2,id2Token)
      }
    const bootstrap = async (appid) => {
      //console.log("value1",(input1))
      if(localStorage.getItem("tokenid1") ==="" ||localStorage.getItem("tokenid1") ===undefined ||localStorage.getItem("tokenid1")===null){
        localStorage.setItem("tokenid1","0");
      }
      if(tk1 === "ETH"){
        localStorage.setItem("tokenid1","0");
      }
      if(tk2 === "TAU"){
        localStorage.setItem("tokenid2",71682000);
      }
        const algodClient = new algosdk.Algodv2(
          "",
          "https://api.testnet.algoexplorer.io",
          ""
        );
        let t1;
        let t2;

       

        let tokenid1 = localStorage.getItem("tokenid1");
        let tokenid2 = localStorage.getItem("tokenid2");
        let ci1;
        let ci2;
    if(parseInt(tokenid1) > parseInt(tokenid2) ){
      localStorage.setItem("tokenid1",tokenid1);
      localStorage.setItem("tokenid2",tokenid2);
      t1 = tokenid1;
      t2 = tokenid2;
      ci1 = input1;
      ci2 = input2;
      // setvs1(input1);
      // setvs2(input2)
      // //console.log(t1)
      // //console.log(t2)
    }
    else{
      localStorage.setItem("tokenid1",tokenid2);
      localStorage.setItem("tokenid2",tokenid1);
       t1 = tokenid2;
       t2 = tokenid1;
       ci1 = input2;
      ci2 = input1;
      //  setvs1(input2);
      // setvs2(input1)
      // //console.log(t1)
      // //console.log(t2)
    }
    console.log("tokenid1",tokenid1,tokenid2)
        let index = parseInt(appID_global);
       
        let replacedData = data.replaceAll("Token1",t1)
        let replacedData2 = replacedData.replaceAll("Token2",t2)
        let replacedData3 = replacedData2.replaceAll("appId",appID_global);
        let results = await algodClient.compile(replacedData3).do();
        
        // let acinfores = await readingLocalstate(algodClient,results.hash);
        // let calculateds1 = await assert1Reserve(acinfores);
        // let calculateds2 = await assert2Reserve(acinfores);

        // let cali1 = await convert1(ci1,calculateds1,calculateds2);
        // let cali2 = await convert2(ci2,calculateds1,calculateds2);


        setvs1(ci1);
        setvs2(ci2);
        // console.log("cali1",cali1,cali2);

        localStorage.setItem("escrow",results.hash)
    
        let program = new Uint8Array(Buffer.from(results.result, "base64"));
    
        let lsig = algosdk.makeLogicSig(program);
        // console.log("Escrow =", lsig.address());
        try {
          const accounts = await myAlgoWallet.connect();
          const addresses = accounts.map((account) => account.address);
          const params = await algodClient.getTransactionParams().do();
    
          let sender =  localStorage.getItem("walletAddress");;
          let recv_escrow = lsig.address();
          let amount ;
         
          
          if(parseInt(t2) == 0){
            let accountasset1 = await algodClient.getAssetByID(t1).do();
            // let accountasset2 = await algodClient.getAssetByID(t2).do();
            let unit1 = accountasset1.params['unit-name'];
            // console.log(unit1)
            let unit2 ="ETH";
            amount = 860000;
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: sender,
              to: recv_escrow,
              amount: amount,
              note: undefined,
              suggestedParams: params,
            });
      
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("bootstrap")));
            appArg.push(algosdk.encodeUint64(parseInt(t1)));
            appArg.push(algosdk.encodeUint64(parseInt(t2)));
            let foreignassets = [];
            foreignassets.push(parseInt(t1));
            // foreignassets.push(parseInt(t2));
            const transaction2 = algosdk.makeApplicationOptInTxnFromObject({
              from: recv_escrow,
              appIndex: index,
              appArgs: appArg,
              accounts: [sender],
              foreignAssets: foreignassets,
              suggestedParams: params,
            });
      
            const transaction3 =
              algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                assetName: "Element Pool "+unit1+"-"+"ETH",
                unitName: "ELEMPOOL",
                assetURL: "https://Element.org",
                total: 18446744073709551615n,
                decimals: 6,
                note: undefined,
                suggestedParams: params,
              });
      
            const transaction4 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: recv_escrow,
                assetIndex: parseInt(t1),
                note: undefined,
                amount: 0,
                suggestedParams: params,
              });
      
            
      
            const groupID = algosdk.computeGroupID([
              transaction1,
              transaction2,
              transaction3,
              transaction4
            ]);
            const txs = [
              transaction1,
              transaction2,
              transaction3,
              transaction4              
            ];
            txs[0].group = groupID;
            txs[1].group = groupID;
            txs[2].group = groupID;
            txs[3].group = groupID;
      
            const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
            const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
      
            const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
            const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
            
      
            
            toast.info("Transaction in Progress"); 
            const response = await algodClient
              .sendRawTransaction([
                signedTx1.blob,
                signedTx2.blob,
                signedTx3.blob,
                signedTx4.blob
              ])
              .do();
          //console.log("TxID", JSON.stringify(response, null, 1));
          await waitForConfirmation(algodClient, response.txId);
          toast.success(`Transaction Success ${response.txId}`);
         
          setShowOptInButton(true);
          }
          else{
            let accountasset1 = await algodClient.getAssetByID(t1).do();
            let accountasset2 = await algodClient.getAssetByID(t2).do();
            let unit1 =accountasset1.params['unit-name']
           
            amount = 961000;
            let unit2 =accountasset2.params['unit-name']
          let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender,
            to: recv_escrow,
            amount: amount,
            note: undefined,
            suggestedParams: params,
          });
    
          let appArg = [];
          appArg.push(new Uint8Array(Buffer.from("bootstrap")));
          appArg.push(algosdk.encodeUint64(parseInt(t1)));
          appArg.push(algosdk.encodeUint64(parseInt(t2)));
          let foreignassets = [];
          foreignassets.push(parseInt(t1));
          foreignassets.push(parseInt(t2));
          const transaction2 = algosdk.makeApplicationOptInTxnFromObject({
            from: recv_escrow,
            appIndex: index,
            appArgs: appArg,
            accounts: [sender],
            foreignAssets: foreignassets,
            suggestedParams: params,
          });
    
          const transaction3 =
            algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
              from: recv_escrow,
              assetName: "Element Pool " + unit1 + "-" + unit2,
              unitName: "ELEMPOOL",
              assetURL: "https://Element.org",
              total: 18446744073709551615n,
              decimals: 6,
              note: undefined,
              suggestedParams: params,
            });
    
          const transaction4 =
            algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from: recv_escrow,
              to: recv_escrow,
              assetIndex: parseInt(t1),
              note: undefined,
              amount: 0,
              suggestedParams: params,
            });
    
          const transaction5 =
            algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from: recv_escrow,
              to: recv_escrow,
              assetIndex: parseInt(t2),
              note: undefined,
              amount: 0,
              suggestedParams: params,
            });
    
          const groupID = algosdk.computeGroupID([
            transaction1,
            transaction2,
            transaction3,
            transaction4,
            transaction5,
          ]);
          const txs = [
            transaction1,
            transaction2,
            transaction3,
            transaction4,
            transaction5,
          ];
          txs[0].group = groupID;
          txs[1].group = groupID;
          txs[2].group = groupID;
          txs[3].group = groupID;
          txs[4].group = groupID;
    
          const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
          const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
    
          const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
          const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
          const signedTx5 = algosdk.signLogicSigTransaction(txs[4], lsig);
    
          
          toast.info("Transaction in Progress");
          const response = await algodClient
            .sendRawTransaction([
              signedTx1.blob,
              signedTx2.blob,
              signedTx3.blob,
              signedTx4.blob,
              signedTx5.blob,
            ])
            .do();
          //console.log("TxID", JSON.stringify(response, null, 1));
          await waitForConfirmation(algodClient, response.txId);
          toast.success(`Transaction Success ${response.txId}`);
          setShowOptInButton(true);
          }
          
          
         
          //setShowOptInButton(true);
        } catch (err) {
          toast.error(`Transaction Failed due to ${err}`);
          //console.error(err);
        }
      };
      const optIn =async (appid) => {

        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
        const params = await algodClient.getTransactionParams().do();
        let escrowaddress = localStorage.getItem("escrow");
        let accountInfoResponse = await algodClient.accountInformation(escrowaddress).do();
   
        let assetId3 = accountInfoResponse['created-assets'][0]['index'];
        localStorage.setItem("newasset",assetId3);
        // console.log('Asset 3 ID: ', assetId3);
  
  
      
    let index = parseInt(appid);
    // console.log("appId inside donate", index)
  try {
    

    let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from:localStorage.getItem("walletAddress"),
      to :localStorage.getItem("walletAddress"),
      assetIndex: assetId3 ,
      amount: 0,
      suggestedParams:params,
      appIndex:index
    });

    
      
      const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
      toast.info("Transaction in Progress");

  const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
  //console.log("TxID", JSON.stringify(response, null, 1));
  await waitForConfirmation(algodClient, response.txId);
  toast.success(`Transaction Success ${response.txId}`);
  // toast.info("Create Liquidity Done Sucessfully");
  setShowMintButton(true);
    } catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      //console.error(err);
    }

     
  }
  const mint = async (appid) => {
 
    let index = parseInt(appid);
    // console.log("appId inside donate", index);
    // console.log("input1",input1)
    // console.log("input2",input2)
    setAppId(appid);
    let tokenid1 = localStorage.getItem("tokenid1");
    let tokenid2 = localStorage.getItem("tokenid2");
      
    let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appID_global);
    let results = await algodClient.compile(replacedData).do();

    // console.log("Hash = " + results.hash);
    // console.log("Result = " + results.result);

    
    let assetId3 = localStorage.getItem("newasset")
    // console.log(assetId3)

    
    let program = new Uint8Array(Buffer.from(results.result, "base64"));

    let lsig = algosdk.makeLogicSig(program);
    // console.log("Escrow =", lsig.address()); 



    let total;
    console.log("s1",vs1,vs2)
    // if (s1 === undefined || s2 === "") {
      total = (Math.sqrt(vs1 * vs2) - 1000);
      // total = Math.floor(total - (total * 0.05));
      // total = total -(total * 0.05);
      // console.log("Total,: ", total);
    // } else {
      // let liquidity_asset_amount = Math.min(
      //   (vs1 * ilt) / s1,
      //   (vs2 * ilt) / s2
      // );
      // total = Math.floor((liquidity_asset_amount - liquidity_asset_amount ) * 0.05);
      // console.log("Total 2: ", total);
    // }
    let asset1Name = await assetName(tokenid1);
    let asset2Name = await assetName(tokenid2);
    let asset3Name = await assetName(assetId3);

    const userjsonkey= {
      "algoAddress": results.hash,
      "creationTime": "",
      "accountType": tokenid1,    
      "profileName": tokenid2,
      "twitterName": assetId3,   
      "profileURL": localStorage.getItem("walletAddress"),
      "asset1Name": asset1Name,
      "asset2Name": asset2Name,
      "escrowData": results.result
  }
  console.log("values")
    {
                                
          // this.setState({setLoading:false}) ;  
          // this.setState({setisOpenmkyc:true}); 
          try {

            const params = await algodClient.getTransactionParams().do();
            let sender = localStorage.getItem("walletAddress");
      
            let recv_escrow = lsig.address();
            let amount = 3000;
      
            let note1 = [];
            note1.push(new Uint8Array(Buffer.from("fee")));
            if(parseInt(tokenid2) == 0){
      
              let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                amount: amount,
                suggestedParams: params,
              });
        
              let appArg = [];
              appArg.push(new Uint8Array(Buffer.from("mint")));
        
              let foreignassets = [];
              foreignassets.push(parseInt(tokenid1));
              // foreignassets.push(parseInt(tokenid2));
              foreignassets.push(parseInt(assetId3));
              const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
                from: recv_escrow,
                appIndex: index,
                appArgs: appArg,
                appAccounts: sender,
                accounts: [sender],
                foreignAssets: foreignassets,
                suggestedParams: params,
              });
        
              const transaction3 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  assetIndex: parseInt(tokenid1),
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(vs1),
                  suggestedParams: params,
                });
        
              const transaction4 =
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(vs2),
                  suggestedParams: params,
                });
        
              let foreignassetliquidity = [];
              foreignassetliquidity.push(parseInt(assetId3));
              // console.log(total.toFixed(0));
              const transaction5 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: recv_escrow,
                  to: sender,
                  assetIndex: parseInt(assetId3),
                  note: undefined,
                  accounts: [recv_escrow],
                  appAccounts: recv_escrow,
                  foreignAssets: foreignassetliquidity,
                  amount: parseInt(total),
                  suggestedParams: params,
                });
                console.log("total",total)
                const groupID = algosdk.computeGroupID([
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ]);
                const txs = [
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ];
                for (let i = 0; i <= 4; i++) txs[i].group = groupID;
          
                const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
                const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
        
                const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
                toast.info("Transaction in Progress");
                const response = await algodClient
                  .sendRawTransaction([
                    signedTxArray[0].blob,
                    signedTx1.blob,
                    signedTxArray[1].blob,
                    signedTxArray[2].blob,
                    signedTx2.blob,
                  ])
                  .do();
              //console.log("TxID", JSON.stringify(response, null, 1));
                await waitForConfirmation(algodClient, response.txId);
      
                
                // await postuserdetail(userjsonkey);
                // await postusertx(localStorage.getItem("walletAddress"),response.txId,recv_escrow,"Create Liquidity",0,total,tokenid1,tokenid2,amount);
                toast.success(`Transaction Success ${response.txId}`);
                toast.info("Creating Liquidity Done Sucessfully");
                await createpair(recv_escrow,asset1Name,asset2Name,asset3Name,tokenid1,tokenid2,assetId3)
                await createtpairhistory(recv_escrow,(vs1+vs2),(vs1+vs2+total),amount,asset1Name,asset2Name,asset3Name,tokenid1,tokenid2,assetId3);
               
                
                // window.location.reload();
              //   setTxId(response.txId);
            }
            else{
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: sender,
              to: recv_escrow,
              amount: amount,
              suggestedParams: params,
            });
      
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("mint")));
      
            let foreignassets = [];
            foreignassets.push(parseInt(tokenid1));
            foreignassets.push(parseInt(tokenid2));
            foreignassets.push(parseInt(assetId3));
            const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
              from: recv_escrow,
              appIndex: index,
              appArgs: appArg,
              appAccounts: sender,
              accounts: [sender],
              foreignAssets: foreignassets,
              suggestedParams: params,
            });
      
            const transaction3 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid1),
                note: undefined,
                accounts: sender,
                amount: parseInt(vs1),
                suggestedParams: params,
              });
      
            const transaction4 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid2),
                note: undefined,
                accounts: sender,
                amount: parseInt(vs2),
                suggestedParams: params,
              });
      
            let foreignassetliquidity = [];
            foreignassetliquidity.push(parseInt(assetId3));
          //console.log(total.toFixed(0));
            const transaction5 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: sender,
                assetIndex: parseInt(assetId3),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts: recv_escrow,
                foreignAssets: foreignassetliquidity,
                amount: parseInt(Math.round(total)),
                suggestedParams: params,
              });
              const groupID = algosdk.computeGroupID([
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ]);
              const txs = [
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ];
              for (let i = 0; i <= 4; i++) txs[i].group = groupID;
        
              const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
              const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
      
              const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
              toast.info("Transaction in Progress");
              const response = await algodClient
                .sendRawTransaction([
                  signedTxArray[0].blob,
                  signedTx1.blob,
                  signedTxArray[1].blob,
                  signedTxArray[2].blob,
                  signedTx2.blob,
                ])
                .do();
            //console.log("TxID", JSON.stringify(response, null, 1));
              await waitForConfirmation(algodClient, response.txId);
              
              // await postuserdetail(userjsonkey);
              // await postusertx(localStorage.getItem("walletAddress"),response.txId,recv_escrow,"Create Liquidity",0,total,tokenid1,tokenid2,amount);
              await createpair(recv_escrow,asset1Name,asset2Name,asset3Name,tokenid1,tokenid2,assetId3);
              await createtpairhistory(recv_escrow,(vs1+vs2),(vs1+vs2+total),amount,asset1Name,asset2Name,asset3Name,tokenid1,tokenid2,assetId3);
              toast.success(`Transaction Success ${response.txId}`);
              toast.info("Creating Liquidity Done Sucessfully");
              // window.location.reload();
              // setTxId(response.txId);
            }
            
           
            setShow(true);
          } catch (err) {
            toast.error(`Transaction Failed due to ${err}`);
          //console.error(err);
          }                                         
        }
    
  };
  const mint1call = async (appid,a1,a2,asn1,asn2) => {
 
    let index = parseInt(appid);
  //console.log("appId inside donate", index);
  //console.log("input1",a1)
  //console.log("input2",a2)
    setAppId(appid);
    let tokenid1 = rstate?.accountType;
    let tokenid2 = rstate?.profileName;
      
    let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appID_global);
    let results = await algodClient.compile(replacedData).do();

  //console.log("Hash = " + results.hash);
  //console.log("Result = " + results.result);

    
    let assetId3 = rstate?.twitterName;
  //console.log(assetId3)

    let program = new Uint8Array(Buffer.from(results.result, "base64"));

    let lsig = algosdk.makeLogicSig(program);
  //console.log("Escrow =", lsig.address()); 

    // readLocalState(algodClient,results.hash,appId,tokenid1,tokenid2,assetId3);

let i1 = Math.floor(a1);
let i2 = Math.floor(a2);
console.log("input1",i1)
  //console.log("input2",ilt)
let tvl = s1+s2;
let vl = s1 + s2 + ilt;
    let total;
   

      let liquidity_asset_amount = Math.min(
        (i1 * ilt) / s1,
        (i2 * ilt) / s2
      );
      liquidity_asset_amount = liquidity_asset_amount - (liquidity_asset_amount * 0.05)
      //  let liquidity_asset_amount = Math.min(
      //   (i1 * aprice[3]) / aprice[0],
      //   (i2 * aprice[3]) / aprice[1]
      // );
    //console.log("liquidity_asset_amount",liquidity_asset_amount)
      // total = Math.floor((liquidity_asset_amount - liquidity_asset_amount )* 0.5);
      total = Math.floor(liquidity_asset_amount)
    console.log("Total 2: ", total,a1,Math.floor(a2));
   

                          
          // this.setState({setLoading:false}) ;  
          // this.setState({setisOpenmkyc:true}); 
          try {

            const params = await algodClient.getTransactionParams().do();
            let sender = localStorage.getItem("walletAddress");
      
            let recv_escrow = lsig.address();
            let amount = 3000;
      
            let note1 = [];
            note1.push(new Uint8Array(Buffer.from("fee")));
            if(parseInt(tokenid2) == 0){
      
              let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                amount: amount,
                suggestedParams: params,
              });
        
              let appArg = [];
              appArg.push(new Uint8Array(Buffer.from("mint")));
        
              let foreignassets = [];
              foreignassets.push(parseInt(tokenid1));
              // foreignassets.push(parseInt(tokenid2));
              foreignassets.push(parseInt(assetId3));
              const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
                from: recv_escrow,
                appIndex: index,
                appArgs: appArg,
                appAccounts: sender,
                accounts: [sender],
                foreignAssets: foreignassets,
                suggestedParams: params,
              });
      //console.log("3rdtran",i1)
              const transaction3 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  assetIndex: parseInt(tokenid1),
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(Math.floor(i1)),
                  suggestedParams: params,
                });
        
              const transaction4 =
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(Math.floor(i2)),
                  suggestedParams: params,
                });
        
              let foreignassetliquidity = [];
              foreignassetliquidity.push(parseInt(assetId3));
            //console.log(total.toFixed(0));
              const transaction5 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: recv_escrow,
                  to: sender,
                  assetIndex: parseInt(assetId3),
                  note: undefined,
                  accounts: [recv_escrow],
                  appAccounts: recv_escrow,
                  foreignAssets: foreignassetliquidity,
                  amount: (total),
                  suggestedParams: params,
                });
                const groupID = algosdk.computeGroupID([
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ]);
                const txs = [
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ];
                for (let i = 0; i <= 4; i++) txs[i].group = groupID;
          
                const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
                const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
        
                const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
                toast.info("Transaction in Progress");
                const response = await algodClient
                  .sendRawTransaction([
                    signedTxArray[0].blob,
                    signedTx1.blob,
                    signedTxArray[1].blob,
                    signedTxArray[2].blob,
                    signedTx2.blob,
                  ])
                  .do();
              //console.log("TxID", JSON.stringify(response, null, 1));
                await waitForConfirmation(algodClient, response.txId);
      let an = asn1 +"/"+ asn2;
               
                // await postusertx(localStorage.getItem("walletAddress"),response.txId,recv_escrow,"Add Liquidity",total,0,asn1,asn2,amount);
                await createtxhash(recv_escrow,response.txId,"ADD LIQUIDITY",total,an)
                await updatepairhistory(tokenid1,tokenid2,amount,tvl,vl);
                toast.success(`Transaction Success ${response.txId}`);
                toast.info("Add Liquidity Done Sucessfully");
              //   setTxId(response.txId);
            }
            else{
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: sender,
              to: recv_escrow,
              amount: amount,
              suggestedParams: params,
            });
      
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("mint")));
      
            let foreignassets = [];
            foreignassets.push(parseInt(tokenid1));
            foreignassets.push(parseInt(tokenid2));
            foreignassets.push(parseInt(assetId3));
            const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
              from: recv_escrow,
              appIndex: index,
              appArgs: appArg,
              appAccounts: sender,
              accounts: [sender],
              foreignAssets: foreignassets,
              suggestedParams: params,
            });
      
            const transaction3 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid1),
                note: undefined,
                accounts: sender,
                amount: parseInt(Math.floor(i1)),
                suggestedParams: params,
              });
      
            const transaction4 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid2),
                note: undefined,
                accounts: sender,
                amount: (Math.floor(i2)),
                suggestedParams: params,
              });
      
            let foreignassetliquidity = [];
            foreignassetliquidity.push(parseInt(assetId3));
          //console.log(total.toFixed(0));
            const transaction5 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: sender,
                assetIndex: parseInt(assetId3),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts: recv_escrow,
                foreignAssets: foreignassetliquidity,
                amount: ((total)),
                suggestedParams: params,
              });
              const groupID = algosdk.computeGroupID([
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ]);
              const txs = [
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ];
              for (let i = 0; i <= 4; i++) txs[i].group = groupID;
        
              const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
              const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
             
              const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
              toast.info("Transaction in Progress");
              const response = await algodClient
                .sendRawTransaction([
                  signedTxArray[0].blob,
                  signedTx1.blob,
                  signedTxArray[1].blob,
                  signedTxArray[2].blob,
                  signedTx2.blob,
                ])
                .do();
            //console.log("TxID", JSON.stringify(response, null, 1));
              await waitForConfirmation(algodClient, response.txId);
              let an = asn1 +"/"+asn2;
              // await postusertx(localStorage.getItem("walletAddress"),response.txId,recv_escrow,"Add Liquidity",total,0,asn1,asn2,amount);
              await createtxhash(recv_escrow,response.txId,"ADD LIQUIDITY",total,an)
              await updatepairhistory(tokenid1,tokenid2,amount,tvl,vl);
              toast.success(`Transaction Success ${response.txId}`);
              toast.info("Add Liquidity Done Sucessfully");
              handleLiquidiy();
              // setTxId(response.txId);
            }
            
           
            
          } catch (err) {
            toast.error(`Transaction Failed due to ${err}`);
            // console.error(err);
          }                                         
        
    
  };
  
 const optin =async () => {
   
    const myAlgoWallet = new MyAlgoConnect();
    const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
    
    
    
    let index = parseInt(appID_global);
    // console.log("appId inside donate", index)
  try {
   
    const params = await algodClient.getTransactionParams().do();

    let optinTranscation = algosdk.makeApplicationOptInTxnFromObject({
      from:localStorage.getItem("walletAddress"),
      suggestedParams:params,
      appIndex:index
    });

    
      
      const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
      
      toast.info("Transaction in Progress");
  const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
  // console.log("TxID", JSON.stringify(response, null, 1));
  await waitForConfirmation(algodClient, response.txId);
  
  // await postusertx(localStorage.getItem("walletAddress"),response.txId,0,"Opt-In App",0,0,"","",0);
  await createtxhash("-",response.txId,"App Opt-In","-","-")
  toast.success(`Transaction Success ${response.txId}`);
  toast.info("App Opt-In Succeed")

    } catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      // console.error(err);
    }
  }

  const rem = async(a1,a2,a3) =>{
    let escrowaddress = rstate?.algoAddress;
    await readLocalState(algodClient,escrowaddress,appID_global,a1,a2,a3);
      
    handleRemove()
  }
  const addli = async() =>{
    let s1 =  await find_balance(rstate?.accountType);
    // console.log("b1",s1)
    setas1balance(s1);
    let s2 = await find_balance(rstate?.profileName);
    setas2balance(s2);
    //console.log("b2",s2)
    // const assets1 = await indexerClient.lookupAssetBalances(rstate?.accountType).do();
    // console.log("asset",assets1)
    // assets1.balances.map((a)=>{
    //   if(a.address == localStorage.getItem("walletAddress")){
    //     setas1balance(a.amount)
    //   }
    // })
    // const assets2 = await indexerClient.lookupAssetBalances(rstate?.profileName).do();
    // assets2.balances.map((a)=>{
    //   if(a.address == localStorage.getItem("walletAddress")){
    //     setas2balance(a.amount)
    //   }
    // })
    
  }
  const percent = async(entered_percent) =>{
       let liquidity_asset_in = gvprice * entered_percent / 100;
       setliquidityamount(liquidity_asset_in);
        //console.log("v",liquidity_asset_in) 
  
        let asset1_amount = (liquidity_asset_in * s1) / ilt ;
        //console.log(asset1_amount)
        let asset2_amount = (liquidity_asset_in * s2) / ilt ;
        let asset1_amount_out = asset1_amount - (asset1_amount * 0.5)
        setamount1Out(asset1_amount_out)
        let asset2_amount_out = asset2_amount - (asset2_amount * 0.5)
        setamount2Out(asset2_amount_out)

        //console.log("asset1_amount_out",asset1_amount_out)
        
        //console.log("asset2_amount_out",asset2_amount_out)

  }
    const percent1 = async (an1,an2) => {
      let tokenid1 = rstate?.accountType;
      let tokenid2 = rstate?.profileName;
      let index = parseInt(appID_global);
      //console.log("appId inside donate", tokenid2);

      
      let t1,t2;
      if(tokenid1 > tokenid2 ){
          t2 = tokenid2;
          t1 = tokenid1;
          
      }
      else{
          t2 = tokenid1;
          t1 = tokenid2;
          
      }
  
      
    // let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appId);
    // let results = await algodClient.compile(replacedData).do();
      let replacedData = data.replaceAll("Token1",t1).replaceAll("Token2",t2).replaceAll("appId",appID_global);
      let results = await algodClient.compile(replacedData).do();
   //console.log("data")
      setesdata(results);
      //console.log("Hash = " + results.hash);
      //console.log("Result = " + results.result);
      let escrowaddress = results.hash;
      //console.log("escrow",escrowaddress)
      let program = new Uint8Array(Buffer.from(results.result, "base64"));
  
      let lsig = algosdk.makeLogicSig(program);
      //console.log("Escrow =", lsig.address()); 
      await readLocalState(algodClient,escrowaddress,index,t1,t2,"0");
      let ana1 = await assetName(tokenid1);
      let ana2 = await assetName(tokenid2);
            // let accountInfoResponse = await algodClient.accountInformation(results.hash).do();
      // //console.log("account",accountInfoResponse);
      // let assetId3 = accountInfoResponse['created-assets'][0]['index'];
      
      // let k = await indexerClient.lookupAccountByID(rstate?.algoAddress).do();
     
      // //console.log("k",k)
     
          try {
            // const accounts = await myAlgoWallet.connect();
            // const addresses = accounts.map(account => account.address);
            const params = await algodClient.getTransactionParams().do();
            
            let sender =  localStorage.getItem("walletAddress");
            let recv_escrow = lsig.address();
            let amount = 3000;
            let vl = s1+s2 + ilt;  
            let tvl = s1 + s2;      
            let note1=[];
            note1.push(new Uint8Array(Buffer.from("fee")));
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from:  localStorage.getItem("walletAddress"), 
              to: recv_escrow, 
              amount: amount, 
              //  note: note1,  
               suggestedParams: params
             });
           
             let appArg = [];
             appArg.push(new Uint8Array(Buffer.from("burn")));
             
             let foreignassets = [];
            //  let decAddr = algosdk.decodeAddress(addresses[0]);
            //  foreignassets.push(decAddr.publicKey);
             foreignassets.push(parseInt(t1));
             foreignassets.push(parseInt(t2));
             foreignassets.push(parseInt(rstate?.twitterName));
             const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
                 from: recv_escrow, 
                 appIndex: index,
                 appArgs: appArg,
                 appAccounts: localStorage.getItem("walletAddress"),
                 accounts: [ localStorage.getItem("walletAddress")],
                 foreignAssets:foreignassets,
                 suggestedParams: params
               });
      
             
              //console.log(parseInt(amount1Out).toFixed(0))
              const transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from:recv_escrow ,
                to:  localStorage.getItem("walletAddress"),
                assetIndex: parseInt(t1),
                note: undefined,
                accounts:  localStorage.getItem("walletAddress"),
                amount: parseInt(parseInt(amount1Out.toFixed(0))),
                suggestedParams: params
              });
  
              const transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from:recv_escrow ,
                to:  localStorage.getItem("walletAddress"),
                assetIndex: parseInt(t2),
                note: undefined,
                accounts:  localStorage.getItem("walletAddress"),
                amount: parseInt(amount2Out.toFixed(0)),
                suggestedParams: params
              });
              
              let foreignassetliquidity =[];
              foreignassetliquidity.push(parseInt(rstate?.twitterName));
              // let decAddr = algosdk.decodeAddress(recv_escrow);
              // let acc =[];
              // acc.push(decAddr.publicKey);
              const transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from:  localStorage.getItem("walletAddress") ,
                to:recv_escrow ,
                assetIndex: parseInt(rstate?.twitterName),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts:recv_escrow,
                foreignAssets:foreignassetliquidity,
                amount: parseInt(liquidityamount),
                suggestedParams: params
              });
      
          
            const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4, transaction5]);
            const txs = [ transaction1, transaction2, transaction3, transaction4, transaction5];
            txs[0].group = groupID;
            txs[1].group = groupID;
            txs[2].group = groupID;
            txs[3].group = groupID;
            txs[4].group = groupID;
            
            const signedTx1 = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[4].toByte()]);
            const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
            const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
            const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
            // const signedTx5 = await myAlgoWallet.signTransaction(txs[4].toByte());
            toast.info("Removing Liquidity in Progress");
      const response = await algodClient.sendRawTransaction([ signedTx1[0].blob, signedTx2.blob, signedTx3.blob, signedTx4.blob, signedTx1[1].blob ]).do();
         
    //console.log("TxID", JSON.stringify(response, null, 1));
    
    
    await waitForConfirmation(algodClient, response.txId);
    let an = ana1 +"/"+ana2;
    // await postusertx(localStorage.getItem("walletAddress"),response.txId,0,"Remove Liquidity",0,0,"","",amount);
    await createtxhash(recv_escrow,response.txId,"REMOVE LIQUIDITY",liquidityamount,an)
    await updatepairhistory(tokenid1,tokenid2,amount,tvl,vl);
     
    handleRemove()
    toast.success(`Transaction Completed Successfully ${response.txId}`);
    toast.info("Removing Liquidity is Done!")  
  } catch (err) {
        toast.error(`Transaction Failed due to ${err}`);
        //console.error(err);
      }
    };

const manager = async(r,a,b,c) =>{
const erc20Contract = new ethers.Contract(r?.tokenAddress1, ERC20ABI, provider);
const erc20Contract2 = new ethers.Contract(r?.tokenAddress2, ERC20ABI, provider);
let l=[];
l.push(a);
l.push(b);
l.push(c);
if(r?.tokenAddress1 !== WSEIAddress){
  let bal1 = ethers.utils.formatUnits( await erc20Contract.balanceOf(address), r?.tokenDecimals1);
  setliquidbal1(bal1);
} else {
  const eth = await provider.getBalance(address);
  setEthbal(eth);
}
if(r?.tokenAddress2 !== WSEIAddress){
  let bal2 = ethers.utils.formatUnits( await erc20Contract2.balanceOf(address), r?.tokenDecimals2);
  setliquidbal2(bal2);
} else {
  const eth = await provider.getBalance(address);
  setEthbal(eth);
}
  setrstate(r);
  setaprice(l);
  // let p = await readingLocalstate(algodClient,r.algoAddress);
  // //console.log("prime",p)
  //   let p1 =await rewardasset1(p, r.accountType);
  //  //console.log("afterp1",p1)
  //   let p2 = rewardasset2(p,r.profileName);
  //   let p3 = await rewardasset3(p,r.twitterName);
    
  //   let added = p1 + p2 + p3;
    //console.log("rewardasset3",added)
    setpooladdedValue(a+b+c);
    //console.log("pooled",pooledValue)
  handleManage();
}
const manager1 = async() =>{
  let v = await find_balance_escrow(rstate?.twitterName,rstate?.algoAddress)
  //console.log("balance",v)
  setexcessb(v);
  let s =  await find_balance(rstate?.twitterName);
  setgivenprice(s)
  // // let a =  (algosdk.encodeUint64((65613731)));

  // //console.log("ssetgiven",s);
    
  

}
//console.log("rstate",rstate);

const pool= async()=>{
  // await createpair ("J7VRGVZBL27ESEC22PFOUEW4NKF6WPHIEIL477O2HABEWJO2RS2XADSF2U",
  // "ELEM","ETH","Element Pool ELEM-ETH",71116238,0,75692365,
  //   "26YB76MYZHKHCGRAJLQRMVFSEI5OUR5W22WW7ABODC5JXLG4JPL3U5OYIA")
  // await createtpairhistory("J7VRGVZBL27ESEC22PFOUEW4NKF6WPHIEIL477O2HABEWJO2RS2XADSF2U",
  // 77167245,4413213,3000,"ELEM","ETH","Element Pool ELEM-ETH",71116238,0,75692365)
  
  first()
  handleShow()
}
const addingliq =(esc,tid1,tid2,tid3)=>{
  readLocalState(algodClient,esc,appId,tid1,tid2,tid3);
  handleLiquidiy();

}
function SetValue1(Amountin){
  let amount2 = convert1((Amountin * 1000000),aprice[0],aprice[1]);
  //console.log("amout2",amount2)
  setamount2(amount2/1000000);
  setsAmount1(Amountin * 1000000)
  setsAmount2(amount2)
}
function SetValue2(Amountin){
  let amount2 = convert2((Amountin * 1000000),aprice[0],aprice[1]);
  //console.log("amout2",amount2)
  setamount1(amount2/1000000);
  setsAmount1(amount2)
  setsAmount2(Amountin * 1000000)
}



// const pooladdedvalues= async(k) =>{
    
// }
// useEffect(() =>{()},[])
// const asset_reserve= (escrAddr,a1,a2,a3) =>{
//   readLocalState(algodClient,escrAddr,appID_global,a1,a2,a3)
//   let s =[];
//   s.push(s1);
//   //console.log("arrayvalues",s1)
// }
// const findBalance = async() =>{
//   let v = await find_balance(rstate?.twitterName)
//   //console.log("balance",v)
//   setexcessb(v);
// }

 const setVal =(k) =>{
  setValue(k);
  callp1();
  setpc1(pr1 * (k/1000000));
  //console.log("price1",pr1*k)
 }
 const setVal2 =(k) =>{
  setValue1(k);
   callp2();
  setpc2(pr2 * (k/1000000));
  //console.log("price1",pr2*k)
 }

 const approveSei1 = async(token11) => {
  try{
      setLoader1(true);
      console.log("approve starts...");
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const erc20Contract = new ethers.Contract(token11, ERC20ABI, signer);
      // const cfContract = new ethers.Contract(cftokenAddress, cftokenAbi, signer);
      let tx;
      
          tx = await erc20Contract.approve(PancakeRouterV2Address, ethers.utils.parseUnits((1000000000).toString(), 18));
      
      await tx.wait();
      toast.success(toastDiv(tx.hash, `Approved Succesfuly`));
      await fun();
      setLoader1(false);
  }catch(e){
      setLoader1(false);
      console.error(e);
  }
 
}

const approveSei2 = async(token22) => {
  try{
      setLoader1(true);
      console.log("approve starts...");
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const erc20Contract = new ethers.Contract(token22, ERC20ABI, signer);
      // const cfContract = new ethers.Contract(cftokenAddress, cftokenAbi, signer);
      let tx;
      
          tx = await erc20Contract.approve(PancakeRouterV2Address, ethers.utils.parseUnits((1000000000).toString(), 18));
      
      await tx.wait();
      toast.success(toastDiv(tx.hash, `Approved Succesfuly`));
      await fun();
      setLoader1(false);
  }catch(e){
      setLoader1(false);
      console.error(e);
  }
 
}

const approvePair = async() => {
  try{
      setLoader2(true);
      console.log("approve starts...");
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const pairContract = new ethers.Contract(rstate?.pair, PancakePairV2ABI, signer);
      // const cfContract = new ethers.Contract(cftokenAddress, cftokenAbi, signer);
      let tx;
      
      tx = await pairContract.approve(PancakeRouterV2Address, ethers.utils.parseUnits((1000000000000).toString(), 18));
      
      await tx.wait();
      toast.success(toastDiv(tx.hash, `Approved Succesfuly`));
      await fun3();
      setLoader2(false);
  }catch(e){
      setLoader2(false);
      console.error(e);
  }
 
}


  const addLiquiditysei = async(amount1, amount2, token11, token22, decimals1, decimals2, name1, name2, state) => {
      try{
        setLoader1(true);
        const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
        const signer =  ethersProvider.getSigner();
        const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
        const currentEpoch = Math.floor(Date.now() / 1000); // current epoch in seconds
        const epochPlus10Minutes = currentEpoch + (10 * 60); // adding 10 minutes
        const factoryContract = new ethers.Contract(PancakeFactoryV2Address, PancakeFactoryV2ABI, signer);
        let pairAddress = await factoryContract.getPair(token11,token22);
        
        // Helper function to format amount correctly
    const formatAmount = (amount, decimals, a) => {
      const parts = amount.toString().split('.');
      if (parts.length === 2 && parts[1].length > decimals) {
        throw new Error(`Fractional component exceeds decimals: ${amount} with decimals ${decimals} and ${a}`);
      }
      return ethers.utils.parseUnits(amount.toString(), decimals);
    };

    // Convert the deposit amount to wei
    let amountInWei = formatAmount(amount1, decimals1, 1);
    let amountInWei2 = formatAmount(amount2, decimals2, 2);
    console.log("event pre: ", amount1, amount2);
    // let amountInWei2Slipped = formatAmount(parseFloat(amount2 - (amount2 * (slippage / 100))).toFixed(decimals2), decimals2, 3);
    console.log("check", amountInWei, amountInWei2);

        let tx;
        if(name1 === "ETH" || name1 === "WSEI" || name1 === "SEI"){

          tx = await swapContract.addLiquidityETH(token22, amountInWei2, 0, 0, address, epochPlus10Minutes, {value: amountInWei, gasLimit:3000000});

        } else if (name2 === "ETH" || name2 === "WSEI" || name2 === "SEI") {

          tx = await swapContract.addLiquidityETH(token11, amountInWei, 0, 0, address, epochPlus10Minutes, {value: amountInWei2, gasLimit:3000000});

        } else {

          tx = await swapContract.addLiquidity(token11, token22, amountInWei, amountInWei2, 0, 0, address, epochPlus10Minutes);

        }
        
        await tx.wait();
        toast.success(toastDiv(tx.hash, `Transaction Success`));
        let pairAddress1 = await factoryContract.getPair(token11,token22);
        if (pairAddress === "0x0000000000000000000000000000000000000000"){
                  // Get the current time in milliseconds
        const currentTimeMillis = new Date().getTime();

        // Convert milliseconds to seconds (Epoch time is in seconds)
        const epochTimeSeconds = Math.floor(currentTimeMillis / 1000);

          await createLiqlistFirebase(`${name1}-${name2}`,name1, name2, address,token11,token22,decimals1, decimals2,pairAddress1, epochTimeSeconds); 
        }
        if(state){
          setSwapamount1("");
          setSwapamount2("");
          await fun();
          await fun1();
        } else {
          setLiqamount1("");
          setLiqamount2("");
          await fun4();
          await fun3();
        }
        
        setLoader1(false);
        
    }catch(e){
        setLoader1(false);
        console.error(e);
    }
  }

  const remLiquiditysei = async() => {
    try{
      setLoader2(true);
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
      const currentEpoch = Math.floor(Date.now() / 1000); // current epoch in seconds
      const epochPlus10Minutes = currentEpoch + (10 * 60); // adding 10 minutes
      const decimalLimit = Math.pow(10, 18);
      console.log("eth:",ethers.utils.parseUnits(((Math.floor((remLiquidity * decimalLimit)/decimalLimit))).toString(),0), remLiquidity); 
      let tx;
      
      if(rstate?.asset1Name === "WSEI"){

        tx = await swapContract.removeLiquidityETH(rstate?.tokenAddress2, ethers.utils.parseUnits(((Math.floor((remLiquidity * decimalLimit)/decimalLimit))).toString(),0), 0, 0, address, epochPlus10Minutes);

      } else if (rstate?.asset2Name === "WSEI") {

        tx = await swapContract.removeLiquidityETH(rstate?.tokenAddress1, ethers.utils.parseUnits(((Math.floor((remLiquidity * decimalLimit)/decimalLimit))).toString(),0), 0, 0, address, epochPlus10Minutes);

      } else {

        tx = await swapContract.removeLiquidity(rstate?.tokenAddress1, rstate?.tokenAddress2, ethers.utils.parseUnits(((Math.floor((remLiquidity * decimalLimit)/decimalLimit))).toString(),0), 0, 0, address, epochPlus10Minutes);

      }
      
      await tx.wait();
      toast.success(toastDiv(tx.hash, `Remove Liquidity Successful`));
      setRemLiquidity("");
      await fun();
      setLoader2(false);
  }catch(e){
      setLoader2(false);
      console.error(e);
  }
  handleRemove();
}

const handleremLiq = async (a) => {
  console.log("check handle:", rstate);
  const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
  const pairContract = new ethers.Contract(rstate?.pair, PancakePairV2ABI, provider);
  let pairBal1 = await pairContract.balanceOf(address);
  console.log("check handle1:", ethers.utils.formatUnits(pairBal1, 0) * (a / 100), remLiquidity, rstate?.pair);
  let rmliq = ethers.utils.formatUnits(pairBal1, 0) * (a / 100);
  setRemLiquidity(rmliq);

  const decimalLimit = Math.pow(10, 18);
  // Use rmliq directly to fetch liquidity values
  let [amount0, amount1] = await routerContract.getLiquidityValue(rstate?.pair, ethers.utils.parseUnits((Math.floor((rmliq * decimalLimit)/decimalLimit)).toString(), 0));
  console.log("check handle1:", amount0, amount1);

  // Update state in one go
  setliquidityval11(ethers.utils.formatUnits(amount0, 0));
  setliquidityval22(ethers.utils.formatUnits(amount1, 0));

  console.log("check handle:", rstate, ethers.utils.formatUnits(amount0, 0), ethers.utils.formatUnits(amount1, 0));
};

// Example usage
useEffect(() => {
  // This effect will run every time liquidityval11 or liquidityval22 changes
  console.log("liquidity values updated:", liquidityval11, liquidityval22, userPairs);
}, [liquidityval11, liquidityval22, userPairs]);


  const getReserves = async(token11, token22) => {
    const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
    const signer =  ethersProvider.getSigner();
    const factoryContract = new ethers.Contract(PancakeFactoryV2Address, PancakeFactoryV2ABI, signer);
    let pairAddress = await factoryContract.getPair(token11,token22);
    if (pairAddress === "0x0000000000000000000000000000000000000000"){
      return 0,0;
    } else {
      const pairContract = new ethers.Contract(pairAddress, PancakePairV2ABI, signer);
    let [reserve11, reserve22, ] = await pairContract.getReserves();
    console.log("reserves:", pairAddress, reserve11, reserve22);
    return [reserve11, reserve22];
    }
    
  }

  const handleSwapamount1 = async(e) => {
    try{
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
      if(token1!== "" && token2 !==""){
        setSwapamount1(e);
        let [reserve11, reserve22] = await getReserves(token1, token2);
        
        if (reserve11 === 0 || reserve22 === 0){
              console.log("e:",e);
        } else {
          let swapAmount22 = await swapContract.quote(ethers.utils.parseUnits((e).toString(), tokenDecimals1), reserve11, reserve22);
          let swapbuff = ethers.utils.formatUnits(swapAmount22._hex, 0);
          setSwapamount2(parseFloat(swapbuff/(10**tokenDecimals2)).toFixed(tokenDecimals2));
          console.log("SwapAmount:", e, swapAmount22, swapbuff, parseFloat(swapbuff/(10**tokenDecimals2)));
        }   
      }
    }
    catch(e) {
      setSwapamount2("");
      console.log("error:", e);
    }
  };

  const handleSwapamount2 = async(e) => {
    try{
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
      if(token1!== "" && token2 !==""){
        setSwapamount2(e);
        let [reserve11, reserve22] = await getReserves(token1, token2);
        
        if (reserve11 === 0 || reserve22 === 0){

        } else {
          let swapAmount11 = await swapContract.quote(ethers.utils.parseUnits((e).toString(), tokenDecimals2), reserve22, reserve11);
          let swapbuff = ethers.utils.formatUnits(swapAmount11._hex, 0);
          setSwapamount1(parseFloat(swapbuff/(10**tokenDecimals1)).toFixed(tokenDecimals1));
          console.log("SwapAmount:", e, swapAmount11, swapbuff, parseFloat(swapbuff/(10**tokenDecimals1)));
        }   
      }
    }
    catch(e) {
      setSwapamount1("");
      console.log("error:", e);
    }
  };

  const handleLiqamount1 = async(e) => {
    try {
      const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
      if(rstate?.tokenAddress1!== "" && rstate?.tokenAddress2 !==""){
        setLiqamount1(e);
        let [reserve11, reserve22] = await getReserves(rstate?.tokenAddress1, rstate?.tokenAddress2);
        if (reserve11 === 0 || reserve22 === 0){
              console.log("e:",e);
        } else {
          let swapAmount22 = await swapContract.quote(ethers.utils.parseUnits((e).toString(), rstate?.tokenDecimals1), reserve11, reserve22);
          let swapbuff = ethers.utils.formatUnits(swapAmount22._hex, rstate?.tokenDecimals2);
          setLiqamount2(parseFloat(swapbuff).toFixed(rstate?.tokenDecimals2));
          console.log("SwapAmount:", e, swapAmount22, swapbuff);
        }   
      }
     } catch(e) {
       setLiqamount2("");
       console.error(e);
    }
    
  };

  const handleLiqamount2 = async(e) => {
    try {
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
      if(rstate?.tokenAddress1!== "" && rstate?.tokenAddress2 !==""){
        setLiqamount2(e);
        let [reserve11, reserve22] = await getReserves(rstate?.tokenAddress1, rstate?.tokenAddress2);
        
        if (reserve11 === 0 || reserve22 === 0){

        } else {
          let swapAmount11 = await swapContract.quote(ethers.utils.parseUnits((e).toString(), rstate?.tokenDecimals2), reserve22,  reserve11);
          let swapbuff = ethers.utils.formatUnits(swapAmount11._hex, rstate?.tokenDecimals1);
          setLiqamount1(parseFloat(swapbuff).toFixed(rstate?.tokenDecimals1));
          console.log("SwapAmount:", e, swapAmount11, swapbuff);
        }   
      }
    } catch(e) {
      setLiqamount1("");
      console.error(e);
  }
  };

  
  const fun = async() => {
    try{
      console.log("check use");
      const eth = await provider.getBalance(address);
      setEthbal(eth);
     
      let tokenbal1,tokenbal2;
      if(token1 !== WSEIAddress && token1 !== ""){
        const erc20Contract = new ethers.Contract(token1, ERC20ABI, provider);
        let allowance1 = ethers.utils.formatUnits( await erc20Contract.allowance(address, PancakeRouterV2Address), 0);
        setAllowance1(allowance1);
        tokenbal1 = ethers.utils.formatUnits(await erc20Contract.balanceOf(address),0);
        setTokenbal1(tokenbal1);
        console.log("allow",allowance1);
      }
      if(token2 !== WSEIAddress && token2 !== ""){
        const erc20Contract2 = new ethers.Contract(token2, ERC20ABI, provider);
        let allowance2 = ethers.utils.formatUnits( await erc20Contract2.allowance(address, PancakeRouterV2Address), 0);
        setAllowance2(allowance2);
        tokenbal2 = ethers.utils.formatUnits(await erc20Contract2.balanceOf(address),0);
        setTokenbal2(tokenbal2);
        console.log("allow2",allowance2, eth);
      }
      console.log("allow3",tokenbal1,tokenbal2,ethbal);
      // let balance1 = ethers.utils.formatUnits( await erc20Contract.balanceOf(address), 0); 
      // setbusdBalance(balance1);
    } catch(e) {
      console.error(e);
    }
    
}

const poolsei = async() => {
  try{
    setShowLoader(true);
    setLoader(true);
    await fun1();
    setLoader(false);
    handleShow();
  } catch (e){
    console.error(e);
    setLoader(false);
  }
  
}

// const fun1 = async () => {
//   try {
//     const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
//     let userPairs1 = await routerContract.getUserPairs(address);
//     console.log("userPairs:", userPairs1);
//     let pairBuff = [];

//     // Use Promise.all to wait for all the async map operations to complete
//     await Promise.all(userPairs1.map(async (x, i) => {
//       console.log("Processing pair address:", x);
//       // if (!ethers.utils.isAddress(x) || (x).toLowerCase() == ("0xb2A315326a6CD7F7449f3B641F6CEaAd6dCE3cC7").toLowerCase()) {
//       //   console.error(`Invalid pair address: ${x}`);
//       //   return;
//       // }

//       const pairContract = new ethers.Contract(x, PancakePairV2ABI, provider);
//       let liqbal1 = ethers.utils.formatUnits(await pairContract.balanceOf(address), 18);
//       let [reserve11, reserve22,] = await pairContract.getReserves();

//       let token11 = await pairContract.token0();
//       let token22 = await pairContract.token1();
//       if (!ethers.utils.isAddress(token11) || !ethers.utils.isAddress(token22)) {
//         console.error(`Invalid token addresses: ${token11}, ${token22}`);
//         return;
//       }

//       const erc20Contract1 = new ethers.Contract(token11, ERC20ABI, provider);
//       const erc20Contract2 = new ethers.Contract(token22, ERC20ABI, provider);
//       let assetName1 = await erc20Contract1.symbol();
//       let assetName2 = await erc20Contract2.symbol();
//       let decimals1 = await erc20Contract1.decimals();
//       let decimals2 = await erc20Contract2.decimals();
//       console.log("token:", i, x);
      
//       let swapPrice = await routerContract.quote(ethers.utils.parseUnits("1", decimals1), reserve11, reserve22);
//       console.log("token2:", i, x);
//       let priceinT1 = ethers.utils.formatUnits(swapPrice, decimals2);
//       let tokenbal1;
//       let tokenbal2;

//       if ((token11).toLowerCase() !== (WSEIAddress).toLowerCase()) {
//         tokenbal1 = await erc20Contract1.balanceOf(address);
//       } else {
//         tokenbal1 = await provider.getBalance();
//         console.log("bal",tokenbal1);
//       }

//       if ((token22).toLowerCase() !== (WSEIAddress).toLowerCase()) {
//         tokenbal2 = await erc20Contract2.balanceOf(address);
//       } else {
//         tokenbal2 = await provider.getBalance();
//       }

//       console.log("token3:", i, x);
//       pairBuff.push({
//         pair: x,
//         asset1Name: assetName1,
//         asset2Name: assetName2,
//         reserve1: ethers.utils.formatUnits(reserve11, decimals1),
//         reserve2: ethers.utils.formatUnits(reserve22, decimals2),
//         price: priceinT1,
//         tokenAddress1: token11,
//         tokenAddress2: token22,
//         tokenDecimals1: decimals1,
//         tokenDecimals2: decimals2,
//         tokenBal1: ethers.utils.formatUnits(tokenbal1, decimals1),
//         tokenBal2: ethers.utils.formatUnits(tokenbal2, decimals2),
//         liquidity: liqbal1
//       });
//       console.log("address", x);
//     }));

//     setUserPairs(pairBuff);
//     console.log("all pairs:", pairBuff, userPairs);
//   } catch (e) {
//     console.error("error1:", e);
//   }
// }

const fun1 = async () => {
  try {
    const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
    let userPairs1 = await routerContract.getUserPairs(address);
    console.log("userPairs:", userPairs1);
    let pairBuff = [];

    await Promise.all(userPairs1.map(async (x, i) => {
      console.log("Processing pair address:", x);

      const pairContract = new ethers.Contract(x, PancakePairV2ABI, provider);
      
      let liqbal1;
      let reserves;
      let token11;
      let token22;

      try {
        liqbal1 = ethers.utils.formatUnits(await pairContract.balanceOf(address), 18);
      } catch (e) {
        console.error(`Error fetching balance of pair ${x}:`, e);
        return;
      }

      try {
        reserves = await pairContract.getReserves();
      } catch (e) {
        console.error(`Error fetching reserves of pair ${x}:`, e);
        return;
      }

      try {
        token11 = await pairContract.token0();
      } catch (e) {
        console.error(`Error fetching token0 of pair ${x}:`, e);
        return;
      }

      try {
        token22 = await pairContract.token1();
      } catch (e) {
        console.error(`Error fetching token1 of pair ${x}:`, e);
        return;
      }

      if (!ethers.utils.isAddress(token11) || !ethers.utils.isAddress(token22)) {
        console.error(`Invalid token addresses: ${token11}, ${token22}`);
        return;
      }

      const erc20Contract1 = new ethers.Contract(token11, ERC20ABI, provider);
      const erc20Contract2 = new ethers.Contract(token22, ERC20ABI, provider);
      let assetName1;
      let assetName2;
      let decimals1;
      let decimals2;

      try {
        assetName1 = await erc20Contract1.symbol();
      } catch (e) {
        console.error(`Error fetching symbol for token ${token11}:`, e);
        return;
      }

      try {
        assetName2 = await erc20Contract2.symbol();
      } catch (e) {
        console.error(`Error fetching symbol for token ${token22}:`, e);
        return;
      }

      try {
        decimals1 = await erc20Contract1.decimals();
      } catch (e) {
        console.error(`Error fetching decimals for token ${token11}:`, e);
        return;
      }

      try {
        decimals2 = await erc20Contract2.decimals();
      } catch (e) {
        console.error(`Error fetching decimals for token ${token22}:`, e);
        return;
      }

      console.log("token:", i, x);

      let swapPrice;
      try {
        swapPrice = await routerContract.quote(ethers.utils.parseUnits("1", decimals1), reserves[0], reserves[1]);
      } catch (e) {
        console.error(`Error fetching swap price for pair ${x}:`, e);
        return;
      }

      console.log("token2:", i, x);
      let priceinT1 = ethers.utils.formatUnits(swapPrice, decimals2);
      let tokenbal1;
      let tokenbal2;

      try {
        if ((token11).toLowerCase() === (WSEIAddress).toLowerCase()) {
          tokenbal1 = ethbal;
          console.log("baleth");
        } else {
          tokenbal1 = await erc20Contract1.balanceOf(address);
          
        }
      } catch (e) {
        console.error(`Error fetching balance for token ${token11}:`, e);
        return;
      }

      try {
        if ((token22).toLowerCase() === (WSEIAddress).toLowerCase()) {
          tokenbal2 = ethbal;
        } else {
          tokenbal2 = await erc20Contract2.balanceOf(address);
          
        }
      } catch (e) {
        console.error(`Error fetching balance for token ${token22}:`, e);
        return;
      }

      console.log("token3:", i, x);

      pairBuff.push({
        pair: x,
        asset1Name: assetName1,
        asset2Name: assetName2,
        reserve1: ethers.utils.formatUnits(reserves[0], decimals1),
        reserve2: ethers.utils.formatUnits(reserves[1], decimals2),
        price: priceinT1,
        tokenAddress1: token11,
        tokenAddress2: token22,
        tokenDecimals1: decimals1,
        tokenDecimals2: decimals2,
        tokenBal1: ethers.utils.formatUnits(tokenbal1, decimals1),
        tokenBal2: ethers.utils.formatUnits(tokenbal2, decimals2),
        liquidity: liqbal1
      });
      console.log("address", x);
    }));

    setUserPairs(pairBuff);
    console.log("all pairs:", pairBuff, userPairs);
  } catch (e) {
    console.error("error1:", e);
  }
};


  const fun3 = async() => {
    if(address){
    const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
    const pairContract = new ethers.Contract(rstate?.pair, PancakePairV2ABI, provider);
    const erc20Contract = new ethers.Contract(rstate?.tokenAddress1, ERC20ABI, provider);
    const erc20Contract2 = new ethers.Contract(rstate?.tokenAddress2, ERC20ABI, provider);
    if(rstate?.tokenAddress1 !== WSEIAddress){
      let allowance1 = ethers.utils.formatUnits( await erc20Contract.allowance(address, PancakeRouterV2Address), 0);
      setAllowanceLiq1(allowance1);
      console.log("allow",allowance1);
    }
    if(rstate?.tokenAddress2 !== WSEIAddress){
      let allowance2 = ethers.utils.formatUnits( await erc20Contract2.allowance(address, PancakeRouterV2Address), 0);
      setAllowanceLiq2(allowance2);
      console.log("allow2",allowance2);
    }
    let allowancePair1 = ethers.utils.formatUnits(await pairContract.allowance(address, PancakeRouterV2Address), 18);
    setAllowancePair(allowancePair1)
    let liqbal1 = await pairContract.balanceOf(address);
    setliquidbal(ethers.utils.formatUnits(liqbal1, 18));
    let [amount0, amount1] = await routerContract.getLiquidityValue(rstate?.pair, liqbal1);
    setliquidityval1(ethers.utils.formatUnits(amount0,rstate?.tokenDecimals1));
    setliquidityval2(ethers.utils.formatUnits(amount1,rstate?.tokenDecimals2));
    console.log("remove Liquidity:", ethers.utils.formatUnits(amount0,rstate?.tokenDecimals1), ethers.utils.formatUnits(amount1,rstate?.tokenDecimals2), allowancePair1);
    }
  }

  const fun4 = async() => {
    try{
      if(address){
        const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
        const pairContract = new ethers.Contract(rstate?.pair, PancakePairV2ABI, provider);
        const erc20Contract = new ethers.Contract(rstate?.tokenAddress1, ERC20ABI, provider);
        const erc20Contract2 = new ethers.Contract(rstate?.tokenAddress2, ERC20ABI, provider);
        let rstatebuff;
        if(rstate?.tokenAddress1 !== WSEIAddress){
          let bal1 = ethers.utils.formatUnits( await erc20Contract.balanceOf(address), rstate?.tokenDecimals1);
          setliquidbal1(bal1);
          rstatebuff = {...rstate, tokenBal1: bal1};
          console.log("allow",allowance1);
        } else {
          const eth = await provider.getBalance(address);
          setEthbal(eth);
          let bal1 = ethers.utils.formatUnits( eth, rstate?.tokenDecimals1);
          rstatebuff = {...rstate, tokenBal1: bal1};
        }
        if(rstate?.tokenAddress2 !== WSEIAddress){
          let bal2 = ethers.utils.formatUnits( await erc20Contract2.balanceOf(address), rstate?.tokenDecimals2);
          setliquidbal2(bal2);
          rstatebuff = {...rstate, tokenBal2: bal2};
          console.log("allow2",allowance2);
        } else {
          const eth = await provider.getBalance(address);
          setEthbal(eth);
          let bal2 = ethers.utils.formatUnits( eth, rstate?.tokenDecimals2);
          rstatebuff = {...rstate, tokenBal2: bal2};
        }
        setrstate(rstatebuff);
      }
    } catch(e){
      console.log("fun4 error:", e);
    }
  }

  useEffect(() => {
    fun3();
  },[rstate, address, isConnected, remove]);

  // useEffect(() => {
  //   fun1();
  // },[address, isConnected]);

  useEffect(() => {
    fun();
    console.log("tokens:", token1, token2, tokenDecimals1, tokenDecimals2);
  },[address, isConnected, token1, token2]);

  const loaderDelay = async() => {
    if(userPairs.length === 0 && show) {
      setShowLoader(false);
      setShowNoLiquidity(true);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(loaderDelay,10000);
    return () => clearInterval(intervalId);
  }, [show]);

  const toastDiv = (txId,type) =>
    (
        <div>
          <p style={{color:'#FFFFFF'}}> {type} &nbsp;<a style={{color:'#AA14F0'}} href={`https://seitrace.com/tx/${txId}?chain=atlantic-2`} target="_blank" rel="noreferrer"><br/>View in Sei Explorer <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.7176 3.97604L1.69366 14L0.046875 12.3532L10.0697 2.32926H1.23596V0H14.0469V12.8109H11.7176V3.97604Z" fill='#AA14F0'/>
    </svg></a></p> 
        </div>
    );
    
    return (
        <Layout>
          <ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>
            <div className="page-content">
              
                <Container fluid="sm">
                
                    <div className="card-base text-center mb-30 card-pool card-dark">
                        {/* <Button className='card-close' variant='reset'>
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="1">
                                <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                                </g>
                            </svg>
                        </Button> */}
                        <h3><b>LIQUIDITY PROVIDER REWARDS</b></h3><br/>
                        <p style={{fontSize: '17px'}}>Liquidity providers earn a 0.20% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.</p>
                    </div>

                    <div className="card-base text-center card-pool card-dark">
                        <h3 >My Liquidity Positions</h3>
                        {/* <ButtonLoad loading={loader} onClick={()=>poolsei()} className='btn btn-grad btn-xl'>Liquidty</ButtonLoad> */}
                        <ButtonLoad loading={loader} className='mt-xxl-4 mt-2 btn w-70 btn-grad' style={{ width: 'auto' }} onClick={()=>poolsei()}>Liquidty</ButtonLoad>
                    </div>
                </Container>
            </div>

            <Modal show={show} centered={true} size="lg" onHide={handleClose}>
            
                <Modal.Body className='modal-liquidity-body'>
                  
                    <Button className='modal-close' onClick={handleClose} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                   

                    {!liquidity ? (
                        <div className="text-center">
                            <Row className='justify-content-center mb-100'>
                                <Col md={9}>
                                    <h3>LIQUIDITY PROVIDER REWARDS</h3><br/>
                                    <p>Liquidity providers earn a 0.20% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.</p>

                                    <a href="https://x.com/ElementDeFi" target="blank" className='btn-link-purple text-underline'>Learn more about providing liquidity</a>
                                </Col>
                            </Row>

                            <div className="d-flex flex-sm-row mb-10 flex-column justify-content-sm-between align-items-center">
                                <h6 className='mb-sm-0 mb-3'>Liquidity</h6>
                                {/* <div className="modal-manage" color="white">
                                <h6 className='mb-sm-0 mb-3'>Your liquidity</h6>
                    {dbdata.map(function (role, i) { <div >
                      
                      <h6 className='mb-sm-0 mb-3 "modal-manage"' >Your liquidity</h6>
                                  {(role.profileURL === localStorage.getItem("walletAddress"))?(<>
                                  <h1>Hello</h1>
                                  <h6 className='mb-sm-0 mb-3'>Your liquidity</h6>
                                    </>
                                  ):(<> <h6 className='mb-sm-0 mb-3'>Your liquidity</h6></>)}
                                    
                                </div>
                                })}
                                </div> */}
                                <div className="d-flex">
                                    <Button variant='grad' onClick={handlePair} className='text-none  ms-2'>Create Pair</Button>
                                    <Button variant='grad' className='text-none ms-2'>{userPairs?.length}</Button>
                                </div>
                            </div>
                            
                          
                            <div className="modal-manage mb-2">
                              {userPairs.length ===0 ?(
                                showLoader ? (
                                  <div className="center-loader">
                                    <img src="https://c.tenor.com/FBeNVFjn-EkAAAAS/ben-redblock-loading.gif" alt="Loading..." />
                                  </div>
                                ) : (
                                  <div className="center-loader">
                                    <p>No liquidity found</p>
                                  </div>
                                )
                              ) :(<>
                                {userPairs.map((r,i)=>{
                             
                             if(address){
                               // if(r.profileURL){
                               //console.log("rvalue",r,as1[i])
                               return (<div> 
                                 <div className="d-flex flex-sm-row mb-30 flex-column justify-content-sm-between align-items-center">
                                 <div class="d-flex align-items-center td-cell">
                                  <img src={Llogo} alt="icon" style={{width:'40px',height:'40px',borderRadius:'50%'}}/>
                                  <img src={Plogo} style={{width:'40px',height:'40px',borderRadius:'50%', marginLeft: '-15px'}} alt="icon" />
                                  <span class="ms-2">{r?.asset1Name}/{r?.asset2Name}</span>
                                </div>
                                 {/* <Breadcrumb className='mb-sm-0 mb-3'>
                                   
                                 
                                     <Breadcrumb.Item>
                                       
                                         
                                            <img src={elem} width="31" height="30" alt='icon' />
                                          
                                      
            
                                       {r.asset1Name.toUpperCase()}
                                         </Breadcrumb.Item>
                                     <Breadcrumb.Item>
                                       
 <img src={tau} width="31" height="30" alt='icon' />
                                         {r.asset2Name.toUpperCase()}
                                     </Breadcrumb.Item>
                                 </Breadcrumb> */}

                                 <h6 className='mb-0'>1 {r?.asset1Name}  = {r?.price ? parseFloat(r?.price).toFixed(3) : "0"} {r?.asset2Name}</h6>
                             </div>

                             <div className="d-flex flex-md-row flex-column justify-content-md-between align-items-center">
                                 <Row className='mb-md-0 mb-30 text-nowrap align-items-center text-sm-start'>
                                     <Col sm={4} >
                                         {/* <h6>99.99%</h6> */}
                                         
                                         <p>Pool Share</p>
                                         
                                     </Col>
                                     <Col sm={3} className='text-center py-sm-0 py-3'>
                                         <h6 >{r?.price ? parseFloat(r?.liquidity).toFixed(3) : "0"} </h6>
                                         
                                     </Col>
                                     <Col sm={4}>
                                         <h6 >{r?.reserve1 ? parseFloat(r?.reserve1).toFixed(3) : "0"}  {r?.asset1Name}</h6>
                                         <h6>{r?.reserve2 ? parseFloat(r?.reserve2).toFixed(3) : "0"}  {r?.asset2Name}</h6>
                                         {/* <h6>~$1,070.67</h6> */}
                                     </Col>
                                 </Row>

                                 <Button variant='grad' onClick={()=>manager(r,r?.reserve1,r?.reserve2,r?.price)} className='text-none ms-2'>Manage</Button>
                             </div>   
                             </div>  )
                             }
                                      })}</>)}
                            
                              
                            
                             
                            </div>
                        </div>
                    ):(
                         (
                            <>
                                <div className="modal_header mb-50 d-flex align-items-center">
                                    <Button variant='reset' onClick={handleLiquidiy} className='p-0 me-4'>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                        </svg>
                                    </Button>

                                    <h2 className="h3 mb-0">CREATE LIQUIDITY</h2>     
                                </div>

                                <Row className='justify-content-center' >
                                    <Col md={9} lg={8}>
                                        <div className="mb-2">
                                            <label className='d-flex align-items-center justify-content-between' >From
                                            {(tk1 == "Algo")||(tk1 == "USDC") ? (<><small>Price:${pc1>0 ? parseFloat(pc1).toFixed(4) : pr1} {tk1.toUpperCase()}</small></>):(<></>) }
                                            
                                             </label>

                                            <div className="balance-card d-flex align-items-center justify-content-between" >
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white' value={swapamount1} onChange={(e) => handleSwapamount1(e.target.value)}  placeholder='0.0' />

                                              

                                            {/* <FilterDropdown setk = {(t1)=>sett1(t1)} ></FilterDropdown> */}
                                            {/* <FilterDropdown assetid1 = {AssetId1} setassetid1={(AssetId2)=>(setAssetId1(AssetId2))}  ass={ass1} setassets={(ass1)=>setAssets1(ass1)} setassetsn={(assn1)=>setAssetsn1(assn1)} assn = {assn1} setk = {(t1)=>sett1(t1)} setToken1Id={(ti1)=>{setTokenId1(ti1)}} setclicklogo1={(l1)=>{setlogo1(l1)}}></FilterDropdown> */}
                                            {/* <FilterDropdown assetid1 = {AssetId1} setassetid1={(AssetId1)=>(setAssetId1(AssetId1))}  ass={ass1} setassets={(ass1)=>setAssets1(ass1)} setassetsn={(assn1)=>setAssetsn1(assn1)} assn = {assn1} setk = {(t1)=>sett1(t1)} setToken1Id={(ti1)=>{setTokenId1(ti1)}} setclicklogo1={(l1)=>{setlogo1(l1)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname1)=>{setTokenName1(tokenname1)}} settokendecimals={(tokendecimals)=>{setTokenDecimals1(tokendecimals)}}></FilterDropdown> */}
                                            <FilterDropdown assetid1 = {AssetId1} setassetid1={(AssetId1)=>(setAssetId1(AssetId1))}  ass={ass1} setassets={(ass1)=>setAssets1(ass1)} setassetsn={(assn1)=>setAssetsn1(assn1)} assn = {assn1} setk = {(t1)=>sett1(t1)} setToken1Id={(ti1)=>{setTokenId1(ti1)}} setclicklogo1={(l1)=>{setlogo1(l1)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname1)=>{setTokenName1(tokenname1)}} settokendecimals={(tokendecimals)=>{setTokenDecimals1(tokendecimals)}}></FilterDropdown>

                                            </div>
                                        </div>
                                        {(tk1 == "ETH")||(tk1 == "SEI")||(tk1 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/(10 ** 18)).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal1 || tokenbal1 === 0)?'0.0':parseFloat(tokenbal1/(10**tokenDecimals1)).toFixed(4) } </small></>) }

                                        <div className="mb-2 pt-1 text-center">
                                            <Button variant='reset'>
                                                <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.919922" y="60.1743" width="60.0313" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.1743)" fill="white"/>
                                                    <path d="M30 29.1584V23.1553H32V29.1584H38V31.1595H32V37.1626H30V31.1595H24V29.1584H30Z" fill="black"/>
                                                </svg>
                                            </Button>
                                        </div>

                                        <div className="mb-20">
                                            <label className='d-flex align-items-center justify-content-between'>To 
                                            {(tk2 == "Algo")||(tk2 == "USDC") ? (<><small >Price:${pc2 > 0 ? parseFloat(pc2).toFixed(4) : pr2}  {tk2.toUpperCase()}</small></>):(<></>) }
                                            </label>

                                            <div className="balance-card d-flex align-items-center justify-content-between">
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white' value={swapamount2} onChange={(e) => handleSwapamount2(e.target.value)}  placeholder='0.0' />
                                            
                                            
                                            {/* <FilterDropdown2 setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)}/> */}
                                            {/* <FilterDropdown2 assetid2 = {AssetId2} setassetid2={(AssetId2)=>(setAssetId2(AssetId2))} ass={ass} setassets={(ass)=>setAssets(ass)} setassetsn={(assn)=>setAssetsn(assn)} assn = {assn} setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)} setToken2Id={(ti2)=>{setTokenId2(ti2)}} setclicklogo2={(l2)=>{setlogo2(l2)}}/> */}
                                            <FilterDropdown2 assetid2 = {AssetId2} setassetid2={(AssetId2)=>(setAssetId2(AssetId2))} ass={ass} setassets={(ass)=>setAssets(ass)} setassetsn={(assn)=>setAssetsn(assn)} assn = {assn} setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)} setToken2Id={(ti2)=>{setTokenId2(ti2)}} setclicklogo2={(l2)=>{setlogo2(l2)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname2)=>{setTokenName2(tokenname2)}} settokendecimals={(tokendecimals)=>{setTokenDecimals1(tokendecimals)}}/>

                                            </div>
                                        </div>
                                        {/* {(tk2 == "TAU")||(tk2 == "Algo")?(<><small>Balance:{parseFloat(balanceid2).toFixed(2)}</small></>):(<><small>Balance:{parseFloat(id2Token/1000000).toFixed(2) } </small></>) } */}
                                        {(tk2 == "ETH")||(tk2 == "SEI")||(tk2 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/(10 ** 18)).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal2 || tokenbal2 === 0)?'0.0':parseFloat(tokenbal2/(10**tokenDecimals2)).toFixed(4) } </small></>) }
                                        {/* <div className="balance-card py-2 mb-10 d-flex align-items-center justify-content-between">
                                            <label>POOL FEE</label>

                                            <h6>0.86 ETH</h6>
                                        </div> */}

                                        <p className="text-red">
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg> */}
                                           
                                        </p>
                                        {/* { (!showOptInButton && !showMintButton )?(<>
                                            <Button className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>bootstrap(appID_global)}>CREATE</Button>
                                        </>):(showOptInButton && !showMintButton)?(<>
                                            <Button className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>optIn(appID_global)}>Asset Opt-In</Button>
                                        </>):(<>
                                            <Button className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>mint(appID_global)}>CREATE LIQUIDITY</Button>
                                        </>)
                                        } */}
                                        { (allowance1 < (swapamount1*(10**tokenDecimals1)) && (tokenName1 !== "ETH" && tokenName1 !== "WSEI" && tokenName1 !== "SEI"))?(<>
                                            <ButtonLoad loading={loader1} className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>approveSei1(token1)}>APPROVE {`${tokenName1}`}</ButtonLoad>
                                        </>):(allowance2 < (swapamount2*(10**tokenDecimals2)) && (tokenName2 !== "ETH" && tokenName2 !== "WSEI" && tokenName2 !== "SEI"))?(<>
                                            <ButtonLoad loading={loader1} className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>approveSei2(token2)}>APPROVE {`${tokenName2}`}</ButtonLoad>
                                        </>):(<>
                                            <ButtonLoad loading={loader1} className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>addLiquiditysei(swapamount1, swapamount2, token1, token2, tokenDecimals1, tokenDecimals2, tokenName1, tokenName2, true)}>CREATE LIQUIDITY</ButtonLoad>
                                        </>)
                                        }

                                        <p className='d-flex'>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                </svg>
                                            </span>
                                            Once you create the pool, other users will be able to add liquidity to it.
                                        </p>

                                    </Col>
                                </Row>
                            </>
                        )
                    )}
                </Modal.Body>
            </Modal>


            <Modal show={manage} centered={true} size="lg" onHide={handleManage}>
                <Modal.Body className='modal-liquidity-body'>
                    <Button className='modal-close' onClick={handleManage} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                    
                    {(!remove  && !liquidity) ?(
                        <>
                            <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={handleManage} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>
  
                                <h2 className="h3 mb-0"  >{rstate?.asset1Name} / {rstate?.asset2Name}</h2>     
                            </div>
                        
                            <div className="text-center mb-md-5 mb-4">
                                <Button variant='grad' onClick={()=>handleLiquidiy()} className='m-2 py-3'>Add</Button>
                                 {/* <Button variant='grad' onClick={handleLiquidiy} className='text-none ms-2'>Add liquidity</Button> */}
                                {/* <Button variant='grad' onClick={()=>rem(rstate?.accountType,rstate?.profileName,rstate?.twitterName)} className='m-2 py-3'>Remove</Button> */}
                                <Button variant='grad' onClick={()=>handleRemove()} className='m-2 py-3'>Remove</Button>
                            </div>
                    
                            <Row className='text-center justify-content-center'>
                                <Col md={8}>
                                    <p>Your Pool tokens (including excess amounts)</p>
                                                                
                                    <div className="balance-card mb-10 d-flex align-items-center justify-content-between">
                                        <label onClick={manager1()} >{rstate?.asset1Name} / {rstate?.asset2Name} Pool Tokens</label>

                                        <div className='h3 m-0' >{liquidbal ? parseFloat(liquidbal).toFixed(4) : "0.000"}</div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) :(remove && !liquidity) ? (
                        <>
                            <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={handleRemove} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>

                                <h2 className="h3 mb-0">REMOVE LIQUIDITY</h2>     
                            </div>

                            <div className="modal-manage mb-30">
                                <Row className='mb-md-0 text-nowrap align-items-center text-center'>
                                    <Col sm={4}>
                                        {/* <h6>99.99%</h6> */}
                                        <p>Pool Share</p>
                                    </Col>
                                    <Col sm={4} className='py-sm-0 py-3'>
                                        <h6>{parseFloat(liquidbal).toFixed(4)} LP</h6>
                                    </Col>
                                    <Col sm={4}>
                                        <h6>{parseFloat(liquidityval1).toFixed(4)} {rstate?.asset1Name}</h6>
                                        <h6>{parseFloat(liquidityval2).toFixed(4)} {rstate?.asset2Name}</h6>
                                    </Col>
                                </Row>
                            </div>
                            
                            <label className='mb-20'>Remove Amount</label>

                            <Row className='mb-30'>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio1' name="amount" />
                                    <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>handleremLiq(25)}>25%</label>
                                </Col>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio2' name="amount" />
                                    <label htmlFor="radio2" className='btn btn-default px-2 w-100'  onClick={()=>handleremLiq(50)}>50%</label>
                                </Col>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio3' name="amount" />
                                    <label htmlFor="radio3" className='btn btn-default px-2 w-100'  onClick={()=>handleremLiq(75)}>75%</label>
                                </Col>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio4' name="amount" />
                                    <label htmlFor="radio4" className='btn btn-default px-2 w-100'  onClick={()=>handleremLiq(100)}>Max</label>
                                </Col>
                            </Row>

                            <Row className='justify-content-center'>
                                <Col md={6}>
                                    <div className="balance-card mb-20 d-flex align-items-center justify-content-between">
                                        <label className='h6'>{rstate?.asset1Name}</label>

                                        <h6  >{liquidityval11 > 0 ? parseFloat(liquidityval11/(1e18)).toFixed(3) :"0.00"}</h6>
                                    </div>

                                    <div className="balance-card mb-30 d-flex align-items-center justify-content-between">
                                        <label className='h6'>{rstate?.asset2Name}</label>

                                        <h6 >{liquidityval22 > 0 ? parseFloat(liquidityval22/(1e18)).toFixed(3) :"0.00"} 
                                        {/* <small className='d-block text-gray'>~$0.16</small> */}
                                        </h6>
                                    </div>
                                    {allowancePair >= parseFloat(remLiquidity/1e18) ? 
                                    <ButtonLoad loading={loader2} variant='grad' className='btn-lg w-100' onClick={() => remLiquiditysei()}>Remove</ButtonLoad> :
                                    <ButtonLoad loading={loader2} variant='grad' className='btn-lg w-100' onClick={() => approvePair()}>Approve LP</ButtonLoad>}
                                    
                                </Col>
                            </Row>

                        </>
                    ):
                    (
                        <>
                            <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={handleLiquidiy} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>

                                <h2 className="h3 mb-0" onClick={addli()}>ADD LIQUIDITY</h2>     
                            </div>

                            <Row className='justify-content-center'>
                                <Col md={9} lg={8}>
                                    <div className="mb-2">
                                        <label className='d-flex align-items-center justify-content-between'>From {(rstate?.asset1Name === "WSEI" || rstate?.asset1Name === "SEI" || rstate?.asset1Name === "ETH") ? <small>Balance: { !(ethbal) ?'0.0' : parseFloat(ethbal/1e18).toFixed(4) }  {rstate?.asset1Name}</small> : <small>Balance: { !(liquidbal1) ?'0.0' : parseFloat(liquidbal1).toFixed(4) }  {rstate?.asset1Name}</small>}</label>
                                        {/* {(rstate?.asset1Name == "ETH")||(rstate?.asset1Name == "SEI")||(rstate?.asset1Name == "WSEI")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/(10 ** 18)).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(rstate?.tokenBal1)?parseFloat(rstate?.tokenBal1).toFixed(3):'0.0' } </small></>) } */}
                                        <div className="balance-card d-flex align-items-center justify-content-between">
                                          
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white'  value={liqamount1 ? liqamount1 : ""} onChange={e => handleLiqamount1(e.target.value)}  placeholder="0.0" autoComplete='off'/>

                                      </div>
                                    </div>

                                    <div className="mb-2 pt-1 text-center">
                                        <Button variant='reset'>
                                            <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.919922" y="60.1743" width="60.0313" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.1743)" fill="white"/>
                                                <path d="M30 29.1584V23.1553H32V29.1584H38V31.1595H32V37.1626H30V31.1595H24V29.1584H30Z" fill="black"/>
                                            </svg>
                                        </Button>
                                    </div>

                                    <div className="mb-20">
                                        <label className='d-flex align-items-center justify-content-between'>T0 {(rstate?.asset2Name === "WSEI" || rstate?.asset2Name === "SEI" || rstate?.asset2Name === "ETH") ? <small>Balance: { !(ethbal) ?'0.0' : parseFloat(ethbal/1e18).toFixed(4) }  {rstate?.asset2Name}</small> : <small>Balance: { !(liquidbal2) ?'0.0' : parseFloat(liquidbal2).toFixed(4) }  {rstate?.asset2Name}</small>}</label>

                                        <div className="balance-card d-flex align-items-center justify-content-between">
                                         
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white'  value={liqamount2 ? liqamount2 : ""} onChange={e => handleLiqamount2(e.target.value)}  placeholder="0.0" autoComplete='off'></input>
                                         

                                            {/* <FilterDropdown2 /> */}
                                        </div>
                                    </div>

                                    {/* <div className="balance-card py-2 mb-10 d-flex align-items-center justify-content-between">
                                        <label>Pool Fee</label>

                                        <h6>0.86 ETH</h6>
                                    </div> */}

                                    <p className="text-red">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                        unverified assets alert, be careful! */}
                                    </p>

                                    {/* <Button className='btn w-100 mb-20 text-none btn-grad btn-xl' onClick={()=>mint1call(appID_global,samount1,samount2,rstate?.asset1Name,rstate?.asset2Name)}>ADD LIQUIDITY</Button> */}
                                    { (allowanceLiq1 < (liqamount1*(10**(rstate?.decimals1))) && (rstate?.asset1Name !== "ETH" && rstate?.asset1Name !== "WSEI" && rstate?.asset1Name !== "SEI"))?(<>
                                            <ButtonLoad loading={loader1} className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>approveSei1(rstate?.tokenAddress1)}>APPROVE {`${rstate?.asset1Name}`}</ButtonLoad>
                                        </>):(allowanceLiq2 < (liqamount2*(10**(rstate?.decimals2))) && (rstate?.asset2Name !== "ETH" && rstate?.asset2Name !== "WSEI" && rstate?.asset2Name !== "SEI"))?(<>
                                            <ButtonLoad loading={loader1} className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>approveSei2(rstate?.tokenAddress2)}>APPROVE {`${rstate?.asset2Name}`}</ButtonLoad>
                                        </>):(<>
                                            <ButtonLoad loading={loader1} className='btn w-100 mb-20 text-none btn-grad btn-xl' onClick={()=>addLiquiditysei(liqamount1, liqamount2, rstate?.tokenAddress1, rstate?.tokenAddress2, rstate?.tokenDecimals1, rstate?.tokenDecimals2, rstate?.asset1Name, rstate?.asset2Name, false)}>ADD LIQUIDITY</ButtonLoad>
                                        </>)
                                        }

                                    <p className='d-flex'>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </span>
                                        Once you create the pool, other users will be able to add liquidity to it.
                                    </p>

                                </Col>
                            </Row>
                        </>
                        )}




                </Modal.Body>
            </Modal>

        </Layout>
    );
                    }

export default PoolPage;