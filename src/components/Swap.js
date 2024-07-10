import React from 'react';
import { Col, Container, Row, Breadcrumb, Dropdown, Button, ButtonGroup, DropdownButton, InputGroup, FormControl, Modal } from 'react-bootstrap';
import ButtonLoad from 'react-bootstrap-button-loader';
import Layout from './Layouts/LayoutInner';
// import {Container} from 'react-bootstrap';
import SwapChart from './Snippets/SwapChart';
// import Select from 'react-select';
import appcss from "../App.css";
// import makeAnimated from 'react-select/animated';
import FilterDropdown from './Snippets/FilterDropdown';
import FilterDropdown2 from './Snippets/FilterDropdown2';
import logo from '../assets/images/logoasset.png';
import taulogo from '../assets/images/tau-original.png';
import questionlogo from '../assets/images/question_transparent.png'
// const animatedComponents = makeAnimated();
import { useState } from "react";
import { useEffect } from "react";
import { createtxhash ,updatepairhistory} from './apicallfunction';
import { postusertx } from './apicallfunction';
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import { useLocation } from "react-router-dom";
import algosdk from "algosdk";
import {amount_out_with_slippage,asset1_price,assert3Reserve,assert1Reserve,assert2Reserve,readingLocalstate,escrowdatacompile,checkassetin,escrowdata,asset2_price, find_balance_escrow,find_balance,priceOfCoin1,priceOfCoin2} from './formula';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'; 
import { PancakeFactoryV2Address, PancakeFactoryV2ABI, PancakeRouterV2Address, PancakeRouterV2ABI, PancakePairV2ABI, ERC20ABI, WSEIAddress } from '../abi';
import { ethers } from 'ethers';
import usdcLogo from '../assets/images/usdc-logo.png';
import seilogo from '../assets/images/sei-logo.png';

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

function SwapPage(props) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
});

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://evm-rpc-testnet.sei-apis.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    const [ swapamount1, setSwapamount1 ] = useState("");
    const [ swapamount2, setSwapamount2 ] = useState("");
    const [ slippage, setSlippage ] = useState(0.01);
    const [allowance, setAllowance] = useState("");
    const [ token1, setToken1 ] = useState("");
    const [ token2, setToken2 ] = useState("");
    const [ tokenName1, setTokenName1 ] = useState("");
    const [ tokenName2, setTokenName2 ] = useState("");
    const [ tokenDecimals1, setTokenDecimals1 ] = useState(18);
    const [ tokenDecimals2, setTokenDecimals2 ] = useState(18);
    const [ tokenbal1, setTokenbal1 ] = useState(0.0);
    const [ tokenbal2, setTokenbal2 ] = useState(0.0);
    const [ ethbal, setEthbal ] = useState(0.0);
    const [ loader, setLoader ] =useState(false);

  const location = useLocation();
  const [a, setdisplay] = useState([]);
  const [dvalue, setdvalue] = useState(false);
  // console.log("pagesi",location); 
  
  
    const [input1, setValue] = React.useState('0.0');
    const [input2, setValue1] = React.useState('0.0');
    const [s1, sets1] = useState("");

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const [AssetId1,setAssetId1] = useState("");
    const [AssetId2,setAssetId2] = useState("");
console.log("Assetid1",AssetId1,AssetId2)
    const[tk1,sett1] = useState("");
    const[id1Token,setTokenId1] = useState("");
    const[id2Token,setTokenId2] = useState("");
    const[tk2,sett2] = useState("");
  //console.log("tk2",tk1)
    const [s2, sets2] = useState("");
    const[samount1,setsamount1] = useState("");
    const[samount2,setsamount2] = useState("");
    const[swapfees,setswapfees]= useState("");
    const[swapamount,set_inp_goal] = useState("");
    const[ass1,setAssets1]= React.useState("");
    const[assn1,setAssetsn1]= React.useState("");
    const [appId,setAppId] = useState("");
    const [ilt, setilt] = useState("");
    const[optinbutton,setoptinbutton] = useState("");
    const[swapopt,setoswapopt]= useState(true);
    
    const[esc,setesc]= useState("");
    const[fee,setfees] = useState("");
    const[swf,setswf] = useState("");
    const[swapdetail,setswapdetail]= useState(false);
    const[pricechange,setpricechange]= useState(false);
    const[sufficient,setsufficient]= useState(false);
    const[AssWithFee,setasswithfee] = useState("");
    const[price1,setprice1]= useState("");
    const[price2,setprice2]= useState("");
    // const[gain,setgain] = useState("");
    const[logovalue1,setlogo1] = useState("");
    const[logovalue2,setlogo2] = useState("");
    const [algoPrice, setAlgoPrice] = useState("");
    const [usdcPrice, setUsdcPrice] = useState("");
    const[swapv,setSwapv] = useState(true);
    const[pr1,setpr1]= useState("");
    const[pr2,setpr2]= useState("");
    const[pc1 ,setpc1]= useState("");
    const[pc2 ,setpc2]= useState("");
    const[balanceid1,setbamalanceid1]= useState("");
    const[balanceid2,setbamalanceid2]= useState("");
    const[assn,setAssetsn]= React.useState("");
    const[ass,setAssets]= React.useState("");
  //console.log("swapopt",id1Token,id2Token)
    // let a = [];
    
    // if(a){
    //   // sett1(a.name1);
    //   // sett2(a.name2);
    //   // sets1(a.avalue);
    //   // sets2(a.bvalue);
    // }
    useEffect(() =>{
      const asyncFn = async () => {
      if(location.state === null || location.state === undefined || location.state ===""){
        setdvalue(true);
      }
      else{
        // a = location.state.detail;
        setdisplay(location.state.detail)
         sett1(location.state.detail.name1);
        sett2(location.state.detail.name2);
         setdvalue(false);
         sets1(location.state.detail.a);
          sets2(location.state.detail.b);
          setAssetId1(location.state.detail.id1);
          setAssetId2(location.state.detail.id2);
         localStorage.setItem("tokenid1",location.state.detail.id1)
         localStorage.setItem("tokenid2",location.state.detail.id2)
         let v = await find_balance(location.state.detail.id1);
         setTokenId1(v);
         setTokenId2(await find_balance(location.state.detail.id2));

    console.log("pagesi",v); 
      }
    }
    asyncFn();

    },[])
   
  //console.log("state",tk1,tk2)
    // const[gain1,setgain1] = useState("");
    useEffect(() =>{ren()},[])
    // useEffect(() =>{checkbalan()},[])

  //console.log("gain",logovalue1)
  //console.log("gain1",id2Token)
    // if(tk2 === "TAU"){
    //   setTokenId2(71682000);
    // }
  const ren =()=>{
    if(!fee){
      setfees(0.05);
    }
    if(!AssWithFee){
    }
    if(!localStorage.getItem("assetname1")){
    }
    if(!localStorage.getItem("assetname2")){
    }
    callfirst();
    checkbalan();
    // checkoptin();
   
  //console.log("id1",localStorage.getItem("tokenid1"))
  //console.log("id1",localStorage.getItem("tokenid2"))
    
  }
  
