import React, {useState, useEffect} from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import Layout from './Layout';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
// import Arrow from '../../assets/images/arrow-tr.svg';
// import FilterDropdown from '../Snippets/FilterDropdown';
import elemLogo from '../../assets/images/modal-square-logo.png';
import tauLogo from '../../assets/images/tau-original.png';
import einrLogo from '../../assets/images/EINR-original.png';

import ReactDomServer from 'react-dom/server';
import usdcLogo from '../../assets/images/usdc-logo.png';
import MyAlgoConnect from '@randlabs/myalgo-connect';


const algosdk = require('algosdk');
const myAlgoWallet = new MyAlgoConnect();
const Mint = () => {

    const [usdcAmount, setUsdcAmount ] = useState("");
    const [elemAmount, setElemAmount ] = useState("");
    const [tauAmount, setTauAmount ] = useState("");

    const [assets, setAssets] = useState("");

    const [usdcBalances, setUsdcBalances] = useState("");
    const [elemBalances, setElemBalances] = useState("");

    let appID_global = 74983783;
    let tauID = 71682000;
    let elemID = 71116238;
    let usdcID = 71311423;
    let elemReserve = "Z6AEFL237SLCYWEDPGPVP5SCKJ7MOQWIC6EMCTRLBAZPGSSRQQQV3GCXFQ";

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


const optInApp = async () => 
{
    if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
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
      await waitForConfirmation(algodClient, response.txId);
      toast.success(`Transaction Success ${response.txId}`);
  }
  catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      console.error(err);
  }
}
}

const optInAsset = async () => 
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
          assetIndex: parseInt(tauID)
      });
  
      const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
    toast.info("Transaction in Progress");
      const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
      await waitForConfirmation(algodClient, response.txId);
      toast.success(`Transaction Success ${response.txId}`);
  
  }
  catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      console.error(err);
  
  }
}
}


