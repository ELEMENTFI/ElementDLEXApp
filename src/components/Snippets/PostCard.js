import React, { Component, useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, ProgressBar, Form, InputGroup  } from 'react-bootstrap';

import Image from '../../assets/images/element_banner_sale.png';
import Icon from '../../assets/images/post-icon-1.png';
import Logo from '../../assets/images/element logo.png';
import SLogo from '../../assets/images/modal-square-logo.png';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import ReactDomServer from 'react-dom/server';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import {appOptinLaunchpad, assetOptinLaunchpad, donateLaunchpad} from '../apicallfunction';
import '../toast-style-override.css'
import axios from 'axios';  
import url from '../../configurl';
import { Link } from 'react-router-dom';
const algosdk = require('algosdk');
const myAlgoWallet = new MyAlgoConnect();

const PostCard = () => {

    const [show, setShow] = React.useState(false);
    const [showDonate, setShowDonate] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseDonate = () => setShowDonate(false);
    const handleShowDonate = () => setShowDonate(true);

    const [address, setAddress] = React.useState(false);

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
    const[percent,setPercent]= useState(parseFloat(""));
    const[date,setdate]= useState("");
    const[time,settime]= useState("");
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
    // const [show, setShow] = useState(false);
    const [value, setValue] = React.useState('');
    const [valueAddAddress, setValueAddAddress] = React.useState('');
    const [addrAddAddress, setValueAddrAddAddress] = React.useState('');

    const handleCloseAddress = () => setAddress(false);
    const handleAddress = () => setAddress(true);

    let appID_global = 66153856;
    let escrow_global = "LMCGCWB7LOFIQBIKO663W4OOOQQCNWQGU23HCMLYXX3S35OXS47XLXLTXQ";
    let elementID_global = 66145664;
    let whiteID_global = 56296602;
    let owner_global = "UTV3AUE6PTUDIBAT6EOP57IUJMW75MOXNP2XOZLMJX5CEBLDGTMYTR32CU";

    const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
    const indexClient = new algosdk.Indexer('', 'https://testnet.algoexplorerapi.io/idx2', '');

    const waitForConfirmation = async function (client, txId) {
        let status = (await client.status().do());
        let lastRound = status["last-round"];
          while (true) {
            const pendingInfo = await client.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
              //Got the completed Transaction
              //console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            //   toast.success(`Transaction Successful with ${txId}`);
              toast.success(`Transaction ${txId} confirmed in round ${pendingInfo["confirmed-round"]}`);
              break;
            }
            lastRound++;
            await client.statusAfterBlock(lastRound).do();
          }
        };  

        const AppOptIn = async () =>
        {
            if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
          let application = indexClient.searchForApplications(appID_global);
          //console.log("Global State =", application);
          let appById = await algodClient.getApplicationByID(appID_global).do();
          //console.log("Global State =", appById.params);
          let params = await algodClient.getTransactionParams().do();
        
          try {
        
            const txn = algosdk.makeApplicationOptInTxnFromObject({
                suggestedParams:params,
                from: localStorage.getItem("walletAddress"),
                appIndex: parseInt(appID_global),
            });
        
            const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
            toast.info("Transaction in Progress");
            const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
           //API for Connect wallet  stored in /lpTracker
          await appOptinLaunchpad(localStorage.getItem("walletAddress"), "Opted in to Launchpad app");
          //API end
            await waitForConfirmation(algodClient, response.txId);
            // toast.success(`Transaction Success ${response.txId}`);
        }
        catch (err) {
            toast.error(`Transaction Failed due to ${err}`);
            console.error(err);
        }
    }
        }

    const optinAsset = async () =>
    {
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
              assetIndex: elementID_global
          });
      
          const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
        toast.info("Transaction in Progress");
          const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
          
          //API for Connect wallet  stored in /lpTracker
          await assetOptinLaunchpad(localStorage.getItem("walletAddress"), "Opted in to ELEM Asset");
          //API end

          await waitForConfirmation(algodClient, response.txId);
        //   toast.success(`Transaction Success ${response.txId}`);
      
      }
      catch (err) {
          toast.error(`Transaction Failed due to ${err}`);
          console.error(err);
      
      }
    }
    }

    const Donate =async (Pop_amount) => {


        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

        handleCloseDonate();
        if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{

        // var amt =  window.prompt("Enter the amount you want to donate"); 
        // let amount = parseInt(amt);
        let amount = parseFloat(Pop_amount) * 1000000;
        let index = parseInt(appID_global);
        //console.log("appId inside donate", index)
        //console.log("amonut pop", amount)
    
        try {
        //   const accounts = await myAlgoWallet.connect();
          // const addresses = accounts.map(account => account.address);
          const params = await algodClient.getTransactionParams().do();
    
          let appArgs1 = [];
          appArgs1.push(new Uint8Array(Buffer.from("donate")));
          // let decAddr = algosdk.decodeAddress('EGUSS7HHM3ODVPW3Z2L55WPCZCR4TWSN2VVAKYPZKYEUER5BXM5N6YNH7I');
          // appArgs.push(decAddr.publicKey);
          //   //console.log("(line:516) appArgs = ",appArgs)
          //localStorage.setItem("escrow", 'PKWSTDTMCYQQSFLNOW3W4TJN5VFJDR3KN5Q76G6OY6D4NFKHSFDZWC5BKY');
          let sender = localStorage.getItem("walletAddress");
        //   let recv_escrow = escrow;
          // create unsigned transaction
          let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
            from:sender, 
            suggestedParams: params, 
            appIndex: index, 
            appArgs: appArgs1
          })                    
          
          
          let data = `#pragma version 5
          // deploy app first then get id
          // replace id in this teal to create
          // the escrow address
          // use goal app update to set the
          // escrow address
          // This contract only spends out
          // it two transactions are grouped
          gtxn 0 TypeEnum
          int 4
          ==
          bnz opt_in
  
          gtxn 0 TypeEnum
          int 6
          ==
          gtxn 0 ApplicationArgs 0
          byte "donate"
          ==
          &&
          bnz donate
                  gtxn 0 TypeEnum
                  int 6
                  ==
                  gtxn 0 ApplicationArgs 0
                  byte "claim"
                  ==
                  &&
                  bnz claim
  claim:
          global GroupSize
          int 2
          ==
          // The first transaction must be
          // an ApplicationCall (ie call stateful smart contract)
          gtxn 0 TypeEnum
          int 6
          ==
          &&
          // The specific App ID must be called
          // This should be changed after creation
          gtxn 0 ApplicationID
          int 66153856
          ==
          &&
          // The applicaiton call must either be
          // A general applicaiton call or a delete
          // call
          gtxn 0 OnCompletion
          int NoOp
          ==
          int DeleteApplication
          gtxn 0 OnCompletion
          ==
          ||
          &&
          // verify neither transaction
          // contains a rekey
  
          gtxn 1 RekeyTo
          global ZeroAddress
          ==
          &&
  
          gtxn 1 RekeyTo
          global ZeroAddress
          ==
          &&
          gtxn 0 RekeyTo
          global ZeroAddress
          ==
          &&
          bnz finish
          int 0
          return
          opt_in:
  global GroupSize
  int 2
  ==
  bz failed
  gtxn 0 TypeEnum
  int 6
  ==
  
  gtxn 0 ApplicationID
  int 66153856 //appID
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
          donate:
          global GroupSize
          int 4
          ==
          gtxn 0 TypeEnum
          int 6
          ==
          &&
          // The specific App ID must be called
          // This should be changed after creation
          gtxn 0 ApplicationID
          int 66153856
          ==
          &&
          // The applicaiton call must either be
          // A general applicaiton call or a delete
          // call
          gtxn 0 OnCompletion
          int NoOp
          ==
          int DeleteApplication
          gtxn 0 OnCompletion
          ==
          ||
          &&
          bnz finish
          int 0
          return
          failed:
          int 0
          return
          finish:
          int 1
          return`;
          
          
          
          let results = await algodClient.compile(data).do();
          //console.log("Hash = " + results.hash);
          //console.log("Result = " + results.result);
          
          let program = new Uint8Array(Buffer.from(results.result, "base64"));          
          let lsig = new algosdk.LogicSigAccount(program);
          //console.log("Escrow =", lsig.address());
          
          let transaction2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: lsig.address(), 
            amount: amount, 
             note: undefined,  
             suggestedParams: params
           });


          let sender_es = lsig.address();
          let receiver_es = localStorage.getItem("walletAddress");
          // let receiver = "<receiver-address>"";
          let amount_es = amount * 2;
          let closeToRemaninder = undefined;
          let note = undefined;
          let assetID = parseInt(elementID_global) ;
          let transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: sender_es, 
            to: receiver_es, 
            amount: amount_es, 
            assetIndex: assetID, 
            suggestedParams: params
          }); 

          let transaction4 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: lsig.address(), 
            amount: 1000, 
             note: undefined,  
             suggestedParams: params
           });
          
          const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4]);
          const txs = [ transaction1, transaction2, transaction3, transaction4];
          txs[0].group = groupID;
          txs[1].group = groupID;
          txs[2].group = groupID;
          txs[3].group = groupID;

          const signedTx1 = await myAlgoWallet.signTransaction([txs[0].toByte(), txs[1].toByte(), txs[3].toByte()]);
        //   const signedTx2 = await myAlgoWallet.signTransaction(txs[1].toByte());
          const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
        //   const signedTx4 = algosdk.signLogicSigTransaction(txs[3].toByte());

          toast.info("Transaction in Progress");
      const response = await algodClient.sendRawTransaction([signedTx1[0].blob, signedTx1[1].blob, signedTx3.blob, signedTx1[2].blob]).do();
      //console.log("TxID", JSON.stringify(response, null, 1));
      //API for Connect wallet  stored in /lpTracker
      await donateLaunchpad(localStorage.getItem("walletAddress"), amount);
      //API end
      await waitForConfirmation(algodClient, response.txId);
    //   toast.success(`Transaction Successfully completed with ${response.txId}`);
      toast.info(`Now you have obtained Element amount = ( ${(parseFloat(Pop_amount) * 2).toFixed(2)} ELEM )`);
        } catch (err) {
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

        // console.log("R value", r);

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
                            let dec = new Uint8Array(Buffer.from(creatorAddress_c, "base64"));
                            let addr = algosdk.encodeAddress(dec);
                            setCreator(addr);
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

useEffect(async() =>{await fetch()},[goal, startdt, enddt, total])

useEffect(async() => {
    await first()
}, [day, hour, min, sec, lock]);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

const first = async () => {

    var us= enddt;
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
        <>{a.key === "U3RhcnREYXRl" ? ((new Date(parseFloat(a.value['uint'])*1000)).toLocaleString()).slice(0,8) : ''}</>
    )
})