//  const checkoptin = async() =>{
//   let l1 = localStorage.getItem("tokenid2");
//   let l2 = localStorage.getItem("tokenid1");
//   await checkassetin(l1);
//  }

  const checkbalan = async()=>{
    // console.log("balance",tk2)
    // // if(tk2 === "TAU"){
    // //   setTokenId2(71682000);
    // // }
    // console.log("balance",id2Token)
    {
      let s1 = await find_balance(0);
      setbamalanceid1(s1);
      // console.log("balance",s1,id1Token)
      // let s2 = await find_balance(id2Token);
      // setbamalanceid2(s2);
      // console.log("balance",s2,id2Token)
    }
    
   
  }
  const callfirst =async()=>{

    let pk1 = await priceOfCoin1();
      setAlgoPrice(pk1);
      setpc1(pk1);
      // setpc2(pk1);
  //console.log("pk1",pk1);
    let pk2 = await priceOfCoin2();
    setpc2(pk2);
    // setpc2(pk2);
    setUsdcPrice(pk2);
  //console.log("pk2",pk2);
    if(tk1 == "Algo" || tk1 === "ETH" || tk1 === "SEI"){
      setpc1(pk1);
    }
    if(tk2 == "USDC" || tk2 === "usdc"){
      setpc2(pk2);
    }
  }
  const callp1 =() =>{
    if(tk1){
    //console.log("tk1")
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
  //console.log("k1",tk1)
    if(tk1 === "Algo"|| tk1=== "ETH"){
      p1 =  algoPrice;
    //console.log("first",p1);
    }
    else if(tk1 === "USDC"){
    //console.log("firstvalue",p1);
      p1 = usdcPrice;
    //console.log("first",p1);
    }
  //console.log("p1",p1)
    setpr1(p1);
    // setpc1(p1);
  }
  const call_price2 =async()=>{
    let p2;
    if(tk2 === "Algo"|| tk2=== "ETH"){
     p2 = algoPrice;
    }
    else if(tk2 === "USDC"){
      p2 = usdcPrice;
    }
  //console.log("p2",p2)
    setpr2(p2);
    // setpc1(p2)
  }
  const pricelisting=async(s1,s2)=>{
    let p1 =await asset1_price(s1,s2);
  //console.log("p1",p1)
    setprice1(p1);
    let p2 = await asset2_price(s1,s2);
    setprice2(p2);
  }
   
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
  
    //   async function readLocalState(client, account, index1){
    //       let accountInfoResponse = await client.accountInformation(account).do();
    //       console.log("accinfo",accountInfoResponse);
    //       if(accountInfoResponse['apps-local-state'].length > 0){
    //         for(let i = 0; i< accountInfoResponse['apps-local-state'][0]['key-value'].length;i++){
    //           if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czE="){
    //            sets1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //            console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //           }
    //           else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czI="){
    //            sets2(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //            console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //           }
    //           else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] ===  "aWx0"){
    //            setilt(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //            console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //           }
    //         }
    //       }
         
    //       // for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
    //       //   if (accountInfoResponse['apps-local-state'][i].id == index1) {
    //       //       console.log("Application's global state:");
    //       //       for (let n = 0; n < accountInfoResponse['apps-local-state'][i]['key-value'].length; n++) {
    //       //          // console.log(accountInfoResponse['apps-local-state'][i]['key-value']);
    //       //           let enc = accountInfoResponse['apps-local-state'][i]['key-value'][n];
    //       //           if(enc['key'] === "czE="){
    //       //             sets1(enc.value.uint)
    //       //           }
    //       //           if(enc['key'] === "czI="){
    //       //             sets2(enc.value.uint)
    //       //           }
    //       //           if(enc['key'] === "aWx0"){
    //       //             setilt(enc.value.uint)
    //       //           }             
    //       //       }
                
    //   //        }
    //   //   }
    //   }
    const swap = async (appid,asset_in_amount) => {
      if(AssetId1 === ""|| AssetId1===undefined || AssetId1===null){
        setAssetId1(0);
     }
      if(tk1 === "ETH"){
        localStorage.setItem("tokenid1","0");
      }
      
       if(tk2 === "TAU"){
        localStorage.setItem("tokenid2",71682000);
      }
        let tokenid1 = AssetId1;
        let tokenid2 = AssetId2;
        let index = parseInt(appid);
      //console.log("appId inside donate", index);
  
        setAppId(appid);
        let tt1;
        let tt2;
          if(tokenid1 > tokenid2){
              tt1 =tokenid1;
              tt2 = tokenid2;
          }
          else{
              tt1 =tokenid2;
              tt2 = tokenid1;
          }
      //console.log("data",tt1)
      //console.log("data1",tt2)
        
     
          let edata = await escrowdata(appID_global,tt1,tt2);
        
        // let escrowaddress = edata.hash()
      //console.log("escrow",edata)
        let accountInfoResponse = await algodClient.accountInformation(edata.address()).do();
      //console.log("account",accountInfoResponse);
        let assetId3 = accountInfoResponse['created-assets'][0]['index'];
      //console.log('Asset 3 ID: ', assetId3);
      
      
    
        // let program = new Uint8Array(Buffer.from(edata.logic, "base64"));
    
        // let lsig = algosdk.makeLogicSig(program);
        let lsig = edata;
      //console.log("Escrow =", lsig.address()); 
  
        // readLocalState(algodClient,escrowaddress,appId);
        
     //console.log(s1)
       let r1,r2;
       let t1 ,t2;
          
        let dtdata = await escrowdatacompile(appID_global,AssetId1,AssetId2);
        console.log("dtdata",dtdata)
        let compiled = await readingLocalstate(algodClient,dtdata.hash)
        let reserve1 = await assert1Reserve(compiled);
        let reserve2 = await assert2Reserve(compiled); 
        let reserve3 = await assert3Reserve(compiled); 
        if(tokenid1 > tokenid2){
          r1 = reserve1;
          r2 = reserve2;
          
      }
      else{
          r1 = reserve2;
          r2 = reserve1;
          // t1 = tokenid1;
          // t2 = tokenid2;
      }
          
          let vl = reserve1 + reserve2 + reserve3;
          let tvl = reserve1 + reserve2;
        let k = r1 * r2 ;
        let asset_in_amount_minus_fee = (asset_in_amount * 997) / 1000
            
        let swap_fees = asset_in_amount - asset_in_amount_minus_fee
            
        let l = asset_in_amount_minus_fee - swap_fees;
        let asset_out_amount_withoutfees = r2 - (k / (r1 + l ))  
        let asset_out_amount = amount_out_with_slippage(asset_out_amount_withoutfees,fee);
        let am1;
        let am2;
        console.log("tokenidvalues",tokenid1,tokenid2)
        if(swapv){
          t1 = tokenid1;
          t2 = tokenid2;
          am1 = asset_in_amount;
          am2 = asset_out_amount;
        } 
        else{
          t1 = tokenid2;
          t2 = tokenid1;
          am2 = asset_in_amount;
          am1 = asset_out_amount;
        }  

      //console.log("amount",asset_in_amount,asset_out_amount)
        
        try {
  
          const params = await algodClient.getTransactionParams().do();
          let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from:localStorage.getItem("walletAddress"),
            to :localStorage.getItem("walletAddress"),
            assetIndex: parseInt(57692249) ,
            amount: 0,
            suggestedParams:params
          });
      
          
            
          const signedTx11 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
          toast.info("Transaction in Progress");
      
        const response1 = await algodClient.sendRawTransaction(signedTx11.blob).do();
      //console.log("TxID", JSON.stringify(response1, null, 1));
        await waitForConfirmation(algodClient, response1.txId);
        toast.info("Optin Completed");
          
          let sender = localStorage.getItem("walletAddress");
          let recv_escrow = lsig.address();
          let amount = 2000;
          
          let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: recv_escrow, 
            amount: amount,  
             suggestedParams: params
           });
         
           let appArg = [];
           appArg.push(new Uint8Array(Buffer.from("swap")));
           appArg.push(new Uint8Array(Buffer.from("fi")));
  
           let foreignassets = [];
  
           if(parseInt(t1)==0){
            // foreignassets.push(parseInt(tokenid1));
            foreignassets.push(parseInt(t2));
            foreignassets.push(parseInt(assetId3));
           }
           else if(parseInt(t2)==0){
            foreignassets.push(parseInt(t1));
            // foreignassets.push(parseInt(tokenid2));
            foreignassets.push(parseInt(assetId3));
           }
           else{
            foreignassets.push(parseInt(t1));
            foreignassets.push(parseInt(t2));
            foreignassets.push(parseInt(assetId3));
           }
           
           
           const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
               from: recv_escrow, 
               appIndex: index,
               appArgs: appArg,
               appAccounts:sender,
               accounts: [sender],
               foreignAssets:foreignassets,
               suggestedParams: params
             });
             let transaction3;
             let transaction4;
             if(parseInt(t1)==0){
              transaction3 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                note: undefined,
                accounts:sender,
                amount: parseInt(am1), 
                suggestedParams: params
              });
             }
             else{
             //console.log("asset1",t1);
              transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(t1),
                note: undefined,
                accounts:sender,
                amount: parseInt(am1), 
                suggestedParams: params
              });
             }
            
            if(parseInt(t2)==0){
             transaction4 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: recv_escrow ,
                to: sender,               
                note: undefined,
                accounts: recv_escrow,
                amount: parseInt(parseInt(am2).toFixed(0)),
                suggestedParams: params
              });
            }
            else{
              transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow ,
                to: sender,
                assetIndex:parseInt(t2), 
                note: undefined,
                accounts: recv_escrow,
                amount: parseInt(parseInt(am2).toFixed(0)),
                suggestedParams: params
              });
            }
            console.log("tk1&tk2",tk1,tk2,am1,am2)
   let newescrow = `#pragma version 5
  
   txn TypeEnum
   int axfer
   ==
   bnz success
   global GroupSize
   int 5
   ==
   gtxn 4 TypeEnum
   int axfer
   ==
   &&
   gtxn 1 ApplicationID
   int 57691024
   ==
   &&
   gtxn 2 AssetSender
   gtxn 4 AssetReceiver
   ==
   &&
   int 0
   gtxn 2 AssetAmount
   int 997
   *
   int 1000
   /
   store 1
   int 0
   gtxn 2 AssetAmount
   load 1
   -
   store 2
   int 0
   gtxn 4 AssetAmount
   load 2
   ==
   gtxn 4 XferAsset
   int 57692249
   ==
   &&
   bnz success
   bz failed
   
   failed:
   int 0
   return
   
   success:
   int 1
   return`;
   let results1 = await algodClient.compile(newescrow).do(); 
 //console.log("escrownew",results1.hash)  
   let program1 = new Uint8Array(Buffer.from(results1.result, "base64"));
    
        let lsig1 = algosdk.makeLogicSig(program1);
           let transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from: results1.hash ,
              to: sender,
              assetIndex:parseInt(57692249), 
              note: undefined,
              accounts: recv_escrow,
              amount: parseInt(parseInt(swap_fees).toFixed(0)),
              suggestedParams: params
            });
            
            
          const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4,transaction5]);
          const txs = [ transaction1, transaction2, transaction3, transaction4, transaction5];
          for (let i = 0; i <= 4; i++) txs[i].group = groupID;
        
          const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
          const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
          const signedTx5 = algosdk.signLogicSigTransaction(txs[4], lsig1);
          const signedTxnarray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte()]);
          toast.info("Swapping in Progress");
      const response = await algodClient.sendRawTransaction([signedTxnarray[0].blob, signedTx2.blob, signedTxnarray[1].blob, signedTx4.blob, signedTx5.blob]).do();
    //console.log("TxID", JSON.stringify(response, null, 1));
    //   setTxId(response.txId);
    //   setShow(true);
      await waitForConfirmation(algodClient, response.txId);
     let an = tk1 +"/"+tk2;
      // await postusertx(localStorage.getItem("walletAddress"),response.txId,recv_escrow,"Swap",tvl,asset_in_amount,tk1,tk2,amount);
      await createtxhash(recv_escrow,response.txId,"SWAP",asset_in_amount,an)
      await updatepairhistory(tokenid1,tokenid2,amount,tvl,vl);
      setsamount1(0)
      setsamount2(0)
      toast.success(`Swapping Completed Successfully ${response.txId}`);    
      toast.info("Swapping Completed"); 
      
    } catch (err) {
          toast.error(`Transaction Failed due to ${err}`);
        //console.error(err);
        }
      };
  
      const setvalueA1 =async(asset_in_amount)=>{
        let dtdata;
        setsamount1(asset_in_amount);
        if(AssetId1 === ""|| AssetId1===undefined || AssetId1===null){
           dtdata = await escrowdatacompile(appID_global,0,AssetId2);
        }
        else{
           dtdata = await escrowdatacompile(appID_global,AssetId1,AssetId2);
        }
        console.log("dtdata",dtdata)
        let compiled = await readingLocalstate(algodClient,dtdata.hash)
        let reserve1 = await assert1Reserve(compiled);
        let reserve2 = await assert2Reserve(compiled);
        console.log("dtdata",reserve1,reserve2,dtdata)
          callp1();
        //console.log("asset_in_amount",asset_in_amount)
          setpc1(pr1 * (asset_in_amount/1000000));
          // if(tk1 === "ETH"){
          //   localStorage.setItem("tokenid1","0");
          // }
          // else if(tk2 === "ETH"){
          //   localStorage.setItem("tokenid2","0");
          // }
          let r1,r2;
          let tokenid1 = AssetId1;
          let tokenid2 = AssetId2;
          if(tokenid1 > tokenid2){
              r1 = reserve1;
              r2 = reserve2;
          }
          else{
              r1 = reserve2;
              r2 = reserve1;
          }
          pricelisting(s1,s2);
          setswf((asset_in_amount)/1000000 * 0.003);
          set_inp_goal(asset_in_amount);
          let k = r1 * r2 ;
        //console.log('s1', s1);
        //console.log('s2', s2);
          let asset_in_amount_minus_fee = (asset_in_amount * 997) / 1000;
        //console.log('asset_in_amount', asset_in_amount);
              
          let swap_fees = asset_in_amount - asset_in_amount_minus_fee;
        //console.log('swap_fees', swap_fees);
          setswapfees(swap_fees)
              
          let l = asset_in_amount_minus_fee - swap_fees;
        //console.log('l', l);
  
          let asset_out_amount = r2 - (k / (r1 + l ))   ;
          let asswithfee = amount_out_with_slippage(asset_out_amount,fee);
        //console.log("asswithfee",asswithfee);
          setasswithfee(asswithfee)
          
          setsamount2(asset_out_amount);
          setswapdetail(true);
          if(reserve1 <=0 || reserve2 <=0  || asset_in_amount > r1 || asset_out_amount > r2){
            setsufficient(true);
          }
          else{
            setsufficient(false);
          }
      
      }
  
      const setvalueA2=async(asset_out)=>{
        let dtdata;
        setsamount2(asset_out);
      //console.log("asset_out",asset_out)
        if(AssetId1 === ""|| AssetId1===undefined || AssetId1===null){
            dtdata = await escrowdatacompile(appID_global,0,AssetId2);
        }
        else{
            dtdata = await escrowdatacompile(appID_global,AssetId1,AssetId2);
        }
        console.log("dtdata",dtdata)
        let compiled = await readingLocalstate(algodClient,dtdata.hash)
        let reserve1 = await assert1Reserve(compiled);
        let reserve2 = await assert2Reserve(compiled);
        console.log("dtdata",reserve1,reserve2,dtdata)
        callp2();
        setpc2(pr2 * (asset_out/1000000));
        if(tk1 === "ETH"){
          localStorage.setItem("tokenid1","0");
        }
        else if(tk2 === "ETH"){
          localStorage.setItem("tokenid2","0");
        }
        //   first();
        let tokenid1 = reserve1;
        let tokenid2 = reserve2;
          let r1,r2;
          if(tokenid1 > tokenid2){
              r1 = s2;
              r2 = s1;
          }
          else{
              r1 = s1;
              r2 = s2;
          }
          pricelisting(s2,s1);
          let k = r1 * r2 ;
        //console.log('s1', s1);
        //console.log('s2', s2);
          let asset_in_amount_minus_fee = (asset_out * 997) / 1000;
        //console.log('asset_in_amount', asset_out);
              
          let swap_fees = asset_out - asset_in_amount_minus_fee;
        //console.log('swap_fees', swap_fees);
          setswapfees(swap_fees)
              
          let l = asset_in_amount_minus_fee - swap_fees;
        //console.log('l', l);
  
          let asset_out_amount = r2 - (k / (r1 + l ));
          let asswithfee = amount_out_with_slippage(asset_out_amount,fee);
          setasswithfee(asswithfee)
          setswf((asset_out_amount)/1000000 * 0.003);
        //console.log("s",asset_out_amount);
          set_inp_goal(asset_out_amount);
          
          setsamount1(asset_out_amount);
          setswapdetail(true);
          if(reserve1 <=0 || reserve2 <=0  || asset_out > r1 || asset_out_amount > r2){
            setsufficient(true);
          }
          else{
            setsufficient(false);
          }
      
    
    }
    function setvalueA1duplicate(asset_in_amount){
      callp1();
      setpc1(pr1 * (asset_in_amount/1000000));
      if(a.name1 === "ETH"){
        localStorage.setItem("tokenid1","0");
      }
      else if(a.name2 === "ETH"){
        localStorage.setItem("tokenid2","0");
      }
      let r1,r2;
      let tokenid1 = AssetId1;
      let tokenid2 = AssetId2;
      if(tokenid1 > tokenid2){
          r1 = a.a;
          r2 = a.b;
      }
      else{
          r1 = a.b;
          r2 = a.a;
      }
      pricelisting(a.a,a.b);
      setswf((asset_in_amount)/1000000 * 0.003);
      set_inp_goal(asset_in_amount);
      let k = r1 * r2 ;
    //console.log('s1', a.a);
    //console.log('s2', a.b);
      let asset_in_amount_minus_fee = (asset_in_amount * 997) / 1000;
    //console.log('asset_in_amount', asset_in_amount);
          
      let swap_fees = asset_in_amount - asset_in_amount_minus_fee;
    //console.log('swap_fees', swap_fees);
      setswapfees(swap_fees)
          
      let l = asset_in_amount_minus_fee - swap_fees;
    //console.log('l', l);

      let asset_out_amount = r2 - (k / (r1 + l ))   ;
      let asswithfee = amount_out_with_slippage(asset_out_amount,fee);
    //console.log("asswithfee",asswithfee);
      setasswithfee(asswithfee)
      setsamount1(asset_in_amount);
      setsamount2(asset_out_amount);
      setswapdetail(true);
      if(a.a<=0 || a.b <=0){
        setsufficient(true);
      }
      else{
        setsufficient(false);
      }
  
  }
  function setvalueA2duplicate(asset_out){
    callp2();
    setpc2(pr2 * (asset_out/1000000));
    if(a.name1 === "ETH"){
      localStorage.setItem("tokenid1","0");
    }
    else if(a.name2 === "ETH"){
      localStorage.setItem("tokenid2","0");
    }
    //   first();
    let tokenid1 = localStorage.getItem("tokenid1");
    let tokenid2 = localStorage.getItem("tokenid2");
      let r1,r2;
      if(tokenid1 > tokenid2){
          r1 = a.a;
          r2 = a.b;
      }
      else{
          r1 = a.b;
          r2 = a.a;
      }
      pricelisting(a.a,a.b);
      let k = r1 * r2 ;
      // console.log('s1', s1);
      // console.log('s2', s2);
      let asset_in_amount_minus_fee = (asset_out * 997) / 1000;
    //console.log('asset_in_amount', asset_out);
          
      let swap_fees = asset_out - asset_in_amount_minus_fee;
    //console.log('swap_fees', swap_fees);
      setswapfees(swap_fees)
          
      let l = asset_in_amount_minus_fee - swap_fees;
    //console.log('l', l);

      let asset_out_amount = r2 - (k / (r1 + l ));
      let asswithfee = amount_out_with_slippage(asset_out_amount,fee);
      setasswithfee(asswithfee)
      setswf((asset_out_amount)/1000000 * 0.003);
    //console.log("s",asset_out_amount);
      set_inp_goal(asset_out_amount);
      setsamount2(asset_out);
      setsamount1(asset_out_amount);
      setswapdetail(true);
      if(a.a<=0 || a.b <=0){
        setsufficient(true);
      }
      else{
        setsufficient(false);
      }
  

}
     
      const optinassert =async () => {
        if(localStorage.getItem("tokenid2") === "0"){
          setoswapopt(false);
        }
else{
  
        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
        const params = await algodClient.getTransactionParams().do();
  try {
    

    let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from:localStorage.getItem("walletAddress"),
      to :localStorage.getItem("walletAddress"),
      assetIndex: parseInt(localStorage.getItem("tokenid2")) ,
      amount: 0,
      suggestedParams:params
    });

    
      
      const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
      toast.info("Transaction in Progress");

  const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
//console.log("TxID", JSON.stringify(response, null, 1));
  await waitForConfirmation(algodClient, response.txId);
 
  // await postusertx(localStorage.getItem("walletAddress"),response.txId,0,"Opt-In Asset",0,0,"","","3000");
  setoswapopt(false);
  toast.success(`Transaction Success ${response.txId}`);
  
    } catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      //console.error(err);
    }}

     
  }

  const feesAmount =(f) =>{
    setfees(f);
    setSlippage(f);
    handleCloseModal();
  }
  const setpChange =() =>{
    if(pricechange){
      setpricechange(false)
    }
    else{
      setpricechange(true)
    }
    
  }

