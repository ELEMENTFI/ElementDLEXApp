import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';

import Icon1 from '../../assets/images/icon1.png';
import Icon2 from '../../assets/images/icon2.png';
import Llogo from '../../assets/images/L logo.png';
import Plogo from '../../assets/images/P logo.png';
import elem from '../../assets/images/elem-original.png';
import tau from '../../assets/images/tau-original.png';
import { useHistory } from "react-router-dom";
import {calltokenForUsers,callapiforuserslist} from '../apicallfunction';
import moment from 'moment';
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk, { Algod,base64 } from "algosdk";
import {postusertx,postuserdetail} from '../apicallfunction';
import { Button, Col, Container, Modal, Row, Breadcrumb } from 'react-bootstrap';
import { createtxhash ,updatepairhistory,getmethod} from '../apicallfunction';
import { priceOfCoin1,priceOfCoin2,find_balance,checkassetin,find_balance_escrow,convert1,convert2,readingLocalstate,assetName,decodLocalState } from '../formula';
import { PancakeFactoryV2ABI, PancakeFactoryV2Address, PancakeRouterV2ABI, PancakeRouterV2Address, ERC20ABI, PancakePairV2ABI } from '../../abi';

import { assert2Reserve, assert1Reserve } from '../formula';
import { getLiqlistFirebase } from '../../firebasefunctions';
import { ethers } from 'ethers';
// import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const myAlgoWallet = new MyAlgoConnect();
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
const TopLiquidity = () => {
    let history=useHistory();

    const url = "https://evm-rpc-testnet.sei-apis.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    const [dt,setdt] = useState([]);
    const[ar1,setar1] = useState([]);
    const[ar2,setar2] = useState([]);
    const[ar3,setar3] = useState([]);
    const [s1, sets1] = useState("");
    const [s2, sets2] = useState("");
    const [ilt, setilt] = useState("");
    const[unclaimed_protocol_fees,setunclaimed_protocol_fees]= useState("");
    const[outstanding_asset1_amount,setoutstanding_asset1_amount]= useState("")
    const[outstanding_asset2_amount,setoutstanding_asset2_amount]= useState("")
    const[outstanding_liquidity_amount,setoutstanding_liquidity_amount]= useState("")
    const[shownvalue,setshownalue] = useState(false);
    const[a,seta] = useState([]);
    const [liquidity, setLiquidity] = React.useState(false);
    const [pair, setPair] = React.useState(false);
    const[aprice,setaprice]= useState([]);
    const handleClose = () => setShow(false);
    const [show, setShow] = React.useState(false);
    const [appId,setAppId] = useState("");
    const[b,setb] = useState([]);
    const[c,setc] = useState([]);
    const[pageSize,setPageSize]=useState(0); 
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage,setpostperpage] = useState(4);
    const[startingpage,setstap ] = useState(0);
    const[spvalue,setpvalue] = useState("");
  //console.log("avalue",a);
    const[amount2Value,setamount2] = useState("");
    const[amount1Value,setamount1] = useState("");
    // const handleLiquidiy = () => {setLiquidity(!liquidity); setPair(false)};
    const [handleLiquidiyopen,sethandleLiquidiyopen] = useState(false);
    const [handleLiquidiyclose,sethandleLiquidiyclose] = useState(false);
    const handlelopen =() =>{sethandleLiquidiyopen(true)}
    const handlelclose =() =>{sethandleLiquidiyopen(false)}
    const[a1balance,setas1balance]=useState("");
    const[a2balance,setas2balance]=useState("");
    const[samount1,setsAmount1] = useState("");
    const[samount2,setsAmount2] = useState("");
    const[rstate,setrstate]= useState([]);
    const[liqList, setLiqList]=useState([]);
    let appID_global = 57691024;

    let currentPosts;
    // Get current posts
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    // console.log("bva",b.slice(0,3))
    currentPosts = b.slice(startingpage, indexOfLastPost);
  // console.log("current",currentPosts,indexOfLastPost);
