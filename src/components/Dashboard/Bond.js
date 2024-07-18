import React, { Component, useState, useEffect, useContext, useRef } from 'react';
import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import ReactDomServer from 'react-dom/server';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import Logo from '../../assets/images/modal-logo.png';
import Arrow from '../../assets/images/arrow-tr.svg';
import ModalSquareLogo from '../../assets/images/modal-square-logo.png';

const algosdk = require('algosdk');
const myAlgoWallet = new MyAlgoConnect();

const Bond = () => {
 
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showExchange, setShowExchange] = React.useState(false);
    const handleCloseExchange = () => setShowExchange(false);
    const handleShowExchange = () => setShowExchange(true);
    const [accounts, setaccount] = useState("");
    let[startdt,setstartdt] = useState("");
    const[enddt,setenddt] = useState("");
    const[clsdt,setclsdt] = useState("");
    const[goal,setgoal] = useState("");
    const[total,settotal] = useState("");
    const[rec,setrec]= useState("");
    const[creator,setCreator]= useState("");
    const[escrow,setescrow]= useState("");
    const[appid,setappid]= useState("");
    const[percent,setPercent]= useState("");
    const[date,setdate]= useState("");
    const[timecf,settime]= useState("");
    const[map1,setMap]= useState([]);
    const[day,setTime4]= useState("");
    const[hour,setTim1]= useState("");
    const[min,setTim2]= useState("");
    const[sec,setTim3]= useState("");
    const[lock,setlock]= useState(""); 
    const [addr,setToaddr] = useState("");
    const [asset,setToasset] = useState("");
    const [amount_inp, setToamount] = useState("");
    const [amtReclaim, setToReclaim] = useState("");
    const [LocalAmount, setLocalAmount] = useState("");
    const [bond, setBond] = React.useState("");
    const [stable,setToStable] = useState("");
    const [time,setToTime] = useState("");
    const [algoPrice, setAlgoPrice] = useState([]);
    const [usdtPrice, setUsdtPrice] = useState([]);
    const [usdcPrice, setUsdcPrice] = useState([]);
    const [treasuryBalance, setTreasuryBalance] = useState("");
    const [value, setValue] = React.useState('');
    //console.log("mapSet", map1);
    // let appId = setappid(46584645);

    let appID_global = 71951577;
    let usdcID = 71311423;
    let elemID = 71116238;

    const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
    const indexClient = new algosdk.Indexer('', 'https://testnet.algoexplorerapi.io/idx2', '');



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

        useEffect(async() => {
            await TreasuryBalance()
        }, [treasuryBalance]);        

const TreasuryBalance = async () =>{
    let balance = await algodClient.accountInformation("6ZJG2JCG2CAU7WAHEU5ZMFWIZGVNT65XZYVAOK4G7YHNHOCWBNXJTNCTYU").do();
    // console.log(balance['assets'][0]['amount']);
    setTreasuryBalance(parseFloat(balance['assets'][0]['amount'])/1000000);
}