const changetokens =()=>{
  setSwapv(!swapv)
  setsamount1(0)
  setsamount2(0);
  const tokenbuff = token1;
  const tokenbuff2 = tokenName1;
  const tokenbuff3 = tokenDecimals1;
  setToken1(token2);
  setToken2(tokenbuff);
  setTokenName1(tokenName2);
  setTokenName2(tokenbuff2);
  setTokenDecimals1(tokenDecimals2);
  setTokenDecimals2(tokenbuff3);
  handleSwapamount1(swapamount2);
  // let a = tk1;
  // let b = tk2;
  // // sett1(a) 
  // sett1(b);
  // sett2(a);
  //console.log("clicking")
  // localStorage.setItem("tokenid1","0");
  //console.log("tkvalues",tk1,tk2)
  // //console.log("tkvalues",tk1,tk2)

}

const appOptIn = async () =>
{
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
    
    toast.warn("Transaction in Progress");
const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
// console.log("TxID", JSON.stringify(response, null, 1));
await waitForConfirmation(algodClient, response.txId);

// await postusertx(localStorage.getItem("walletAddress"),response.txId,0,"Opt-In App",0,0,"","",0);

await createtxhash("-",response.txId,"App Opt-In","-","-")
toast.success(`Transaction Success ${response.txId}`);
  } catch (err) {
    toast.error(`Transaction Failed due to ${err}`);
    // console.error(err);
  }
}

