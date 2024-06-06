import React, {useState, useEffect} from 'react';
import { Col, Container, OverlayTrigger, Row, Tooltip, Modal, Form, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Layout from './Layout';
import ReactDomServer from 'react-dom/server';
import Arrow from '../../assets/images/arrow-tr.svg';
import Clock from '../../assets/images/Clock.svg';
import ModalSquareLogo from '../../assets/images/modal-square-logo.png';
import { ToastContainer, Toast, Zoom, Bounce, Flip, Slide, toast} from 'react-toastify';
import "../../components/toast-style-override.css"
import MyAlgoConnect from '@randlabs/myalgo-connect';
import configfile from "../../stakingconfigTau.json";
import axios from 'axios'

const algosdk = require('algosdk');
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const myAlgoConnect = new MyAlgoConnect();

let appID_global = 71117404;
let elementID_global = 71116238;

const Dashboard = () => {


    const [show, setShow] = React.useState(true);
    const [showStake, setShowStake] = React.useState(false);

    const handleCloseStake = () => setShowStake(false);
    const handleShowStake = () => setShowStake(true);

    const[rewardBool,setRewardBool]=useState(false);
    const [showUnstake, setShowUnstake] = React.useState(false);
    const[time,settime]= useState("");
    const handleCloseUnstake = () => setShowUnstake(false);
    const handleShowUnstake = () => setShowUnstake(true);
    const [algoPrice, setAlgoPrice] = useState([]);
    const [usdtPrice, setUsdtPrice] = useState([]);
    const handle = () => setShow(!show);
    const[day,setTime4]= useState("");
    const[hour,setTim1]= useState("");
    const[min,setTim2]= useState("");
    const[sec,setTim3]= useState("");
    const[lock,setlock]= useState(""); 
    const [s1, sets1] = useState("");
    const [s2, sets2] = useState("");
    const [ilt, setilt] = useState("");
    const [elemMint, setElemMint] = useState("");
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [rebaseTime, setRebaseTime] = useState("");
    function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }


    let [activeTab, setActiveTab] = useState("Deposit");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const[stakeenddate,setStakeendDate]=useState('');
    var[datestake,setDatestake]=useState([]);
    var [time2, settime2]=useState("");
    var [date1, setdate1]=useState("");
    var [time1, settime1]=useState("");
    const[ap1,setAP] = useState("");
    const [discal ,setdistance]=useState("");
    const [lock1 ,setlock1]=useState("");
    const[stakelock,setStakeLock]=useState("");
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
    let history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpens, setIsOpens] = useState(false);
    var[dis,setDis] = useState("");
    const [isOpennew, setIsOpennew] = useState(false);
    const [isOpennewpro, setIsOpennewpro] = useState(false);
    const[datasendhere,datasethere] = useState("");

    // const [show, setShow] = React.useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const[balance,setBalance] = useState([]);

    const[stakedbalance,setStakedBalance] = useState([]);
    const[rewardamountbalance,setrewardBalance] = useState([]);
    const[globaltime,setGlobalTime] = useState('');
    const[globalstake,setGlobalStake] = useState('');
    const[totalsul,settotalsul] = useState('');
    const[totalslatelock,settotalslatelock] = useState('');
    const[usertime,setusertime] = useState('');
    const[rewardcalc,setrewardcalculation]=useState('');
    const[stakeamount,setstakedamount] = useState("");
    const[unstakeamount,setunstakedamount] = useState("");
    const [accounts, setaccount] = useState("");

    const[totalstake,setTotalStake]=useState("");
    const[prices1,setS1]=useState("");
    const[prices2,setS2]=useState("");
    const[price,setprice]=useState("");
    const[totalreward,setTotalreward]=useState("");
    const[totalrewardallocated,setTotalrewardallocated]=useState("");
    const[rewardleft,setRewardleft]=useState("");
    const[totalclaimed,setTotalclaim]=useState("");
    const[totallock,setTotallock]=useState("");
    let address=localStorage.getItem("walletAddress");

  async function readLocalState(client, account, index1){
    let accountInfoResponse = await client.accountInformation(account).do();
    // let val = await client.ApplicationInformation(appId);
    // console.log("val",val)
    console.log("accinfo",accountInfoResponse);
   
    for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      if (accountInfoResponse['apps-local-state'][i].id == index1) {
          console.log("Application's global state:");
          for (let n = 0; n < accountInfoResponse['apps-local-state'][i]['key-value'].length; n++) {
             // console.log(accountInfoResponse['apps-local-state'][i]['key-value']);
              let enc = accountInfoResponse['apps-local-state'][i]['key-value'][n];
              if(enc['key'] === "czE="){
                sets1(enc.value.uint)
              }
              if(enc['key'] === "czI="){
                sets2(enc.value.uint)
              }
              if(enc['key'] === "aWx0"){
                setilt(enc.value.uint)
              }                  
          }
          
      }
  }
}

useEffect(() =>{},[s1,s2])
const fetch = async () => {
  await rebaseGlobalState();

  }

