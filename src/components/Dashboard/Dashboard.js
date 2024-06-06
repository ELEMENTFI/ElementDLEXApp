import React, {useState, useEffect} from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import Arrow from '../../assets/images/arrow-tr.svg';
import TotalValueDepositedChart from './Snippets/TotalValueDepositedChart';
import MarketValueTreasuryAssets from './Snippets/MarketValueTreasuryAssets';
import RiskFreeValueTreasuryAsset from './Snippets/RiskFreeValueTreasuryAsset';
import SLPTreasury from './Snippets/SLPTreasury';
import TAUStaked from './Snippets/TAUStaked';
import RunwayAvailable from './Snippets/RunwayAvailable';
const algosdk = require('algosdk');
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

let appID_global = 71117404;
const Dashboard = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });

const [totalSupply, setTotalSupply] = useState("");
const [cirSupply, setCirSupply] = useState("");
const [treasuryBalance, setTreasuryBalance] = useState("");
const [bondBalance, setBondBalance] = useState("");
const [stakeBalance, setStakeBalance] = useState("");
const [reserveBalance, setReserveBalance] = useState("");





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



    useEffect(async() => {
        await assetSupply()
    }, [totalSupply, cirSupply]);  

const assetSupply = async () => {
    let asset = await algodClient.getAssetByID(parseInt(71116238)).do();
    // console.log(asset['params']['total']);
    let totalSupply = parseFloat(asset['params']['total']) / 1000000;
    setTotalSupply(totalSupply);
    let accountInfoResponse2 = await algodClient.accountInformation("Z6AEFL237SLCYWEDPGPVP5SCKJ7MOQWIC6EMCTRLBAZPGSSRQQQV3GCXFQ").do();
    // console.log(accountInfoResponse2['assets'][0]['amount']);
    let reserveSupply = parseFloat(accountInfoResponse2['assets'][0]['amount'])/1000000;
    let circulatingSupply = parseFloat(parseFloat(totalSupply) - parseFloat(reserveSupply)).toFixed(6);
    setCirSupply(circulatingSupply);
}

useEffect(async() => {
    await TreasuryBalance()
}, [treasuryBalance]);        

const TreasuryBalance = async () =>{
let balance = await algodClient.accountInformation("6ZJG2JCG2CAU7WAHEU5ZMFWIZGVNT65XZYVAOK4G7YHNHOCWBNXJTNCTYU").do();
// console.log(balance['assets'][0]['amount']);
setTreasuryBalance(parseFloat(balance['assets'][0]['amount'])/1000000);
}

useEffect(async() => {
    await BondBalance()
}, [bondBalance]);        

const BondBalance = async () =>{
let balance = await algodClient.accountInformation("GYU4CDG3YIPQB4375A5MRNAJK5WCG6WEWBV4S44W5XMWUYRU3FEIWFY3N4").do();
// console.log(balance['assets'][0]['amount']);
setBondBalance(parseFloat(balance['assets'][0]['amount'])/1000000);
}

useEffect(async() => {
    await StakeBalance()
}, [stakeBalance]);        

const StakeBalance = async () =>{
let balance = await algodClient.accountInformation("QSVJYDZSCVCCDS2NGIMLCLHDUGL6TRTXHEPH4BQZP6MBBNLWCOM5TRJGEM").do();
// console.log(balance['assets'][0]['amount']);
setStakeBalance(parseFloat(balance['assets'][0]['amount'])/1000000);
}

useEffect(async() => {
    await ReserveBalance()
}, [reserveBalance]);        

const ReserveBalance = async () =>{
let balance = await algodClient.accountInformation("Z6AEFL237SLCYWEDPGPVP5SCKJ7MOQWIC6EMCTRLBAZPGSSRQQQV3GCXFQ").do();
// console.log(balance['assets'][0]['amount']);
setReserveBalance(parseFloat(balance['assets'][0]['amount'])/1000000);
}


    return (
        <Layout>
            <Container fluid="lg">
                <Row>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Market Cap</span>
                            <strong>$1,953,403,446</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>TAU Price</span>
                            <strong>$1</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Fiduciary Treasury 
                            {/* <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        annualized
                                    </Tooltip>
                                }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </OverlayTrigger> */}
                            </span>
                            <strong>$1,953,403,446</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM PRICE</span>
                            <strong>$3.00</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Circulating ELEM</span>
                            <strong>{parseFloat(cirSupply).toFixed(2)}</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Total ELEM</span>
                            <strong>{totalSupply}</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Current Index
                            {/* <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        annualized
                                    </Tooltip>
                                }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </OverlayTrigger> */}
                            </span>
                            <strong>{localStorage.getItem("rebaseCountStake")}</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM MARKET CAP</span>
                            <strong>$1,953,403,446</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM Treasury</span>
                            <strong>{parseFloat(treasuryBalance).toFixed(2)}</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM Bond balance</span>
                            <strong>{parseFloat(bondBalance).toFixed(2)}</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM Stake reward</span>
                            <strong>{parseFloat(stakeBalance).toFixed(2)}</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM Reserve</span>
                            <strong>{parseFloat(reserveBalance).toFixed(2)}</strong>
                        </div>
                    </Col>
                </Row>

                {/* <div className="note mb-40 d-flex justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <p>TAU is currently migrating to improved contracts. Please note that during this time, frontend metrics may be inaccurate.</p>
                </div> */}

                <Row>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Total Value Deposited 
                                    {/* <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Total Value Deposited
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger> */}
                                    </p>
                                    <h6><strong>$1,703,470,900</strong> Today</h6>
                                </div>
                                <Link to="#"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <TotalValueDepositedChart />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Market Value of Treasury Assets 
                                    {/* <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Market Value of Treasury Assets
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger> */}
                                    </p>
                                    <h6><strong>$560,925,646</strong> Today</h6>
                                </div>
                                <Link to="#"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <MarketValueTreasuryAssets />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Risk Free Value of Treasury Asset 
                                    {/* <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Risk Free Value of Treasury Asset
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger> */}
                                    </p>
                                    <h6><strong>$215,380,370</strong> Today</h6>
                                </div>
                                <Link to="#"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <RiskFreeValueTreasuryAsset />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Protocol Owned Liquidity TAU-USDC 
                                    {/* <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Protocol Owned Liquidity TAU-USDC
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger> */}
                                    </p>
                                    <h6><strong>99.99%</strong> Today</h6>
                                </div>
                                <Link to="#"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <SLPTreasury />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>TAU Staked 
                                    {/* <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                TAU Staked
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger> */}
                                    </p>
                                    <h6><strong>88.95%</strong> Today</h6>
                                </div>
                                <Link to="#"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <TAUStaked />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Runway Available 
                                    {/* <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Runway Available
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger> */}
                                    </p>
                                    <h6><strong>357.9 Days</strong></h6>
                                </div>
                                <Link to="#"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <RunwayAvailable />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Dashboard;