const approveSei = async() => {
  try{
      setLoader(true);
      console.log("approve starts...");
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer =  ethersProvider.getSigner();
      const erc20Contract = new ethers.Contract(token1, ERC20ABI, signer);
      // const cfContract = new ethers.Contract(cftokenAddress, cftokenAbi, signer);
      let tx;
      
          tx = await erc20Contract.approve(PancakeRouterV2Address, ethers.utils.parseUnits((swapamount1).toString(), 18));
      
      await tx.wait();
      await fun();
      setLoader(false);
  }catch(e){
      setLoader(false);
      console.error(e);
  }
 
}


  const swapSei = async() => {
      try{
        setLoader(true);
        const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
        const signer =  ethersProvider.getSigner();
        const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
        const currentEpoch = Math.floor(Date.now() / 1000); // current epoch in seconds
        const epochPlus10Minutes = currentEpoch + (10 * 60); // adding 10 minutes
        
            // Convert the deposit amount to wei
        const decimalLimit = Math.pow(10, tokenDecimals1);
        const decimalLimit2 = Math.pow(10, tokenDecimals2); 
        const amountInWei = ethers.utils.parseUnits((Math.floor(swapamount1 * decimalLimit) / decimalLimit).toString(), tokenDecimals1);
        const amountInWei2 = ethers.utils.parseUnits((Math.floor(swapamount2 * decimalLimit2) / decimalLimit2).toString(), tokenDecimals2);
        const amountInWei2Slipped = ethers.utils.parseUnits((Math.floor((swapamount2 - swapamount2 * (slippage / 100)) * decimalLimit) / decimalLimit).toString(), tokenDecimals2);
        console.log("chack", amountInWei2, amountInWei2Slipped);

        let tx;
        if(tokenName1 === "ETH" || tokenName1 === "SEI"){
          tx = await swapContract.swapExactETHForTokens(amountInWei2Slipped, [token1,token2], address, epochPlus10Minutes, {value: amountInWei});
        } else if (tokenName2 === "ETH" || tokenName2 === "SEI") {
          tx = await swapContract.swapExactTokensForETH(amountInWei, amountInWei2Slipped, [token1,token2], address, epochPlus10Minutes);
        } else {
          tx = await swapContract.swapExactTokensForTokens(amountInWei, amountInWei2Slipped, [token1,token2], address, epochPlus10Minutes);
        }
        
        await tx.wait();
        setSwapamount1("");
        setSwapamount2("");
        setLoader(false);
        await fun();
        
    }catch(e){
        setLoader(false);
        console.error(e);
    }
  }

  const handleSwapamount1 = async(e) => {
    const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
    const signer =  ethersProvider.getSigner();
    const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
    setSwapamount1(e);
    let swapAmount22 = await swapContract.getAmountsOut(ethers.utils.parseUnits((e).toString(), tokenDecimals1), [token1,token2]);
    let swapbuff = ethers.utils.formatUnits(swapAmount22[1]._hex, 0)
    setSwapamount2(parseFloat(swapbuff/(10**tokenDecimals2)));
    console.log("SwapAmount:", e, swapAmount22, swapbuff, parseFloat(swapbuff/(10**tokenDecimals2)));
  };

  const handleSwapamount2 = async(e) => {
    const swapContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
    setSwapamount2(e);
    let swapAmount11 = await swapContract.getAmountsIn(ethers.utils.parseUnits((e).toString(), tokenDecimals2), [token1,token2]);
    let swapbuff = ethers.utils.formatUnits(swapAmount11[0]._hex, 0)
    setSwapamount1(parseFloat(swapbuff/(10**tokenDecimals1)));
    console.log("SwapAmount2:", e, swapAmount11, parseFloat(swapbuff/(10**tokenDecimals1)));
  };

  const fun = async() => {
    try{
      console.log("check use");
      const eth = await provider.getBalance(address);
      setEthbal(eth);

      const erc20Contract = new ethers.Contract(token1, ERC20ABI, provider);
      const erc20Contract2 = new ethers.Contract(token2, ERC20ABI, provider);
      
      if(token1 !== WSEIAddress){
        let allowance1 = ethers.utils.formatUnits( await erc20Contract.allowance(address, PancakeRouterV2Address), 0);
        setAllowance(allowance1);
        console.log("allow",allowance1);
      }
      let tokenbal1 = ethers.utils.formatUnits(await erc20Contract.balanceOf(address),0);
      setTokenbal1(tokenbal1);
      let tokenbal2 = ethers.utils.formatUnits(await erc20Contract2.balanceOf(address),0);
      setTokenbal2(tokenbal2);
      console.log("allow1",tokenbal1,tokenbal2,eth);
      // let balance1 = ethers.utils.formatUnits( await erc20Contract.balanceOf(address), 0); 
      // setbusdBalance(balance1);
    } catch(e) {
      console.error(e);
    }
    
}

  useEffect(() => {
    fun();
    console.log("tokens:", token1, token2, tokenDecimals1, tokenDecimals2);
  },[address, isConnected, token1, token2]);

    return (
        <Layout>
        <><ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/></>

            <div className="page-content">

            <Modal centered size="lgmd" show={showModal} onHide={handleCloseModal}>
              <Modal.Body>
                <Button className='modal-close' onClick={handleCloseModal} variant='reset'>
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="1">
                      <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                      </g>
                  </svg>
                </Button>

                <h4 className="h4 mb-0"><center>SLIPPAGE TOLERANCE</center></h4>  

                <div className="pt-md-5 pt-3">
                  <Row className='mb-30'>
                    <Col sm={4} className='mb-2'>
                        <input type="radio" hidden id='radio1' name="amount" />
                        <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>feesAmount(0.05)} >0.05%</label>
                        {/* <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>feesAmount(0.05)}>0.05%</Button> */}
                    </Col>
                    <Col sm={4} className='mb-2'>
                        <input type="radio" hidden id='radio2' name="amount" />
                        <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>feesAmount(0.01)} >0.01%</label>

                        {/* <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>feesAmount(0.01)}>0.01%</Button> */}
                    </Col>
                    <Col sm={4} className='mb-2'>
                    <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>feesAmount(0.5)} >0.5%</label>

                        <input type="radio" hidden id='radio3' name="amount" />
                        {/* <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>feesAmount(0.5)}>0.5%</Button> */}
                    </Col>
                    {/* <Col sm={12} md={3} className='mb-md-2'>
                      <InputGroup className='mb-2 py-2 input-reload'>
                        <FormControl
                          className='m-0 form-control py-0 pe-1 ps-2  border-0 text-white'
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                        />
                        <InputGroup.Text id="basic-addon2" style={{opacity: '0.5'}} className='px-1'>0.50%</InputGroup.Text>
                      </InputGroup>
                    </Col> */}
                  </Row>
                </div>
              </Modal.Body>
              
            </Modal>
                <Container>
                    <Row>
                        <Col lg={6} className='mb-lg-0 mb-4 order-lg-2'>
                            <div className="card-base card-shadow card-dark" style={{minHeight: '640px'}}>
                                <h6 className='text-uppercase mb-4'></h6>

                                <div className="d-flex mb-1 justify-content-end">
                                <Row className='align-items-center mb-2'>
                                  <Col>
                                {/* <button className='btn btn-grad' onClick={()=>appOptIn()}>App Opt-In</button> */}
                                <button className='btn btn-grad'>{slippage}%</button>
                                </Col>
                                <Col>
                                    <Button variant='reset' onClick={handleShowModal}>
                                      <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.17 21.4721C6.3766 20.8052 6.75974 20.2278 7.2666 19.8193C7.77346 19.4109 8.37909 19.1915 9 19.1915C9.62091 19.1915 10.2265 19.4109 10.7334 19.8193C11.2403 20.2278 11.6234 20.8052 11.83 21.4721H22V23.7499H11.83C11.6234 24.4167 11.2403 24.9942 10.7334 25.4027C10.2265 25.8111 9.62091 26.0305 9 26.0305C8.37909 26.0305 7.77346 25.8111 7.2666 25.4027C6.75974 24.9942 6.3766 24.4167 6.17 23.7499H2V21.4721H6.17ZM12.17 13.4999C12.3766 12.833 12.7597 12.2556 13.2666 11.8471C13.7735 11.4386 14.3791 11.2193 15 11.2193C15.6209 11.2193 16.2265 11.4386 16.7334 11.8471C17.2403 12.2556 17.6234 12.833 17.83 13.4999H22V15.7777H17.83C17.6234 16.4445 17.2403 17.022 16.7334 17.4304C16.2265 17.8389 15.6209 18.0582 15 18.0582C14.3791 18.0582 13.7735 17.8389 13.2666 17.4304C12.7597 17.022 12.3766 16.4445 12.17 15.7777H2V13.4999H12.17ZM6.17 5.52764C6.3766 4.86078 6.75974 4.28333 7.2666 3.87487C7.77346 3.46642 8.37909 3.24707 9 3.24707C9.62091 3.24707 10.2265 3.46642 10.7334 3.87487C11.2403 4.28333 11.6234 4.86078 11.83 5.52764H22V7.80542H11.83C11.6234 8.47228 11.2403 9.04973 10.7334 9.45819C10.2265 9.86665 9.62091 10.086 9 10.086C8.37909 10.086 7.77346 9.86665 7.2666 9.45819C6.75974 9.04973 6.3766 8.47228 6.17 7.80542H2V5.52764H6.17ZM9 7.80542C9.26522 7.80542 9.51957 7.68543 9.70711 7.47185C9.89464 7.25827 10 6.96858 10 6.66653C10 6.36448 9.89464 6.0748 9.70711 5.86121C9.51957 5.64763 9.26522 5.52764 9 5.52764C8.73478 5.52764 8.48043 5.64763 8.29289 5.86121C8.10536 6.0748 8 6.36448 8 6.66653C8 6.96858 8.10536 7.25827 8.29289 7.47185C8.48043 7.68543 8.73478 7.80542 9 7.80542ZM15 15.7777C15.2652 15.7777 15.5196 15.6577 15.7071 15.4441C15.8946 15.2305 16 14.9408 16 14.6388C16 14.3367 15.8946 14.047 15.7071 13.8334C15.5196 13.6199 15.2652 13.4999 15 13.4999C14.7348 13.4999 14.4804 13.6199 14.2929 13.8334C14.1054 14.047 14 14.3367 14 14.6388C14 14.9408 14.1054 15.2305 14.2929 15.4441C14.4804 15.6577 14.7348 15.7777 15 15.7777ZM9 23.7499C9.26522 23.7499 9.51957 23.6299 9.70711 23.4163C9.89464 23.2027 10 22.913 10 22.611C10 22.3089 9.89464 22.0193 9.70711 21.8057C9.51957 21.5921 9.26522 21.4721 9 21.4721C8.73478 21.4721 8.48043 21.5921 8.29289 21.8057C8.10536 22.0193 8 22.3089 8 22.611C8 22.913 8.10536 23.2027 8.29289 23.4163C8.48043 23.6299 8.73478 23.7499 9 23.7499Z" fill="white"/>
                                    </svg>
                                    </Button>
                                    <DropdownButton
                                        as={ButtonGroup}
                                        drop={'start'}
                                        variant="secondary"
                                        className='dropdown-reset d-none'
                                        title={<svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.17 21.4721C6.3766 20.8052 6.75974 20.2278 7.2666 19.8193C7.77346 19.4109 8.37909 19.1915 9 19.1915C9.62091 19.1915 10.2265 19.4109 10.7334 19.8193C11.2403 20.2278 11.6234 20.8052 11.83 21.4721H22V23.7499H11.83C11.6234 24.4167 11.2403 24.9942 10.7334 25.4027C10.2265 25.8111 9.62091 26.0305 9 26.0305C8.37909 26.0305 7.77346 25.8111 7.2666 25.4027C6.75974 24.9942 6.3766 24.4167 6.17 23.7499H2V21.4721H6.17ZM12.17 13.4999C12.3766 12.833 12.7597 12.2556 13.2666 11.8471C13.7735 11.4386 14.3791 11.2193 15 11.2193C15.6209 11.2193 16.2265 11.4386 16.7334 11.8471C17.2403 12.2556 17.6234 12.833 17.83 13.4999H22V15.7777H17.83C17.6234 16.4445 17.2403 17.022 16.7334 17.4304C16.2265 17.8389 15.6209 18.0582 15 18.0582C14.3791 18.0582 13.7735 17.8389 13.2666 17.4304C12.7597 17.022 12.3766 16.4445 12.17 15.7777H2V13.4999H12.17ZM6.17 5.52764C6.3766 4.86078 6.75974 4.28333 7.2666 3.87487C7.77346 3.46642 8.37909 3.24707 9 3.24707C9.62091 3.24707 10.2265 3.46642 10.7334 3.87487C11.2403 4.28333 11.6234 4.86078 11.83 5.52764H22V7.80542H11.83C11.6234 8.47228 11.2403 9.04973 10.7334 9.45819C10.2265 9.86665 9.62091 10.086 9 10.086C8.37909 10.086 7.77346 9.86665 7.2666 9.45819C6.75974 9.04973 6.3766 8.47228 6.17 7.80542H2V5.52764H6.17ZM9 7.80542C9.26522 7.80542 9.51957 7.68543 9.70711 7.47185C9.89464 7.25827 10 6.96858 10 6.66653C10 6.36448 9.89464 6.0748 9.70711 5.86121C9.51957 5.64763 9.26522 5.52764 9 5.52764C8.73478 5.52764 8.48043 5.64763 8.29289 5.86121C8.10536 6.0748 8 6.36448 8 6.66653C8 6.96858 8.10536 7.25827 8.29289 7.47185C8.48043 7.68543 8.73478 7.80542 9 7.80542ZM15 15.7777C15.2652 15.7777 15.5196 15.6577 15.7071 15.4441C15.8946 15.2305 16 14.9408 16 14.6388C16 14.3367 15.8946 14.047 15.7071 13.8334C15.5196 13.6199 15.2652 13.4999 15 13.4999C14.7348 13.4999 14.4804 13.6199 14.2929 13.8334C14.1054 14.047 14 14.3367 14 14.6388C14 14.9408 14.1054 15.2305 14.2929 15.4441C14.4804 15.6577 14.7348 15.7777 15 15.7777ZM9 23.7499C9.26522 23.7499 9.51957 23.6299 9.70711 23.4163C9.89464 23.2027 10 22.913 10 22.611C10 22.3089 9.89464 22.0193 9.70711 21.8057C9.51957 21.5921 9.26522 21.4721 9 21.4721C8.73478 21.4721 8.48043 21.5921 8.29289 21.8057C8.10536 22.0193 8 22.3089 8 22.611C8 22.913 8.10536 23.2027 8.29289 23.4163C8.48043 23.6299 8.73478 23.7499 9 23.7499Z" fill="white"/>
                                            </svg>}
                                    >
                                        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                                    </DropdownButton>
                                    </Col>
                                </Row>
                                </div>

                                <div className="mb-0">
                                  
                                    <label className='d-flex align-items-center justify-content-between'>From
                                    {(tk1 == "ETH")||(tk1 == "SEI")||(tk1 == "Algo") ? (<><small>Price:${pc1 > 0 ? parseFloat(pc1).toFixed(2) : (pr1 > 0)?pr1:'0.0'} {tk1.toUpperCase()}</small></>):
                                    (tk1 == "USDC")?(<><small>Price:${pc2 > 0 ? parseFloat(pc2).toFixed(2) :  (pr1 > 0)?pr1:'0.0'} {tk1.toUpperCase()}</small></>):(<></>) }
                                            
                                     </label>

                                        {/* <input type="text" onChange={(e) => setValue(e.target.value)} placeholder='Enter Token' className='form-control' value={value} />
                                 <div className="card-base card-dark card-token mb-30">      
                            <input  type="text" onChange={(e) => setValue(e.target.value)} placeholder='Enter Token' className='form-control' value={value} />
                        </div> */}
{dvalue ? (
<>
{swapv ? (
  <>
   <div className="balance-card d-flex align-items-center justify-content-between">

  {/* <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={((parseInt(samount1)/1000000 == NaN)||(samount1 == 0)) ? '' : parseInt(samount1)/1000000 } onChange={event => setvalueA1((event.target.value)* 1000000)} /> */}
  <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={swapamount1? swapamount1 : ""} onChange={(e) => handleSwapamount1(e.target.value)} />
  <FilterDropdown assetid1 = {AssetId1} setassetid1={(AssetId1)=>(setAssetId1(AssetId1))}  ass={ass1} setassets={(ass1)=>setAssets1(ass1)} setassetsn={(assn1)=>setAssetsn1(assn1)} assn = {assn1} setk = {(t1)=>sett1(t1)} setToken1Id={(ti1)=>{setTokenId1(ti1)}} setclicklogo1={(l1)=>{setlogo1(l1)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname1)=>{setTokenName1(tokenname1)}} settokendecimals={(tokendecimals)=>{setTokenDecimals1(tokendecimals)}}></FilterDropdown>
  </div>
    {/* {(tk1 == "ETH")||(tk1 == "Algo")?(<><small>Balance:{ balanceid1 > 0 ? parseFloat(balanceid1/1000000).toFixed(2) : '0.0'}</small></>):(<><small>Balance:{(id1Token=== NaN||id1Token ===undefined||id1Token===null)?'0.0': parseFloat(id1Token/1000000).toFixed(2) } </small></>) } */}
    {(tk1 == "ETH")||(tk1 == "SEI")||(tk1 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/1e18).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal1)?'0.0': parseFloat(tokenbal1/(10 ** tokenDecimals1)).toFixed(4) } </small></>) }

    </>
):(<>
<div className="balance-card d-flex align-items-center justify-content-between">
 {/* <input type='number' className='m-0 form-control p-0 border-0 text-white' placeholder="0.0" autoComplete='off' value={((parseInt(samount2)/1000000 == NaN)||(samount2 == 0))  ? '' :(parseInt(samount2)/1000000)} onChange={event => setvalueA2((event.target.value)* 1000000)} /> */}
 <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={swapamount1? swapamount1 : ""} onChange={(e) => handleSwapamount1(e.target.value)} />
 <FilterDropdown2 assetid2 = {AssetId2} setassetid2={(AssetId2)=>(setAssetId2(AssetId2))} ass={ass} setassets={(ass)=>setAssets(ass)} setassetsn={(assn)=>setAssetsn(assn)} assn = {assn} setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)} setToken2Id={(ti2)=>{setTokenId2(ti2)}} setclicklogo2={(l2)=>{setlogo2(l2)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname2)=>{setTokenName2(tokenname2)}} settokendecimals={(tokendecimals)=>{setTokenDecimals1(tokendecimals)}}/>
 </div>
                                    {/* {(tk2 == "TAU")?(<><small>Balance:{parseFloat(balanceid2).toFixed(2)}</small></>):(<> */}
                                    <small>Balance:{(!tokenbal1 || tokenbal1 === 0)?'0.0':parseFloat(tokenbal1/(10 ** tokenDecimals1)).toFixed(4)  } </small>
    