// useEffect(() =>{readvaliemethod()},[])
const readvaliemethod=async()=>{
 let k = await getmethod(1,2);
 console.log("K",k)
 setb(k);
//  let c = k.slice(1, 4);
 let m =0;
 console.log("m",m)
 k.map((r,i)=>{
   m = m + r.tvl;
 })
 console.log("m",m)
  localStorage.setItem("tvl",m);
}


    const setpostcall = ()=>{
      //console.log("postperpage",postsPerPage)
        if(postsPerPage <= 4){
            
        }
        else{
        setpostperpage(postsPerPage-4)
      //console.log("postperpage")
        }
    
       
    }
    async function readLocalState(client, account,passvalue){
        let accountInfoResponse = await client.accountInformation(account).do();
      //console.log("accinfo",accountInfoResponse);
        let avalue,bvalue,cvalue;
        if(accountInfoResponse['apps-local-state'].length > 0){
          for(let i = 0; i< accountInfoResponse['apps-local-state'][0]['key-value'].length;i++){
            if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czE="){
             avalue = (accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            //  setMax(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           //console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            }
            else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czI="){
             bvalue = (accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            //  setMax1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           //console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            }
            else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] ===  "aWx0"){
             cvalue = (accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           //console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            }
          }
        }
        let pgsize = {"a":avalue,"b":bvalue,"c":cvalue,"name1":passvalue.asset1name,"name2":passvalue.asset2name,"id1":passvalue.as1id,"id2":passvalue.as2id}
        history.push({
            pathname: '/swap',          
            state: { detail: pgsize }
        })
    }
    async function readLocalStateValue(client, account, index1,asset1,asset2){
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
          // if(keys.slice(0,2) === "bw"){
          //   let a1 = decodLocalState(String(keys));
           
          //   if(decodLocalState(keys) === asset1){
          //     setoutstanding_asset1_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              
          //   } 
          //   if(decodLocalState(keys) === asset2){
          //     setoutstanding_asset2_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
             
          //   } 
          //   if(decodLocalState(keys) === asset3){
          //     setoutstanding_liquidity_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
           
          //   }
          // }          
         
        
         
        }
     
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
          //console.log(
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
    const buttonclick = async(pvalue) =>{

        await readLocalState(algodClient,pvalue.escrowAddress,pvalue);
       
    }

   
   const setincrm= async()=>{
  console.log("not enter",postsPerPage,(b.length-4))
   if(postsPerPage > (b.length-4))
   {
     if((b.length)-postsPerPage > 0){
        console.log("not enter")
        let k = (b.length)-postsPerPage;
        setpostperpage(postsPerPage+k)
        // setstap(startingpage)
        currentPosts= b.slice(indexOfLastPost, indexOfLastPost+k);
     }
     
   }
   else{
    setpostperpage(postsPerPage+4)
    // setstap(startingpage)
     currentPosts= b.slice(indexOfLastPost, indexOfLastPost+4);
   //console.log("current",currentPosts);
   }
    
   }
   
 //console.log("bvalue",b)

function SetValue1(Amountin){
    //console.log("aprice",aprice);
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
  const addli = async(as1,as2) =>{
    let s1 =  await find_balance(as1);
  //console.log("b1",s1,as1)
    setas1balance(s1);
    let s2 = await find_balance(as2);
    setas2balance(s2);
  //console.log("b2",s2)
    
    
  }
  const pass =async(pvalue)=>{
   
    addli(pvalue.as1id,pvalue.as2id)
    setpvalue(pvalue)
    let a1 = await readingLocalstate(algodClient,pvalue.escrowAddress);
  //console.log("values",a1);

    let b1 = assert1Reserve(a1);
   let  b2 = assert2Reserve(a1);
   
   let pr =[];
   pr.push(b1);
   pr.push(b2);
   setaprice(pr);
   readLocalStateValue(algodClient,pvalue.escrowAddress,appId,pvalue.as1id,pvalue.as2id);


   let sh = await checkassetin(pvalue.as3id);
    if(sh === undefined || sh === null || sh===""){
      setshownalue(false);
    }
    else{
      setshownalue(true);
    }
   
   handlelopen();

  //console.log("asset1",b1,b2,pr)
    
  }
  const closevalue =()=>{
    setamount1(0)
    setamount2(0)
    handlelclose();
   
    // setas1balance(0);
    // setas2balance(0);
  }
  const optIn =async (assid) => {

    // const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
    const params = await algodClient.getTransactionParams().do();
  ;

   
    // console.log('Asset 3 ID: ', assetId3);
// console.log("appId inside donate", index)
try {


let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  from:localStorage.getItem("walletAddress"),
  to :localStorage.getItem("walletAddress"),
  assetIndex: assid ,
  amount: 0,
  suggestedParams:params,
  
});


  
  const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
  toast.info("Optin Progress");

const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
//console.log("TxID", JSON.stringify(response, null, 1));
await waitForConfirmation(algodClient, response.txId);
toast.success(`Transaction Success ${response.txId}`);
toast.info("Optin Done Sucessfully");
setshownalue(true);
} catch (err) {
  toast.error(`Transaction Failed due to ${err}`);
  //console.error(err);
}

 
}
  const mint1call = async (appid,a1,a2,asn1,asn2) => {
 
    let index = parseInt(appid);
  //console.log("appId inside donate", index);
  //console.log("input1",a1)
  //console.log("input2",a2)
    setAppId(appid);
    let tokenid1 = spvalue.as1id;
    let tokenid2 = spvalue.as2id;
      
    let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appID_global);
    let results = await algodClient.compile(replacedData).do();

  //console.log("Hash = " + results.hash);
  //console.log("Result = " + results.result);

    
    let assetId3 = spvalue.as3id;
  //console.log(assetId3)

    let program = new Uint8Array(Buffer.from(results.result, "base64"));

    let lsig = algosdk.makeLogicSig(program);
  //console.log("Escrow =", lsig.address()); 

    // readLocalStateValue(algodClient,results.hash,appId,tokenid1,tokenid2);

let i1 = Math.floor(a1);
let i2 = Math.floor(a2);
console.log("input1",i1)
  //console.log("input2",ilt)
let vl = s1+s2+ilt;
let tvl = s1 + s2;
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
    //console.log("Total 2: ", total);
   

                          
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
            //console.log("asset3",assetId3)
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
            //console.log(total);
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
                toast.info("Adding Liquidity is Successfully Done!")
                closevalue();
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
                amount: parseInt(Math.floor(i2)),
                suggestedParams: params,
              });
      
            let foreignassetliquidity = [];
            foreignassetliquidity.push(parseInt(assetId3));
          console.log(total.toFixed(0));
            const transaction5 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: sender,
                assetIndex: parseInt(assetId3),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts: recv_escrow,
                foreignAssets: foreignassetliquidity,
                amount: parseInt((total)),
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
              toast.info("Adding Liquidity is successfully Done!")
              closevalue();
              // setTxId(response.txId);
            }
            
           
            
          } catch (err) {
            toast.error(`Transaction Failed due to ${err}`);
          //console.error(err);
          }                                         
        
    
  };

  const fun = async() => {
    let liqlist1 = [];
    let liquidityList = await getLiqlistFirebase();
    const factoryContract = new ethers.Contract(PancakeFactoryV2Address, PancakeFactoryV2ABI, provider);
    const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
    await Promise.all(liquidityList.map(async(x,i) => {
      const pairContract = new ethers.Contract(x.lpaddress, PancakePairV2ABI, provider);
      const liquiditySupply = ethers.utils.formatUnits(await pairContract.totalSupply(), 18);
      let [reserve11, reserve22, ] = await pairContract.getReserves();
      liqlist1.push({...x, liquidity:liquiditySupply, volume: 10, 
        reserve1: ethers.utils.formatUnits(reserve11, x.decimals1), 
        reserve2: ethers.utils.formatUnits(reserve22, x.decimals2),
        dateNew:  convertEpochToTimeAgo(x.date)});
    }));
    
    setLiqList(liqlist1);
    console.log(liqlist1);
  }

  const convertEpochToTimeAgo = (epoch) => {
    const milliseconds = new Date().getTime() - epoch * 1000;
    const timeUnits = [
        { unit: 'day', value: 24 * 60 * 60 },
        { unit: 'hour', value: 60 * 60 },
        { unit: 'minute', value: 60 },
        { unit: 'second', value: 1 }
    ];

    for (const { unit, value } of timeUnits) {
        const count = Math.floor(milliseconds / (1000 * value));
        if (count > 0) return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
    }

    return 'just now';
};

  // useState(() => {
  //   fun();
  // },[liqList.length]);
  

    return (
        <div className='mb-5'>
            <h2 className="h3 mb-40">Top Liquidity Pairs</h2>
           
                <Modal show={handleLiquidiyopen} centered={true} size="lg" onHide={handlelclose}>
            <ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>
                <Modal.Body className='modal-liquidity-body'>
                <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={()=>closevalue()} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>

                                <h2 className="h3 mb-0" >ADD LIQUIDITY</h2>     
                            </div>

                            <Row className='justify-content-center'>
                                <Col md={7}>
                                    <div className="mb-2">
                                        <label className='d-flex align-items-center justify-content-between'>From <small>Balance: { a1balance > 0 ? parseFloat(a1balance/1000000).toFixed(3) : '0.0'} </small></label>

                                        <div className="balance-card d-flex align-items-center justify-content-between">
                                          {amount1Value ? (<>
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white'  value={amount1Value}  placeholder="0.0" autoComplete='off'/>
                                          </>):(<>
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white'  onChange={e => SetValue1(e.target.value)}   placeholder="0.0" autoComplete='off'/>
                                          </>)}
                                          <Button variant='filter'  >{spvalue.asset1name}</Button>
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
                                        <label className='d-flex align-items-center justify-content-between'>T0 <small>Balance: { a2balance > 0 ? parseFloat(a2balance/1000000).toFixed(4) :'0.0'}  </small></label>

                                        <div className="balance-card d-flex align-items-center justify-content-between">
                                          {amount2Value ? (<>
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white'  value={amount2Value}  placeholder="0.0" autoComplete='off'></input>
                                          </>):(<>
                                            <input type='number' className='m-0 form-control p-0 border-0 text-white'  onChange={e => SetValue2(e.target.value)}  placeholder="0.0" autoComplete='off'></input>
                                          </>)}
                                          <Button variant='filter'  >{spvalue.asset2name}</Button>
                                            {/* <FilterDropdown2 /> */}
                                        </div>
                                    </div>

                                    <div className="balance-card py-2 mb-10 d-flex align-items-center justify-content-between">
                                        <label>Pool Fee</label>

                                        <h6>0.86 ETH</h6>
                                    </div>

                                    <p className="text-red">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                        unverified assets alert, be careful! */}
                                    </p>
{shownvalue ? (<>
  <Button className='btn w-100 mb-20 text-none btn-grad btn-xl' onClick={()=>mint1call(appID_global,samount1,samount2,spvalue.asset1name,spvalue.asset2name)}>ADD LIQUIDITY</Button>

</>):(<>
  <Button className='btn w-100 mb-20 text-none btn-grad btn-xl' onClick={()=>optIn(spvalue.as3id)}>Asset Opt-In</Button>

</>)}

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
                                </Modal.Body>
            </Modal>
           
            <ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>

            <div className="table-group-outer table-group-lg">
  <div className="table-group-head">
    <div className="table-group-tr">
      <div className="table-group-th">NAME</div>
      <div className="table-group-th">
        <Dropdown>
          <Dropdown.Toggle variant="reset" id="dropdown-basic">
            LIQUIDITY
          </Dropdown.Toggle>
        </Dropdown>
      </div>
      <div className="table-group-th">VOLUME</div>
      <div className="table-group-th">POOL</div>
      <div className="table-group-th">CREATOR</div>
      <div className="table-group-th">DATE</div>
    </div>
  </div>

  {liqList === null || liqList === "" || liqList === undefined || liqList.length == 0 ? (
    <div className="table-group-body text-gray-AA">
      <br/>
      <Button className='btn w-50 mb-20 text-none btn-grad' style={{ width: 'auto', marginLeft: "25%" }} onClick={fun}>VIEW</Button>
    </div>
  ) : (
    liqList.map((x, index) => (
      <div key={index} className="table-group-body text-gray-AA">
        <div className="table-group-tr">
          <div className="table-group-td name-column">
            <div className="d-flex align-items-center td-cell">
              {/* <img src={elem} alt='icon' />
              <img src={tau} alt='icon' /> */}
              <img src={Llogo} alt="icon" style={{width:'35px',height:'35px',borderRadius:'50%'}}/>
              <img src={Plogo} style={{width:'35px',height:'35px',borderRadius:'50%', marginLeft: '2px'}} alt="icon" />
              <span>{x?.name}</span>
            </div>
          </div>
          <div className="table-group-td liquidity-column">{parseFloat(x?.liquidity).toFixed(4)}</div>
          <div className="table-group-td volume-column">{parseFloat(x?.reserve1).toFixed(4)} {x?.name1} <br/> {parseFloat(x?.reserve2).toFixed(4)} {x?.name2}</div>
          <div className="table-group-td pool-column"><a href={`https://seitrace.com/address/${x?.lpaddress}?chain=atlantic-2`} target="_blank">{x?.lpaddress}</a></div>
          <div className="table-group-td creator-column"><a href={`https://seitrace.com/address/${x?.creator}?chain=atlantic-2`} target="_blank">{x?.creator}</a></div>
          <div className="table-group-td">{x?.dateNew}</div>
        </div>
      </div>
    ))
  )}
</div>


            <div className="pagination-footer d-flex align-items-center justify-content-between">
                <p>showing 1-{parseFloat(postsPerPage/4).toFixed(0)} from {parseFloat(b.length/4).toFixed(0)}</p>

                <div className="d-flex align-items-center">
                    <Button variant='arrow'  >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        </svg>
                    </Button>
                    <Button variant='arrow' >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </Button>
                </div>
            </div>
         
           


        </div>
    );
};

export default TopLiquidity;