const rebaseGlobalState = async () => {
  let appById = await algodClient.getApplicationByID(parseInt(appID_global)).do();
  let appArgsRet = [];
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][0]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][1]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][2]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][3]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][4]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][5]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][6]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][7]['key']));
  appArgsRet.push(JSON.stringify(appById['params']['global-state'][8]['key']));
  // console.log("array", appById);

  for (let i = 0; i <= 8; i++) { 

                  // if(appArgsRet[i] == '"Q3JlYXRvcg=="'){
                  //     let creatorAddress_c =  JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]);
                  //     // console.log("creator address", creatorAddress_c)
                  //     setCreator(JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]));
                  // }
                  if(appArgsRet[i] == '"UmViYXNlVGltZQ=="'){
                      let endDate_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                      // console.log(endDate_c);
                      localStorage.setItem("rebaseTime", JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                  }
                  else if(appArgsRet[i] == '"UmViYXNlQ291bnQ="'){
                      let closeDate_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                      localStorage.setItem("rebaseCountStake",JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                  }
                  // else if(appArgsRet[i] == '"R29hbA=="'){
                  //     let goalAmount_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                  //     setgoal(goalAmount_c);
                  // }
                  // else if(appArgsRet[i] == '"UmVjZWl2ZXI="'){
                  //     let recv_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]);
                  //     setrec(JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]));
                  // }
                  // else if(appArgsRet[i] == '"U3RhcnREYXRl"'){
                  //     let startDate_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                  //     setstartdt(JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                  // }
                  // else if(appArgsRet[i] == '"VG90YWw="'){
                  //     let total_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                  //     settotal(JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                  // }
                  // else if(appArgsRet[i] == '"RXNjcm93"'){
                  //     let escrow_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]);
                  //     setescrow(JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]));
                  // }
}
}

useEffect(async() =>{await fetch()},[])

    useEffect(() => {
        const fetchPosts = async () => {
             // read local state of application from user account

      let accountInfoResponse = await algodClient.accountInformation(localStorage.getItem("walletAddress")).do();
      let appById = await algodClient.getApplicationByID(parseInt(configfile.applicationid)).do();
      //console.log("globalappid",appById);
     
        //console.log("Application's global state:");
       
           //console.log("Application's global state:1",appById['params']['global-state']);
           //console.log("Application's :1",appById['params']['global-state'][0]['key']);
           //console.log("globaltime",appById['params']['global-state'][0]['value']['uint']);
          
           let globaltimenew;
           let gloablstakenew;
           let totalsulnew;
           let totalslatelocknew;
           let stakedbalancenew;
           let rewardbalancenew;
           let usertimenew;
           for(let i=0;i<11;i++){
              
                if(appById['params']['global-state'][i]['key']==="R1Q="){
                globaltimenew = appById['params']['global-state'][i]['value']['uint'];
                setGlobalTime(appById['params']['global-state'][i]['value']['uint']);
                //console.log("globaltime",globaltime);
                }
     
                if(appById['params']['global-state'][i]['key']==="R1NT"){
                  gloablstakenew=appById['params']['global-state'][i]['value']['uint'];
                  setGlobalStake(appById['params']['global-state'][i]['value']['uint']);
                  }
                if(appById['params']['global-state'][i]['key']==="VFNVTA=="){
                    totalsulnew =appById['params']['global-state'][i]['value']['uint'];
                    
                    settotalsul(appById['params']['global-state'][i]['value']['uint']);
                    }
                if(appById['params']['global-state'][i]['key']==="VFNM"){
                      totalslatelocknew=appById['params']['global-state'][i]['value']['uint'];
                      settotalslatelock(appById['params']['global-state'][i]['value']['uint']);
                      }   
               }
              

           
           
       
    
       
    
    
      //console.log("accinfolocal",accountInfoResponse);
      if( accountInfoResponse['apps-local-state'].length === null|| accountInfoResponse['apps-local-state'].length ===undefined||accountInfoResponse['apps-local-state'].length===""){
        alert("check");
     }
    else{
    
    
      //console.log("User",accountInfoResponse['apps-local-state'].length);
      for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
          if (accountInfoResponse['apps-local-state'][i].id == parseInt(configfile.applicationid)) {
              //console.log("User's local state:",accountInfoResponse['apps-local-state'][i].id);
              let acccheck= accountInfoResponse['apps-local-state'][i][`key-value`]; 
              //console.log("Usercheck",acccheck);
              //console.log("User",accountInfoResponse['apps-local-state'][i][`key-value`]);
            
              if(accountInfoResponse['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse['apps-local-state'][i][`key-value`]===""){
                alert("check");
             }
            else{
    for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
                  //console.log(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                  //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                  
                  let rewardkey =accountInfoResponse['apps-local-state'][i]['key-value'][n];
                 if(rewardkey['key'] === "VUE="){
                   stakedbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                   setStakedBalance(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                 }
                if(rewardkey['key'] === "VVNT"){
                  rewardbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                  //console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  setrewardBalance(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  //console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                }
                if(rewardkey['key'] === "VVQ="){
                  usertimenew = accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                  //console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  setusertime(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  //console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                }
                  
              }
    
            }
    
              
          }
      }
    }
      for(let i = 0; i < accountInfoResponse['assets'].length; i++){
        //console.log("accountsasset", accountInfoResponse['assets']);
         if (accountInfoResponse['assets'][i]['asset-id'] == parseInt(configfile.assetid)) {
          setBalance(accountInfoResponse['assets'][i]['amount']);
          //console.log("accountsassetnew", accountInfoResponse['assets'][i]['amount']);
    
         }
      }
    
    
      
      //console.log("sub",globaltimenew);
      //console.log("sub_div",usertimenew);
      //console.log("mul1",stakedbalancenew);
      //console.log("add_div",rewardbalancenew);
      //console.log("mul2",gloablstakenew);
      // //console.log("rewardCal",rewardCal);
      let sub = parseInt(globaltimenew) - parseInt(usertimenew);
        //console.log("checksub",sub);
      let sub_div = parseFloat(sub) / 60;
      
      let mul1 = parseFloat(sub_div) * parseFloat(stakedbalancenew);
      
      let add = parseFloat(rewardbalancenew) + parseFloat(mul1);
      
      let add_div =  parseFloat(add) / parseFloat(gloablstakenew);
      
      let mul2 = parseFloat(add_div) * parseFloat(totalsulnew);
      
      let rewardCal1 = parseFloat(mul2) / 1000000;
      let rewardCal = rewardCal1.toFixed(6);
      // console.log("rewardamountcalculation",parseFloat(rewardCal));
      //let rewardcalculation =parseFloat((parseFloat(rewardamountbalance)+(parseFloat((globaltime)-parseFloat(usertime))/60)*parseFloat(stakedbalance)/parseFloat(globalstake))*parseFloat(totalsul)/parseFloat(1000000));
      setrewardcalculation(parseFloat(rewardCal));
      (rewardCal === 'NaN' || rewardCal === "" || rewardCal === null || rewardCal === '' || rewardCal === undefined) ? setRewardBool(false) : setRewardBool(true);

    
      
        
        };
        
    
        fetchPosts();
      }, [rewardcalc]);

    //for totalstakeed and reward 
    useEffect(() => {
        const fetchPosts = async () => {
       
      //let applicationid = 53433787;
      const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
      let accountInfoResponse1 = await client.accountInformation(configfile.creatoraddress).do();
    
    for (let i = 0; i < accountInfoResponse1['created-apps'].length; i++) { 
       //console.log("Application's global state:");
      if (accountInfoResponse1['created-apps'][i].id == parseInt(configfile.applicationid)) {
          //console.log("Application's global state:");
          for (let n = 0; n < accountInfoResponse1['created-apps'][i]['params']['global-state'].length; n++) {
              //console.log(accountInfoResponse1['created-apps'][i]['params']['global-state'][n]);
              let enc = accountInfoResponse1['created-apps'][i]['params']['global-state'][n];
              //console.log("encode",enc);
              var decodedString = window.atob(enc.key);
              if(enc['key'] === "R0E="){
                setTotalStake( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
                //console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
              }
              if(enc['key'] === "VFNVTEM="){
                setTotalreward( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
                //console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
              }
              if(enc['key'] === "VFNM"){
                setTotalrewardallocated( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
                //console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
              }
          }
          
      }
  }
        
        };
        
    
        fetchPosts();
      }, []);  

    
//for price
useEffect(() => {
    const fetchPosts = async () => {
      let slpricenew;
      let s2pricenew;
  let priceappid = 21580889;
  const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
  //let accountInfoResponse1 = await client.accountInformation("MX4W5I4UMDT5B76BMP4DS63Z357WDMNHDICPNEKPG4HVPZJTS2G53DDVBY").do();
  let accountInfoResponse2 = await client.accountInformation(configfile.pairescrowaddress).do();
  //console.log("accinfolocalprice",accountInfoResponse2);
  if( accountInfoResponse2['apps-local-state'].length === null|| accountInfoResponse2['apps-local-state'].length ===undefined||accountInfoResponse2['apps-local-state'].length===""){
    alert("checkprice");
 }else{
  //console.log("priceconsole",accountInfoResponse2['apps-local-state'].length);
  for (let i = 0; i < accountInfoResponse2['apps-local-state'].length; i++) { 
    if (accountInfoResponse2['apps-local-state'][i].id == parseInt(configfile.priceappid)) {
        //console.log("User's local stateprice:",accountInfoResponse2['apps-local-state'][i].id);
        let acccheck= accountInfoResponse2['apps-local-state'][i][`key-value`]; 
        //console.log("Usercheckfor price",acccheck);
        //console.log("Userforprice",accountInfoResponse2['apps-local-state'][i][`key-value`]);
      
        if(accountInfoResponse2['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse2['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse2['apps-local-state'][i][`key-value`]===""){
          alert("check");
       }
      else{
for (let n = 0; n < accountInfoResponse2['apps-local-state'][i][`key-value`].length; n++) {
            //console.log(accountInfoResponse2['apps-local-state'][i][`key-value`][n]);
            //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
            
            let rewardkey =accountInfoResponse2['apps-local-state'][i]['key-value'][n];
           if(rewardkey['key'] === "czE="){
            slpricenew=accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint'];
            //console.log("s1pricenew",accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
             setS1(accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
           }
          if(rewardkey['key'] === "czI="){
            s2pricenew=accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint'];
            //console.log("s2pricenew",accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
            setS2(accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
          
          }
          
            
        }

      }

        
    }
}


 }
 let pricecal;
 pricecal=parseInt((slpricenew)/(s2pricenew));
 //console.log("pricecalculated",pricecal);
 setprice(pricecal);
    
    };
    

    fetchPosts();
  }, []);  


//rewardleft
useEffect(() => {
    const fetchPosts = async () => {
        
let appById = await algodClient.getApplicationByID(parseInt(configfile.applicationid)).do();
//console.log("globalappid",appById);

//console.log("Application's global state:");

   //console.log("Application's global state:1",appById['params']['global-state']);
   //console.log("Application's :1",appById['params']['global-state'][0]['key']);
   //console.log("globaltime",appById['params']['global-state'][0]['value']['uint']);
  
   
   let totalclaim;
   let totallock;
   let rewardleft;
   for(let i=0;i<11;i++){
      
      
        if(appById['params']['global-state'][i]['key']==="VFNVTEM="){
            totalclaim =appById['params']['global-state'][i]['value']['uint'];
            //console.log("totalclaim",totalclaim);
            setTotalclaim(appById['params']['global-state'][i]['value']['uint']);
            }
        if(appById['params']['global-state'][i]['key']==="VFNM"){
            
            totallock=appById['params']['global-state'][i]['value']['uint'];
            //console.log("totallock",totallock);
              setTotallock(appById['params']['global-state'][i]['value']['uint']);
              }   
       }
    
     rewardleft=(parseFloat(totallock-totalclaim)).toFixed(4);
     setRewardleft(rewardleft);

    };
    

    fetchPosts();
  }, []);   
    const waitForConfirmation = async function (client, txId) {
        let status = (await client.status().do());
        let lastRound = status["last-round"];
          while (true) {
            const pendingInfo = await client.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
              //Got the completed Transaction
              console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
              break;
            }
            lastRound++;
            await client.statusAfterBlock(lastRound).do();
          }
        };  
    const assetoptin = async() => {
        
      try{
      const algosdk = require('algosdk');
      const algodclient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io/', '');
      const myAlgoConnect = new MyAlgoConnect();
      const params = await algodclient.getTransactionParams().do();
      const assetoptin1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: localStorage.getItem("walletAddress"),
        to: localStorage.getItem("walletAddress"),
        assetIndex: parseInt(configfile.assetid),
        note: undefined,
        amount: 0,
        suggestedParams: params
        });
        
        const signedTxnass = await myAlgoConnect.signTransaction(assetoptin1.toByte());
        toast.warn("Transaction in Progress");
        const responseass = await algodClient.sendRawTransaction(signedTxnass.blob).do();
        toast.success(`Asset Optin Success ${responseass.txId}`);
        //console.log("optresponse",responseass)
        // toast.success(`Asset Optin Success ${responseass.txId}`);
        await waitForConfirmation(algodClient, responseass.txId);


        window.location.reload();
        // datasethere("Asset Optin Successfully")
        // setIsOpennewpro(false)
        // setIsOpennew(true)
      }
      catch (err) {
          console.error(err);
          toast.error(`Asset Optin Failed due to ${err}`);
        //   setIsOpennewpro(false)
      }
      }

      //appoptin

      const optin=async(assetID,responsetxId,addresseswall)=>{
        if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
        try{    
         
        const algosdk = require('algosdk');
        const algodclient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io/', '');
        const myAlgoConnect = new MyAlgoConnect();
        
        try {
          //const accounts = await myAlgoWallet.connect();
          //const addresses = accounts.map(account => account.address);
          //console.log("addressget",addresses)
          //localStorage.getItem('wallet',addresses[0])
        const params = await algodclient.getTransactionParams().do();
        // let transoptin1 = algosdk.makeApplicationOptInTxnFromObject({
        //   from: localStorage.getItem('wallet'),
        //   appIndex:parseInt(appId1),
        //   note: undefined,
        //   suggestedParams: params
        //   });
      
      
        let transoptin2 = algosdk.makeApplicationOptInTxnFromObject({
            from: localStorage.getItem("walletAddress"),
            appIndex:parseInt(configfile.applicationid),
            note: undefined,
            suggestedParams: params
            });
      
       // const signedTxn1 = await myAlgoConnect.signTransaction(transoptin1.toByte());
        const signedTxn2 = await myAlgoConnect.signTransaction(transoptin2.toByte());
        toast.warn("Transaction in Progress");
        const response2 = await algodclient.sendRawTransaction(signedTxn2.blob).do();
        //console.log("optresponse",response2);
        toast.success(`App Optin Success ${response2.txId}`);
        await waitForConfirmation(algodClient, response2.txId);
         window.location.reload();
        
        }
        catch (err) {
          console.error(err);
          toast.error(`App Optin Failed due to ${err}`);
          //storedb(assetID,responsetxId,addresseswall);
        }
      }
      catch (err) {
          console.error(err);
          toast.error(`App Optin Failed due to ${err}`);
      }
    }
      }
     //stake
     const stake = async() => {
      handleCloseStake();
      if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
        try{
        const algosdk = require('algosdk');
        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
       
         var amt = document.getElementById("tid1").value; 
         let stakeamount = parseFloat(amt) * 1000000;
         global.TextEncoder = require("util").TextEncoder; 
       
         setaccount(localStorage.getItem("walletAddress"));
         let sender = localStorage.getItem("walletAddress");
       
         
         // helper function to await transaction confirmation
         // Function used to wait for a tx confirmation
         const waitForConfirmation = async function (algodclient, txId) {
             let status = (await algodclient.status().do());
             let lastRound = status["last-round"];
               while (true) {
                 const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
                 if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                   //Got the completed Transaction
                   //console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                   break;
                 }
                 lastRound++;
                 await algodclient.statusAfterBlock(lastRound).do();
               }
             };
         
        
         try {
        //   const addresses = await myAlgoConnect.connect();
           // define sender
           
           let sender = localStorage.getItem("walletAddress");
           //let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
         // get node suggested parameters
           let params = await algodClient.getTransactionParams().do();
           // comment out the next two lines to use suggested fee
           params.fee = 1000;
           params.flatFee = true;
         
           let appArgs1= [];
           
           appArgs1.push(new Uint8Array(Buffer.from("CHECK")));
           //console.log("(line:516) appArgs = ",appArgs1)
         
           // create unsigned transaction
           let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
            from: sender, 
           suggestedParams: params, 
           appIndex: parseInt(configfile.applicationid), 
            appArgs: appArgs1});
           //  let txId1 = transaction1.txID().toString();
         
           let appArgs2= [];
           
           appArgs2.push(new Uint8Array(Buffer.from("S")));
           //console.log("(line:516) appArgs = ",appArgs2)
         
           // create unsigned transaction
           let transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
            from: sender, 
           suggestedParams: params, 
           appIndex: parseInt(configfile.applicationid), 
            appArgs: appArgs2});
           // // Sign the transaction
           // let signedTxn = txn.signTxn(account.sk);
           // console.log("Signed transaction with txID: %s", txId);
         
         let transaction3 =algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
           from: sender,
           to: configfile.escrowaddress,
           amount:stakeamount,
           note: undefined,
           assetIndex: parseInt(configfile.assetid),
           suggestedParams: params});
         
          //  let transaction3 =algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          //   from: sender,
          //   to: "QGJQVEY5DFKXSHSEKOTRUXMRNNJTGEBDSNDKEKBGHRFBD6EEBNCZVT37TY",
          //   amount: stakeamount,
          //   note: undefined,
          //   suggestedParams: params}); 
      
           const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3]);
           const txs = [ transaction1, transaction2, transaction3];
           txs[0].group = groupID;
           txs[1].group = groupID;
           txs[2].group = groupID;
         
         
         
        const signedTx1 = await myAlgoConnect.signTransaction([txs[0].toByte(), txs[1].toByte(), txs[2].toByte()]);
        // const signedTx2 = await myAlgoConnect.signTransaction(txs[1].toByte());
        // const signedTx3 = await myAlgoConnect.signTransaction(txs[2].toByte());
        toast.warn("Transaction in Progress");
       const response = await algodClient.sendRawTransaction([ signedTx1[0].blob, signedTx1[1].blob, signedTx1[2].blob]).do();
       //console.log("TxID", JSON.stringify(response, null, 1));   
       toast.success(`Staked Successfully! ${response.txId}`);   
       await waitForConfirmation(algodClient, response.txId);

        window.location.reload();
    // this.forceUpdate();
       //alert("Staked Successfully");
    //    datasethere("Staked Successfully")
    //    setIsOpennewpro(false)
    //    setIsOpennew(true)
         }
         catch (err) {
             console.error(err);
             toast.error(`Staking Failed due to ${err}`);
         }
        }
        catch (err) {
            console.error(err);
            //setIsOpennewpro(false)
            toast.error(`Transaction Failed due to ${err}`);
        }
        }
      } 
     //unstake

     const unstake = async() => {
      handleCloseUnstake();
      if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
        //setIsOpennewpro(true)
        try{
        // await myAlgoConnect.connect();
        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
      
      
        let appId1 = 46315308;
        //let applicationid = 53433787;
        var amt = document.getElementById("tid2").value; 
        let unstakeamount = parseFloat(amt) * 1000000;
        global.TextEncoder = require("util").TextEncoder; 
        // const algosdk = require('algosdk');
      
        const waitForConfirmation = async function (algodclient, txId) {
          let status = (await algodclient.status().do());
          let lastRound = status["last-round"];
            while (true) {
              const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
              if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                //console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                break;
              }
              lastRound++;
              await algodclient.statusAfterBlock(lastRound).do();
            }
          };
      
        try {
          // const addresses = await myAlgoConnect.connect();
          //console.log("Address =", addresses);
            var escrowdata1 = `#pragma version 5

            global GroupSize // size=6
            int 2
            >=
            global GroupSize // size=6
            int 6
            <=
            &&
            bz label1
            gtxn 0 ApplicationID
            int 71326217
            ==
            bnz label2
            b label1
            label2:
            gtxn 0 TypeEnum
            int 6 // ApplicationCall
            ==
            gtxn 0 OnCompletion
            int 0 // NoOp
            ==
            int 0
            gtxn 0 OnCompletion
            ==
            ||
            &&
            gtxn 1 RekeyTo // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ
            global ZeroAddress
            ==
            &&
            gtxn 0 RekeyTo // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ
            global ZeroAddress
            ==
            &&
            bnz label3
            label1:
            int 0
            return
            label3:
            int 1
            return`;
          var escrowdata=escrowdata1.replaceAll("appid",parseInt(configfile.applicationid));
        // define sender
        let sender = localStorage.getItem("walletAddress");
       // let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
      
       // get node suggested parameters
        let params = await algodClient.getTransactionParams().do();
        // comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;
        let appArgs1= [];
        
        appArgs1.push(new Uint8Array(Buffer.from("CHECK")));
        //console.log("(line:516) appArgs = ",appArgs1)
      
        // create unsigned transaction
        let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
          from: sender, 
          suggestedParams: params, 
          appIndex: parseInt(configfile.applicationid), 
          appArgs: appArgs1});
        //  let txId1 = transaction1.txID().toString();
      
        let appArgs2= [];
        
        appArgs2.push(new Uint8Array(Buffer.from("W")));
        //console.log("(line:516) appArgs = ",appArgs2)
      
        // create unsigned transaction
        let transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
          from: sender, 
          suggestedParams: params, 
          appIndex: parseInt(configfile.applicationid), 
          appArgs: appArgs2})
       
        //  let txId1 = transaction1.txID().toString();
      
        let results = await algodClient.compile(escrowdata).do();
        //console.log("Hash = " + results.hash);
        //console.log("Result = " + results.result);
        let program = new Uint8Array(Buffer.from(results.result, "base64"));
       
      
      let lsig = algosdk.makeLogicSig(program);
          
      
      let sender1 = lsig.address();
      //console.log("logic",sender1)
          let receiver = sender;
          // let receiver = "<receiver-address>"";
          
         // let closeToRemaninder = sender;
          let note = undefined;
          let transaction3 =algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: sender1,
            to: receiver,
            amount: unstakeamount,
            note: undefined,
            assetIndex: parseInt(configfile.assetid),
            suggestedParams: params});
      
            // let transaction3 =algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            //   from: sender1,
            //   to: receiver,
            //   amount:unstakeamount,
            //   note: undefined,
            //   suggestedParams: params});
      
      
      
      
          // let transaction4 =algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          //   from: sender,
          //   to: sender1,
          //   amount: 1000,
          //   note: undefined,
          //   suggestedParams: params});
          //let txns = [transaction1, transaction2,transaction3,transaction4];
      
      //myAlgo start
      
      const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3]);
            const txs = [ transaction1, transaction2, transaction3];
            txs[0].group = groupID;
            txs[1].group = groupID;
            txs[2].group = groupID;
           // txs[3].group = groupID;
            
            const signedTx1 = await myAlgoConnect.signTransaction([txs[0].toByte(), txs[1].toByte()]);
            // const signedTx2 = await myAlgoConnect.signTransaction(txs[1].toByte());
            const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
            //const signedTx4 = await myAlgoConnect.signTransaction(txs[3].toByte());
            toast.warn("Transaction in Progress");
            //console.log("Show", show);
        const response = await algodClient.sendRawTransaction([ signedTx1[0].blob, signedTx1[1].blob, signedTx3.blob]).do();
        //console.log("TxID", JSON.stringify(response, null, 1));
        toast.success(`Unstaked Successfully ${response.txId}`);
        await waitForConfirmation(algodClient, response.txId);
        window.location.reload();

    //    // alert("Unstaked Successfully");
    //    datasethere("Unstaked Successfully")
    //    setIsOpennewpro(false)
    //    setIsOpennew(true)
      }
      catch (err) {
          console.error(err);
          toast.error(`Unstaking Failed due to ${err}`);
      }
      }
      catch (err) {
          console.error(err);
        //   setIsOpennewpro(false)
        toast.error(`Unstaking Failed due to ${err}`);
      }
    }
      }


    //claim reward
    const Claimreward = async() => {
        setIsOpennewpro(true)
        if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
        try{
        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
      
      
       // let appId1 = 46315308;
        //let applicationid = 53433787;
        
        global.TextEncoder = require("util").TextEncoder; 
        // const algosdk = require('algosdk');
      
        const waitForConfirmation = async function (algodclient, txId) {
          let status = (await algodclient.status().do());
          let lastRound = status["last-round"];
            while (true) {
              const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
              if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                //console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                break;
              }
              lastRound++;
              await algodclient.statusAfterBlock(lastRound).do();
            }
          };
      
        try {
          // const addresses = await myAlgoConnect.connect();
          //console.log("Address =", addresses);
            var escrowdata1 = `#pragma version 5

            global GroupSize // size=6
            int 2
            >=
            global GroupSize // size=6
            int 6
            <=
            &&
            bz label1
            gtxn 0 ApplicationID
            int 71326217
            ==
            bnz label2
            b label1
            label2:
            gtxn 0 TypeEnum
            int 6 // ApplicationCall
            ==
            gtxn 0 OnCompletion
            int 0 // NoOp
            ==
            int 0
            gtxn 0 OnCompletion
            ==
            ||
            &&
            gtxn 1 RekeyTo // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ
            global ZeroAddress
            ==
            &&
            gtxn 0 RekeyTo // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ
            global ZeroAddress
            ==
            &&
            bnz label3
            label1:
            int 0
            return
            label3:
            int 1
            return`;
        var escrowdata=escrowdata1.replaceAll("appid",parseInt(configfile.applicationid));
        // define sender
        let sender = localStorage.getItem("walletAddress");
       // let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
      
       // get node suggested parameters
        let params = await algodClient.getTransactionParams().do();
        // comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;
        let appArgs1= [];
        
        appArgs1.push(new Uint8Array(Buffer.from("CHECK")));
        //console.log("(line:516) appArgs = ",appArgs1)
      
        // create unsigned transaction
        let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
          from: sender, 
          suggestedParams: params, 
          appIndex: parseInt(configfile.applicationid), 
          appArgs: appArgs1});
        //  let txId1 = transaction1.txID().toString();
      
        let appArgs2= [];
        
        appArgs2.push(new Uint8Array(Buffer.from("CA")));
        //console.log("(line:516) appArgs = ",appArgs2)
      
        // create unsigned transaction
        let transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
          from: sender, 
          suggestedParams: params, 
          appIndex: parseInt(configfile.applicationid), 
          appArgs: appArgs2})
       
      
      
      
      //  let appArgs3= [];
        
      //   appArgs2.push(new Uint8Array(Buffer.from("12")));
      //   console.log("(line:516) appArgs = ",appArgs3)
      
      //   // create unsigned transaction
      //   let transaction3 = algosdk.makeApplicationNoOpTxnFromObject({
      //     from: sender, 
      //     suggestedParams: params, 
      //     appIndex: configfile.applicationid, 
      //     appArgs: appArgs3})
        //  let txId1 = transaction1.txID().toString();
      
        let results = await algodClient.compile(escrowdata).do();
        //console.log("Hash = " + results.hash);
        //console.log("Result = " + results.result);
        let program = new Uint8Array(Buffer.from(results.result, "base64"));
       
      
      let lsig = algosdk.makeLogicSig(program);
          
      
      let sender1 = lsig.address();
      //console.log("logic",sender1)
          let receiver = sender;
          // let receiver = "<receiver-address>"";
          
         // let closeToRemaninder = sender;
          let note = undefined;
          let transaction4 =algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: sender1,
            to: receiver,
            amount: parseInt(parseFloat(rewardcalc)*1000000),
            note: undefined,
            assetIndex: parseInt(configfile.assetid),
            suggestedParams: params});
          // let transaction5 =algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          //   from: sender,
          //   to: sender1,
          //   amount: 2000,
          //   note: undefined,
          //   suggestedParams: params});
          //let txns = [transaction1, transaction2,transaction3,transaction4];
      
      //myAlgo start
      
      const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction4]);
            const txs = [ transaction1, transaction2, transaction4];
            txs[0].group = groupID;
            txs[1].group = groupID;
            txs[2].group = groupID;
            //txs[2].group = groupID;
              //txs[4].group = groupID;
            
            const signedTx1 = await myAlgoConnect.signTransaction([txs[0].toByte(), txs[1].toByte()]);
            // const signedTx2 = await myAlgoConnect.signTransaction(txs[1].toByte());
            //const signedTx3 = await myAlgoConnect.signTransaction(txs[2].toByte());
            const signedTx4 = algosdk.signLogicSigTransaction(txs[2], lsig);
            //const signedTx5 = await myAlgoConnect.signTransaction(txs[4].toByte());
            toast.warn("Transaction in Progress");
        const response = await algodClient.sendRawTransaction([ signedTx1[0].blob, signedTx1[1].blob,signedTx4.blob]).do();
        //console.log("TxID", JSON.stringify(response, null, 1));
        await toast.success(`Reward Claimed Successfully ${response.txId}`);
        await waitForConfirmation(algodClient, response.txId);
    
        window.location.reload();
       // alert(" Reward Claimed Successfully");
    //    datasethere("Reward Claimed Successfully")
    //    setIsOpennewpro(false)
    //    setIsOpennew(true)
      }
      catch (err) {
          console.error(err);
          toast.error(`Reward Claiming Failed due to ${err}`);
      }
      }
      catch (err) {
          console.error(err);
          //setIsOpennewpro(false)
          toast.error(`Transaction Failed due to ${err}`);
      }
    }
      }


    useEffect(async() => {
      await first()
  }, [day, hour, min, sec, lock]);

    const first = async () => {
      let rebaseT = parseInt(localStorage.getItem("rebaseTime"));
      var us= rebaseT + 300;
      var ff=new Date(us);
  // setdate(ff.toDateString());
  var hours = ff.getHours();
    var minutes = ff.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    settime( hours + ':' + minutes + ' ' + ampm);
  //settime(lock);
  var countDowndate   =us * 1000;
  //console.log(countDowndate);
  // var countDownDate = new Date().getTime() + (lock * 1000) ;
  //alert(time);
      var x = setInterval(function() {
         var now = new Date().getTime();
        var distance = countDowndate - now ;
      //   console.log("-------------------now", distance);
       // console.log(now);
        // Time calculations for days, hours, minutes and seconds
       var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
      //   console.log("date e", day);
      //   console.log("hour e", hour);
      //   console.log("min e", minutes);
      //   console.log("sec e", seconds);
  
        // Output the result in an element with id="demo"
       // document.getElementById("demo").innerHTML = hours + "h "
       // + minutes + "m " + seconds + "s ";
      setTime4(days);
      setTim1(hours);
      setTim2(minutes);
      setTim3(seconds);
  
  
      
      
      
      
        // If the count down is over, write some text 
        if (distance < 0) {
              clearInterval(x);
              setlock(false);
  
             // console.log('CountDown Finished');
          }
          else{
           setlock(true);
          }
  
      
        
      }, 1000);
     
  
  }


  const burn = async () => {
 
    let index = parseInt(appID_global);
    console.log("appId", index);      

    //reserve start
  
    let reserveData = `#pragma version 5

    global GroupSize
    int 2
    >=
    global GroupSize
    int 5
    <=
    &&
    bz failed
    
    gtxn 0 TypeEnum
    int 6
    ==
    
    gtxn 0 ApplicationID
    int 71117404
    ==
    &&
    
    gtxn 0 OnCompletion
    int NoOp
    ==
    int DeleteApplication
    gtxn 0 OnCompletion
    ==
    ||
    &&
    
    gtxn 1 RekeyTo
    global ZeroAddress
    ==
    &&
    gtxn 0 RekeyTo
    global ZeroAddress
    ==
    &&
    bz failed
    int 1
    return
    
    failed:
    int 0
    return`;
    
    let reserveResults = await algodClient.compile(reserveData).do();
    console.log("Hash = " + reserveResults.hash);
    console.log("Result = " + reserveResults.result);
    // let program = new Uint8Array(Buffer.from(<"base64-encoded-program">, "base64"));
    let reserveProgram = new Uint8Array(Buffer.from(reserveResults.result, "base64"));
    let resArg = [];
    resArg.push(new Uint8Array (Buffer.from("burn")));
    let lsigReserve = new algosdk.LogicSigAccount(reserveProgram);
    console.log("Escrow =", lsigReserve.address());
    
    //reserve end

    try {
      // const accounts = await myAlgoWallet.connect();
      // const addresses = accounts.map(account => account.address);
      const params = await algodClient.getTransactionParams().do();
      let reserve = lsigReserve.address();
      
      let appArg = [];
      appArg.push(new Uint8Array (Buffer.from("burn")));
       const transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
           from: localStorage.getItem("walletAddress"), 
           appIndex: index,
           appArgs: appArg,
           suggestedParams: params
         });

        const transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from:localStorage.getItem("walletAddress"),
          to: reserve,
          assetIndex: parseInt(elementID_global),
          amount: 1000000 * 1000000,
          suggestedParams: params
        });

      const groupID = algosdk.computeGroupID([ transaction1, transaction2]);
      const txs = [ transaction1, transaction2];
      txs[0].group = groupID;
      txs[1].group = groupID;
      
      const signedTx1 = await myAlgoConnect.signTransaction([txs[0].toByte(), txs[1].toByte()]);
      // const signedTx2 = algosdk.signLogicSigTransaction(txs[1], smartSiglsig);