const myAlgoOptIn = async () =>
{
    if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
  let application = indexClient.searchForApplications(appID_global);
  console.log("Global State =", application);
  let appById = await algodClient.getApplicationByID(appID_global).do();
  console.log("Global State =", appById.params);
  let params = await algodClient.getTransactionParams().do();

  try {

    const txn = algosdk.makeApplicationOptInTxnFromObject({
        suggestedParams:params,
        from: localStorage.getItem("walletAddress"),
        appIndex: parseInt(appID_global),
    });

    const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
    toast.warn("Transaction in Progress");
    const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
    await waitForConfirmation(algodClient, response.txId);
    await toast.success(`Transaction Success ${response.txId}`);
}
catch (err) {
    toast.error(`Transaction Failed due to ${err}`);
    console.error(err);
}
        }
}



                const Exchange =async (Pop_amount) => {
                // if(((parseFloat(stable)/1000000).toFixed(2) === 0.00 && (parseFloat(bond)/1000000).toFixed(2) === 0.00) || ((parseFloat(stable)/1000000).toFixed(2) === 'NaN' && (parseFloat(bond)/1000000).toFixed(2) === 'NaN'))
                // {
                    handleCloseExchange();
                    const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
                    if (localStorage.getItem("walletAddress") === "")
                    {
                        toast.error("Connect your wallet");
                    }
                    else{
                    // var amt =  window.prompt("Enter the amount you want to donate"); 
                    // let amount = parseInt(amt) * 1000000;
                    let amount = parseInt(Pop_amount) * 1000000;
                  let index = parseInt(appID_global);
                    console.log("appId inside donate", index)
                
                    try {
                    //   const accounts = await myAlgoWallet.connect();
                      // const addresses = accounts.map(account => account.address);
                      const params = await algodClient.getTransactionParams().do();
                
                      let appArgs1 = [];
                      appArgs1.push(new Uint8Array(Buffer.from("discount_buy")));
                      // let decAddr = algosdk.decodeAddress('EGUSS7HHM3ODVPW3Z2L55WPCZCR4TWSN2VVAKYPZKYEUER5BXM5N6YNH7I');
                      // appArgs.push(decAddr.publicKey);
                      //   console.log("(line:516) appArgs = ",appArgs)
                      //localStorage.setItem("escrow", 'PKWSTDTMCYQQSFLNOW3W4TJN5VFJDR3KN5Q76G6OY6D4NFKHSFDZWC5BKY');
                      let sender = localStorage.getItem("walletAddress");
                      let recv_escrow = escrow;
                      // create unsigned transaction
                      let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
                        from:sender, 
                        suggestedParams: params, 
                        appIndex: index, 
                        appArgs: appArgs1
                      })                    
                      
                      
                      let data = `#pragma version 5

                      gtxn 1 TypeEnum
                      int 4
                      ==
                      bnz opt_in
                      
                      gtxn 0 ApplicationArgs 0
                      byte "get_token"
                      ==
                      bnz get_token
                      
                      opt_in:
                      global GroupSize
                      int 2
                      ==
                      bz failed
                      gtxn 0 TypeEnum
                      int 6
                      ==
                      
                      gtxn 0 ApplicationID
                      int 71951577 //appID
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
                      
                      get_token:
                      global GroupSize
                      int 2
                      ==
                      bz failed
                      gtxn 0 TypeEnum
                      int 6
                      ==
                      
                      gtxn 0 ApplicationID
                      int 71951577 //appID
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
                      
                      
                      
                      let results = await algodClient.compile(data).do();
                      console.log("Hash = " + results.hash);
                      console.log("Result = " + results.result);
                      
                      let program = new Uint8Array(Buffer.from(results.result, "base64"));
                      
                      let lsig = algosdk.makeLogicSig(program);
                      console.log("Escrow =", lsig.address());
                      
                      let transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                        from: sender, 
                        to: lsig.address(), 
                        amount: amount, 
                        assetIndex: usdcID,
                        suggestedParams: params
                       });
  
                      
                      const groupID = algosdk.computeGroupID([ transaction1, transaction2]);
                      const txs = [ transaction1, transaction2];
                      txs[0].group = groupID;
                      txs[1].group = groupID;
  
                      const signedTx1 = await myAlgoWallet.signTransaction([txs[0].toByte(), txs[1].toByte()]);
                      // const signedTx2 = await myAlgoWallet.signTransaction(txs[1].toByte());
  
                      toast.info("Transaction in Progress");
                  const response = await algodClient.sendRawTransaction([ signedTx1[0].blob, signedTx1[1].blob]).do();
                  console.log("TxID", JSON.stringify(response, null, 1));
                  await waitForConfirmation(algodClient, response.txId);
                  toast.success(`Transaction Success ${response.txId}`);
                    } catch (err) {
                      toast.error(`Transaction Failed due to ${err}`);
                      console.error(err);
                    }
                }
                // }
                // else{
                //     toast.error(`Claim all remaining Bond to exchange`);
                // }

                
                
                  
                        //  mapTotal();
                        //  mapGoal();
                        
                          
                          // Use the AlgoSigner encoding library to make the transactions base
                          
                  
                    }


const myAlgoOptInAsset = async () => {
    if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
  
  let params = await algodClient.getTransactionParams().do();
  
  try {

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams: params,
        from: localStorage.getItem("walletAddress"),
        to: localStorage.getItem("walletAddress"),
        amount: 0,
        assetIndex: elemID
    });

    const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
    const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
    toast.success(`Transaction Success ${response.txId}`);
    await waitForConfirmation(algodClient, response.txId);
    window.location.reload();
}
catch (err) {
    toast.error(`Transaction Failed due to ${err}`);
    console.error(err);

}
        }
}



const globalState = async (index) =>
{
      try {
        let appById = await algodClient.getApplicationByID(appID_global).do();
        setMap(appById['params']['global-state']);
        let accountInfoResponse = await algodClient.accountInformation(localStorage.getItem("walletAddress")).do();
        // console.log("R value", appById);
        // console.log("local", accountInfoResponse);
        // console.log("stable", accountInfoResponse['apps-local-state'])
        let c = 0;

        if( accountInfoResponse['apps-local-state'].length === null|| accountInfoResponse['apps-local-state'].length ===undefined||accountInfoResponse['apps-local-state'].length===""){
            // alert("check");
         }
        else{
        
        
        //   console.log("User",accountInfoResponse['apps-local-state'].length);
          for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
              if (accountInfoResponse['apps-local-state'][i].id == parseInt(appID_global)) {
                //   console.log("User's local state:",accountInfoResponse['apps-local-state'][i].id);
                  let acccheck= accountInfoResponse['apps-local-state'][i][`key-value`]; 
                //   console.log("Usercheck",acccheck);
                //   console.log("User",accountInfoResponse['apps-local-state'][i][`key-value`]);
                
                  if(accountInfoResponse['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse['apps-local-state'][i][`key-value`]===""){
                    // alert("check");
                 }
                else{
        for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
                    //   console.log(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                      //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                      
                      let rewardkey =accountInfoResponse['apps-local-state'][i]['key-value'][n];
                     if(rewardkey['key'] === "TXlBbW91bnRCb25k"){
                    //    stakedbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                    setBond(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                     }
                    if(rewardkey['key'] === "TXlBbW91bnRTdGFibGU="){
                    //   rewardbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                    // console.log("stable",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                    setToStable(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                    //   console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                    }
                    if(rewardkey['key'] === "TXlUaW1l"){
                    //   usertimenew = accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                    // console.log("MyTime",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                    setToTime(parseInt(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']) + 300);
                    //   console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                    }
                      
                  }
        
                }
        
                  
              }
          }
        }


        // console.log("c =", c);
        // map1.map((a)=>{
        //     console.log("map", a);
        // })

        // map1.forEach((element) => {
        //     console.log("Element", element)
        // });

        let appArgsRet = [];
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][0]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][1]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][2]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][3]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][4]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][5]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][6]['key']));
        appArgsRet.push(JSON.stringify(appById['params']['global-state'][7]['key']));
        // console.log("array", appArgsRet);

        // setrec(JSON.stringify(r['application']['params']['global-state'][0]['value'][`bytes`]));
        // setstartdt(JSON.stringify(r['application']['params']['global-state'][1]['value'][`uint`]));
        // settotal(JSON.stringify(r['application']['params']['global-state'][2]['value'][`uint`]));
        // setCreator(JSON.stringify(r['application']['params']['global-state'][3]['value'][`bytes`]));
        // setenddt(JSON.stringify(r['application']['params']['global-state'][4]['value'][`uint`]));
        // setclsdt(JSON.stringify(r['application']['params']['global-state'][5]['value'][`uint`]));
        // setgoal(JSON.stringify(r['application']['params']['global-state'][6]['value'][`uint`]));
        // setescrow(JSON.stringify(r['application']['params']['global-state'][7]['value'][`bytes`]));

        for (let i = 0; i <= 7; i++) { 

                        if(appArgsRet[i] == '"Q3JlYXRvcg=="'){
                            let creatorAddress_c =  JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]);
                            // console.log("creator address", creatorAddress_c)
                            setCreator(JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]));
                        }
                        else if(appArgsRet[i] == '"RW5kRGF0ZQ=="'){
                            let endDate_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                            setenddt(JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                        }
                        else if(appArgsRet[i] == '"RnVuZENsb3NlRGF0ZQ=="'){
                            let closeDate_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                            setclsdt(JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                        }
                        else if(appArgsRet[i] == '"R29hbA=="'){
                            let goalAmount_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                            setgoal(goalAmount_c);
                        }
                        else if(appArgsRet[i] == '"UmVjZWl2ZXI="'){
                            let recv_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]);
                            setrec(JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]));
                        }
                        else if(appArgsRet[i] == '"U3RhcnREYXRl"'){
                            let startDate_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                            setstartdt(JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                        }
                        else if(appArgsRet[i] == '"VG90YWw="'){
                            let total_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]);
                            settotal(JSON.stringify(await appById['params']['global-state'][i]['value'][`uint`]));
                        }
                        else if(appArgsRet[i] == '"RXNjcm93"'){
                            let escrow_c = JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]);
                            setescrow(JSON.stringify(await appById['params']['global-state'][i]['value'][`bytes`]));
                        }
                        let j = i + 1;
                        // console.log("time =", j, "then", JSON.stringify(await r['application']['params']['global-state'][6]['value'][`uint`]));
                        // console.log("state", goal);
                        // console.log("state", JSON.stringify(await r['application']['params']['global-state'][1]['value'][`uint`]));
                        // //let start = JSON.stringify(await r['application']['params']['global-state'][1]['value'][`uint`]);
                        let per = parseFloat((parseFloat(total/1000000)/parseFloat(goal/1000000)) * 100);
                        // console.log("----------------total =", total);
                        // console.log("----------------per =", per);
                        setPercent(per);
                }


        //return JSON.stringify(r['application']['params']['global-state'][7]['value'][`bytes`], null, 2);
      } catch (e) {
        //console.error(e);
        return JSON.stringify(e, null, 2);
      }
}

useEffect(async() =>{await fetch()},[bond, stable, time])

useEffect(async() => {
    await first()
}, [day, hour, min, sec, lock]);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

const first = async () => {

    var us= time + 30;
    var ff=new Date(us);
setdate(ff.toDateString());
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

const fetch = async () => {
let index = parseInt(appID_global); //current app id need to be entered
setappid(index);
// await readLocalState(algodClient, localStorage.getItem("walletAddress"), index);
await globalState(index);
}

const mapTotal = map1.map((a)=>{
    return(
        <>{a.key === "VG90YWw=" ? parseFloat(a.value['uint'])/1000000 : ''}</>
    )
})

const mapGoal = map1.map((a)=>{
    return(
        <>{a.key === "R29hbA==" ? parseFloat(a.value['uint'])/1000000 : ''}</>
    )
})

const mapStartDate = map1.map((a)=>{
    return(
        <>{a.key === "U3RhcnREYXRl" ? ((new Date(parseFloat(a.value['uint'])*1000)).toLocaleString()).slice(0,10) : ''}</>
    )
})

const mapStartTime = map1.map((a)=>{
    return(
        <>{a.key === "U3RhcnREYXRl" ? ((new Date(parseFloat(a.value['uint'])*1000)).toLocaleString()).slice(11,23) : ''}</>
    )
})

const mapEndDate = map1.map((a)=>{
    return(
        <>{a.key === "RW5kRGF0ZQ==" ? ((new Date(parseFloat(a.value['uint'])*1000)).toLocaleString()).slice(0,10) : ''}</>
    )
})

const mapCreator = map1.map((a)=>{
    return(
        <>{a.key === "Q3JlYXRvcg==" ? a.value['byte'] : ''}</>
    )
})

const mapRecv = map1.map((a)=>{
    return(
        <>{a.key === "UmVjZWl2ZXI=" ? parseFloat(a.value['uint'])/1000000 : ''}</>
    )
})

const mapEscrow = map1.map((a)=>{
    return(
        <>{a.key === "RXNjcm93" ? parseFloat(a.value['uint'])/1000000 : ''}</>
    )
})

const mapCloseDate = map1.map((a)=>{
    return(
        <>{a.key === "RnVuZENsb3NlRGF0ZQ==" ? parseFloat(a.value['uint'])/1000000 : ''}</>
    )
})

let mapPercent = parseFloat((ReactDomServer.renderToString(mapTotal))/parseFloat(ReactDomServer.renderToString(mapGoal))*100).toFixed(2);
// console.log("----mapPercent----", mapPercent);

let reclaimAmount = parseFloat((200/(ReactDomServer.renderToString(mapTotal)))*parseFloat(LocalAmount)/1000000);
// console.log("reclaim amount = ",reclaimAmount)

const Claim =async () => {
    if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{

  const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

 
//   let amount = parseInt(amountsend);
  let index = parseInt(appID_global);
  console.log("appId inside donate", index)

  try {
    // const accounts = await myAlgoWallet.connect();
    // const addresses = accounts.map(account => account.address);
    const params = await algodClient.getTransactionParams().do();

    let appArgs1 = [];
    appArgs1.push(new Uint8Array(Buffer.from("get_token")));
    // let decAddr = algosdk.decodeAddress('EGUSS7HHM3ODVPW3Z2L55WPCZCR4TWSN2VVAKYPZKYEUER5BXM5N6YNH7I');
    // appArgs.push(decAddr.publicKey);
    //   console.log("(line:516) appArgs = ",appArgs)
    //localStorage.setItem("escrow", 'PKWSTDTMCYQQSFLNOW3W4TJN5VFJDR3KN5Q76G6OY6D4NFKHSFDZWC5BKY');
    let sender = localStorage.getItem("walletAddress");
    let recv_escrow = escrow;
    // create unsigned transaction
    let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
      from:sender, 
      suggestedParams: params, 
      appIndex: index, 
      appArgs: appArgs1
    })   
    
    
    let data = `#pragma version 5

    gtxn 1 TypeEnum
    int 4
    ==
    bnz opt_in
    
    gtxn 0 ApplicationArgs 0
    byte "get_token"
    ==
    bnz get_token
    
    opt_in:
    global GroupSize
    int 2
    ==
    bz failed
    gtxn 0 TypeEnum
    int 6
    ==
    
    gtxn 0 ApplicationID
    int 71951577 //appID
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
    
    get_token:
    global GroupSize
    int 2
    ==
    bz failed
    gtxn 0 TypeEnum
    int 6
    ==
    
    gtxn 0 ApplicationID
    int 71951577 //appID
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
    
    
    
    let results = await algodClient.compile(data).do();
    // console.log("Hash = " + results.hash);
    // console.log("Result = " + results.result);
    
    let program = new Uint8Array(Buffer.from(results.result, "base64"));
    
    let lsig = new algosdk.LogicSigAccount(program);
    // console.log("Escrow =", lsig.address());
    
    let sender_es = lsig.address();
    let receiver_es = localStorage.getItem("walletAddress");
    // let receiver = "<receiver-address>"";
    let amount_es;
    if(((parseInt(stable) * 20) / 100 >= parseInt(bond))){
        amount_es = parseInt(bond);
    }
    else{
        amount_es = (parseInt(stable) * 20) / 100;
    }
    // console.log("amount rebase=", amount_es);
    // let assetID = 50812029 ;
    let transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender_es, 
      to: receiver_es,  
      amount: amount_es, 
      assetIndex: elemID, 
      suggestedParams: params
    }); 
    
    


  
    const groupID = algosdk.computeGroupID([ transaction1, transaction2]);
    const txs = [ transaction1, transaction2 ];
    txs[0].group = groupID;
    txs[1].group = groupID;
    
    
    const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
    const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
    toast.info(`Transaction in Progress`)