const mapStartTime = map1.map((a)=>{
    return(
        <>{a.key === "U3RhcnREYXRl" ? ((new Date(parseFloat(a.value['uint'])*1000)).toLocaleString()).slice(11,23) : ''}</>
    )
})

const mapEndDate = map1.map((a)=>{
    return(
        <>{a.key === "RW5kRGF0ZQ==" ? ((new Date(parseFloat(a.value['uint'])*1000)).toLocaleString()).slice(0,9) : ''}</>
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

let mapPercent = parseFloat((ReactDomServer.renderToString(mapTotal))/parseFloat(ReactDomServer.renderToString(mapGoal))*100).toFixed(4);

    return (
        
        <>
{/* <><ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/></> */}
                   <Modal show={showDonate} centered onHide={handleCloseDonate}>
                {/* <Modal.Header class="btn-close btn-close-white" closeButton /> */}
                <Modal.Body>
                    <Button className='modal-close' onClick={handleCloseDonate} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                    <div className="pb-4 px-3">
                  
                        <img src={SLogo} width="80" className="mx-auto mb-1 d-block" alt="icon" />
                        <h5 className="mb-1 text-center">Element</h5>
                        <p className="mb-4 pb-3 text-center"></p>

                        <Form className='form-area'>
                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <center><Form.Label><h3>Donate ETH</h3></Form.Label></center> <br/>
                            <Form.Control type="text" placeholder="Enter Amount" value={value} onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}/>
                        </Form.Group>
                            <Button variant="grad" size="lg" className='w-100' onClick={()=>Donate(value)}>
                                Donate
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
            <div className="post-card">
                <div className="post-card-image">
                    <img src={Image} alt="post img" />
                </div>

                <div className="post-card-title w-100 d-flex align-items-center">
                    <img src={SLogo} alt="icon" />
                    <div>
                        <h6 className='m-0'>Element</h6>
                        <span className='d-block'>ELEM</span>
                    </div>
                </div>

                <div className="post-card-body">
                    <div className="d-flex align-items-start justify-content-between">
                        <span>Total Raise</span>
                        <div className="h6 text-end">{mapGoal} ETH</div>
                    </div>
                    <div className="d-flex align-items-start justify-content-between">
                        <span>Starts On <br/> Ends On </span>
                        {/* <div className="h6 text-end">{mapStartDate} <small className='d-block'>≈</small></div> */}
                        <div className="h6 text-end">{mapStartDate} <br/> {mapEndDate}</div>
                    </div>
                </div>

                <div className="post-card-footer d-flex align-items-end justify-content-between">
                    <div>
                    <Button variant='grad' onClick={handleShow}>Participate</Button><br/><br/>
                    {/* {localStorage.getItem("walletAddress") === creator ? (<><Button variant='grad' onClick={handleAddress}>ADD ADDRESS</Button><br/><br/></>):(<></>)} */}
                        
                    
                    </div>
                    <div className="h6 text-end"> <Link to="/"><h6>Project Website</h6></Link> </div>
                    {/* <div className="h6 text-end text-uppercase">Official Announcement</div> */}
                </div>
            </div>
            
            <Modal
                show={show}
                size={'lg'}
                centered={true}
                onHide={handleClose}
                keyboard={false}
            ><><ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/></>

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
                            <img src={Logo}  width='15%' height='15%' alt="logo" />

                            <Button variant='grad' className='py-1' onClick={()=>AppOptIn()} style={{textTransform:"capitalize"}}>app opt-in</Button>

                            <span>(Opt-in only one time)</span>
                        </div>

                        <div className='d-flex ms-auto pt-2 flex-column align-items-end'>
                            <strong>Price</strong>
                            <div className="h5 mb-0">2 ELEM</div>
                            <strong>1 ETH</strong>
                        </div>
                    </div>

                    <div className="d-flex mb-20 flex-wrap align-items-start justify-content-between">
                        <div>
                            {/* <strong>Round</strong> */}
                            <div className="h5 mb-0 text-uppercase">Sale in Progress</div>
                        </div>
                        <div className='text-md-end'>
                            <strong>Time Left</strong>
                            <div className="h5 mb-0">{lock == true ? (<>{day}d:{hour}h:{min}m:{sec}s</>):(<>{0}d:{0}h:{0}m:{0}s</>)}</div>
                        </div>
                    </div>

                    <div className="mb-20">
                        <div className="d-flex justify-content-between">
                            <strong>Start</strong>
                            <strong>End</strong>
                        </div>
                        <ProgressBar now={mapPercent} />
                        <div className="d-flex justify-content-between">
                            <strong>{mapPercent}%</strong>
                            <strong>{mapTotal} / {mapGoal} ETH</strong>
                        </div>
                    </div>

                    <div className="mb-20 d-flex flex-column align-items-end">
                        <Button variant='grad' className='mb-20' onClick={()=>optinAsset() } style={{textTransform:"capitalize"}}>asset opt-in</Button>
                        <Button variant='grad' onClick={()=>handleShowDonate()} style={{textTransform:"capitalize"}}>donate</Button>
                    </div>

                    <div className="d-flex align-items-start justify-content-between">
                        <div className='d-flex flex-column'>
                            <strong>Goal Amount</strong>
                            <div className="h3 mb-0">{mapGoal}</div>
                            <strong>ETH</strong>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                            <strong>Total Raise now</strong>
                            <div className="h3 mb-0">{mapTotal}</div>
                            <strong>ETH</strong>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* <Modal
                show={address}
                size={'lg'}
                centered={true}
                onHide={handleCloseAddress}
                keyboard={false}
            >
                <Modal.Body className='p-md-5'>
                    <Button className='modal-close' onClick={handleCloseAddress} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="1">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                    {/* <Form className='form-area'>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Address" value={addrAddAddress} onChange={(e) => setValueAddrAddAddress(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Asset ID:</Form.Label>
                            <Form.Control type="text" placeholder="Enter Asset" />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Amount:</Form.Label>
                            <Form.Control type="text" placeholder="Enter Amount" value={valueAddAddress} onChange={(e) => setValueAddAddress(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}/>
                        </Form.Group>
                        <div className="text-end">
                            <Button variant="grad" onClick={() => addAddress(addrAddAddress, whiteID_global, valueAddAddress, appID_global)}>
                                Add Address
                            </Button>
                        </div>
                    </Form>
                    <p className='mt-md-5 mt-4 text-gray'>(Adding Address Function will be visible only to the App creator - Normal users can't access this function)</p>
                </Modal.Body>
            </Modal> */}
        </>
    );
};

export default PostCard;