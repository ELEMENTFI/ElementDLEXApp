import React, {useState, useEffect} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import {
    Link
  } from "react-router-dom";

import ProtocolImage from "../../assets/images/protocol-image.png";
import ProtocolImageMOb from "../../assets/images/element-protocol-mob-image-2.png";

const HomeBannerBanking = () => {

    return (
        <div className='page-banner text-center'>
            <Container fluid="lg">
                <Row className='justify-content-center py-0'>
                    <Col xl={12}><br/><br/>
                        <h1>Algorand's Stablecoin DeFi 2.0 Hub</h1>
                    </Col>
                </Row>

                <div className="text-center banner-protocol-image">

                    <img src={ProtocolImage} alt="ProtocolImage" className='img-fluid d-none d-md-block mx-auto' />
                    <img src={ProtocolImageMOb} alt="ProtocolImage" className='img-fluid d-md-none w-100' />
                    
                </div>

                <Row className='justify-content-center banner-protocol-text'>
                    <Col xl={9} className="px-xl-5">
                       <p>The First Non-Dilutive Algorithmic Fractional Stablecoin Model to solve the so-called '‘Stablecoin Trilemma" problem via  Autonomous Demand Supply Balancer (ADSB) stabilization algorithm that orthogonally regulates the price dynamics through elastic supply adjustments, burn and bonding mechanics within a closed ecosystem.</p>
                        {/* <p>TAU is the first non-dilutive fractional stablecoin for DeFi 2.0, where the price balance is orthogonally regulated through ELEM elastic supply adjustments, burn and bonding mechanics within a closed ecosystem.</p> */}
                    </Col>
                </Row>

                <div className="pt-4">
                {/* <Link to="/dashboard" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>Stablecoin Hub</Link> */}
                <Link to="/elemcurrency" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>ELEM Currency</Link>
                <Link to="/swap" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>AMM DEX</Link>
                <Link to="/lending" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>Money Market</Link>
                {/* <Link to="/launchpad" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>Launchpad</Link> */}
                {/* <Link to="/farm" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>Yield Farming</Link> */}
                <a href="https://elementnft.vercel.app/" target="_blank" rel="noreferrer" className='m-md-2 mb-3 btn btn-lg btn-sm-full d-md-none btn-grad'>NFT Market</a>
                    {/* <Link to="/dashboard" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>Stablecoin Hub</Link> */}
                    <Link to="/elemcurrency" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>ELEM Currency</Link>
                    <Link to="/swap" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>AMM DEX</Link>
                    <Link to="/lending" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>Money Market</Link>
                    {/* <Link to="/launchpad" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>Launchpad</Link> */}
                    {/* <Link to="/farm" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>Yield Farming</Link> */}
                    {/* <a href="https://elementnft.vercel.app/" target="_blank" rel="noreferrer" className='m-md-2 mb-3 btn btn-lg btn-mob-full d-none d-md-inline-block btn-grad'>NFT Market</a> */}
                </div>
            </Container>
        </div>
    );
};

export default HomeBannerBanking;