</>)} 
 
</>
):(<>
 <div className="balance-card d-flex align-items-center justify-content-between">

  {/* <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={((parseInt(samount1)/1000000 == NaN)||(samount1 == 0)) ? '' : parseInt(samount1)/1000000 } onChange={event => setvalueA1duplicate((event.target.value)* 1000000)} /> */}

  <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={swapamount1? swapamount1 : ""} onChange={(e) => handleSwapamount1(e.target.value)} />

  <Button variant='filter'  >
            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="">
                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
            </svg> */}
           
           {a.name1 === "ETH" || a.name1 === "SEI"?(<>
            <img  width="31" height="30" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROQNyD7j5bC5DMh1kN613JbHgcczZBwncxFrSp-5EhdVCrg3vEHayr5WtEo1JCSyyJUAs&usqp=CAU"}/>
           </>):(<>
            <img  width="31" height="30" src={logo}/>

           </>)}           {a.name1}
         
        </Button>
        </div>
    {(tk1 == "ETH")||(tk1 == "SEI")||(tk1 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/(10 ** 18)).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal1 || tokenbal1 === 0)?'0.0':parseFloat(tokenbal1/(10**tokenDecimals1)).toFixed(4) } </small></>) }

</>)}                                        
  </div>

<div className="text-center">
    <Button variant='reset' onClick={() => changetokens()}>
        <svg width="32" height="32" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.919922" y="60.0796" width="60" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.0796)" fill="white"/>
            <path d="M31.0488 26.0296L35.9988 21.0796L40.9488 26.0296L39.5348 27.4436L36.9978 24.9076L36.9988 38.0796H34.9988V24.9076L32.4628 27.4436L31.0488 26.0296ZM21.0488 34.1296L22.4628 32.7156L24.9988 35.2516V22.0796H26.9988V35.2516L29.5348 32.7156L30.9488 34.1296L25.9988 39.0796L21.0488 34.1296Z" fill="black"/>
        </svg>
    </Button>
