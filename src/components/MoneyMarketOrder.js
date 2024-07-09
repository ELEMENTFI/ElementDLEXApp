import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form, Tabs, Tab, Button} from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
import OrderIcon from '../assets/images/order-icon.png';

import BG from '../assets/images/market-left-bg-new1.png';
import BGGrad from '../assets/images/bg-grad.png';
import usdcLogo from '../assets/images/usdc-logo.png'
import elementLogo from '../assets/images/elem-original.png';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import BigInt from 'BigInt';
import { ethers } from 'ethers';
import { CarbonFinanceAbi, CarbonFinanceAddress, ERC20MockAbi, ERC20MockAddress, cftokenAbi, cftokenAddress } from '../abi';

const MoneyMarket = () => {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://bsc-testnet-rpc.publicnode.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    // const [provider, setProvider] = useState("");
    const [allowance, setAllowance] = useState("");
    const [busdBalance, setbusdBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState();
    const [withdrawAmount, setWithdrawAmount] = useState();
    const [userDeposit, setUserDeposit] = useState("");
    const [userDebt, setUserDebt] = useState("");
    const [totalDeposited, setTotalDeposited] = useState("");
    const [totalELEM, setTotalELEM] = useState("");
    const [totalBorrowPercent, setTotalBorrowPercent] = useState("");

    const fun = async() => {
        const erc20Contract = new ethers.Contract(ERC20MockAddress, ERC20MockAbi, provider);
        const carbonContract = new ethers.Contract(CarbonFinanceAddress,CarbonFinanceAbi, provider);
        const cfContract = new ethers.Contract(cftokenAddress,cftokenAbi, provider);
        let allowance1 = ethers.utils.formatUnits( await erc20Contract.allowance(address, CarbonFinanceAddress), 0); 
        setAllowance(allowance1);
        let balance1 = ethers.utils.formatUnits( await erc20Contract.balanceOf(address), 0); 
        setbusdBalance(balance1);
        let userDeposit1 = ethers.utils.formatUnits( await carbonContract.getCdpTotalDeposited(address), 0);
        setUserDeposit(userDeposit1);
        let userDebt1 = ethers.utils.formatUnits( await carbonContract.getCdpTotalDebt(address), 0);
        setUserDebt(userDebt1);
        let totalDeposited1 = ethers.utils.formatUnits( await carbonContract.totalDeposited(), 0);
        setTotalDeposited(totalDeposited1);
        let totalCF = ethers.utils.formatUnits( await cfContract.totalSupply(), 0);
        setTotalELEM(totalCF);
        let borrowPercent = (totalCF/(totalDeposited1/ 2))*100;
        setTotalBorrowPercent(borrowPercent);
        
        console.log("allowance:", allowance1, balance1, userDeposit1, userDebt1);
    }

    useEffect(() => {
        fun();
    }, [address, isConnected]);

    const approve = async() => {
        try{
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const carbonContract = new ethers.Contract(ERC20MockAddress, ERC20MockAbi, signer);
            if (typeof depositAmount !== 'string') {
                depositAmount = depositAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(depositAmount, 18);
            let tx = await carbonContract.approve(address, amountInWei);
            await tx.wait();
            await fun();
        }catch(e){
            console.error(e);
        }
       
    }

    const deposit = async() => {
        try{
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const carbonContract = new ethers.Contract(CarbonFinanceAddress, CarbonFinanceAbi, signer);
            if (typeof depositAmount !== 'string') {
                depositAmount = depositAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(depositAmount, 18);
            let tx = await carbonContract.deposit(amountInWei);
            await tx.wait();
            setDepositAmount("");
            await fun();
            
        }catch(e){
            console.error(e);
        }
    }

    const withdraw = async() => {
        try{
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const carbonContract = new ethers.Contract(CarbonFinanceAddress, CarbonFinanceAbi, signer);
            if (typeof withdrawAmount !== 'string') {
                withdrawAmount = withdrawAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(withdrawAmount, 18);
            let tx = await carbonContract.withdraw(amountInWei);
            await tx.wait();
            setWithdrawAmount("");
            await fun();
            
        }catch(e){
            console.error(e);
        }
    }

    // React.useEffect(() => {
    //     window.scrollTo(0, 0);
    // });
    return (
        <Layout>
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
                                            <h4 className='mb-0 text-normal font-semi-bold' style={{color: '#FF0099'}}>{userDeposit ? (userDeposit/1e18).toFixed(2) : "0.00"} USDC</h4>
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
                                        <Tab eventKey="deposite" title="Deposit USDC">
                                            <div className="pt-4">
                                                <div className="h4 mb-4 pb-2">Deposit USDC</div>

                                                <div className="d-flex flex-wrap mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>from</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>

                                                    <span className='ms-auto'>Balance {busdBalance? parseFloat(busdBalance/1e18).toFixed(2) : "0.00"}</span>
                                                </div>

                                                <Form>
                                                    <input type="text" className='form-control mb-3 form-dark' placeholder='0.0' value={depositAmount} onChange={(e)=>{setDepositAmount(e.target.value)}}/>
                                                    {(allowance/1e18) >= depositAmount ? 
                                                    <Button variant='grad' className='w-100' onClick={deposit}>Deposit</Button> :
                                                    <Button variant='grad' className='w-100' onClick={approve}>Approve</Button>}
                                                </Form>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="withdraw" title="Withdraw USDC">
                                        <div className="pt-4">
                                                <div className="h4 mb-4 pb-2">Withdraw USDC</div>

                                                <div className="d-flex flex-wrap mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>from</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>

                                                    <span className='ms-auto'>Balance {userDeposit? parseFloat(userDeposit/1e18).toFixed(2) : "0.00"}</span>
                                                </div>

                                                <Form>
                                                    <input type="text" className='form-control mb-3 form-dark' placeholder='0.0' value={withdrawAmount} onChange={(e)=>{setWithdrawAmount(e.target.value)}}/>
                                                    <Button variant='grad' className='w-100' onClick={withdraw} >Withdraw</Button>
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
                                        <strong>{totalDeposited ? parseFloat(totalDeposited/1e18).toFixed(2) : "0.00"} USDC</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Available</span>
                                        <strong>{totalDeposited ? parseFloat((totalDeposited - (2 * totalELEM))/1e18).toFixed(2) : "0.00"} USDC</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Borrowed</span>
                                        <strong>{totalBorrowPercent? parseFloat(totalBorrowPercent).toFixed(2) : "0.00"}%</strong>
                                    </div>
                                    <div className="f16 d-flex align-items-center justify-content-between mb-2">
                                        <span>Collateral</span>
                                        <strong>{totalDeposited ? parseFloat(totalDeposited/1e18).toFixed(2) : "0.00"} USDC</strong>
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