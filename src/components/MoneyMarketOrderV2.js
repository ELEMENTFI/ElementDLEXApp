import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Form, Tabs, Tab, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
import ButtonLoad from 'react-bootstrap-button-loader';
import OrderIcon from '../assets/images/order-icon.png';

import BG from '../assets/images/bg-v2-new.png';
import BGGrad from '../assets/images/bg-grad.png';
import elementLogo from '../assets/images/element logo.png'
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import BigInt from 'BigInt';
import { CarbonFinanceAbi, CarbonFinanceAddress, ERC20MockAbi, ERC20MockAddress, cftokenAbi, cftokenAddress } from '../abi';

const MoneyMarket = () => {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const url = "https://bsc-testnet-rpc.publicnode.com";
    const provider = new ethers.providers.JsonRpcProvider(url);

    // const [provider, setProvider] = useState("");
    const [allowance, setAllowance] = useState("");
    const [allowance2, setAllowance2] = useState("");
    const [borrowAmount, setborrowAmount] = useState("");
    const [repayAmount, setrepayAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [liquidateAmount, setLiquidateAmount] = useState("");
    const [busdBalance, setbusdBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState();
    const [userDeposit, setUserDeposit] = useState("");
    const [userDebt, setUserDebt] = useState("");
    const [totalDeposited, setTotalDeposited] = useState("");
    const [totalELEM, setTotalELEM] = useState("");
    const [totalBorrowPercent, setTotalBorrowPercent] = useState("");
    const [repayToken, setRepayToken] = useState("ELEM");
    const [loader, setLoader] = useState(false);
    const [loader1, setLoader1] = useState(false);
    const [loader2, setLoader2] = useState(false);

    const fun = async() => {
        const erc20Contract = new ethers.Contract(ERC20MockAddress, ERC20MockAbi, provider);
        const carbonContract = new ethers.Contract(CarbonFinanceAddress,CarbonFinanceAbi, provider);
        const cfContract = new ethers.Contract(cftokenAddress, cftokenAbi, provider);

        let allowance1 = ethers.utils.formatUnits( await erc20Contract.allowance(address, CarbonFinanceAddress), 0); 
        setAllowance(allowance1);
        let allowance2 = ethers.utils.formatUnits( await cfContract.allowance(address, CarbonFinanceAddress), 0); 
        setAllowance2(allowance2);
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
        
        console.log("allowance:", allowance1, allowance2,  balance1, userDeposit1, userDebt1);
    }

    const approve = async() => {
        try{
            setLoader1(true);
            console.log("approve starts...");
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const erc20Contract = new ethers.Contract(ERC20MockAddress, ERC20MockAbi, signer);
            const cfContract = new ethers.Contract(cftokenAddress, cftokenAbi, signer);
            let tx;
            if(repayToken === "ELEM"){
                tx = await cfContract.approve(CarbonFinanceAddress, ethers.utils.parseUnits((repayAmount).toString(), 18));
            } else {
                tx = await erc20Contract.approve(CarbonFinanceAddress, ethers.utils.parseUnits((repayAmount).toString(), 18));
            }
            
            await tx.wait();
            await fun();
            setLoader1(false);
        }catch(e){
            setLoader1(false);
            console.error(e);
        }
       
    }

    const borrow = async() => {
        try{
            setLoader(true);
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const carbonContract = new ethers.Contract(CarbonFinanceAddress, CarbonFinanceAbi, signer);
            if (typeof borrowAmount !== 'string') {
                borrowAmount = borrowAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(borrowAmount, 18);
            let tx = await carbonContract.mint(amountInWei);
            await tx.wait();
            setborrowAmount("");
            await fun();
            setLoader(false);
        }catch(e){
            setLoader(false);
            console.error(e);
        }
    }

    const repay = async() => {
        try {
            setLoader1(true);
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const carbonContract = new ethers.Contract(CarbonFinanceAddress, CarbonFinanceAbi, signer);
            if (typeof repayAmount !== 'string') {
                repayAmount = repayAmount.toString();
            }
            
            // Convert the deposit amount to wei
            let amountInWei = ethers.utils.parseUnits(repayAmount, 18);
            let tx;
            if(repayToken === "ELEM"){
                tx = await carbonContract.repay(0, amountInWei);
            }
            else {
                tx = await carbonContract.repay(amountInWei, 0);
            }
            
            await tx.wait();
            setrepayAmount("");
            await fun();
            setLoader1(false);
        }catch(e){
            setLoader1(false);
            console.error(e);
        }
    }

    const liquidate = async() => {
        try{
            setLoader2(true);
            const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
            const signer =  ethersProvider.getSigner();
            const carbonContract = new ethers.Contract(CarbonFinanceAddress, CarbonFinanceAbi, signer);
            let tx = await carbonContract.liquidate(ethers.utils.parseUnits((liquidateAmount).toString(), 18));
            await tx.wait();
            setLiquidateAmount("");
            await fun();
            setLoader2(false);
        }catch(e){
            setLoader2(false);
            console.error(e);
        }
    }

    useEffect(() => {
        fun();
    }, [address, isConnected]);


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
                                    <h4 className="mb-20 font-bold card-left-title font-normal">Add collateral in order to borrow assets </h4>
                                    <div className='h8 mb-30'>Gain exposure to tokens without reducing your assets. Leverage will enable you to take short positions againts assets and earn from downside movements.</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={8} lg={8} xl={6} className='mb-xl-0 mb-4'>
                            <div className="money-market-card h-100">
                                <div className="money-market-card-order-header d-flex align-items-center">
                                    <img src={elementLogo} alt="elementLogo" style={{"height": "65px", "width": "65px"}} />
                                    <div className='ps-3'>
                                        <div className="h4 mb-2">Borrow ELEM</div>
                                        <p className='d-flex flex-wrap'><span className='d-flex align-items-center me-5'>Collateral: <div className="h6 mb-0">ELEM</div></span> 
                                        {/* <span className='d-flex align-items-center'>Oracle: <div className="h6 mb-0">Chainink</div></span> */}
                                        </p>
                                    </div>
                                </div>

                                <div className="money-market-card-order-body">
                                    <div className="row mb-30">
                                        <div className="col-4">
                                            <p className='mb-0' style={{color: '#969696'}}>Collateral</p>
                                            <h4 className='mb-0 text-normal font-semi-bold' style={{color: '#FF0099'}}>{userDeposit ? (userDeposit/1e18).toFixed(2) : "0.00"} USDC</h4>
                                            {/* <h5 className='mb-0'>$0.00</h5> */}
                                        </div>
                                        <div className="col-4">
                                            <p className='mb-0' style={{color: '#969696'}}>Borrowed</p>
                                            <h5 className='mb-0'>{userDebt ? (userDebt/1e18).toFixed(2) : "0.00"} ELEM</h5>
                                        </div>
                                        <div className="col-4">
                                            <p className='mb-0' style={{color: '#969696'}}>Borrow%</p>
                                            <h5 className='mb-0'>50%</h5>
                                        </div>
                                    </div>

                                    <Tabs
                                        defaultActiveKey="borrow"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className='tabs-dark'
                                    >
                                        <Tab eventKey="borrow" title="Borrow">
                                            <div className="pt-4">
                                                <div className="h4 mb-4 pb-2">Borrow ELEM</div>

                                                {/* <div className="d-flex flex-wrap mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>Add ETH collateral from </span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>

                                                    <span className='ms-auto'>Balance 0</span>
                                                </div> */}

                                                {/* <input type="text" className='form-control mb-4 form-dark' placeholder='0.0' /> */}

                                                <div className="d-flex flex-wrap mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45-up'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>Borrow ELEM to</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>wallet</Button>

                                                    <span className='ms-auto'>Max {userDeposit ? ((((userDeposit)/(1e18))/2) - (userDebt/1e18)).toFixed(2) : "0.00"}</span>
                                                </div>

                                                <input type="number" className='form-control mb-3 form-dark' placeholder='0.0' value={borrowAmount} onChange={(e)=>{setborrowAmount(e.target.value)}}/>
                                                {borrowAmount >= (((userDeposit/(1e18))/2) - (userDebt/1e18)) ? 
                                                    <Button variant='grad' className='w-100' disabled>Insufficient Collateral</Button> :
                                                    <ButtonLoad loading={loader} variant='grad' className='w-100' onClick={borrow}>Borrow Elem</ButtonLoad>}
                                                
                                            </div>
                                        </Tab>
                                        <Tab eventKey="repay" title="Repay">
                                        <div className="pt-4">
                                                <div className="h4 mb-4 pb-2">Repay ELEM</div>

                                                <div className="d-flex mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>from</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>&nbsp;&nbsp;&nbsp;
                                                    <Button variant={repayToken === "ELEM" ?'success' : 'outline-success'} className='btn-sm my-2' onClick={()=>{setRepayToken("ELEM")}}>ELEM</Button>&nbsp;&nbsp;&nbsp;
                                                    <Button variant={repayToken === "USDC" ?'success' : 'outline-success'} className='btn-sm my-2' onClick={()=>{setRepayToken("USDC")}}>USDC</Button>

                                                    <span className='ms-auto'>Debt {userDebt? parseFloat(userDebt/1e18).toFixed(2) : "0.00"} ELEM</span>
                                                </div>

                                                <Form>
                                                <div className="d-flex mb-3">
                                                    <input type="number" className="form-control form-dark" placeholder="0.0" value={repayAmount} onChange={(e)=>{setrepayAmount(e.target.value)}}/>
                                                </div>

                                                {
                                                repayToken === "ELEM" &&
                                                <>{ (allowance2/1e18) >= repayAmount ?
                                                    <ButtonLoad loading={loader1} variant='grad' className='w-100' onClick={repay}>Repay</ButtonLoad> :
                                                    <ButtonLoad loading={loader1} variant='grad' className='w-100' onClick={approve}>Approve ELEM</ButtonLoad>
                                                }</>
                                                }

{
                                                repayToken === "USDC" &&
                                                <>{ (allowance/1e18) >= repayAmount ?
                                                    <ButtonLoad loading={loader1} variant='grad' className='w-100' onClick={repay}>Repay</ButtonLoad> :
                                                    <ButtonLoad loading={loader1} variant='grad' className='w-100' onClick={approve}>Approve USDC</ButtonLoad>
                                                }</>
                                                }
                                                    
                                                    {/* <Button variant='grad' className='w-100' onClick={repay}>Repay</Button> */}
                                                </Form>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="liquidate" title="Liquidate">
                                        <div className="pt-4">
                                                <div className="h4 mb-4 pb-2">Liquidate USDC</div>

                                                <div className="d-flex mb-24 align-items-center" style={{color: '#969696'}}>
                                                    <span className='arrow-45'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span>
                                                    <span className='mx-3'>from</span>

                                                    <Button variant='outline-danger' className='btn-sm my-2'>Wallet</Button>

                                                    <span className='ms-auto'>Balance {userDeposit? parseFloat(userDeposit/1e18).toFixed(2) : "0.00"} USDC</span>
                                                </div>

                                                <Form>
                                                <input type="number" className='form-control mb-3 form-dark' placeholder='0.0' value={liquidateAmount} onChange={(e)=>{setLiquidateAmount(e.target.value)}}/>
                                                    <ButtonLoad loading={loader2} variant='grad' className='w-100' onClick={liquidate}>Liquidate USDC</ButtonLoad>
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
                                        <strong>{totalELEM? parseFloat(totalELEM/1e18).toFixed(2) : "0.00"} ELEM</strong>
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