const response = await algodClient.sendRawTransaction([ signedTx1.blob, signedTx2.blob]).do();
console.log("TxID", JSON.stringify(response, null, 1));
await waitForConfirmation(algodClient, response.txId);
toast.success(`Transaction Successful with ${response.txId}`);
  } catch (err) {
    toast.error(`Transaction Failed due to ${err}`);
    console.error(err);
  }
        }


      //  mapTotal();
      //  mapGoal();
      
        
        // Use the AlgoSigner encoding library to make the transactions base
        

  }


const Finish = async () => {

    const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

 
    //   let amount = parseInt(amountsend);
      let index = parseInt(appID_global);
      console.log("appId inside", index)
    
      try {
        const accounts = await myAlgoWallet.connect();
        const addresses = accounts.map(account => account.address);
        const params = await algodClient.getTransactionParams().do();
    
        let appArgs1 = [];
        appArgs1.push(new Uint8Array(Buffer.from("finish")));
        let sender = localStorage.getItem("walletAddress");
        // create unsigned transaction
        let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
          from:sender, 
          suggestedParams: params, 
          appIndex: index, 
          appArgs: appArgs1
        })   


        const signedTx1 = await myAlgoWallet.signTransaction(transaction1.toByte());
        toast.info(`Transaction in Progress`)
    const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
    console.log("TxID", JSON.stringify(response, null, 1));
    await waitForConfirmation(algodClient, response.txId);
    toast.success(`Transaction Successful with ${response.txId}`);
      } catch (err) {
        toast.error(`Transaction Failed due to ${err}`);
        console.error(err);
      }

}


