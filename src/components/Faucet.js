import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Layout from './Layouts/LayoutInner';
import Icon1 from '../assets/images/icon1.png';
import Icon2 from '../assets/images/icon2.png';
import tauLogo from '../assets/images/tau-original.png';
import usdcLogo from '../assets/images/usdc-logo.png';
import seilogo from '../assets/images/sei-logo.png';
import colorLogo from '../assets/images/element logo.png';
import BG from '../assets/images/bg-v2-new.png';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'; 
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import ButtonLoad from 'react-bootstrap-button-loader';
import { FaucetAddress, FaucetABI, cftokenAddress, cftokenAbi, ERC20MockAbi, ERC20MockAddress, ElemAddress, ERC20ABI } from '../abi';

const Faucet = () => {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://evm-rpc-testnet.sei-apis.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    const [ethbal, setEthbal] = useState(0.00);
    const [totusdcbal, setTotUsdcbal] = useState(0.00);
    const [totelembal, setTotElembal] = useState(0.00);
    const [usdcbal, setUsdcbal] = useState(0.00);
    const [elembal, setElembal] = useState(0.00);
    const [loader, setLoader] = useState(false);
    const [loader1, setLoader1] = useState(false);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const claimUsdc = async() => {
        try{
        setLoader(true);
        const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
        const signer =  ethersProvider.getSigner();
        const erc20Contract = new ethers.Contract(FaucetAddress, FaucetABI, signer);
        let tx = await erc20Contract.dispense("USDC");
        tx.wait();
        toast.success(toastDiv(tx.hash, 'Successfully claimed'));
        await fun();
        } catch(e) {
            console.log("error:", e);
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    const claimElem = async() => {
        try{
        setLoader1(true);
        const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
        const signer =  ethersProvider.getSigner();
        const erc20Contract = new ethers.Contract(FaucetAddress, FaucetABI, signer);
        let tx = await erc20Contract.dispense("ELEM");
        tx.wait();
        toast.success(toastDiv(tx.hash, 'Successfully claimed'));
        await fun();
        } catch(e) {
            console.log("error:", e);
            setLoader1(false);
        } finally {
            setLoader1(false);
        }
    }

    const fun = async() => {
        try{
        const erc20Contract = new ethers.Contract(ERC20MockAddress, ERC20MockAbi, provider);
        // const erc20Contract2 = new ethers.Contract(ElemAddress, ERC20ABI, provider);

        const eth = ethers.utils.formatUnits(await provider.getBalance(address), 18);
        setEthbal(parseFloat(eth).toFixed(2));

        const userusdc = ethers.utils.formatUnits(await erc20Contract.balanceOf(address), 18);
        setUsdcbal(parseFloat(userusdc).toFixed(2));
        // const userelem = ethers.utils.formatUnits(await erc20Contract2.balanceOf(address), 18);
        // setElembal(parseFloat(userelem).toFixed(2));
        const totalusdc = ethers.utils.formatUnits(await erc20Contract.balanceOf(FaucetAddress), 18);
        setTotUsdcbal(parseFloat(totalusdc).toFixed(2));
        // const totalelem = ethers.utils.formatUnits(await erc20Contract2.balanceOf(FaucetAddress), 18);
        // setTotElembal(parseFloat(totalelem).toFixed(2));

        console.log("ethbal:", eth);
        } catch(e) {
            console.log("error:", e);
        }
    }

    useEffect(() => {
        if(address){
            fun();
        }
        
    },[address, isConnected]);

    const toastDiv = (txId,type) =>
        (
            <div>
              <p style={{color:'#FFFFFF'}}> {type} &nbsp;<a style={{color:'#AA14F0'}} href={`https://seitrace.com/tx/${txId}?chain=atlantic-2`} target="_blank" rel="noreferrer"><br/>View in Sei Explorer <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.7176 3.97604L1.69366 14L0.046875 12.3532L10.0697 2.32926H1.23596V0H14.0469V12.8109H11.7176V3.97604Z" fill='#AA14F0'/>
        </svg></a></p> 
            </div>
        );
    

    return (
        <Layout>
             <><ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false} className="Toastify__toast-container--bottom-right"/></>
            <div className="page-content">
                <Container fluid="lg">
                    <Row className="g-4"> {/* Added className="g-4" for equal spacing */}
                        <Col md={4} lg={4} xl={3}>
                            <div className="card-border-grad card-shadow card-market card-left">
                                <div className="card-border-grad-inner" style={{ backgroundImage: `url(${BG})` }}>
                                    <h4 className="mb-20 font-bold card-left-title font-normal">Faucet: Obtain Test Tokens Easily</h4>
                                    <div className='h8 mb-30'>
                                    Access our testnet faucet to receive free test tokens and start experimenting with our platform. These tokens will help you explore our features, perform transactions, and understand the mechanics without any financial risk.
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={8} lg={8} xl={9}>
                            <div className="money-market-card">
                                <div className="money-market-card-header d-flex flex-wrap flex-xl-row flex-column align-items-center justify-content-xl-between justify-content-center">
                                    <h4 className='font-normal mb-xl-0 mb-3 text-uppercase'>Faucet</h4>
                                </div>
                                <div className="money-market-card-body">
                                    <div className="table-group-outer table-group-market">
                                        <div className="table-group-head px-3 d-flex justify-content-space-between">
                                            <div className="table-group-tr">
                                                <div className="table-group-th mr-8">Token</div>
                                                <div className="table-group-th mr-7">Name</div>
                                                <div className="table-group-th mr-8">Claim amount</div>
                                                <div className="table-group-th mr-8">Faucet Balance</div>
                                                <div className="table-group-th mr-8">User Balance</div>
                                                <div className="table-group-th text-end ml-9">Claim</div>
                                            </div>
                                        </div>
                                        {/* <div className="table-group-head px-3 d-flex justify-content-space-between">
                                            <div className="table-group-tr">
                                                <div className="table-group-td  mr-8">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={colorLogo} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase  mr-11" style={{ color: "white" }}>ELEM</div>
                                                <div className="table-group-td text-uppercase  mr-9" style={{ color: "white" }}> 5 </div>
                                                <div className="table-group-td  mr-8" style={{ color: "white" }}>{totelembal ? totelembal : '0.00'} </div>
                                                <div className="table-group-td  mr-8" style={{ color: "white" }}>{elembal ? elembal : '0.00'} </div>
                                                <div className="table-group-td text-end ml-10" style={{ color: "white" }}>
                                                    <ButtonLoad loading={loader1} className='w-70 btn-grad' onClick={claimElem}>Claim</ButtonLoad>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="table-group-head px-3 d-flex justify-content-space-between">
                                            <div className="table-group-tr">
                                                <div className="table-group-td  mr-8">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={usdcLogo} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase  mr-11" style={{ color: "white" }}>USDC</div>
                                                <div className="table-group-td text-uppercase  mr-9" style={{ color: "white" }}> 5 </div>
                                                <div className="table-group-td  mr-8" style={{ color: "white" }}>{totusdcbal ? totusdcbal : '0.00'} </div>
                                                <div className="table-group-td  mr-8" style={{ color: "white" }}>{usdcbal ? usdcbal : '0.00'} </div>
                                                <div className="table-group-td text-end ml-10" style={{ color: "white" }}>
                                                    <ButtonLoad loading={loader} className='w-70 btn-grad' onClick={claimUsdc}>Claim</ButtonLoad>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-group-head px-3 d-flex justify-content-space-between">
                                            <div className="table-group-tr">
                                                <div className="table-group-td  mr-8">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={seilogo} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase  mr-11" style={{ color: "white" }}>SEI</div>
                                                <div className="table-group-td text-uppercase  mr-9" style={{ color: "white" }}> - </div>
                                                <div className="table-group-td  mr-8" style={{ color: "white" }}> - </div>
                                                <div className="table-group-td  mr-8" style={{ color: "white" }}>{ethbal ? ethbal : '0.00'} </div>
                                                <div className="table-group-td text-end ml-10" style={{ color: "white" }}>
                                                <a href='https://atlantic-2.app.sei.io/faucet/' target='blank' style={{textDecoration: 'none'}}><Button className='w-70 btn-grad'>Claim</Button></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-group-footer py-3 px-3 pagination-footer d-flex align-items-center justify-content-between">
                                        <p>Faucet Count 2</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
};

export default Faucet;