</div>

<div className="mb-2">
    <label className='d-flex align-items-center justify-content-between'>To 
    {(tk2 == "ETH")||(tk2 == "SEI")||(tk2 == "Algo") ? (<><small >Price:${pc1 > 0 ? parseFloat(pc1).toFixed(2) : (pr2 > 0)?pr2:'0.0'}  {tk2.toUpperCase()}</small></>):
      (tk2 == "USDC")?(<><small>Price:${pc2 > 0 ? parseFloat(pc2).toFixed(2) :  (pr2 > 0)?pr2:'0.0'} {tk1.toUpperCase()}</small></>):(<></>) }


    </label>

   
    {dvalue ? (
    <>
    {swapv ? (
  <>
   <div className="balance-card d-flex align-items-center justify-content-between">
  {/* <input type='number' className='m-0 form-control p-0 border-0 text-white' placeholder="0.0" autoComplete='off' value={((parseInt(samount2)/1000000 == NaN)||(samount2 == 0))  ? '' :(parseInt(samount2)/1000000)} onChange={event => setvalueA2((event.target.value)* 1000000)} /> */}
  <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={swapamount2? swapamount2 : ""} onChange={(e) => handleSwapamount2(e.target.value)} disabled={true}/>
  <FilterDropdown2 assetid2 = {AssetId2} setassetid2={(AssetId2)=>(setAssetId2(AssetId2))} ass={ass} setassets={(ass)=>setAssets(ass)} setassetsn={(assn)=>setAssetsn(assn)} assn = {assn} setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)} setToken2Id={(ti2)=>{setTokenId2(ti2)}} setclicklogo2={(l2)=>{setlogo2(l2)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname2)=>{setTokenName2(tokenname2)}} settokendecimals={(tokendecimals)=>{setTokenDecimals2(tokendecimals)}}/>
  </div>
                                    {/* {(tk2 == "TAU")?(<><small>Balance:{parseFloat(balanceid2).toFixed(2)}</small></>):(<> */}
                                    {(tk2 == "ETH")||(tk2 == "SEI")||(tk2 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/1e18).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal2 || tokenbal2 === 0)?'0.0': parseFloat(tokenbal2/(10**tokenDecimals2)).toFixed(4) } </small></>) }
                                    
                                    
 </>
):(<>
 <div className="balance-card d-flex align-items-center justify-content-between">
 {/* <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={((parseInt(samount1)/1000000 == NaN)||(samount1 == 0)) ? '' : parseInt(samount1)/1000000 } onChange={event => setvalueA1((event.target.value)* 1000000)} /> */}
 <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={swapamount2? swapamount2 : ""} onChange={(e) => handleSwapamount2(e.target.value)} disabled={true} />
 <FilterDropdown assetid1 = {AssetId1} setassetid1={(AssetId2)=>(setAssetId1(AssetId2))}  ass={ass1} setassets={(ass1)=>setAssets1(ass1)} setassetsn={(assn1)=>setAssetsn1(assn1)} assn = {assn1} setk = {(t1)=>sett1(t1)} setToken1Id={(ti1)=>{setTokenId1(ti1)}} setclicklogo1={(l1)=>{setlogo1(l1)}} settoken1={(token11)=>{setToken1(token11)}} settoken2={(token22)=>{setToken2(token22)}} settokenname={(tokenname1)=>{setTokenName1(tokenname1)}} settokendecimals={(tokendecimals)=>{setTokenDecimals2(tokendecimals)}}></FilterDropdown>
  </div>
    {(tk2 == "ETH")||(tk2 == "SEI")||(tk2 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/1e18).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal2 || tokenbal2 === 0)?'0.0': parseFloat(tokenbal2/(10**tokenDecimals2)).toFixed(4) } </small></>) }

    </>)} </>
):(<>
 <div className="balance-card d-flex align-items-center justify-content-between">
  {/* <input type='number' className='m-0 form-control p-0 border-0 text-white' placeholder="0.0" autoComplete='off' value={((parseInt(samount2)/1000000 == NaN)||(samount2 == 0))  ? '' :(parseInt(samount2)/1000000)} onChange={event => setvalueA2duplicate((event.target.value)* 1000000)} /> */}
  <input type='number' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={swapamount2? swapamount2 : ""} onChange={(e) => handleSwapamount2(e.target.value)} disabled={true}/>

  <Button variant='filter'  >
            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="">
                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
            </svg> */}
           {a.name2 === "ETH" || a.name2 === "SEI"?(<>
            <img  width="31" height="30" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROQNyD7j5bC5DMh1kN613JbHgcczZBwncxFrSp-5EhdVCrg3vEHayr5WtEo1JCSyyJUAs&usqp=CAU"}/>
           </>):(<>
            <img  width="31" height="30" src={logo}/>

           </>)}
        {a.name2}
         
        </Button>
        </div>
                                    {/* {(tk2 == "TAU")?(<><small>Balance:{parseFloat(balanceid2).toFixed(2)}</small></>):(<> */}
                                    {(tk2 == "ETH")||(tk2 == "SEI")||(tk2 == "Algo")?(<><small>Balance:{ ethbal > 0 ? parseFloat(ethbal/1e18).toFixed(4) : '0.0'}</small></>):(<><small>Balance:{(!tokenbal2 || tokenbal2 === 0)?'0.0': parseFloat(tokenbal2/(10**tokenDecimals1)).toFixed(4) } </small></>) }
                                    
