import React, { Component, useState, useEffect, useRef } from 'react';
import { Col, Container, Row, Form, InputGroup, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
import { Link, useHistory } from "react-router-dom";
import Icon1 from '../assets/images/icon1.png';
import Icon2 from '../assets/images/icon2.png';
import elementLogo from '../assets/images/favicon.ico';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import "./toast-style-override.css"
import MyAlgoConnect from '@randlabs/myalgo-connect';
import configfile from "../stakingconfig.json";
const algosdk = require('algosdk');
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const myAlgoConnect = new MyAlgoConnect();


function StakePage() {
    const [show, setShow] = React.useState(false);

    const handle = () => setShow(!show);


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


    useEffect(() => {
        const fetchPosts = async () => {
             // read local state of application from user account

      let accountInfoResponse = await algodClient.accountInformation(localStorage.getItem("walletAddress")).do();
      let appById = await algodClient.getApplicationByID(parseInt(configfile.applicationid)).do();
      console.log("globalappid",appById);
     
        console.log("Application's global state:");
       
           console.log("Application's global state:1",appById['params']['global-state']);
           console.log("Application's :1",appById['params']['global-state'][0]['key']);
           console.log("globaltime",appById['params']['global-state'][0]['value']['uint']);
          
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
                console.log("globaltime",globaltime);
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
              

           
           
       
    
       
    
    
      console.log("accinfolocal",accountInfoResponse);
      if( accountInfoResponse['apps-local-state'].length === null|| accountInfoResponse['apps-local-state'].length ===undefined||accountInfoResponse['apps-local-state'].length===""){
        alert("check");
     }
    else{
    
    
      console.log("User",accountInfoResponse['apps-local-state'].length);
      for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
          if (accountInfoResponse['apps-local-state'][i].id == parseInt(configfile.applicationid)) {
              console.log("User's local state:",accountInfoResponse['apps-local-state'][i].id);
              let acccheck= accountInfoResponse['apps-local-state'][i][`key-value`]; 
              console.log("Usercheck",acccheck);
              console.log("User",accountInfoResponse['apps-local-state'][i][`key-value`]);
            
              if(accountInfoResponse['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse['apps-local-state'][i][`key-value`]===""){
                alert("check");
             }
            else{
    for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
                  console.log(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                  //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
                  
                  let rewardkey =accountInfoResponse['apps-local-state'][i]['key-value'][n];
                 if(rewardkey['key'] === "VUE="){
                   stakedbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                   setStakedBalance(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                 }
                if(rewardkey['key'] === "VVNT"){
                  rewardbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                  console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  setrewardBalance(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                }
                if(rewardkey['key'] === "VVQ="){
                  usertimenew = accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
                  console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  setusertime(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                  console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
                }
                  
              }
    
            }
    
              
          }
      }
    }
      for(let i = 0; i < accountInfoResponse['assets'].length; i++){
        console.log("accountsasset", accountInfoResponse['assets']);
         if (accountInfoResponse['assets'][i]['asset-id'] == parseInt(configfile.assetid)) {
          setBalance(accountInfoResponse['assets'][i]['amount']);
          console.log("accountsassetnew", accountInfoResponse['assets'][i]['amount']);
    
         }
      }
    
    
      
      console.log("sub",globaltimenew);
      console.log("sub_div",usertimenew);
      console.log("mul1",stakedbalancenew);
      console.log("add_div",rewardbalancenew);
      console.log("mul2",gloablstakenew);
      // console.log("rewardCal",rewardCal);
      let sub = parseInt(globaltimenew) - parseInt(usertimenew);
        console.log("checksub",sub);
      let sub_div = parseFloat(sub) / 60;
      
      let mul1 = parseFloat(sub_div) * parseFloat(stakedbalancenew);
      
      let add = parseFloat(rewardbalancenew) + parseFloat(mul1);
      
      let add_div =  parseFloat(add) / parseFloat(gloablstakenew);
      
      let mul2 = parseFloat(add_div) * parseFloat(totalsulnew);
      
      let rewardCal1 = parseFloat(mul2) / 1000000;
      let rewardCal = rewardCal1.toFixed(6);
      console.log("rewardamountcalculation",rewardCal);
      //let rewardcalculation =parseFloat((parseFloat(rewardamountbalance)+(parseFloat((globaltime)-parseFloat(usertime))/60)*parseFloat(stakedbalance)/parseFloat(globalstake))*parseFloat(totalsul)/parseFloat(1000000));
      setrewardcalculation(rewardCal);
    
    
      
        
        };
        
    
        fetchPosts();
      }, []);

    //for totalstakeed and reward 
    useEffect(() => {
        const fetchPosts = async () => {
       
      //let applicationid = 53433787;
      const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
      let accountInfoResponse1 = await client.accountInformation(configfile.creatoraddress).do();
    
    for (let i = 0; i < accountInfoResponse1['created-apps'].length; i++) { 
       console.log("Application's global state:");
      if (accountInfoResponse1['created-apps'][i].id == parseInt(configfile.applicationid)) {
          console.log("Application's global state:");
          for (let n = 0; n < accountInfoResponse1['created-apps'][i]['params']['global-state'].length; n++) {
              console.log(accountInfoResponse1['created-apps'][i]['params']['global-state'][n]);
              let enc = accountInfoResponse1['created-apps'][i]['params']['global-state'][n];
              console.log("encode",enc);
              var decodedString = window.atob(enc.key);
              if(enc['key'] === "R0E="){
                setTotalStake( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
                console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
              }
              if(enc['key'] === "VFNVTEM="){
                setTotalreward( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
                console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
              }
              if(enc['key'] === "VFNM"){
                setTotalrewardallocated( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
                console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
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
  console.log("accinfolocalprice",accountInfoResponse2);
  if( accountInfoResponse2['apps-local-state'].length === null|| accountInfoResponse2['apps-local-state'].length ===undefined||accountInfoResponse2['apps-local-state'].length===""){
    alert("checkprice");
 }else{
  console.log("priceconsole",accountInfoResponse2['apps-local-state'].length);
  for (let i = 0; i < accountInfoResponse2['apps-local-state'].length; i++) { 
    if (accountInfoResponse2['apps-local-state'][i].id == parseInt(configfile.priceappid)) {
        console.log("User's local stateprice:",accountInfoResponse2['apps-local-state'][i].id);
        let acccheck= accountInfoResponse2['apps-local-state'][i][`key-value`]; 
        console.log("Usercheckfor price",acccheck);
        console.log("Userforprice",accountInfoResponse2['apps-local-state'][i][`key-value`]);
      
        if(accountInfoResponse2['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse2['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse2['apps-local-state'][i][`key-value`]===""){
          alert("check");
       }
      else{
for (let n = 0; n < accountInfoResponse2['apps-local-state'][i][`key-value`].length; n++) {
            console.log(accountInfoResponse2['apps-local-state'][i][`key-value`][n]);
            //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
            
            let rewardkey =accountInfoResponse2['apps-local-state'][i]['key-value'][n];
           if(rewardkey['key'] === "czE="){
            slpricenew=accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint'];
            console.log("s1pricenew",accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
             setS1(accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
           }
          if(rewardkey['key'] === "czI="){
            s2pricenew=accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint'];
            console.log("s2pricenew",accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
            setS2(accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
          
          }
          
            
        }

      }

        
    }
}


 }
 let pricecal;
 pricecal=parseInt((slpricenew)/(s2pricenew));
 console.log("pricecalculated",pricecal);
 setprice(pricecal);
    
    };
    

    fetchPosts();
  }, []); 





    return (
        <Layout>
            <><ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/></>
            <div className="page-content">
                <Container fluid="lg">
                    <Row>
                        <Col lg={4} xl={3} className='mb-lg-0 mb-4'>
                            <div className="card-base card-dark card-left">
                                <h2 className="h3 mb-20 font-semi-bold">Stake</h2>
                                <h5 className='text-gray text-normal mb-30'>Stake ELEM to earn tokens as rewards.</h5>

                                <h6 className='text-gray-D2'>Total Value Locked (TVL)</h6>
                                <h5 className='mb-30'>{parseInt(totalstake/1000000)} ELEM</h5>

                                <h6 className='text-gray-D2'>ELEM Price</h6>
                                <h5 className='mb-30'>{price} ELEM</h5>

                                <h6 className='text-gray-D2'>My Holdings</h6>
                                <h5 className='mb-0'>{balance/1000000} ELEM</h5>
                            </div>
                        </Col>
                        <Col lg={8} xl={9}>
                            <div className="d-flex filter-responsive flex-wrap mb-3 align-items-center justify-content-xl-between justify-content-center">
                                <ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                                    <li><a href="/stake" className='active'>All staking pools</a></li>
                                    <li><a href="#">Inactive farms</a></li>
                                </ul>
                                
                                <Form>
                                    <InputGroup className="input-group-search">
                                        <Form.Control placeholder="Search by name, symbol or address" />
                                        <Button variant="reset">
                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.0693 2.06396C16.0373 2.06396 20.0693 6.09596 20.0693 11.064C20.0693 16.032 16.0373 20.064 11.0693 20.064C6.10134 20.064 2.06934 16.032 2.06934 11.064C2.06934 6.09596 6.10134 2.06396 11.0693 2.06396ZM11.0693 18.064C14.9363 18.064 18.0693 14.931 18.0693 11.064C18.0693 7.19596 14.9363 4.06396 11.0693 4.06396C7.20134 4.06396 4.06934 7.19596 4.06934 11.064C4.06934 14.931 7.20134 18.064 11.0693 18.064ZM19.5543 18.135L22.3833 20.963L20.9683 22.378L18.1403 19.549L19.5543 18.135Z" fill="white"/>
                                            </svg>
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </div>

                            {!show ? (
                                <>
                                    <div className="table-group-outer">
                                        <div className="table-group-head">
                                            <div className="table-group-tr">
                                                <div className="table-group-th">Stake</div>
                                                <div className="table-group-th">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                            TVL
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="table-group-th">Earn</div>
                                                <div className="table-group-th text-end">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                            APR
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-group-body">
                                        <Link to="stakebox">
                                            <div className="table-group-tr">

                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={elementLogo} alt='icon' />
                                                        {/* <img src={elementLogo} alt='icon' /> */}
                                                        <span style={{color:"white"}}>ELEM</span>
                                                    </div>
                                                </div>
                                          
                                                <div className="table-group-td" style={{color:"white"}}>{totalstake/1000000}</div>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={elementLogo} alt='icon' />
                                                        {/* <img src={elementLogo} alt='icon' /> */}
                                                        {/* <span>651.30	ELEM / DAY</span> */}
                                                        <span style={{color:"white"}}>ELEM / DAY</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-end">
                                                    <p>253% 
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                annualized
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <p>annualized</p>
                                                    
                                                </div>
                                              
                                            </div>
                                            </Link>
                                            {/* <div className="table-group-tr" onClick={handle}>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>frax / rome</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td">$60,419.94</div>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>651.30	element / day</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-end">
                                                    <p>253% 
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                annualized
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <p>annualized</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr" onClick={handle}>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>frax / rome</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td">$60,419.94</div>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>651.30	element / day</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-end">
                                                    <p>253% 
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                annualized
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <p>annualized</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr" onClick={handle}>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>frax / rome</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td">$60,419.94</div>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>651.30	element / day</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-end">
                                                    <p>253% 
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                annualized
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <p>annualized</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr" onClick={handle}>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>frax / rome</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td">$60,419.94</div>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>651.30	element / day</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-end">
                                                    <p>253% 
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                annualized
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <p>annualized</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr" onClick={handle}>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>frax / rome</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td">$60,419.94</div>
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                        <span>651.30	element / day</span>
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-end">
                                                    <p>253% 
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                annualized
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <p>annualized</p>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                            
                                    <div className="pagination-footer d-flex align-items-center justify-content-between">
                                        <p>showing 1-5 from 150</p>

                                        <div className="d-flex align-items-center">
                                            <Button variant='arrow'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                            </Button>
                                            <Button variant='arrow'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="stack-container">
                                    <Row>
                                        <Col md={6}>
                                            <h5 className='d-flex mb-10 align-items-center'>
                                                <svg width="40" height="42" className='me-3' viewBox="0 0 40 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="40" height="42" rx="20" fill="#FACB84"/>
                                                    
                                                </svg>
                                                Stake ELEM
                                            </h5>

                                            <div className="mb-3">
                                                <label className='d-flex align-items-center justify-content-between'><small>Balance: {balance/1000000}</small></label>
                                                <div className="balance-card d-flex align-items-center justify-content-between">
                                                    <input type='text' id="tid1" className='me-3 form-control flex-grow-1 p-0 border-0 text-white' />
                                                    
                                                    <strong>ELEM</strong>
                                                </div>
                                            </div>
                                            <Row className='gx-2 mb-5'>
                                                <Col sm="4" className='py-sm-0 py-1'>
                                                    <Button variant='default' className='px-2 py-2 w-100 text-uppercase'>Asset optin</Button>
                                                </Col>
                                                <Col sm="4" className='py-sm-0 py-1'>
                                                    <Button variant='default' className='px-2 py-2 w-100 text-uppercase' >app optin</Button>
                                                </Col>
                                                <Col sm="4" className='py-sm-0 py-1'>
                                                    <Button variant='default' className='px-2 py-2 w-100 text-uppercase' >stake ELEM</Button>
                                                </Col>
                                            </Row>

                                            <h5 className='d-flex mb-10 align-items-center'>
                                                <svg width="40" height="40" className='me-3' viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="39.8942" height="40" rx="19.9471" transform="matrix(-1 0 0 1 40 0)" fill="white"/>
                                                    <path d="M16.9993 20.0377L13.2681 23.7688L16.9993 27.5L18.0651 26.4342L16.1535 24.5219L26.0822 24.5226V23.0151H16.1535L18.0651 21.1035L16.9993 20.0377ZM23.1048 12.5L22.039 13.5658L23.9505 15.4774H14.0219V16.9849H23.9505L22.039 18.8965L23.1048 19.9623L26.8359 16.2312L23.1048 12.5Z" fill="black"/>
                                                </svg>
                                                Withdraw ELEM
                                            </h5>

                                            <div className="mb-3">
                                                <label className='d-flex align-items-center justify-content-between'><small>Balance: {stakedbalance/1000000}</small></label>
                                                <div className="balance-card d-flex align-items-center justify-content-between">
                                                    <input type='text' id="tid2" className='me-3 form-control flex-grow-1 p-0 border-0 text-white' />
                                                    
                                                    <strong>ELEM</strong>
                                                </div>
                                            </div>

                                            <Button variant='grad' className='w-100'>Withdraw</Button>
                                        </Col>

                                        <Col md={6} className='mt-md-0 mt-4'>
                                            <div className="balance-card py-md-4 d-flex mb-3 align-items-center justify-content-between">
                                                <div className='h7 ms-1 py-3 d-flex align-items-center'>Current APY
                                                <div className="ms-2">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                Current APY
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#969696" class="bi d-block bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                </div>
                                                </div>
                                                <strong>500.46%</strong>
                                            </div>
                                            <div className="balance-card py-md-4 d-flex mb-3 align-items-center justify-content-between">
                                                <div className='h7 ms-1 py-3 d-flex align-items-center'>My Staked ELEM 
                                                <div className="ms-2">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                My Staked ELEM
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#969696" class="bi d-block bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                </div>
                                                </div>
                                                <strong>{stakedbalance/1000000} <small className='h7 ms-2'>ELEM</small></strong>
                                            </div>
                                            <div className="balance-card py-md-4 d-flex mb-3 align-items-center justify-content-between">
                                                <div className='h7 ms-1 py-3 d-flex align-items-center'>My Earned ELEM 
                                                <div className="ms-2">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                My Earned ELEM
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#969696" class="bi d-block bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                </div>
                                                </div>
                                                <strong> <small className='h7 ms-2'>ELEM</small></strong>
                                            </div>
                                            <div className="balance-card py-md-4 d-flex mb-3 align-items-center justify-content-between">
                                                <div className='h7 ms-1 py-3 d-flex align-items-center'>ELEM Rewards 
                                                <div className="ms-2">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip id={`tooltip-top`}>
                                                                ELEM Rewards
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#969696" class="bi d-block bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                            </svg>
                                                        </OverlayTrigger>
                                                </div>
                                                </div>
                                                <Button variant='grad'>Claim reward</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}

export default StakePage;