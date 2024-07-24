import React, { Component, useState, useEffect, useRef } from 'react';
import { Col, Container, Row, Form, InputGroup, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
import {
    Link
  } from "react-router-dom";

// import Icon1 from '../assets/images/icon1.png';
// import Icon2 from '../assets/images/icon2.png';
import Icon1 from '../assets/images/L logo.png';
// import Icon2 from '../assets/images/Ethereum-icon.svg';
import Icon2 from '../assets/images/P logo.png';
import Icon4 from '../assets/images/element logo.png';
import Icon3 from '../assets/images/tau-original.png';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import configfile from "../stakingconfig.json";
import configfiletau from "../stakingFarmTauconfig.json";

import configfileelemalgo from "../stakingelemalgoconfig.json";

import {farmtvlelemalgopair} from "./ElemAlgoFarmStaking.js";
import {farmtvlelem} from "./ElemFarmStaking ";
import {farmtvltau} from "./TAUFarmStaking ";
import {Rewardelemalgopair} from "./REWARDELEMALGO.js";
import {Rewardelem} from "./REWARDELEM";
import {Rewardtau} from "./REWARDTAU";

import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { LPStakeAddress, LPStakeABI, PancakePairV2ABI, ERC20ABI, cftokenAddress, cftokenAbi } from '../abi.js';

const algosdk = require('algosdk');
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const myAlgoConnect = new MyAlgoConnect();

function FarmPage() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://bsc-testnet-rpc.publicnode.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    const LPpairAddress = "0x0F56aBFb18b8Ad36334e553b8D04da8CFa95CcDd";//"0x5C43a8Cc6e4E6c43257a8a2C327eDDC2bc26C1B8";
    // const elemAddress = "0x43E8d4d7d6f79A8DE0B37aa261184Dfb5a0A410B"; 

    //window.location.reload();
   // const configfile =localStorage.getItem("ASSETFARM") === "elem"?require("../stakingconfig.json"):localStorage.getItem("ASSETFARM") === "elemalgo"?  require("../stakingelemalgoconfig.json"):require("../stakingconfigTau.json");
    const[allfarm,setAllfarm]=useState(true);
    const[singlefarm,setSinglefarm]=useState(false);
    const[lpfarm,setlpfarm]=useState(false);
    const[totalstake,setTotalStake]=useState("");
    const[balance,setBalance] = useState([]);
    const[globaltime,setGlobalTime] = useState('');
    const[stakedbalance,setStakedBalance] = useState([]);
    const[usertime,setusertime] = useState('');
    const[rewardcalc,setrewardcalculation]=useState('');
    const[rewardamountbalance,setrewardBalance] = useState([]);
    const[globalstake,setGlobalStake] = useState('');
    const[totalsul,settotalsul] = useState('');
    const[totalslatelock,settotalslatelock] = useState('');
    const[price,setprice]=useState("");
    const[prices1,setS1]=useState("");
    const[prices2,setS2]=useState("");
    const[totalreward,setTotalreward]=useState("");
    const[totalrewardallocatedelem,setTotalrewardallocatedelem]=useState("");
    const[totalrewardallocatedtau,setTotalrewardallocatedtau]=useState("");
    const[totalrewardallocatedelemalgo,setTotalrewardallocatedelemalgo]=useState("");
    const[totalstakeelemalgo,setTotalStakeelemalgo]=useState("");
    const[totalstaketau,setTotalStaketau]=useState("");
    const[totalvaluelockedoverall,setOverallTVL]=useState([]);

    const[stakeAmount, setStakeAmount] = useState("");
    const[unstakeAmount, setUnstakeAmount] = useState("");
    const[allowance, setAllowance] = useState("");
    const[totalStaked, settotalStaked] = useState("");
    const[userStaked, setUserStaked] = useState("");
    const[totalReward, setTotalReward] = useState("");
    const[userReward, setUserReward] = useState("");
    const[lpbal, setlpbal] = useState("");
    const[elembal, setelembal] = useState("");

    //const[displaying,setDisplaying]=usestate([]);    
    //let totalstakeelemalgo="";
 const allfarmfunction = async() => {
         setAllfarm(true);
         setSinglefarm(false);
         setlpfarm(false);
    }
    const singlefarmfunction = async() => {
        setAllfarm(false);
        setSinglefarm(true);
        setlpfarm(false);
   }
   const lpfarmfunction = async() => {
    setAllfarm(false);
    setSinglefarm(false);
    setlpfarm(true);
}
const elemalgopair = async() => {
   localStorage.setItem("ASSETFARM","");
   localStorage.setItem("ASSETFARM","elemalgo");
   localStorage.setItem('farm', 'BNB/ELEM');
    localStorage.setItem('image1', Icon1);
    localStorage.setItem('image2', Icon2);
    localStorage.setItem('tvl', totalStaked);
   console.log("insideelemalgo");
}
const elem = async() => {
    localStorage.setItem("ASSETFARM","");
    localStorage.setItem("ASSETFARM","elem");
    console.log("insideelem");
 }
 const tau = async() => {
    localStorage.setItem("ASSETFARM","");
    localStorage.setItem("ASSETFARM","tau");
    console.log("insideelem");
 }
//for value fetching
// useEffect(() => {
//     const fetchPosts = async () => {
//          // read local state of application from user account

//   let accountInfoResponse = await algodClient.accountInformation(localStorage.getItem("walletAddress")).do();
//   let appById = await algodClient.getApplicationByID(parseInt(configfile.applicationid)).do();
//   console.log("globalappid",appById);
 
//     console.log("Application's global state:");
   
//        console.log("Application's global state:1",appById['params']['global-state']);
//        console.log("Application's :1",appById['params']['global-state'][0]['key']);
//        console.log("globaltime",appById['params']['global-state'][0]['value']['uint']);
      
//        let globaltimenew;
//        let gloablstakenew;
//        let totalsulnew;
//        let totalslatelocknew;
//        let stakedbalancenew;
//        let rewardbalancenew;
//        let usertimenew;
//        for(let i=0;i<11;i++){
          
//             if(appById['params']['global-state'][i]['key']==="R1Q="){
//             globaltimenew = appById['params']['global-state'][i]['value']['uint'];
//             setGlobalTime(appById['params']['global-state'][i]['value']['uint']);
//             console.log("globaltime",globaltime);
//             }
 
//             if(appById['params']['global-state'][i]['key']==="R1NT"){
//               gloablstakenew=appById['params']['global-state'][i]['value']['uint'];
//               setGlobalStake(appById['params']['global-state'][i]['value']['uint']);
//               }
//             if(appById['params']['global-state'][i]['key']==="VFNVTA=="){
//                 totalsulnew =appById['params']['global-state'][i]['value']['uint'];
                
//                 settotalsul(appById['params']['global-state'][i]['value']['uint']);
//                 }
//             if(appById['params']['global-state'][i]['key']==="VFNM"){
//                   totalslatelocknew=appById['params']['global-state'][i]['value']['uint'];
//                   settotalslatelock(appById['params']['global-state'][i]['value']['uint']);
//                   }   
//            }
          

       
       
   

   


//   console.log("accinfolocal",accountInfoResponse);
//   if( accountInfoResponse['apps-local-state'].length === null|| accountInfoResponse['apps-local-state'].length ===undefined||accountInfoResponse['apps-local-state'].length===""){
//     alert("check");
//  }
// else{


//   console.log("User",accountInfoResponse['apps-local-state'].length);
//   for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
//       if (accountInfoResponse['apps-local-state'][i].id == parseInt(configfile.applicationid)) {
//           console.log("User's local state:",accountInfoResponse['apps-local-state'][i].id);
//           let acccheck= accountInfoResponse['apps-local-state'][i][`key-value`]; 
//           console.log("Usercheck",acccheck);
//           console.log("User",accountInfoResponse['apps-local-state'][i][`key-value`]);
        
//           if(accountInfoResponse['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse['apps-local-state'][i][`key-value`]===""){
//             alert("check");
//          }
//         else{
// for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
//               console.log(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
//               //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
              
//               let rewardkey =accountInfoResponse['apps-local-state'][i]['key-value'][n];
//              if(rewardkey['key'] === "VUE="){
//                stakedbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
//                setStakedBalance(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//              }
//             if(rewardkey['key'] === "VVNT"){
//               rewardbalancenew=accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
//               console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//               setrewardBalance(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//               console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//             }
//             if(rewardkey['key'] === "VVQ="){
//               usertimenew = accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint'];
//               console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//               setusertime(accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//               console.log("rewardcheck",accountInfoResponse['apps-local-state'][i]['key-value'][n]['value']['uint']);
//             }
              
//           }

//         }

          
//       }
//   }
// }
//   for(let i = 0; i < accountInfoResponse['assets'].length; i++){
//     console.log("accountsasset", accountInfoResponse['assets']);
//      if (accountInfoResponse['assets'][i]['asset-id'] == parseInt(configfile.assetid)) {
//       setBalance(accountInfoResponse['assets'][i]['amount']);
//       console.log("accountsassetnew", accountInfoResponse['assets'][i]['amount']);

//      }
//   }


  
//   console.log("sub",globaltimenew);
//   console.log("sub_div",usertimenew);
//   console.log("mul1",stakedbalancenew);
//   console.log("add_div",rewardbalancenew);
//   console.log("mul2",gloablstakenew);
//   // console.log("rewardCal",rewardCal);
//   let sub = parseInt(globaltimenew) - parseInt(usertimenew);
//     console.log("checksub",sub);
//   let sub_div = parseFloat(sub) / 60;
  
//   let mul1 = parseFloat(sub_div) * parseFloat(stakedbalancenew);
  
//   let add = parseFloat(rewardbalancenew) + parseFloat(mul1);
  
//   let add_div =  parseFloat(add) / parseFloat(gloablstakenew);
  
//   let mul2 = parseFloat(add_div) * parseFloat(totalsulnew);
  
//   let rewardCal1 = parseFloat(mul2) / 1000000;
//   let rewardCal = rewardCal1.toFixed(6);
//   console.log("rewardamountcalculation",rewardCal);
//   //let rewardcalculation =parseFloat((parseFloat(rewardamountbalance)+(parseFloat((globaltime)-parseFloat(usertime))/60)*parseFloat(stakedbalance)/parseFloat(globalstake))*parseFloat(totalsul)/parseFloat(1000000));
//   setrewardcalculation(rewardCal);


  
    
//     };
    

//     fetchPosts();
//   }, []);

//for elem totalstakeed and reward 
// useEffect(() => {
//     const fetchPosts = async () => {
   
//   //let applicationid = 53433787;
//   const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
//   let accountInfoResponse1 = await client.accountInformation(configfile.creatoraddress).do();

// for (let i = 0; i < accountInfoResponse1['created-apps'].length; i++) { 
//    console.log("Application's global state:");
//   if (accountInfoResponse1['created-apps'][i].id == parseInt(configfile.applicationid)) {
//       console.log("Application's global state:");
//       for (let n = 0; n < accountInfoResponse1['created-apps'][i]['params']['global-state'].length; n++) {
//           console.log(accountInfoResponse1['created-apps'][i]['params']['global-state'][n]);
//           let enc = accountInfoResponse1['created-apps'][i]['params']['global-state'][n];
//           console.log("encode",enc);
//           var decodedString = window.atob(enc.key);
//           if(enc['key'] === "R0E="){
//             setTotalStake( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
//             console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
//           }
//           if(enc['key'] === "VFNVTEM="){
//             setTotalreward( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
//             console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
//           }
//           if(enc['key'] === "VFNM"){
//             setTotalrewardallocated( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
//             console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
//           }
//       }
      
//   }
// }
    
//     };
    

//     fetchPosts();
//   }, []);  


//for price
// useEffect(() => {
// const fetchPosts = async () => {
//   let slpricenew;
//   let s2pricenew;
// let priceappid = 21580889;
// const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
// //let accountInfoResponse1 = await client.accountInformation("MX4W5I4UMDT5B76BMP4DS63Z357WDMNHDICPNEKPG4HVPZJTS2G53DDVBY").do();
// let accountInfoResponse2 = await client.accountInformation(configfile.pairescrowaddress).do();
// console.log("accinfolocalprice",accountInfoResponse2);
// if( accountInfoResponse2['apps-local-state'].length === null|| accountInfoResponse2['apps-local-state'].length ===undefined||accountInfoResponse2['apps-local-state'].length===""){
// alert("checkprice");
// }else{
// console.log("priceconsole",accountInfoResponse2['apps-local-state'].length);
// for (let i = 0; i < accountInfoResponse2['apps-local-state'].length; i++) { 
// if (accountInfoResponse2['apps-local-state'][i].id == parseInt(configfile.priceappid)) {
//     console.log("User's local stateprice:",accountInfoResponse2['apps-local-state'][i].id);
//     let acccheck= accountInfoResponse2['apps-local-state'][i][`key-value`]; 
//     console.log("Usercheckfor price",acccheck);
//     console.log("Userforprice",accountInfoResponse2['apps-local-state'][i][`key-value`]);
  
//     if(accountInfoResponse2['apps-local-state'][i][`key-value`]=== null|| accountInfoResponse2['apps-local-state'][i][`key-value`] === undefined||accountInfoResponse2['apps-local-state'][i][`key-value`]===""){
//       alert("check");
//    }
//   else{
// for (let n = 0; n < accountInfoResponse2['apps-local-state'][i][`key-value`].length; n++) {
//         console.log(accountInfoResponse2['apps-local-state'][i][`key-value`][n]);
//         //setStakedBalance(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
        
//         let rewardkey =accountInfoResponse2['apps-local-state'][i]['key-value'][n];
//        if(rewardkey['key'] === "czE="){
//         slpricenew=accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint'];
//         console.log("s1pricenew",accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
//          setS1(accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
//        }
//       if(rewardkey['key'] === "czI="){
//         s2pricenew=accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint'];
//         console.log("s2pricenew",accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
//         setS2(accountInfoResponse2['apps-local-state'][i]['key-value'][n]['value']['uint']);
      
//       }
      
        
//     }

//   }

    
// }
// }


// }
// let pricecal;
// pricecal=parseInt((slpricenew)/(s2pricenew));
// console.log("pricecalculated",pricecal);
// setprice(pricecal);

// };


// fetchPosts();
// }, []); 


// //for elemalgo
// useEffect(() => {
//     const fetchPosts = async () => {
   
//   //let applicationid = 53433787;
//   const client = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
//   let accountInfoResponse1 = await client.accountInformation(configfileelemalgo.creatoraddress).do();

// for (let i = 0; i < accountInfoResponse1['created-apps'].length; i++) { 
//    console.log("Application's global state:");
//   if (accountInfoResponse1['created-apps'][i].id == parseInt(configfileelemalgo.applicationid)) {
//       console.log("Application's global state:");
//       for (let n = 0; n < accountInfoResponse1['created-apps'][i]['params']['global-state'].length; n++) {
//           console.log(accountInfoResponse1['created-apps'][i]['params']['global-state'][n]);
//           let enc = accountInfoResponse1['created-apps'][i]['params']['global-state'][n];
//           console.log("encode",enc);
//           var decodedString = window.atob(enc.key);
//           if(enc['key'] === "R0E="){
//             setTotalStakeelemalgo( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
//             console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
//           }
//           if(enc['key'] === "VFNVTEM="){
//             setTotalreward( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
//             console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
//           }
//           if(enc['key'] === "VFNM"){
//             setTotalrewardallocated( accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint']);
//             console.log("checktvl", accountInfoResponse1['created-apps'][i]['params']['global-state'][n]['value']['uint'])
//           }
//       }
      
//   }
// }
    
//     };
    

//     fetchPosts();
//   }, []);  

  

//ELEMETHPAIR
// useEffect(() => {
//     const fetchPosts = async () => {
//         setTotalStakeelemalgo(await farmtvlelemalgopair(configfileelemalgo.creatoraddress,configfileelemalgo.applicationid));   
//         setTotalrewardallocatedelemalgo(await Rewardelemalgopair(configfileelemalgo.creatoraddress,configfileelemalgo.applicationid));        
//     };
//     fetchPosts();
//   }, []); 
//ELEM
// useEffect(() => {
//     const fetchPosts = async () => {
//         setTotalStake(await farmtvlelem(configfile.creatoraddress,configfile.applicationid));   
//         setTotalrewardallocatedelem(await Rewardelem(configfile.creatoraddress,configfile.applicationid));
//         console.log("checkingELEMREWARD",totalrewardallocatedelem);   
//     };
//     fetchPosts();
//   }, []); 

  //tau
// useEffect(() => {
//     const fetchPosts = async () => {
//         setTotalStaketau(await farmtvltau(configfiletau.creatoraddress,configfiletau.applicationid));   
//         setTotalrewardallocatedtau(await Rewardtau(configfiletau.creatoraddress,configfiletau.applicationid));
//         console.log("checkingELEMREWARD",totalrewardallocatedtau);   
//     };
//     fetchPosts();
//   }, []); 

//TOTAL VALUE LOCKED(OVERALL)
// useEffect(() => {
//     const fetchPosts = async () => {
//         setOverallTVL(await totalstakeelemalgo + totalstake);
//         console.log("calculatingtvl",totalvaluelockedoverall);

//     };
//     fetchPosts();
//   }, [totalvaluelockedoverall]); 

  const approveStake = async() => {
    try{
        const ethersProvider =  new ethers.providers.Web3Provider(provider)
        const signer =  ethersProvider.getSigner();
        const pairContract = new ethers.Contract(LPpairAddress, PancakePairV2ABI, signer);
        let tx = await pairContract.approve(LPStakeAddress, ethers.utils.parseUnits((1000000000000).toString(), 18));
        await tx.wait();
    } catch (e) {
        console.error("Error in approve:",e);
    }
  }

  const stake = async() => {
    try{
        const stakeAmount = 0;
        const ethersProvider =  new ethers.providers.Web3Provider(provider)
        const signer =  ethersProvider.getSigner();
        const stakingContract = new ethers.Contract(LPStakeAddress, LPStakeABI, signer);
        let tx = await stakingContract.deposit(ethers.utils.parseUnits((stakeAmount).toString(), 18));
        await tx.wait();
    } catch (e) {
        console.error("Error in stake:",e);
    }
  }

  const fun = async() => {
    try{
    const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
    const stakingContract = new ethers.Contract(LPStakeAddress, LPStakeABI, provider);
    const pairContract = new ethers.Contract(LPpairAddress, PancakePairV2ABI, provider);
    const erc20Contract = new ethers.Contract(cftokenAddress, cftokenAbi, provider);

    const totalStaked1 = ethers.utils.formatUnits(await pairContract.balanceOf(LPStakeAddress), 18);
    settotalStaked(totalStaked1);
    const [userStaked1, rewardAamount1] = await stakingContract.userInfo(address);
    const allowance1 = ethers.utils.formatUnits(await pairContract.allowance(address, LPStakeAddress), 0);
    setAllowance(allowance1);
    const lpbal1 = ethers.utils.formatUnits(await pairContract.balanceOf(address), 18);
    setlpbal(lpbal1);
    const elembal1 = ethers.utils.formatUnits(await erc20Contract.balanceOf(LPStakeAddress), 18);
    setTotalReward(elembal1);
    const userStaked11 =  ethers.utils.formatUnits(userStaked1, 18);
    const rewardAamount22 =  ethers.utils.formatUnits(rewardAamount1, 18);
    setUserStaked(userStaked11);
    setUserReward(rewardAamount22);

    console.log("useeffect farm:", totalStaked1, userStaked11, rewardAamount22, allowance1); 
    } catch(e) {
        console.log("error:", e);
    }
}

useEffect(() => {
fun();
},[address, isConnected, allfarm]);

    return (
        <Layout>
            <div className="page-content">
                <Container fluid="lg">
                    <Row>
                        <Col lg={4} xl={3} className='mb-lg-0 mb-4'>
                            <div className="card-base card-dark card-left">
                                <h2 className="h3 mb-20 font-semi-bold">Farms</h2>
                                <h5 className='text-gray text-normal mb-30'>Stake tokens to earn rewards in ELEM. <br /><a href="https://x.com/ElementDeFi" target='blank' className="btn-link-white">See how it works.</a></h5>

                                <h6 className='text-gray-D2'>Total Value Locked (TVL)</h6>

                                <h4 className='mb-30'>{totalStaked ? parseFloat(totalStaked).toFixed(2) : '0.00'}</h4>


                                <h6 className='text-gray-D2'>ELEM Price</h6>
                                <h4 className='mb-30'>$3.00</h4>

                                <h6 className='text-gray-D2'>Total Reward Allocated</h6>
                                <h4 className='mb-0'>{totalReward ? parseFloat(totalReward).toFixed(2) : '0.00'} ELEM</h4>
                            </div>
                        </Col>
                        <Col lg={8} xl={9}>
                            <div className="d-flex filter-responsive flex-wrap mb-3 align-items-center justify-content-xl-between justify-content-center">
                                
                                {/* <ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                                    <li><a href='' className='active'>All Farms</a></li>
                                    <li><a href=''   >Single Farm</a></li>
                                    <li><a href=''  >LP Asset Farm</a></li>
                                </ul> */}
                                
                                 {/*allstakestart */}
                                {allfarm === true ? <><ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                                    <li><a  className='active' onClick={allfarmfunction}>All Farms</a></li>
                                    <li><a   onClick={singlefarmfunction} >Single Farm</a></li>
                                    <li><a   onClick={lpfarmfunction}>LP Asset Farm</a></li>
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
                                <div className="table-group-outer">
                                <div className="table-group-head">
                                    <div className="table-group-tr">
                                        <div className="table-group-th">Liquidity</div>
                                        <div className="table-group-th">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    TVL
                                                </Dropdown.Toggle>

                                                {/* <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu> */}
                                            </Dropdown>
                                        </div>
                                        <div className="table-group-th">Total Rewards</div>
                                        <div className="table-group-th text-end">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    APR
                                                </Dropdown.Toggle>

                                                {/* <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu> */}
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-group-body">
                               
                                <Link  to={{
                  pathname: 'FarmStaking', query:{farm: 'BNB/ELEM',image1:Icon1,image2:Icon2,tvl:totalstakeelemalgo}}}   onClick={elemalgopair}>
                 
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' style={{height: "35px", width: "35px", borderRadius:"50%"}}/>
                                                <img src={Icon2} alt='icon' style={{height: "37px", width: "37px", borderRadius:"50%", marginLeft:"5px"}}/>
                                                <span style={{color:"white"}}>BNB/ELEM</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>{totalStaked ? parseFloat(totalStaked).toFixed(2) : '0.00'}</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon4} alt='icon' />
                                              
                                                <span style={{color:"white"}}>{totalReward ? parseFloat(totalReward).toFixed(2) : '0.00'}</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            {/* <OverlayTrigger
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
                                                </OverlayTrigger> */}
                                            </p>
                                            <br/>
                                            <p>annualized</p>
                                        </div>
                                   
                                
                                    </div>
                                    </Link>
                                    {/* <Link to={{
                  pathname: 'FarmStaking', query:{farm: 'ELEM',image1:Icon1,tvl:totalstake}}}   onClick={elem}>

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                               
                                                <span style={{color:"white"}}>ELEM</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>{parseFloat((parseFloat(totalstake)/1000000))}</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                            
                                                <span style={{color:"white"}}>{parseFloat((parseFloat(totalrewardallocatedelem)/1000000))}</span>
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
                                    <Link to={{
                  pathname: 'FarmStaking', query:{farm: 'TAU',image1:Icon3,tvl:totalstaketau}}}   onClick={tau}>
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon3} alt='icon' />
                                            
                                                <span style={{color:"white"}}>TAU </span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>{parseFloat((parseFloat(totalstaketau)/1000000))}</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                               
                                                <span style={{color:"white"}}>{parseFloat((parseFloat(totalrewardallocatedtau)/1000000))}</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end" style={{color:"white"}}>
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
                                    </Link> */}
                                </div>
                            </div>

                           

                                
                                
                                 {/*singlestakestart */}
                                
                                 </> : singlefarm === true ? <>
                                <ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                                    <li><a  onClick={allfarmfunction}>All Farms</a></li>
                                    <li><a  className='active' onClick={singlefarmfunction}>Single Farm</a></li>
                                    <li><a onClick={lpfarmfunction}>LP Asset Farm</a></li>
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
                                <div className="table-group-outer">
                                <div className="table-group-head">
                                    <div className="table-group-tr">
                                        <div className="table-group-th">Liquidity</div>
                                        <div className="table-group-th">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    TVL
                                                </Dropdown.Toggle>

                                                {/* <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu> */}
                                            </Dropdown>
                                        </div>
                                        <div className="table-group-th">Total Rewards</div>
                                        <div className="table-group-th text-end">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    APR
                                                </Dropdown.Toggle>

                                                {/* <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu> */}
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-group-body">
                                {/* <Link to={{
                  pathname: 'FarmStaking', query:{farm: 'ELEM',image1:Icon1,tvl:totalstake}}}   onClick={elem}>
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                               
                                                <span style={{color:"white"}}>ELEM</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>{parseInt(totalstake/1000000)}</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                             
                                                <span style={{color:"white"}}>{parseInt(totalrewardallocatedelem/1000000)}</span>
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
                                    <Link to={{
                  pathname: 'FarmStaking', query:{farm: 'TAU',image1:Icon3,tvl:totalstaketau}}}   onClick={tau}>
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon3} alt='icon' />
                                               
                                                <span style={{color:"white"}}>TAU </span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>{parseInt(totalstaketau/1000000)}</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                              
                                                <span style={{color:"white"}}>{parseFloat((parseFloat(totalrewardallocatedtau)/1000000))}</span>
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
                                      </Link> */}
                                      <center>No farm found</center>
                                    {/* <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon2} alt='icon' />
                                               
                                                <span style={{color:"white"}}>Algo</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	ELEM / day</span>
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

                           


                                </> : <>
                                {/*lpstakestart */}
                                <ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                                    <li><a onClick={allfarmfunction}>All Farms</a></li>
                                    <li><a onClick={singlefarmfunction}>Single Farm</a></li>
                                    <li><a  className='active'  onClick={lpfarmfunction}>LP Asset Farm</a></li>
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
                                <div className="table-group-outer">
                                <div className="table-group-head">
                                    <div className="table-group-tr">
                                        <div className="table-group-th">Liquidity</div>
                                        <div className="table-group-th">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    TVL
                                                </Dropdown.Toggle>

                                                {/* <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu> */}
                                            </Dropdown>
                                        </div>
                                        <div className="table-group-th">Total Rewards</div>
                                        <div className="table-group-th text-end">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    APR
                                                </Dropdown.Toggle>

                                                {/* <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu> */}
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-group-body">
                                <Link  to={{
                  pathname: 'FarmStaking', query:{farm: 'BNB/ELEM',image1:Icon1,image2:Icon2,tvl:totalstakeelemalgo}}}   onClick={elemalgopair}>
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' style={{height: "35px", width: "35px", borderRadius: "50%"}}/>
                                                <img src={Icon2} alt='icon' style={{height: "37px", width: "37px", borderRadius: "50%", marginLeft:"5px"}}/>
                                                <span style={{color:"white"}}>BNB/ELEM</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>{totalStaked ? parseFloat(totalStaked).toFixed(2) : '0.00'}</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon4} alt='icon' />
                                               
                                                <span style={{color:"white"}}>{totalReward ? parseFloat(totalReward).toFixed(2) : '0.00'}</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            {/* <OverlayTrigger
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
                                                </OverlayTrigger> */}
                                            </p>
                                            <br/>
                                            <p>annualized</p>
                                        </div>
                                   
                                
                                    </div>
                                    </Link>
                                    {/* <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon3} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>TAU / USDC</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                           
                                                <span style={{color:"white"}}>651.30	ELEM / day</span>
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

                                    {/* <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon3} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>TAU / USDT</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                               
                                                <span>651.30	ELEM / day</span>
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

                         

                                </>}  

                               
                                
                            
                            </div>
                            <div className="pagination-footer d-flex align-items-center justify-content-between">
                            {singlefarm === true ? <p>showing 0 from 1</p> : <p>showing 1-1 from 1</p>}

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

                            {/* <div className="table-group-outer">
                                <div className="table-group-head">
                                    <div className="table-group-tr">
                                        <div className="table-group-th">Liquidity</div>
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
                                        <div className="table-group-th">Rewards</div>
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
                                <Link to="FarmStaking">
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>BNB/ELEM</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td" style={{color:"white"}}>$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>651.30	ELEM / day</span>
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
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>TAU / USDC</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>651.30	ELEM / day</span>
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

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span style={{color:"white"}}>TAU / USDT</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	ELEM / day</span>
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
                            </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}

export default FarmPage;