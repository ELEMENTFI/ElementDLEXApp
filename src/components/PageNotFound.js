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

function PageNotFound() {

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
                        
                        <center>
                        <h1>404 Page Not Found</h1>
                        <p>The page you are looking for does not exist.</p>
                        </center>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
</div>

    );
}

export default PageNotFound;
