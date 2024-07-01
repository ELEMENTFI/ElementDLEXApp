import algosdk from 'algosdk';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import logo from '../../assets/images/logoasset.png';
// import taulogo from '../../assets/images/tautoken.png';
import { axios } from 'axios';
import {walletAsset,walletAssetDetails,find_balance} from "../formula";
import usdclogo from '../../assets/images/usdc-logo.png';
import taulogo from '../../assets/images/tau-original.png';
import elemlogo from '../../assets/images/elem-original.png';
import usdtimg from '../../assets/images/usdtimg.png';
import ethlogo from '../../assets/images/Ethereum-icon.svg'
import seilogo from '../../assets/images/sei-logo.png';
import questionlogo from '../../assets/images/question_logo1.png'
import warninglogo from '../../assets/images/warning_logo1.png'
import {ERC20ABI} from '../../abi';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'; 
import { ethers } from 'ethers';

const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";

const token = {
    'X-API-key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl',
}

let indexerClient = new algosdk.Indexer(token, baseServer, port);

const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const FilterDropdown = ({setk,setToken1Id,setclicklogo1,ass,assn,setassets,setassetsn,setassetid1, settoken1, settoken2, settokenname, settokendecimals}) => {
    const [show, setShow] = React.useState(false);
    const[value, setValue1] = React.useState(0);
    
    const[id,setid]= React.useState("");
    const[seem,setseem]= useState([]);
    const[smore,sets]= useState(false);
    const[pageSize,setPageSize]=useState(6);
    const[simage,setsimage] = useState([]);
    const[acc,setacc] = useState([]);
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
  //console.log("isc",isChecked)
    const call =async(v)=>{
    // let val = document.getElementById("first").value;
  //console.log("val",v)
        //console.log("working",typeof parseInt(value))
        if(!isNaN(v)){
          //console.log("number")
            const assets = await indexerClient.lookupAssetByID(v).do();
            setassets(assets.asset.params['unit-name']);
            setk(assets.asset.params['unit-name']);
            // localStorage.setItem("assetname1",assets.asset.params['unit-name']);
            localStorage.setItem("tokenid1",v);
            // setToken1Id(val);
            setassetsn(0);
            setid(assets.asset.index);
            sets(false)
            //console.log("assets",assets)
        }
        else{
          //console.log("string")
            let assetInfo = await indexerClient.searchForAssets().name(v).limit(10).do();
          //console.log("asinfo",assetInfo)
            sets(true)
            setseem(assetInfo.assets)
        }
        
       
    }

    const fb =async(idv)=>{
        let v = await indexerClient.lookupAccountByID(localStorage.getItem("walletAddress")).do();
        v.account['assets'].map((role,index)=>{
          if(role['asset-id'] === idv ){
            let k = role.amount;
            setToken1Id(k)
          //console.log("tokenbal",k)
          }
        })

        // let b = await find_balance(idv);
        // setToken1Id(b);
      //console.log("tokenbal",v.account['assets'])
      //console.log("tokenbal",idv)
    }
    function handleClick(i,n,l){   
        //  e.preventDefault();
        // setShow(false);
        localStorage.setItem("tokenid1",i);
        setassetid1(i)
        // console.log('The link was clicked.'); 
        setclicklogo1(l);
        
        ////console.log("bvalue",fz);
        //  setToken1Id(id)
        setassetsn(l);
        fb(i);
        handleClose();
        
       //console.log('The link was clicked.');  
        }
        function clicking(l,v,n,x,d) {   
          //console.log(v) 
          setassetid1(l);       
            setassets(v);
            // localStorage.setItem("assetname1",v);
            setk(v);
          //console.log("setting",v);
            setassetsn(n);
            settoken1(x);
            console.log("contract:", x);
            settokenname(v);
            settokendecimals(d);
            localStorage.setItem("tokenid1",l);
            fb(l)
            // setToken1Id(l);
            setclicklogo1(n);
          //console.log('The link was clicked.'); 
            handleClose(); 
           }

           
    const seemore =async()=>{
        // const seemore = await indexerClient.searchForAssets().limit(10).do();
        // setseem(seemore.assets)
        // // sets(true)
        // console.log(seemore.assets)
        let s =[];
        s=[
            {index:0,image:seilogo,name:"ETH", contract: "0x3f6e2955C365ba36cC5D5d74a3edc4CD470ad2C4", decimals:18},
            {index:10458941,image:usdclogo,name:"USDC", contract: "0x3f6e2955C365ba36cC5D5d74a3edc4CD470ad2C4", decimals:6},
            // {index:71682000,image:taulogo,name:"TAU", contract: "0x6620506B175a286F3ad3056C112d650D9579D157", decimals:18},
            {index:71116238,image:elemlogo,name:"ELEM", contract: "0xaB7eEc703836a34105c62595c346b23D4964A2a9", decimals:18},
            {index:67396430,image:usdtimg,name:"USDT", contract: "0xc5A7cc3395fDba9719179a37525c58773d7EBEeE", decimals:6}
            // {index:470842789,image:"https://s2.coinmarketcap.com/static/img/coins/64x64/14923.png",name:"Defly Token"},
            // {index:27878396,image:"https://s2.coinmarketcap.com/static/img/coins/64x64/10820.png",name:"Yieldly"},
            // {index:66309738,image:"https://s2.coinmarketcap.com/static/img/coins/64x64/8378.png",name:"AKITA INU"},
            // {index:26832577,image:"https://s2.coinmarketcap.com/static/img/coins/64x64/7843.png",name:"Asia Reserve Currency Coin"},
            // {index:12400859,image:"https://s2.coinmarketcap.com/static/img/coins/64x64/8279.png",name:"Monerium EUR emoney"},

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
        setValue1(a);
    }
    return (
        <>
         <Button variant='filter' onClick={handleShow} className='dropdown-target'>
            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="">
                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
            </svg> */}
            {ass ? (<>
            <img  width="31" height="30" src={assn === "" ? questionlogo : assn}/>
           {ass}
           </>):(<>
            <img  width="31" height="30" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROQNyD7j5bC5DMh1kN613JbHgcczZBwncxFrSp-5EhdVCrg3vEHayr5WtEo1JCSyyJUAs&usqp=CAU"} onClick={setk("ETH")}/>
           ETH
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
                        <div className="token-list-item" onClick={()=>clicking(0,symbol,"", contract, decimamls)}>
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
                        <div className="token-list-item"  onClick={()=>handleClick(id,ass,logo)}>
                        <div className="token-list-icon">
                            {/* <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                            </svg> */}
                             <img src={logo}></img>
                             </div>
                            <div className="token-list-title">
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
                                                    <h6 >{role.name.toUpperCase()}
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
                                                    <h6 href="#" >{role.name.toUpperCase()}
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
                        <div className="token-list-item" onClick={()=>clicking(r.index,r.params['name'],logo,r.contract, r.decimals)}>
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
                    
                  
                   
                   
                   {/*  <div className="token-list-item">
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

export default FilterDropdown;