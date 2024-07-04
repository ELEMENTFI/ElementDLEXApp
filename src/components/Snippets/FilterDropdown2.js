import React,{useState,useEffect} from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import algosdk from 'algosdk';
import MyAlgoConnect from "@randlabs/myalgo-connect";
import logo from '../../assets/images/logoasset.png';
// import taulogo from '../../assets/images/tautoken.png';
import {walletAsset,walletAssetDetails,checkassetin} from "../formula";
import usdclogo from '../../assets/images/usdc-logo.png';
import taulogo from '../../assets/images/tau-original.png';
import elemlogo from '../../assets/images/element logo.png';
import usdtimg from '../../assets/images/usdt_trans.png';
import ethlogo from '../../assets/images/Ethereum-icon.svg';
import seilogo from '../../assets/images/sei-logo.png';
import questionlogo from '../../assets/images/question_logo1.png'
import warninglogo from '../../assets/images/warning_logo1.png'
import {ERC20ABI} from '../../abi';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'; 
import { ethers } from 'ethers';

const myAlgoWallet = new MyAlgoConnect();
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";

const token = {
    'X-API-key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl',
}

let indexerClient = new algosdk.Indexer(token, baseServer, port);
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

const FilterDropdown2 = ({setassetid2,setMax,setMax1,setMax2,setMax3,setk1,setToken2Id,setclicklogo2,ass,assn,setassets,setassetsn, settoken1, settoken2, settokenname, settokendecimals}) => {
    const [show, setShow] = React.useState(false);
    const[value, setValue] = React.useState("");
    const [s1, sets1] = useState("");
    const [s2, sets2] = useState("");
    const [ilt, setilt] = useState("");
  
    const[id,setid]= React.useState("");
    const[seem,setseem]= useState([]);
    const[smore,sets]= useState(false);
    const[pageSize,setPageSize]=useState(6);
   
    const[simage,setsimage] = useState([]);
    const[acc,setacc] = useState([]);
    const[df,setdf] = useState("");
    const[name,setname] = useState("");
    const[symbol,setsymbol] = useState("");
    const[decimamls,setdecimals] = useState("");
    const[contract,setcontract] = useState("");
    const [tokenDetails, setTokenDetails] = useState({
        name: '',
        symbol: '',
        decimals: 0
    });

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://evm-rpc-testnet.sei-apis.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isChecked, setIsChecked] = useState(false);

    const handleOnChange = () => {
      setIsChecked(!isChecked);
    };

  //console.log("value",value)
    const call =async(v)=>{
        // let val = document.getElementById("first").value;
      //console.log("val",v)
            //console.log("working",typeof parseInt(value))
            if(!isNaN(v)){
              //console.log("number")
                const assets = await indexerClient.lookupAssetByID(v).do();
                setassets(assets.asset.params['unit-name']);
                localStorage.setItem("tokenid2",v);
                // localStorage.setItem("assetname2",assets.asset.params['unit-name']);
                setk1(assets.asset.params['unit-name']);
                setToken2Id(v);
                setassetsn(0);
                setid(assets.asset.index);
                sets(false)
                
            }
            else{
              //console.log("string")
               
                let assetInfo = await indexerClient.searchForAssets().name(v).do();
              //console.log("assetinfo",assetInfo)
                sets(true)
                setseem(assetInfo.assets)
            }         
    
            
        }
        const fb =async(idv)=>{
            if(idv > 0){
            let v = await indexerClient.lookupAccountByID(localStorage.getItem("walletAddress")).do();
        v.account['assets'].map((role,index)=>{
          if(role['asset-id'] === idv ){
            let k = role.amount;
            setToken2Id(k)
          //console.log("tokenbal",k)
          }
        })
    }
    else{
        let account1_info = (await algodClient.accountInformation(localStorage.getItem("walletAddress")).do());
        // console.log("accin",JSON.stringify(account1_info))      
        let calc=JSON.stringify(account1_info.amount); 
        let k = calc;
        setToken2Id(k)
    }

        // let b = await find_balance(idv);
        // setToken1Id(b);
        // console.log("tokenbal",v.account['assets'])
        // console.log("tokenbal",idv)
        }
    function handleClick(i,d,l) {  
        localStorage.setItem("tokenid2",i);
          fb(i);
          setassetid2(i)
        //  e.preventDefault();
       //console.log('The link was clicked.');  
         first();
         setassetsn(l);
        //  setToken2Id(i);
         setclicklogo2(l);
         handleClose();
        
        }
        const first =async() => {
          //console.log("first")
            let tokenid1 = localStorage.getItem("tokenid1");
            console.log("tk1",tokenid1)
            if(tokenid1 === null || tokenid1 === undefined){
                localStorage.setItem("tokenid1",0);
                tokenid1 = 0;
            }
            let tokenid2 = localStorage.getItem("tokenid2");
            let tt1,tt2;
            if(tokenid1 > tokenid2){
                tt1 = tokenid1;
                tt2 = tokenid2;
            }
            else{
                tt2 = tokenid1;
                tt1 = tokenid2;
            }
            let replacedData = data.replaceAll("Token1",tt1).replaceAll("Token2",tt2).replaceAll("appId",appID_global);
            let results = await algodClient.compile(replacedData).do();
            

          console.log("results",results.hash);
          //console.log("results",results.hash);
            setMax3(results)
            readLocalState(algodClient,results.hash,appID_global);
            //  await checkassetin(tokenid2);
            //  let assetidvalue = await indexerClient.lookupAccountByID(localStorage.getItem("walletAddress")).do();
            //  console.log("assetid",assetidvalue.assets);
            //  let k =0;
            //  setMax2(true);
            //  assetidvalue.assets.map((r,i)=>{
            //      if(r['asset-id'] === tokenid2){
            //          k = 1;
            //          setMax2(false);
            //      }
            //  })
            // console.log("assetid",k);
            let assetid = await indexerClient.lookupAssetBalances(tokenid2).do();
          //console.log("asssertid",(assetid))
            let k =0 ;
            if(assetid === "0"){
                k = 1;
                setMax2(false);
            }
            else{
                for(let i=0;i < assetid.balances.length;i++){
                  //console.log("Having",assetid.balances )               
                    if(assetid.balances[i].address === localStorage.getItem("walletAddress")){
                        // setMax2(false)
                        k = 1;
                        setMax2(false);
                      //console.log("Having")
                      //console.log("swapopt",k)
                    }
                    
                }
            }
            
          //console.log("swapopt",k)
            if(k === 1){
                // setMax2(false);
            }
            else{
                setMax2(true);
            }
          //console.log("hash",results.hash);
        }
        async function readLocalState(client, account, index1){
            let accountInfoResponse = await client.accountInformation(account).do();
          //console.log("accinfo",accountInfoResponse);
            if(accountInfoResponse['apps-local-state'].length > 0){
              for(let i = 0; i< accountInfoResponse['apps-local-state'][0]['key-value'].length;i++){
                if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czE="){
                 sets1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
                 setMax(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
               //console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
                }
                else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czI="){
                 sets2(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
                 setMax1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
               //console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
                }
                else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] ===  "aWx0"){
                 setilt(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
               //console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
                }
              }
            }
           
            
        }
        function clicking(l,v,n,x, d) {   
          //console.log(v)
            setassets(v);
            setassetid2((l));
            setassetsn(n);
            setk1(v);
            localStorage.setItem("tokenid2",l);
            settoken2(x);
            console.log("contract2:", x);
            settokenname(v);
            settokendecimals(d);
            first();
            // handleClose();
            fb(l);
            // setToken2Id(l);
            setclicklogo2(n);
            handleClose();
           
          //console.log('The link was clicked.');  
           }
           const seemore =async()=>{
            // const seemore = await indexerClient.searchForAssets().limit(10).do();
            // setseem(seemore.assets)
            // // sets(true)
            // console.log(seemore.assets)
            let s =[];
            s=[
                {index:0,image:seilogo,name:"SEI", contract: "0x3921eA6Cf927BE80211Bb57f19830700285b0AdA", decimals:18},
                {index:10458941,image:usdclogo,name:"USDC", contract: "0x3f6e2955C365ba36cC5D5d74a3edc4CD470ad2C4", decimals:6},
                // {index:71682000,image:taulogo,name:"TAU", contract: "0x6620506B175a286F3ad3056C112d650D9579D157", decimals:18},
                {index:71116238,image:elemlogo,name:"ELEM", contract: "0xaB7eEc703836a34105c62595c346b23D4964A2a9", decimals:18},
                {index:67396430,image:usdtimg,name:"USDT", contract: "0xc5A7cc3395fDba9719179a37525c58773d7EBEeE", decimals:6}
            ]
            setsimage(s);
            let wa = await walletAsset(indexerClient,localStorage.getItem("walletAddress"));
        // console.log("asserts",wa)
        let aswa = await walletAssetDetails(wa);
        // console.log("asserts",aswa)
        // setassetlength(wa.length)
        setacc(aswa);
            
        }

        const getTokenDetails = async(contract1) => {
            setcontract(contract1);
            if ( contract1 !== "" && contract1!== null && ethers.utils.isAddress(contract1) ) {
                try{
                    const erc20Contract = new ethers.Contract(contract1, ERC20ABI, provider);
                    let name1 = await erc20Contract.name(); 
                    let symbol1 = await erc20Contract.symbol(); 
                    let decimals1 = await erc20Contract.decimals(); 
                    console.log("check serach:", name1, symbol1, decimals1)
                    setsymbol(symbol1);
                    setname(name1);
                    setdecimals(decimals1);
                    settokendecimals(decimals1);
                    setTokenDetails({
                        name: name1,
                        symbol: symbol1,
                        decimals: decimals1
                    })
                } catch (e) {
                    console.error(e);
                    setsymbol("");
                    setname("");
                    setdecimals("");
                    setTokenDetails({
                        name: "",
                        symbol: "",
                        decimals: 0
                    })
                }
            
            } else { 
                    setsymbol("");
                    setname("");
                    setdecimals("");
                    setTokenDetails({
                        name: "",
                        symbol: "",
                        decimals: 0
                    })
            }
        }


        useEffect(() =>{seemore()},[])

        function valuestfunction(a){
            call(a);
            setValue(a);
        }
        function setdefaultvalue(){
            // setToken2Id(71682000)
            fb(71682000);
            setk1("TAU")
          //console.log("setting values")
            
        }
    return (
        <>
          <Button variant='filter' onClick={handleShow} className='dropdown-target'>
            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="">
                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
            </svg> */}
           {ass ? (<>
            <img  width="31" height="30" src={(assn === "unknown" || assn === "" )  ? questionlogo : assn}/>
           {ass}
           </>):(<>
            {/* <img  width="31" height="30" src={taulogo} onClick={setdefaultvalue()}/> */}
           SELECT
           </>)}
        </Button>

        <Modal show={show} centered={true} onHide={handleClose}>
            <Modal.Body className='p-0'>
                <Button className='modal-close' onClick={handleClose} variant='reset'>
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="1">
                        <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                        </g>
                    </svg>
                </Button>
                <h5>Select Token</h5>

                <InputGroup className="input-group-search mb-3">
                    {/* <Form.Control value={value == 0? '':value} id="first" onChange={(e) => valuestfunction(e.target.value)} placeholder="Search by Name,or Asset Id" /> */}
                    <Form.Control value={contract? contract : ""} id="first" onChange={(e) => getTokenDetails(e.target.value)} placeholder="Search by Name,or Asset Id" />
                    <Button variant="reset" >
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.0693 2.06396C16.0373 2.06396 20.0693 6.09596 20.0693 11.064C20.0693 16.032 16.0373 20.064 11.0693 20.064C6.10134 20.064 2.06934 16.032 2.06934 11.064C2.06934 6.09596 6.10134 2.06396 11.0693 2.06396ZM11.0693 18.064C14.9363 18.064 18.0693 14.931 18.0693 11.064C18.0693 7.19596 14.9363 4.06396 11.0693 4.06396C7.20134 4.06396 4.06934 7.19596 4.06934 11.064C4.06934 14.931 7.20134 18.064 11.0693 18.064ZM19.5543 18.135L22.3833 20.963L20.9683 22.378L18.1403 19.549L19.5543 18.135Z" fill="white"/>
                        </svg>
                    </Button>
                    {/* <Form.Control value={value} onChange={(e) => setValue(e.target.value)} placeholder="Collection, item or user" /> */}
                </InputGroup>

                <div className="token-list">
                <div className="topping pt-2 px-3 mb-3">
                    <Form.Check 
                        type="checkbox"
                        id={`topping`}
                        name="topping"
                        checked={isChecked}
                        onChange={handleOnChange}
                        label={`Hide Unverified Asset`}
                    />
                {/* <input type="checkbox" id="topping" name="topping" value="Paneer" checked={isChecked} onChange={handleOnChange}/>
        Hide UnVerified Asset */}
      </div>
      { (name !== "" && !isChecked) && 
                    <>
                        <div className="token-list-item" onClick={()=>clicking(0,symbol,"unknown", contract, decimamls)}>
                                                <div className="token-list-icon">
                                                    {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="30.1212" height="30" rx="15" fill="white"/>
                                                        <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                                    </svg> */}
                                                    <img src={questionlogo}/>
                                                </div>
                                                <div className="token-list-title">
                                                    <span >{name? name : ""}</span>
                                                    <h6 >{symbol?.toUpperCase()}
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#44a706" class="bi ms-2 bi-patch-check-fill" viewBox="0 0 16 16">
                                                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                                        </svg> */}
                                                        &nbsp;&nbsp;<img src={warninglogo} style={{"height": "17px", "width": "17px"}}/>
                                                    </h6>
                                                </div>
                                            </div>
						</>

                    }

                    { (value && (smore == false) )? (
                        <div className="token-list-item" onClick={()=>handleClick(id,ass,logo)}>
                        <div className="token-list-icon">
                            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                            </svg> */}
                             <img src={logo}></img>
                        </div>
                        <div className="token-list-title" >
                            {/* <span onClick={call()}>{id}</span> */}
                            <span>{ass.toUpperCase()}</span>
                            {/* <a href="#" onClick={handleClick}>      Click me    </a> */}
                            <h6 >{ass.toUpperCase()} 
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#44a706" class="bi me-2 bi-patch-check-fill" viewBox="0 0 16 16">
                                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                </svg> */}
                            </h6>
                            
                        </div>
                    </div>
                    ): (isChecked) ? (<>
             
                        {simage.map(function (role, i) { 
                            if(role)
                                                    return <div key={i}> 
    
                                                    <div className="token-list-item" onClick={()=>clicking(role.index,role.name,role.image, role.contract, role.decimals)}>
                                                    <div className="token-list-icon">
                                                        {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="30.1212" height="30" rx="15" fill="white"/>
                                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                                        </svg> */}
                                                        <img src={role.image}/>
                                                    </div>
                                                    <div className="token-list-title">
                                                        <span >{role.name.toUpperCase()}</span>
                                                        <h6  >{role.name.toUpperCase()}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#44a706" class="bi ms-2 bi-patch-check-fill" viewBox="0 0 16 16">
                                                                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                                            </svg>
                                                        </h6>
                                                    </div>
                                                </div>
                                          
                                                </div>
                                                })}
            
    
    
                        {/* <Button className='py-1 ' variant='grad'  onClick={()=>{setPageSize(pageSize+6)}}>Click To See More</Button>
    
                     */}
                        
                        </>
                        ):(<>
                         {simage.map(function (role, i) { 
                            if(role)
                                                    return <div key={i}> 
    
                                                    <div className="token-list-item" onClick={()=>clicking(role.index,role.name,role.image, role.contract, role.decimals)}>
                                                    <div className="token-list-icon">
                                                        {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="30.1212" height="30" rx="15" fill="white"/>
                                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                                        </svg> */}
                                                        <img src={role.image}/>
                                                    </div>
                                                    <div className="token-list-title">
                                                        <span >{role.name.toUpperCase()}</span>
                                                        <h6 >{role.name.toUpperCase()}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#44a706" class="bi ms-2 bi-patch-check-fill" viewBox="0 0 16 16">
                                                                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                                            </svg>
                                                        </h6>
                                                    </div>
                                                </div>
                                          
                                                </div>
                                                })}
                         {seem.map((r,i)=>{
                           return(<>
                            <div className="token-list-item" onClick={()=>clicking(r.index,r.params['name'],logo, r.contract, r.decimals)}>
                            <div className="token-list-icon">
                                {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                    <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                </svg> */}
                                <img src={logo}></img>
                            </div>
                            <div className="token-list-title">
                                <span>{r.params['name'].toUpperCase()}</span>
                                <h6 >{r.params['name'].toUpperCase()}</h6>
                            </div>
                            </div>
                            </>)
                       })}
                       {acc.map((r,i)=>{
                           return(<>
                            <div className="token-list-item" onClick={()=>clicking(r.id,r.name,logo, r.contract, r.decimals)}>
                            <div className="token-list-icon">
                                {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                    <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                </svg> */}
                                <img src={logo}></img>
                            </div>
                            <div className="token-list-title">
                                <span>{r.name.toUpperCase()}</span>
                                <h6 >{r.name.toUpperCase()}</h6>
                            </div>
                            </div>
                            </>)
                       })}
                        </>)
                    }
                    
                   
                    {/* <div className="token-list-item">
                        <div className="token-list-icon">
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                            </svg>
                        </div>
                        <div className="token-list-title">
                            <span>subtitle</span>
                            <h6>algo</h6>
                        </div>
                    </div>
                    <div className="token-list-item">
                        <div className="token-list-icon">
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                            </svg>
                        </div>
                        <div className="token-list-title">
                            <span>subtitle</span>
                            <h6>algo</h6>
                        </div>
                    </div>
                    <div className="token-list-item">
                        <div className="token-list-icon">
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                            </svg>
                        </div>
                        <div className="token-list-title">
                            <span>subtitle</span>
                            <h6>algo</h6>
                        </div>
                    </div>
                    <div className="token-list-item">
                        <div className="token-list-icon">
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                            </svg>
                        </div>
                        <div className="token-list-title">
                            <span>subtitle</span>
                            <h6>algo</h6>
                        </div>
                    </div> */}
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default FilterDropdown2;