import React from 'react';
import { Col, Container, Row, Button, Badge } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { ToastContainer, Zoom } from 'react-toastify';
import { useLocation, useHistory } from "react-router-dom";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'; 
import { ethers } from 'ethers';
import { ConnectWallet } from '../generalFunctions';
import { getAccountsFirebase } from '../firebasefunctions';
import bgBackgroundImage from '../assets/images/main_cover.png';
import logo from '../assets/images/element logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function AccountVerifier() {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const navigate = useHistory();

    const [verify, setVerify] = useState("");
    const [accounts, setAccounts] = useState([]);

    const connectWalletSei = async () => {
        await ConnectWallet();
    }

    const checkEligibility = async () => {
        if (isConnected) {
            let verify1;
            let accounts1 = await getAccountsFirebase();
            setAccounts(accounts1);

            for (let i = 0; i < accounts1.length; i++) {
                if ((accounts1[i].account).toLowerCase() === (address).toLowerCase()) {
                    verify1 = true;
                    setVerify(true);
                    // setEligibile(true);
                    // localStorage.setItem('eligibility', JSON.stringify(true));
                    break;
                } else {
                    verify1 = false;
                    setVerify(false);
                    // setEligibile(false);
                    // localStorage.setItem('eligibility', JSON.stringify(false));
                }
            }
            if (verify === true || verify1 === true) {
                navigate.push('/swap');
            }
        } else {
            setVerify("");
        }
    }

    useEffect(() => {
        if (isConnected) {
            checkEligibility();
        }
    }, [address, isConnected]);

    return (
        <div style={{ backgroundImage: `url(${bgBackgroundImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
    <ToastContainer position='bottom-right' draggable={false} transition={Zoom} autoClose={8000} closeOnClick={false} />
    <div className="flex items-center gap-3" style={{ marginLeft: "20px", marginTop: "20px"}}>
        <img src={logo} alt="logo icon" style={{height: "60px", width: "60px"}}/>
        <p className="text-white font-bold text-xl tablet:text-2xl">
            ELEMENT
        </p>
    </div>
    <div className="page-content d-flex align-items-center justify-content-center" style={{ paddingTop: '1vh' }}>
        <Container fluid className="p-0">
            <Row className="justify-content-center">
                <Col lg={6} className="mb-lg-0 mb-4 order-lg-2">
                    <div className="card-base card-shadow card-dark" style={{ height: "auto", overflow: 'auto' }}>
                        <h3>Check your Eligibility !!</h3>
                        <center>
                            {isConnected ? (
                                <>
                                    <Button className="mt-xxl-4 mt-2 btn w-70 btn-grad" style={{ width: "50%" }} onClick={connectWalletSei}>Disconnect Wallet</Button>
                                    <br/><center>{verify === false && 
                                        <Badge bg="danger" className="mb-3 badg">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                            Your Wallet is not allowed to access this Website.
                                        </Badge>}</center>
                                </>
                            ) : (
                                <Button className="mt-xxl-4 mt-2 btn w-70 btn-grad" style={{ width: "50%" }} onClick={connectWalletSei}>Connect Wallet</Button>
                            )}
                        </center>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
</div>

    );
}

export default AccountVerifier;