const usdcFund = async () =>
{
    if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{

let usdcFundProgram = new Uint8Array(Buffer.from("BSABATEZIhIiQzIEgQISMwAQIhIQMwEQgQQSQQACIkOBAEM=", "base64"));

let lsigusdcFund = new algosdk.LogicSigAccount(usdcFundProgram);
// console.log("Escrow =", lsigusdcFund.address());

try {

    const params = await algodClient.getTransactionParams().do();

    let sender = localStorage.getItem("walletAddress");
    let escrow = lsigusdcFund.address();
    // create unsigned transaction
    let transaction1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender, 
        to: sender,  
        amount: 0, 
        assetIndex: parseInt(usdcID), 
        suggestedParams: params
      });    

    let transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: escrow, 
      to: sender,  
      amount: 10 * 1000000, 
      assetIndex: parseInt(usdcID), 
      suggestedParams: params
    }); 

    const groupID = algosdk.computeGroupID([ transaction1, transaction2]);
    const txs = [ transaction1, transaction2 ];
    txs[0].group = groupID;
    txs[1].group = groupID;
    
    
    const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
    const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsigusdcFund);
    toast.info(`Transaction in Progress`)
const response = await algodClient.sendRawTransaction([ signedTx1.blob, signedTx2.blob]).do();
console.log("TxID", JSON.stringify(response, null, 1));
await waitForConfirmation(algodClient, response.txId);
toast.success(`Transaction Successful with ${response.txId}`);
  } catch (err) {
    toast.error(`Transaction Failed due to ${err}`);
    console.error(err);
  }

        }
}



    return (

        <Layout>
    <Modal show={showExchange} centered onHide={handleCloseExchange}>
        {/* <Modal.Header class="btn-close btn-close-white" closeButton /> */}
        <Modal.Body>
        <Button className='modal-close' onClick={handleCloseExchange} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
            <div className="pb-4 px-3">
          
                <img src={Logo} width="80" className="mx-auto mb-1 d-block" alt="icon" />
                <h5 className="mb-1 text-center">Element</h5>
                <p className="mb-4 pb-3 text-center"></p>

                <Form className='form-area'>
                <Form.Group className="mb-4" controlId="formBasicPassword">
                    <center><Form.Label><h3>USDC</h3></Form.Label></center> <br/>
                    <Form.Control type="text" placeholder="Enter Amount" value={value} onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}/>
                </Form.Group>
                    <Button variant="grad" size="lg" className='w-100' onClick={()=>Exchange(value)}>
                        Exchange
                    </Button>
                </Form>
            </div>
        </Modal.Body>
    </Modal>
            <Container fluid="lg">
                {/* <div className="note mb-60 d-flex justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <p>TAU is currently migrating to improved contracts. Please note that during this time, frontend metrics may be inaccurate.</p>
                </div> */}

                <div className="card-bond">
                    <div className="card-bond-inner">
                        <div className="d-flex align-items-center justify-content-between mb-60">
                            <div className="h3 mb-0">Bond</div>
                            {/* <Link className='h5 mb-0 text-white' to="#">v1Bond <img src={Arrow} style={{width: '10px'}} className='ms-1' alt="arrow" /></Link> */}
                        </div>

                        <Row className='text-center mb-20'>
                            <Col className='mb-3'>
                                <p className='mb-1'>Treasury Balance</p>
                                <h6 className='mb-0'>{treasuryBalance} ELEM</h6>
                            </Col>
                            <Col className='mb-3'>
                                <p className='mb-1'>TAU Price</p>
                                <h6 className='mb-0'>${1}</h6>
                            </Col>
                        </Row>

                        <div className="table-group-outer table-group-bond mb-30">
                            <div className="table-group-head">
                                <div className="table-group-tr">
                                    <div className="table-group-th" style={{minWidth: '85px', width: '85px'}}></div>
                                    <div className="table-group-th">Bond</div>
                                    <div className="table-group-th">Price</div>
                                    <div className="table-group-th">ROI</div>
                                    <div className="table-group-th">Duration</div>
                                    <div className="table-group-th"></div>
                                </div>
                            </div>
                            <div className="table-group-body">
                                <div className="table-group-tr">
                                    <div className="table-group-td" style={{minWidth: '85px', width: '85px'}}>
                                        <div className="d-flex align-items-center td-cell">
                                            <img src={ModalSquareLogo} alt='icon' />
                                        </div>
                                    </div>
                                    <div className="table-group-td">
                                        ELEM
                                    </div>
                                    <div className="table-group-td">$3.00</div>
                                    <div className="table-group-td">0.11%</div>
                                    <div className="table-group-td">14 days</div>
                                    <div className="table-group-td text-end"><Button variant='grad' onClick={handleShow} className='py-2'>Bond</Button></div>
                                </div>
                                {/* <div className="table-group-tr">
                                    <div className="table-group-td" style={{minWidth: '85px', width: '85px'}}>
                                        <div className="d-flex align-items-center td-cell">
                                            <img src={ModalSquareLogo} alt='icon' />
                                            <img src={ModalSquareLogo} alt='icon' />
                                        </div>
                                    </div>
                                    <div className="table-group-td">
                                        TAU-USDC LP
                                    </div>
                                    <div className="table-group-td">$195.19</div>
                                    <div className="table-group-td">0.11%</div>
                                    <div className="table-group-td">14 days</div>
                                    <div className="table-group-td text-end"><Button variant='grad' onClick={handleShow} className='py-2'>Bond</Button></div>
                                </div> */}
                            </div>
                        </div>

                        <Row className='justify-content-center text-center'>
                            <Col md={8}>
                                {/* <p>Important: New bonds are auto-staked and no longer vest linearly. Simply claim as sOHM or gOHM at the end of the term.   </p> */}
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>


            <Modal
                show={show}
                size={'lg'}
                centered={true}
                onHide={handleClose}
                keyboard={false}
            >