console.log("before send raw");
const response = await algodClient.sendRawTransaction([signedTx1[0].blob, signedTx1[1].blob]).do();
   
console.log("TxID", JSON.stringify(response, null, 1));
// setTxId(response.txId);
// setShow(true);
await waitForConfirmation(algodClient, response.txId);
toast.success("Rebase completed and burn completed");
} catch (err) {
  toast.error(`Error: ${err}`);
  console.error(err);
}
  };

  const mint = async (mintAmount) => {
 
    let index = appID_global;
    console.log("appId inside", index);

    //reserve start
  
    let reserveData = `#pragma version 5

    global GroupSize
    int 2
    >=
    global GroupSize
    int 5
    <=
    &&
    bz failed
    
    gtxn 0 TypeEnum
    int 6
    ==
    
    gtxn 0 ApplicationID
    int 71117404
    ==
    &&
    
    gtxn 0 OnCompletion
    int NoOp
    ==
    int DeleteApplication
    gtxn 0 OnCompletion
    ==
    ||
    &&
    
    gtxn 1 RekeyTo
    global ZeroAddress
    ==
    &&
    gtxn 0 RekeyTo
    global ZeroAddress
    ==
    &&
    bz failed
    int 1
    return
    
    failed:
    int 0
    return`;
    
    let reserveResults = await algodClient.compile(reserveData).do();
    console.log("Hash = " + reserveResults.hash);
    console.log("Result = " + reserveResults.result);
    // let program = new Uint8Array(Buffer.from(<"base64-encoded-program">, "base64"));
    let reserveProgram = new Uint8Array(Buffer.from(reserveResults.result, "base64"));

    let lsigReserve = new algosdk.LogicSigAccount(reserveProgram);
    console.log("Escrow =", lsigReserve.address());
    
    //escrow end
        
        try {
          // const accounts = await myAlgoWallet.connect();
          // const addresses = accounts.map(account => account.address);
          const params = await algodClient.getTransactionParams().do();

          let reserve = lsigReserve.address();
          
          let appArg = [];
          appArg.push(new Uint8Array (Buffer.from("mint")));
           const transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
               from: localStorage.getItem("walletAddress"), 
               appIndex: index,
               appArgs: appArg,
               suggestedParams: params
             });

            const transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from:reserve,
              to: "YFSZ42J2NYZMOKFM4B6SDPA7LTXMCRP37V5PHOOLABVRWU42GBBFJUA3UI", //L_Escrow
              assetIndex: parseInt(elementID_global),
              amount: parseInt((parseFloat(mintAmount)/4) * 1000000),
              suggestedParams: params
            });

            const transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from:reserve,
              to: "QSVJYDZSCVCCDS2NGIMLCLHDUGL6TRTXHEPH4BQZP6MBBNLWCOM5TRJGEM", //S_Escrow
              assetIndex: parseInt(elementID_global),
              amount: parseInt((parseFloat(mintAmount)/4) * 1000000),
              suggestedParams: params
            });

            const transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from:reserve,
              to: "6ZJG2JCG2CAU7WAHEU5ZMFWIZGVNT65XZYVAOK4G7YHNHOCWBNXJTNCTYU", //Treasury
              assetIndex: parseInt(elementID_global),
              amount: parseInt((parseFloat(mintAmount)/4) * 1000000),
              suggestedParams: params
            });

            const transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from:reserve,
              to: "GYU4CDG3YIPQB4375A5MRNAJK5WCG6WEWBV4S44W5XMWUYRU3FEIWFY3N4", //B_Escrow
              assetIndex: parseInt(elementID_global),
              amount: parseInt((parseFloat(mintAmount)/4) * 1000000),
              suggestedParams: params
            });

          const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4, transaction5]);
          const txs = [ transaction1, transaction2, transaction3, transaction4, transaction5];
          txs[0].group = groupID;
          txs[1].group = groupID;
          txs[2].group = groupID;
          txs[3].group = groupID;
          txs[4].group = groupID;
          
          const signedTx1 = await myAlgoConnect.signTransaction(txs[0].toByte());
          const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsigReserve);
          const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsigReserve);
          const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsigReserve);
          const signedTx5 = algosdk.signLogicSigTransaction(txs[4], lsigReserve);

    const response = await algodClient.sendRawTransaction([ signedTx1.blob, signedTx2.blob, signedTx3.blob, signedTx4.blob, signedTx5.blob]).do();
       
  console.log("TxID", JSON.stringify(response, null, 1));
  // setTxId(response.txId);
  // setShow(true);
  await waitForConfirmation(algodClient, response.txId);
  toast.success(`Rebase completed and bond funded with TxId = ${response.txId}`);
    } catch (err) {
      toast.error(`Error: ${err}`);
      console.error(err);
    }
  };