const mintTau = async () => 
{

    if (localStorage.getItem("walletAddress") === "")
        {
            toast.error("Connect your wallet");
        }
        else{
    try {
        // const accounts = await myAlgoWallet.connect();
        // const addresses = accounts.map(account => account.address);
        const params = await algodClient.getTransactionParams().do();
  
        let appArgs1 = [];
        appArgs1.push(new Uint8Array(Buffer.from("mint")));

        let transaction1 = algosdk.makeApplicationNoOpTxnFromObject({
          from:localStorage.getItem("walletAddress"), 
          suggestedParams: params, 
          appIndex: parseInt(appID_global), 
          appArgs: appArgs1
        })                    
        
        
        let data = `#pragma version 5

        gtxn 0 TypeEnum
        int 6
        ==
        gtxn 0 ApplicationArgs 0
        byte "escrowOptin"
        ==
        &&
        bnz opt_in
        
        gtxn 0 TypeEnum
        int 6
        ==
        gtxn 0 ApplicationArgs 0
        byte "mint"
        ==
        &&
        bnz mint
        
        gtxn 0 TypeEnum
        int 6
        ==
        gtxn 0 ApplicationArgs 0
        byte "redeem"
        ==
        &&
        bnz redeem
        
        b failed
        
        opt_in:
        global GroupSize
        int 2
        ==
        bz failed
        gtxn 0 TypeEnum
        int 6
        ==
        
        gtxn 0 ApplicationID
        int 74983783 //appID
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
        b finish
        
        mint:
        global GroupSize
        int 6
        ==
        gtxn 0 TypeEnum
        int 6
        ==
        &&
        
        gtxn 0 ApplicationID
        int 74983783
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
        
        gtxn 0 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 1 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 2 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 3 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 4 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 5 RekeyTo
        global ZeroAddress
        ==
        &&
        bnz finish
        b failed
        
        redeem:
        global GroupSize
        int 6
        ==
        gtxn 0 TypeEnum
        int 6
        ==
        &&
        
        gtxn 0 ApplicationID
        int 74983783
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
        
        gtxn 0 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 1 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 2 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 3 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 4 RekeyTo
        global ZeroAddress
        ==
        &&
        gtxn 5 RekeyTo
        global ZeroAddress
        ==
        &&
        bnz finish
        b failed
        
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
        console.log("Escrow =", lsig.address());
        
        let transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: localStorage.getItem("walletAddress"), 
            to: lsig.address(), 
            amount: parseFloat(usdcAmount).toFixed(6) * 1000000, 
            assetIndex: parseInt(usdcID), 
            suggestedParams: params
          });

        let elem25 = (parseFloat((parseFloat(elemAmount.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])/ 100) * 25)* 1000000); 
        // let floor2 = Math.floor(elem25);
        // console.log("25% floor =",floor2 * 1000000);
          console.log("25% =",elem25 * 1000000);
        let transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: localStorage.getItem("walletAddress"), 
            to: lsig.address(), 
            amount: parseInt(elem25), 
            assetIndex: parseInt(elemID), 
            suggestedParams: params
          }); 

          let elem75 = (parseFloat((parseFloat(elemAmount.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])/ 100) * 75)* 1000000).toFixed(0);
        //   let floor1 = Math.floor(parseFloat(elem75));
        //   console.log("75% floor =",floor1 * 1000000);
          console.log("75% =",elem75 * 1000000);
          let transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: localStorage.getItem("walletAddress"), 
            to: elemReserve, 
            amount: parseInt(elem75), 
            assetIndex: parseInt(elemID), 
            suggestedParams: params
          });

          let transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: lsig.address(), 
            to: localStorage.getItem("walletAddress"), 
            amount: parseFloat(tauAmount).toFixed(6) * 1000000, 
            assetIndex: parseInt(tauID), 
            suggestedParams: params
          });

        let transaction6 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: localStorage.getItem("walletAddress"), 
          to: lsig.address(), 
          amount: 1000, 
           note: undefined,  
           suggestedParams: params
         });
        
        const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4, transaction5, transaction6 ]);
        const txs = [ transaction1, transaction2, transaction3, transaction4, transaction5, transaction6 ];
        txs[0].group = groupID;
        txs[1].group = groupID;
        txs[2].group = groupID;
        txs[3].group = groupID;
        txs[4].group = groupID;
        txs[5].group = groupID;

        const signedTx1 = await myAlgoWallet.signTransaction([txs[0].toByte(), txs[1].toByte(), txs[2].toByte(), txs[3].toByte(), txs[5].toByte()]);
      //   const signedTx2 = await myAlgoWallet.signTransaction(txs[1].toByte());
        const signedTxEscrow = algosdk.signLogicSigTransaction(txs[4], lsig);
      //   const signedTx4 = algosdk.signLogicSigTransaction(txs[3].toByte());

        toast.info("Transaction in Progress");
    const response = await algodClient.sendRawTransaction([signedTx1[0].blob, signedTx1[1].blob, signedTx1[2].blob, signedTx1[3].blob, signedTxEscrow.blob, signedTx1[4].blob]).do();
    //console.log("TxID", JSON.stringify(response, null, 1));
    await waitForConfirmation(algodClient, response.txId);
    // toast.success(`Transaction Successfully completed with ${response.txId}`);
      } catch (err) {
        toast.error(`Transaction Failed due to ${err}`);
        console.error(err);
      }
    }
}
const print = () => {
    console.log("usdc =", usdcAmount);
    console.log("elem =", elemAmount);
    console.log("tau =", tauAmount);
}

useEffect(() => {
    balAsset();
}, [assets, usdcBalances, elemBalances]);

const balAsset = async () =>
{
let bal = await algodClient.accountInformation(localStorage.getItem("walletAddress")).do();
// console.log(bal['assets']);
let l = bal['assets']['length']
// console.log(l);
for(let i = 0; i < l; i++)
{
    if(bal['assets'][i]['asset-id'] === 71311423)
    {
        setUsdcBalances(bal['assets'][i]['amount']);
        break;
    }
}
for(let j = 0; j < l; j++)
{
    if(bal['assets'][j]['asset-id'] === 71116238)
    {
        setElemBalances(bal['assets'][j]['amount']);
        break;
    }
}

// setAssets(bal['assets']);
}

const amountSet = (value)=>{
    setUsdcAmount(value);
    setElemAmount((parseFloat(value).toString().match(/^-?\d+(?:\.\d{0,6})?/)[0] / 3));
    setTauAmount(parseFloat(value).toFixed(6) * 2)
    // console.log(value);
}

const check = () => {
    var with2Decimals = elemAmount.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0];
    console.log(with2Decimals);
}

    return (
        <Layout>
              <><ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/></>
            <Container fluid="lg">

                <Row className='mb-40'>
              
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>TAU PRICE 
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        From Chainlink
                                    </Tooltip>
                                }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </OverlayTrigger>
                            </span>
                            <strong>$1.0000</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>COLLATERAL RATIO</span>
                            <strong>84.50%</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>POOL BALANCE</span>
                            <strong>36.906M</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>AVAILABLE TO MINT</span>
                            <strong>38.094M</strong>
                        </div>
                    </Col>
                </Row>

                
                <Row>
                    <Col md={4} className="mb-4">
                        <div className="card-graph h-100 p-4">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>MINT</p>
                                    {/* <h6><strong>Choose normal if you already have USDC and ELEM.</strong></h6> */}
                                </div>
                            </div>

                            <div className="card-graph-body pb-4 m-0">
                                <h6 className='mb-3'>COLLATERAL POOL</h6>
                                <button className='btn m-2 px-sm-6 btn-grad' onClick={()=>optInApp()} style={{textTransform:"capitalize"}}>App Opt-In</button>
                                {/* <div className="btn-filter-full">
                                    <FilterDropdown />
                                </div> */}

                                <hr className='my-4' />

                                <h6 className='mb-3'>USDC</h6>
                                <Row className='align-items-center'>
                                    <Col xs={7} md={8}>
                                        <input type="text" placeholder="Amount" className="form-control form-control-reset" value={usdcAmount} onChange={(e) => amountSet(e.target.value)} />
                                        {/* <button onClick={()=>check()}>print</button> */}
                                    </Col>
                                    <Col xs={5} md={4}>
                                        <p className='text-white'>{(parseFloat(usdcBalances)/1000000).toFixed(2) === 'NaN' ? <>{0}</> : (parseFloat(usdcBalances)/1000000).toFixed(2)} USDC Available</p>
                                    </Col>
                                </Row>
                                <hr className='my-4' />

                                <h6 className='mb-3'>ELEM</h6>
                                <Row className='align-items-center'>
                                    <Col xs={7} md={8}>
                                        <input type="text" placeholder="Amount" className="form-control form-control-reset" value={(parseFloat(usdcAmount).toFixed(6) / 3).toFixed(6) === 'NaN' ? 0 : (parseFloat(elemAmount.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0]))} />
                                    </Col>
                                    <Col xs={5} md={4}>
                                        <p className='text-white'>{(parseFloat(elemBalances)/1000000).toFixed(2) === 'NaN' ? <>{0}</> : (parseFloat(elemBalances)/1000000).toFixed(2)} ELEM Available</p>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>

                    <Col md={4} className="mb-4">
                        <div className="card-graph h-100 p-4">
                            <div className="card-graph-header mb-4 d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>EXCHANGE RATES</p>
                                </div>
                            </div>

                            <div className="card-graph-body pb-4 m-0">
                                <div className="mb-5">
                                    <div className="token-list-item token-list-item-nohover px-0">
                                        <div className="token-list-icon">
                                            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                            </svg> */}
                                            <img src={usdcLogo} />
                                        </div>
                                        <div className="token-list-title">
                                            <span>USDC:</span><h6>$1.00</h6>                                        
                                        </div>
                                    </div>
                                    <div className="token-list-item token-list-item-nohover px-0">
                                        <div className="token-list-icon">
                                            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                            </svg> */}
                                            <img src={elemLogo} />
                                        </div>
                                        <div className="token-list-title">
                                            <span>ELEM:</span><h6>$3.00</h6>                                        
                                        </div>
                                    </div>
                                    <div className="token-list-item token-list-item-nohover px-0">
                                        <div className="token-list-icon">
                                            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                            </svg> */}
                                            <img src={einrLogo} />
                                        </div>
                                        <div className="token-list-title">
                                            <span>EINR:</span><h6>$0.013</h6>                                        
                                        </div>
                                    </div>
                                </div>
                                <p className='text-center'>
                                0.0000% <strong>MINTING FEE</strong> <br /> <span className='text-green'>(0.00000 TAU)</span>
                                </p>
                                {/* <p className='text-center'>Pool (V3) 🌊 : 0x2fE0 ... 0729</p> */}
                            </div>
                        </div>
                    </Col>

                    <Col md={4} className="mb-4">
                        <div className="card-graph h-100 p-4">    
                            <div className="card-graph-header mb-3 d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>YOU RECEIVE</p>
                                </div>
                            </div>

                            <div className="card-graph-body pb-4 m-0">
                                <div className="token-list-item token-list-item-nohover px-0">
                                    <div className="token-list-icon">
                                        {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                            <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        <img src={tauLogo} />
                                    </div>
                                    <div className="token-list-title flex-grow-1">
                                        <input type="number" placeholder="-" className="form-control text-center form-control-reset" value={parseFloat(usdcAmount).toFixed(6) * 2}  />                  
                                    </div>
                                </div>

                                <center>            
                            <button className='btn m-2 px-sm-6 btn-grad' onClick={()=>optInAsset()} style={{textTransform:"capitalize"}}>Opt-In TAU</button>
                            <button className='btn m-2 px-sm-6 btn-grad' onClick={()=>mintTau()} style={{textTransform:"capitalize"}}>Mint TAU</button>
                            </center>
                            <br/>
                            <center><p>(OR)</p></center>
                            <br/>
                            <p>Upcoming EINR</p>
                                <div className="token-list-item token-list-item-nohover px-0">
                                    <div className="token-list-icon">
                                        
                                        {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                            <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg> */}
                                        <img src={einrLogo} />
                                    </div>
                                    <div className="token-list-title flex-grow-1">
                                        <input type="number" placeholder="-" className="form-control text-center form-control-reset" value={0.00}  />                  
                                    </div>
                                </div>

                                <center>            
                            <button disabled className='btn m-2 px-sm-6 btn-grad' style={{textTransform:"capitalize"}}>Opt-In EINR</button>
                            <button disabled className='btn m-2 px-sm-6 btn-grad' style={{textTransform:"capitalize"}}>Mint EINR</button>
                            </center>   
                            </div>
                            

                            
                        </div>
                    </Col>
                </Row>
                

            </Container>
        </Layout>
    );
};

export default Mint;