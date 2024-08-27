import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form, Tabs, Tab, Button} from 'react-bootstrap';
import ButtonLoad from 'react-bootstrap-button-loader';
import Layout from './Layouts/LayoutInner';
import OrderIcon from '../assets/images/order-icon.png';

import BG from '../assets/images/market-left-bg-new1.png';
import BGGrad from '../assets/images/bg-grad.png';
import usdcLogo from '../assets/images/usdc-logo.png'
import elementLogo from '../assets/images/elem-original.png';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import BigInt from 'BigInt';
import { ethers } from 'ethers';
import { CarbonFinanceAbi, CarbonFinanceAddress, ERC20MockAbi, ERC20MockAddress, cftokenAbi, cftokenAddress, PancakeFactoryV2Address, PancakeFactoryV2ABI, PancakeRouterV2Address, PancakeRouterV2ABI, USDCAddress, ELEMAddress, ERC20ABI, PancakePairV2ABI } from '../abi';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';

const MoneyMarket = () => {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://sepolia.base.org/";
    const provider = new ethers.providers.JsonRpcProvider(url);

    // const [provider, setProvider] = useState("");
    const [allowance, setAllowance] = useState("");
    const [busdBalance, setbusdBalance] = useState(0);
    const [busdDecimals, setbusdDecimals] = useState(6);
    const [depositAmount, setDepositAmount] = useState();
    const [withdrawAmount, setWithdrawAmount] = useState();
    const [userDeposit, setUserDeposit] = useState("");
    const [userDebt, setUserDebt] = useState("");
    const [totalDeposited, setTotalDeposited] = useState("");
    const [totalELEM, setTotalELEM] = useState("");
    const [totalBorrowPercent, setTotalBorrowPercent] = useState("");
    const [loader, setLoader] = useState(false);
    const [loader1, setLoader1] = useState(false);

    const fun = async() => {
        const erc20Contract = new ethers.Contract(USDCAddress, ERC20ABI, provider);
        // const carbonContract = new ethers.Contract(CarbonFinanceAddress,CarbonFinanceAbi, provider);

        const facoryContract = new ethers.Contract(PancakeFactoryV2Address, PancakeFactoryV2ABI, provider);
        const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
        const pairAddress = await facoryContract.getPair(USDCAddress, ELEMAddress);
        const pairContract = new ethers.Contract(pairAddress, PancakePairV2ABI, provider);

        let allowance1 = ethers.utils.formatUnits( await erc20Contract.allowance(address, PancakeRouterV2Address), 0); 
        setAllowance(allowance1);
        let balance1 = ethers.utils.formatUnits( await erc20Contract.balanceOf(address), 0); 
        setbusdBalance(balance1);
        let decimals1 = ethers.utils.formatUnits( await erc20Contract.decimals(), 0); 
        setbusdDecimals(decimals1);
        let UserDetails = await pairContract.users(address);
        console.log("details of user:", UserDetails);

        const token0 =  await pairContract.token0();
        console.log(token0);
        let totalDeposited1 = 0;
        let totalBorrowed = 0;
        if( (token0).toLowerCase() == (USDCAddress).toLowerCase() ){
            totalDeposited1 = ethers.utils.formatUnits( await pairContract.totalDepositedToken0(), 0);
            setTotalDeposited(totalDeposited1);
            totalBorrowed = ethers.utils.formatUnits( await pairContract.totalBorrowedToken0(), 0);
            setTotalELEM(totalBorrowed);
            let userDeposit1 = ethers.utils.formatUnits( UserDetails?.deposited0, 0);
            setUserDeposit(userDeposit1);
            let userDebt1 = ethers.utils.formatUnits( UserDetails?.borrowed1, 0);
            setUserDebt(userDebt1);
        } else {
            totalDeposited1 = ethers.utils.formatUnits( await pairContract.totalDepositedToken1(), 0);
            setTotalDeposited(totalDeposited1);
            totalBorrowed = ethers.utils.formatUnits( await pairContract.totalBorrowedToken1(), 0);
            setTotalELEM(totalBorrowed);
            let userDeposit1 = ethers.utils.formatUnits( UserDetails?.deposited1, 0);
            setUserDeposit(userDeposit1);
            let userDebt1 = ethers.utils.formatUnits( UserDetails?.borrowed0, 0);
            setUserDebt(userDebt1);
        }

        let borrowPercent = (totalBorrowed/(totalDeposited1/ 2))*100;
        setTotalBorrowPercent(borrowPercent);
        
        console.log("allowance:", allowance1, balance1, totalDeposited1);
    }

    // const fun1 = async() => {
    //     const facoryContract = new ethers.Contract(PancakeFactoryV2Address, PancakeFactoryV2ABI, provider);
    //     const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, provider);
    // }

    useEffect(() => {
        fun();
    }, [address, isConnected]);

    const approve = async() => {
        try{
            setLoader(true);
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const usdcContract = new ethers.Contract(USDCAddress, ERC20ABI, signer);
            // if (typeof depositAmount !== 'string') {
            //     depositAmount = depositAmount.toString();
            // }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits((1000000000).toString(), 18);
            let tx = await usdcContract.approve(PancakeRouterV2Address, amountInWei);
            await tx.wait();
            toast.success(toastDiv(tx.hash, `Approved Successfully`));
            await fun();
            setLoader(false);
        }catch(e){
            setLoader(false);
            console.error(e);
            toast.error(e?.reason);
        }
       
    }

    const deposit = async() => {
        try{
            setLoader(true);
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
            if (typeof depositAmount !== 'string') {
                depositAmount = depositAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(depositAmount, busdDecimals);
            const currentTimeMillis = new Date().getTime();

            // Convert milliseconds to seconds (Epoch time is in seconds)
            const epochTimeSeconds = Math.floor(currentTimeMillis / 1000);
            let tx = await routerContract.deposit(USDCAddress, ELEMAddress, amountInWei, (epochTimeSeconds+600));
            await tx.wait();
            toast.success(toastDiv(tx.hash, `Deposited Successfully`));
            setDepositAmount("");
            await fun();
            setLoader(false);
        }catch(e){
            setLoader(false);
            console.error(e);
            toast.error(e?.reason);
        }
    }

    const withdraw = async() => {
        try{
            setLoader1(true);
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const routerContract = new ethers.Contract(PancakeRouterV2Address, PancakeRouterV2ABI, signer);
            if (typeof withdrawAmount !== 'string') {
                withdrawAmount = withdrawAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(withdrawAmount, busdDecimals);
            const currentTimeMillis = new Date().getTime();

            // Convert milliseconds to seconds (Epoch time is in seconds)
            const epochTimeSeconds = Math.floor(currentTimeMillis / 1000);
            let tx = await routerContract.withdraw(USDCAddress, ELEMAddress, amountInWei, (epochTimeSeconds+600));
            await tx.wait();
            toast.success(toastDiv(tx.hash, `Withdrawn Successfully`));
            setWithdrawAmount("");
            await fun();
            setLoader1(false);
        }catch(e){
            setLoader1(false);
            console.error(e);
            toast.error(e?.reason);
        }
    }

    const toastDiv = (txId,type) =>
        (
            <div>
              <p style={{color:'#FFFFFF'}}> {type} &nbsp;<a style={{color:'#AA14F0'}} href={`https://sepolia.basescan.org/tx/${txId}`} target="_blank" rel="noreferrer"><br/>View in Base sepolia Explorer <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.7176 3.97604L1.69366 14L0.046875 12.3532L10.0697 2.32926H1.23596V0H14.0469V12.8109H11.7176V3.97604Z" fill='#AA14F0'/>
        </svg></a></p> 
            </div>
        );

    // React.useEffect(() => {
    //     window.scrollTo(0, 0);
    // });
    return (
        <Layout>
            <ToastContainer position='bottom-right' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>
            <div className="page-content">
                <Container fluid="lg">
                    <Row>
                        <Col md={4} lg={4} xl={3} className='mb-xl-0 mb-4'>
                            <div className="card-border-grad card-shadow card-market card-left">
                                <div className="card-border-grad-inner" style={{backgroundImage: `url(${BG})`}}>
                                    <h4 className="mb-20 font-bold card-left-title font-normal">Lend assets for interest from borrowers. </h4>
                                    <div className='h8 mb-30'>Have assets you want to earn additional interest on ? Lend them in isolated markets and earn interest from borrowers.</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={8} lg={8} xl={6} className='mb-xl-0 mb-4'>
                            <div className="money-market-card h-100">
                                <div className="money-market-card-order-header d-flex align-items-center">
                                    <img src={usdcLogo} alt="elementLogo" style={{"height": "65px", "width": "65px"}} />
                                    <div className='ps-3'>
                                        <div className="h4 mb-2">Lend USDC</div>
                                        <p className='d-flex flex-wrap'><span className='d-flex align-items-center me-5'>Collateral: <div className="h6 mb-0">USDC</div></span> 
                                        {/* <span className='d-flex align-items-center'>Oracle: <div className="h6 mb-0">Chainink</div></span> */}
                                        </p>
                                    </div>
                                </div>

                                <div className="money-market-card-order-body">
                                    <div className="row mb-30">
                                        <div className="col-4">
                                            <p className='mb-0' style={{color: '#969696'}}>Lent</p>
                                            <h4 className='mb-0 text-normal font-semi-bold' style={{color: '#FF0099'}}>{userDeposit ? (userDeposit/10 ** busdDecimals).toFixed(2) : "0.00"} USDC</h4>
                                            {/* <h5 className='mb-0'>$0.00</h5> */}
                                        </div>
                                        <div className="col-4">
                                            <p className='mb-0' style={{color: '#969696'}}>Borrowed</p>
                                            <h5 className='mb-0'>{userDebt ? (userDebt/1e18).toFixed(2) : "0.00"} ELEM</h5>
                                        </div>
                                        <div className="col-4">
                                            <p className='mb-0' style={{color: '#969696'}}>Supply APR</p>
                                            <h5 className='mb-0'>8.47%</h5>
                                        </div>
                                    </div>

                                    <Tabs
                                        defaultActiveKey="deposite"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className='tabs-dark'
                                    >
                                        <Tab eventKey="deposite" title="Deposit">
                                            <div className="pt-4">
                                                <div className="h5 mb-4 pb-2">Deposit USDC</div>

                                                <div className="d-flex flex-wrap mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>from</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>

                                                    <span className='ms-auto'>Balance {busdBalance? parseFloat(busdBalance/10**busdDecimals).toFixed(2) : "0.00"}</span>
                                                </div>

                                                <Form>
                                                    <input type="number" className='form-control mb-3 form-dark' placeholder='0.0' value={depositAmount} onChange={(e)=>{setDepositAmount(e.target.value)}}/>
                                                    {(allowance/10 ** busdDecimals) >= depositAmount ? 
                                                    <ButtonLoad loading={loader} variant='grad' className='w-100' onClick={deposit}>Deposit</ButtonLoad> :
                                                    <ButtonLoad loading={loader} variant='grad' className='w-100' onClick={approve}>Approve</ButtonLoad>}
                                                </Form>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="withdraw" title="Withdraw">
                                        <div className="pt-4">
                                                <div className="h5 mb-4 pb-2">Withdraw USDC</div>

                                                <div className="d-flex flex-wrap mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>from</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>

                                                    <span className='ms-auto'>Balance {userDeposit? parseFloat(userDeposit/10 ** busdDecimals).toFixed(2) : "0.00"}</span>
                                                </div>

                                                <Form>
                                                    <input type="number" className='form-control mb-3 form-dark' placeholder='0.0' value={withdrawAmount} onChange={(e)=>{setWithdrawAmount(e.target.value)}}/>
                                                    <ButtonLoad loading={loader1} variant='grad' className='w-100' onClick={withdraw} >Withdraw</ButtonLoad>
                                                </Form>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </Col>

                        <Col md={12} lg={12} xl={3}>
                            <div className="card-border-grad card-shadow card-market card-left">
                                <div className="card-border-grad-inner" style={{backgroundImage: `url(${BGGrad})`}}>
                                    <h4 className="mb-20 font-bold card-left-title font-normal">Market</h4>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>APR</span>
                                        <strong>8.47%</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Total</span>
                                        <strong>{totalDeposited ? parseFloat(totalDeposited/10 ** busdDecimals).toFixed(2) : "0.00"} USDC</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Available</span>
                                        <strong>{totalDeposited ? parseFloat((totalDeposited - (2 * totalELEM))/10 ** busdDecimals).toFixed(2) : "0.00"} USDC</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Borrowed</span>
                                        <strong>{totalBorrowPercent? parseFloat(totalBorrowPercent).toFixed(2) : "0.00"}%</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Collateral</span>
                                        <strong>{totalDeposited ? parseFloat(totalDeposited/10 ** busdDecimals).toFixed(2) : "0.00"} USDC</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Health</span>
                                        <strong>{totalBorrowPercent? parseFloat(100 - totalBorrowPercent).toFixed(2) : "0.00"}%</strong>
                                    </div>

                                    {/* <div className="pt-4 pb-5">
                                        <Button variant='grad'>Update Price</Button>
                                    </div>

                                    <h4 className="mb-20 font-bold card-left-title font-normal">Oracle</h4>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Name</span>
                                        <strong>Chainlink</strong>
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
};

export default MoneyMarket;