</>)}
                                    {/* </>) } */}
                                </div>
                                {swapdetail ? (<>
                                  <InputGroup className='mb-2 input-reload'>
                                  <FormControl
                                    className='m-0 form-control py-0 pe-0 ps-2  border-0 text-white' placeholder="Price"
                                   
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                  />
                                  
                                    <InputGroup.Text id="basic-addon2" className='px-1'>{ price1 > 0 ? parseFloat(price1).toFixed(4) : "0"} {tk1} per {tk2}</InputGroup.Text>
                                  
                                    
                                  {/* <Button variant="reset" id="button-addon2" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                      <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                                    </svg>
                                  </Button> */}
                                </InputGroup>

                                <div className="card card-stack mb-2">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <span>Minimum Received</span>
                                      <strong>{parseFloat(AssWithFee/1000000).toFixed(4)} {tk2}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <span>Slippage Tolerance</span>
                                      <strong>{fee}%</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <span>Swap Rewards</span>
                                      <strong >{swf > 0 ? parseFloat(swf).toFixed(3) : "0" } ELEM</strong>
                                    </div>                        
                                  </div>
                                </div> 
                                </>):(<>
                                </>)}
                               <center>
                                {sufficient ? (<>
                                  <Button className='mt-xxl-4 mt-2 btn w-70 btn-grad' >INSUFFICIENT LIQUIDITY</Button>
                                </>):(<>
                                  {/* {(swapopt === true ) ? (<>
                                    <Button className='mt-xxl-4 mt-2 btn w-70 btn-grad' onClick={()=>approveSei()}> Approve {assn1? assn1 : ""}</Button>
                                </>):(<>
                                    <Button className='mt-xxl-4 mt-2 btn w-70 btn-grad' onClick={()=>swap(appID_global,swapamount)}>ZERO FEE EXCHANGE</Button>
                                    
                                </>)} */}
                                {(allowance < (swapamount1 * (10 ** tokenDecimals1)) && token1 !== WSEIAddress) ? (<>
                                    <ButtonLoad loading={loader} className='mt-xxl-4 mt-2 btn w-70 btn-grad' onClick={()=>approveSei()}> Approve {tokenName1? tokenName1 : ""}</ButtonLoad>
                                </>):(<>
                                    {/* <Button className='mt-xxl-4 mt-2 btn w-70 btn-grad' onClick={()=>swap(appID_global,swapamount)}>ZERO FEE EXCHANGE</Button> */}
                                    <ButtonLoad loading={loader} className='mt-xxl-4 mt-2 btn w-70 btn-grad' onClick={()=>swapSei()}>EXCHANGE</ButtonLoad>
                                </>)}
                                </>)}
                                </center>
                               
                                
                               
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="card-base card-chart" style={{minHeight: '640px'}}>
                                <Breadcrumb className='mb-50'>
                                    <Breadcrumb.Item>
                                    {swapv ? (<>
                                      {logovalue1 ? (<>
                                          {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns={logovalue1}>
                                            <rect width="30.1212" height="30" rx="15" fill="White"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        {logovalue1 === "unknown"? <img width="32" height="32"  src={questionlogo}/> : 
                                        <img width="33" height="33"  src={logovalue1}/>}
                                        

                                        </>):(<>
                                          {/* <svg width="35" height="35" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="19.5" cy="19.5" r="19.5" fill="#CACACA"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.35 19.5754L19.4468 7.8L26.5434 19.5754L19.4468 23.7702L19.4468 23.7702L12.35 19.5754ZM19.4468 30.9217L12.35 20.9212L19.4468 25.1139L26.5478 20.9212L19.4468 30.9217Z" fill="#1C1D1F"/>
                                            </svg>                                 */}
                                        <img width="33" height="33"  src={seilogo}/>
                                        </>)}
                                        {/* <img width="31" height="30" viewBox="0 0 31 30" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROQNyD7j5bC5DMh1kN613JbHgcczZBwncxFrSp-5EhdVCrg3vEHayr5WtEo1JCSyyJUAs&usqp=CAU"/> */}

                                        <span style={{"color":"white"}}>{ass1 ? ass1 : "SEI"}</span>
                                    </>):(<>
                                      {logovalue2 ? (<>
                                          {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns={logovalue1}>
                                            <rect width="30.1212" height="30" rx="15" fill="White"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        {logovalue2 === "unknown"? <img width="33" height="33"  src={questionlogo}/> : 
                                        <img width="33" height="33"  src={logovalue2}/>}

                                        </>):(<>
                                          {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="30.1212" height="30" rx="15" fill="White"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        {/* <svg width="35" height="35" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="19.5" cy="19.5" r="19.5" fill="#CACACA"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.35 19.5754L19.4468 7.8L26.5434 19.5754L19.4468 23.7702L19.4468 23.7702L12.35 19.5754ZM19.4468 30.9217L12.35 20.9212L19.4468 25.1139L26.5478 20.9212L19.4468 30.9217Z" fill="#1C1D1F"/>
                                        </svg> */}
                                        
                                        <img width="33" height="33"  src={usdcLogo}/>
                                        </>)}

                                        <span style={{"color":"white"}}>{ass ? ass : "USDC"}</span>
                                    </>)}
                                       
                                     </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                    {swapv ? (<>
                                      {logovalue2 ? (<>
                                          {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns={logovalue1}>
                                            <rect width="30.1212" height="30" rx="15" fill="White"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        {logovalue2 === "unknown"? <img width="32" height="32"  src={questionlogo}/> : 
                                        <img width="32" height="32"  src={logovalue2}/>}

                                        </>):(<>
                                          {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="30.1212" height="30" rx="15" fill="White"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                              {/* <svg width="35" height="35" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <circle cx="19.5" cy="19.5" r="19.5" fill="#CACACA"/>
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.35 19.5754L19.4468 7.8L26.5434 19.5754L19.4468 23.7702L19.4468 23.7702L12.35 19.5754ZM19.4468 30.9217L12.35 20.9212L19.4468 25.1139L26.5478 20.9212L19.4468 30.9217Z" fill="#1C1D1F"/>
                                              </svg> */}
                                              <img width="33" height="33"  src={usdcLogo}/>
                                        </>)}

                                        <span style={{"color":"white"}}>{ass ? ass : "USDC"}</span>
                                    </>):(<>
                                      {logovalue1 ? (<>
                                          {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns={logovalue1}>
                                            <rect width="30.1212" height="30" rx="15" fill="White"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        {logovalue1 === "unknown"? <img width="32" height="32"  src={questionlogo}/> : 
                                        <img width="32" height="32"  src={logovalue1}/>}

                                        </>):(<>
                                          {/* <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="19.5" cy="19.5" r="19.5" fill="#CACACA"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.35 19.5754L19.4468 7.8L26.5434 19.5754L19.4468 23.7702L19.4468 23.7702L12.35 19.5754ZM19.4468 30.9217L12.35 20.9212L19.4468 25.1139L26.5478 20.9212L19.4468 30.9217Z" fill="#1C1D1F"/>
                                            </svg> */}
                                            <img width="33" height="33"  src={seilogo}/>

                                        </>)}
                                        {/* <img width="31" height="30" viewBox="0 0 31 30" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROQNyD7j5bC5DMh1kN613JbHgcczZBwncxFrSp-5EhdVCrg3vEHayr5WtEo1JCSyyJUAs&usqp=CAU"/> */}

                                        <span style={{"color":"white"}}>{ass1 ? ass1 : "SEI"}</span>
                                    </>)}
                                   
                                    </Breadcrumb.Item>
                                </Breadcrumb>

                                <div className="d-flex mb-4 justify-content-between align-items-center">
                                    <div className="h3 mb-0">180.79</div>

                                    <ul className="chart-filter mb-0 d-flex align-items-center list-unstyled">
                                        <li>5M</li>
                                        <li>15M</li>
                                        <li className='active'>1H</li>
                                        <li>4H</li>
                                        <li>1D</li>
                                    </ul>
                                </div>

                                <SwapChart />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}

export default SwapPage;