const noRebase = async () =>
{    
  let index = parseInt(appID_global);
  
  try {
  // const accounts = await myAlgoWallet.connect();
  // const addresses = accounts.map(account => account.address);
  const params = await algodClient.getTransactionParams().do();
  
  let appArg = [];
  appArg.push(new Uint8Array (Buffer.from("equal")));
   const transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
       from: localStorage.getItem("walletAddress"), 
       appIndex: index,
       appArgs: appArg,
       suggestedParams: params
     });

  
  const signedTx1 = await myAlgoConnect.signTransaction(transaction1.toByte());
const response = await algodClient.sendRawTransaction(signedTx1.blob).do();

console.log("TxID", JSON.stringify(response, null, 1));
// setTxId(response.txId);
// setShow(true);
await waitForConfirmation(algodClient, response.txId);
toast.info("NO REBASE, COIN IS STABLE");
} catch (err) {
toast.error(`Error: ${err}`);
console.error(err);
}
}

      const rebase = async () =>
      {
        let asset = await algodClient.getAssetByID(parseInt(elementID_global)).do();
        console.log(asset['params']['total']);
        let totalSupply = parseFloat(asset['params']['total']) / 1000000;
        let accountInfoResponse2 = await algodClient.accountInformation("Z6AEFL237SLCYWEDPGPVP5SCKJ7MOQWIC6EMCTRLBAZPGSSRQQQV3GCXFQ").do();
        console.log(accountInfoResponse2['assets'][0]['amount']);
        let reserveSupply = parseFloat(accountInfoResponse2['assets'][0]['amount'])/1000000;
        let circulatingSupply = parseFloat(parseFloat(totalSupply) - parseFloat(reserveSupply)).toFixed(6);
        console.log(parseFloat(circulatingSupply));

        let valueMint = parseFloat(circulatingSupply)/100;

        console.log(parseFloat(valueMint));
        await mint(valueMint);
        // if(tau > tau_current)
        // {
        //   await burn()
        // }
        // else if(tau < tau_current)
        // {
        //   await mint();
        // }
        // else{
        //   noRebase();
        // }



      }


    return (
        <Layout>
            <><ToastContainer position='top-center' draggable = {true} transition={Slide} autoClose={8000} closeOnClick = {false}/></>
            <Container fluid="lg">
            <Modal show={showStake} centered onHide={handleCloseStake}>
                {/* <Modal.Header class="btn-close btn-close-white" closeButton /> */}
                <Modal.Body>
                <Button className='modal-close' onClick={handleCloseStake} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                    <div className="pb-4 px-3">
                  
                        {/* <img src={SLogo} width="80" className="mx-auto mb-1 d-block" alt="icon" /> */}
                        <h5 className="mb-1 text-center">Element</h5>
                        <p className="mb-4 pb-3 text-center"></p>

                        <Form className='form-area'>
                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <center><Form.Label><h3>Stake</h3></Form.Label></center> <br/>
                            <Form.Control type="text" placeholder="Enter Amount" id="tid1"/>
                        </Form.Group>
                            <Button variant="grad" size="lg" className='w-100' onClick={()=>stake()} style={{textTransform:"capitalize"}}>
                                Stake
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showUnstake} centered onHide={handleCloseUnstake}>
                {/* <Modal.Header class="btn-close btn-close-white" closeButton /> */}
                <Modal.Body>
                <Button className='modal-close' onClick={handleCloseUnstake} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                    <div className="pb-4 px-3">
                  
                        {/* <img src={SLogo} width="80" className="mx-auto mb-1 d-block" alt="icon" /> */}
                        <h5 className="mb-1 text-center">Element</h5>
                        <p className="mb-4 pb-3 text-center"></p>

                        <Form className='form-area'>
                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <center><Form.Label><h3>Unstake</h3></Form.Label></center> <br/>
                            <Form.Control type="text" placeholder="Enter Amount" id="tid2"/>
                        </Form.Group>
                            <Button variant="grad" size="lg" className='w-100' onClick={()=>unstake()} style={{textTransform:"capitalize"}}>
                            Unstake
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
                <div className="card-stack mb-30">
                    <div className="card-stack-inner pb-2">
                        <div className="card-stack-header flex-sm-row flex-column d-flex align-items-center justify-content-sm-between justify-content-center">
                            <div className='mb-sm-0 mb-4 text-sm-start text-center'>
                                <div className="h3 mb-sm-3 mb-2 text-uppercase">Rebase</div>                      

                                {/* <p><small>{lock == true ? (<>{hour}h:{min}m:{sec}s</>):(<>{0}d:{0}h:{0}m:{0}s</>)} to next rebase</small></p> */}
                            </div>
                            <button onClick={rebase} className='btn m-2 px-sm-5 btn-outline-white' style={{textTransform:"capitalize"}}>Rebase</button>

                            <div className="clock d-flex align-items-center justify-content-center flex-column">
                                <img src={Clock} className='clock-circle' alt="Clock" />

                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 7.59041V8.41262C14 8.51027 13.9779 8.60793 13.9653 8.70874C13.8211 10.1601 13.2212 11.5286 12.2516 12.6182C11.2079 13.8247 9.77661 14.63 8.20359 14.8958C7.94212 14.943 7.67436 14.9682 7.40974 15.0029H6.58753L6.45522 14.9808C6.1402 14.9367 5.82518 14.9115 5.53851 14.8454C3.8984 14.5089 2.44015 13.5789 1.44322 12.2338C0.823699 11.4422 0.38762 10.523 0.166445 9.54238C-0.0547308 8.5618 -0.0554882 7.54435 0.164227 6.56344C0.488479 4.90971 1.41732 3.43615 2.76946 2.43035C4.17144 1.3399 5.94392 0.840255 7.70901 1.03795C9.16385 1.17244 10.5363 1.77356 11.6216 2.75167C12.8245 3.79603 13.6274 5.2258 13.8929 6.79655C13.937 7.05802 13.9653 7.32579 14 7.59041ZM13.0549 8.00309C13.0549 6.80206 12.6987 5.62802 12.0312 4.62953C11.3638 3.63104 10.4151 2.85298 9.30534 2.3938C8.19555 1.93462 6.9745 1.81496 5.79669 2.04995C4.61887 2.28495 3.53723 2.86405 2.68864 3.71396C1.84005 4.56388 1.26263 5.64642 1.02947 6.8246C0.79631 8.00278 0.917875 9.22365 1.37878 10.3327C1.83969 11.4418 2.61923 12.3892 3.61876 13.0551C4.61829 13.721 5.79288 14.0754 6.99391 14.0736C8.60342 14.0711 10.1463 13.4308 11.2847 12.293C12.4231 11.1552 13.0642 9.6126 13.0675 8.00309H13.0549Z" fill="#CF92FF"/>
                                    <path d="M6.53434 8.42469V3.58595C6.52091 3.46939 6.55162 3.35202 6.62042 3.25698C6.68923 3.16193 6.79113 3.0961 6.90606 3.07246C6.97094 3.05878 7.038 3.0592 7.10271 3.07367C7.16741 3.08815 7.22826 3.11635 7.28112 3.15637C7.33399 3.19639 7.37764 3.2473 7.40913 3.30565C7.44062 3.364 7.45921 3.42844 7.46365 3.49459C7.46365 3.54185 7.46365 3.59225 7.46365 3.64265V7.48592H7.62746H10.3902C10.5091 7.469 10.6301 7.49801 10.7284 7.56706C10.8267 7.63611 10.895 7.74002 10.9194 7.85765C10.9324 7.91662 10.9335 7.97757 10.9227 8.03697C10.912 8.09638 10.8895 8.15306 10.8567 8.20374C10.8239 8.25442 10.7814 8.29809 10.7316 8.33223C10.6818 8.36637 10.6257 8.3903 10.5666 8.40264C10.508 8.40901 10.4488 8.40901 10.3902 8.40264C9.14902 8.40264 7.90573 8.40264 6.66035 8.40264L6.53434 8.42469Z" fill="#CF92FF"/>
                                </svg>
                                <p>Next <br />Seigniorage</p>
                                <p>{lock == true ? (<>{hour}h:{min}m:{sec}s</>):(<>{0}h:{0}m:{0}s</>)}</p>
                            </div>
                        </div>
                        <Row className='text-center'>
                            <Col className='mb-3'>
                                <p className='mb-1'>APY</p>
                                <h6 className='mb-0'>523%</h6>
                            </Col>
                            <Col className='mb-3'>
                                <p className='mb-1'>Total ELEM Staked</p>
                                <h6 className='mb-0'>{parseInt(totalstake/1000000)} ELEM</h6>
                            </Col>
                            <Col className='mb-3'>
                                <p className='mb-1'>Current Index 
                                {/* <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-top`}>
                                            Current Index
                                        </Tooltip>
                                    }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                </OverlayTrigger> */}
                                </p>
                                <h6 className='mb-0'>{localStorage.getItem("rebaseCountStake")}</h6>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="card-stack mb-30">
                    <div className="card-stack-inner"><br/>
                    <div className="h3 mb-sm-3 mb-2 text-uppercase">Stake</div>
                        <div className="text-center py-md-5 py-4">
                            <button onClick={handleShowStake} className='btn m-2 px-sm-5 btn-noshadow btn-grad' style={{textTransform:"capitalize"}}>Stake</button>
                            <button onClick={handleShowUnstake} className='btn m-2 px-sm-5 btn-outline-white' style={{textTransform:"capitalize"}}>Unstake</button>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <p className=' pe-3'>First time staking ELEM? <br />Please Opt-In APP to use your ELEM for staking.</p>
                            <button onClick={optin} className='btn m-2 px-sm-5 btn-grad' style={{textTransform:"capitalize"}}>App Opt-In</button>
                        </div>

                        {/* <div className="strip mb-60 d-flex">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 3H20C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3ZM5 5V19H19V5H5ZM11.003 16L6.76 11.757L8.174 10.343L11.003 13.172L16.659 7.515L18.074 8.929L11.003 16Z" fill="white"/>
                            </svg>

                            <p>STAKING ELEM</p>
                        </div> */}

                        {/* <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>Unstaked Balance</h6>
                                <h6 className='mb-1 text-end'>0.0000 ELEM</h6>
                            </div>
                        </div> */}
                        <div className="mb-2">
                            <div className="d-flex mb-2 text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3 d-flex align-items-center text-nowrap'>Staked Balance
                                {/* <svg width="14" height="8" viewBox="0 0 14 8" className='ms-3' fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.95384 5.172L2.00384 0.222L0.589844 1.636L6.95384 8L13.3178 1.636L11.9038 0.222L6.95384 5.172Z" fill="white"/>
                                </svg> */}
                                </h6>
                                <h6 className='mb-1 text-end'>{stakedbalance/1000000 === 'NaN' ? <>{0}</> : stakedbalance/1000000} ELEM</h6>
                            </div>
                            {/* <div className="px-2 mb-1 d-flex justify-content-between align-items-center">
                                <p className='mb-1 pe-3'>Single Staking</p>
                                <p className='mb-1 text-end'>0.0000sELEM</p>
                            </div>
                            <div className="px-2 mb-1 d-flex justify-content-between align-items-center">
                                <p className='mb-1 pe-3'>Wrapped Balance</p>
                                <p className='mb-1 text-end'>0.0000 gELEM</p>
                            </div> */}
                        </div>

                        <hr />

                        <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>Reward Amount </h6>
                                <h6 className='mb-1 text-end'>{rewardBool === true ? (<>{rewardcalc}</>) : (<>{0.00}</>)} ELEM</h6>
                            </div>
                        </div>
                        {/* <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>Next Reward Yield </h6>
                                <h6 className='mb-1 text-end'>0.3654%</h6>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>ROI (5-Day Rate) </h6>
                                <h6 className='mb-1 text-end'>5.6240%</h6>
                            </div>
                        </div> */}
                        <center>
                        <button onClick={Claimreward} className='btn m-2 px-sm-5 btn-noshadow btn-grad' style={{textTransform:"capitalize"}}>Claim Reward</button>
                        </center>
                    </div>
                </div>
            </Container>
        </Layout>
    );
};

export default Dashboard;