<><ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/></>
                <Modal.Body>

                    <Button className='modal-close' onClick={handleClose} variant='reset'>
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="1">
                        <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                        </g>
                    </svg>
                    </Button>
                
                    <div className="d-flex mb-20 flex-wrap align-items-start justify-content-between">
                        <div className="d-flex align-items-center mb-md-4 flex-wrap modal-head">
                            <img src={Logo} alt="logo" />

                            <Button variant='grad' className='py-1' onClick={myAlgoOptIn} style={{textTransform:"capitalize"}}>app opt-in</Button>
                            <Button variant='grad' className='py-1' onClick={usdcFund} style={{textTransform:"capitalize"}}>USDC fund</Button>
                            {/* <span>(opt-in only one time)</span> */}
                        </div>
                    </div>

                    <div className="d-flex mb-20 flex-wrap align-items-start justify-content-between">
                        <div>
                            <strong>You can claim after</strong>
                            <div className="h3 mb-0">{lock == true ? (<><h4 className="price">{day}d:{hour}h:{min}m:{sec}s</h4></>):(<><h4>{0}d:{0}h:{0}m:{0}s</h4></>)}</div>
                        </div>
                    </div>

                    <div className="mb-20 d-flex justify-content-center flex-wrap">
                        <div className='mb-3 w-100 text-center'>
                            <Button variant='grad' onClick={()=>handleShowExchange()} style={{textTransform:"capitalize"}}>Exchange</Button>
                        </div>
                        <Button variant='grad' className='mx-sm-2 mx-1 mb-3' onClick={()=>myAlgoOptInAsset()} style={{textTransform:"capitalize"}}>asset opt-in</Button>
                        
                        {(parseFloat(stable)/1000000).toFixed(2) === 0.00 && (parseFloat(stable)/1000000 - parseFloat(bond)/1000000).toFixed(2) === 0.00 ? (<></>) : (<>{(parseFloat(stable)/1000000).toFixed(2) === (parseFloat(stable)/1000000 - parseFloat(bond)/1000000).toFixed(2) ? (<><Button variant='grad' className='mx-sm-2 mx-1 mb-3'onClick={()=>Claim()} style={{textTransform:"capitalize"}}>Claim</Button></>) : (<><Button variant='grad' className='mx-sm-2 mx-1 mb-3'onClick={()=>Claim()} style={{textTransform:"capitalize"}}>Claim</Button></>)}</>)}
                    </div>

                    <div className="d-flex flex-wrap align-items-start justify-content-between">
                        <div className='d-flex pe-2 mb-3 flex-column'>
                            <strong>Bond Total</strong>
                            <div className="h3 mb-0">{(parseFloat(stable)/1000000).toFixed(2) === 'NaN' ? <>{0.00}</>:(parseFloat(stable)/1000000).toFixed(2)}</div>
                        </div>
                        <div className='d-flex pe-2 mb-3 flex-column'>
                            <strong>Bond yet to claim</strong>
                            <div className="h3 mb-0">{(parseFloat(bond)/1000000).toFixed(2) === 'NaN' ? <>{0.00}</>:(parseFloat(bond)/1000000).toFixed(2)}</div>
                        </div>
                        <div className='d-flex mb-3 flex-column'>
                            <strong>Bond claimed</strong>
                            <div className="h3 mb-0">{(parseFloat(stable)/1000000 - parseFloat(bond)/1000000).toFixed(2) === 'NaN' ? <>{0.00}</>:(parseFloat(stable)/1000000 - parseFloat(bond)/1000000).toFixed(2)}</div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default Bond;