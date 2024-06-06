import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon1 from "../../assets/images/tau-icon1.png";
import Icon2 from "../../assets/images/tau-icon2.png";
import Icon3 from "../../assets/images/tau-icon3.png";

const Economy = () => {
    return (
        <div className='economy'>
            <Container fluid="lg">
                <Row className='text-center mb-100 justify-content-center'>
                    <Col lg={9} xl={12}>
                        <p className='text-shadow text-uppercase lead'>ENTER THE DEFI 2.0 HUB</p>
                        <h1 className='px-xl-5 mx-xl-8'>BE PART OF THE OPEN ECONOMY OF THE FUTURE</h1>
                        <p className='text-shadow lead'>ELEMENT is  a cohesive ecosystem of interdependent DeFi 2.0 protocols and platforms built for the borderless future</p>
                    </Col>
                </Row>

                <Row className='justify-content-end'>
                    <Col lg={6} xl={5}>
                        <div className="card-bond card-economy mb-4">
                            <div className="card-bond-inner card-bond-inner-sm">
                                {/* <Row>
                                <Col className="col-sm-2"> */}
                                <img src={Icon1} alt="icon" />
                                {/* </Col>
                                <Col> */}
                                {/* <p>TAU integrates with the Liquidity Protocol and provide zero fee decentralized exchange.</p> */}
                                <p>TAU PROTOCOL  is a modern way to issue Sound and Stable Programmable Money that maintains its buying power irrespective of the market's direction.</p>

                                {/* </Col>
                                </Row> */}
                            </div>
                        </div>
                        <div className="card-bond card-economy mb-4">
                            <div className="card-bond-inner card-bond-inner-sm">
                            {/* <Row>
                            <Col className="col-sm-2"> */}
                                <img src={Icon2} alt="icon" />
                                {/* </Col>
                                <Col> */}
                                {/* <p>Money Market benefits from the TAU treasury to provide Liquidation Fee Lending thus increasing the network value.</p> */}
                                <p>ELECTRON PROTOCOL enhances the Money Market economics with Liquidation Free Loans and Exchange dynamics with ZERO Fee Policy.</p>

                                {/* </Col>
                            </Row> */}
                            </div>
                        </div>
                        <div className="card-bond card-economy mb-5">
                            <div className="card-bond-inner card-bond-inner-sm">
                            {/* <Row>
                                <Col className="col-sm-2"> */}
                                <img src={Icon3} alt="icon" />
                                {/* </Col>
                                <Col> */}
                                <p>Stablecoin as a Service platform as a one-stop-shop for futuristic TradFi and CDBC initiatives leveraging Algorand's co-chain architecture.</p>
                                {/* </Col>
                            </Row> */}
                            </div>
                        </div>

                        <center><Link to="/elemcurrency" className='m-md-2 mb-3 btn btn-lg btn-grad'>Access ELEMENT Hub   
                            <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.6389 8.36952L18.8028 8.2H18.567H0.967033C0.700676 8.2 0.486002 8.10872 0.33782 7.95548C0.189347 7.80195 0.1 7.57826 0.1 7.3C0.1 7.02174 0.189347 6.79805 0.33782 6.64452C0.486002 6.49128 0.700676 6.4 0.967033 6.4H18.567H18.8064L18.6382 6.22972L14.0939 1.63048C14.0937 1.63036 14.0936 1.63023 14.0935 1.63011C13.7445 1.26887 13.7447 0.730627 14.0939 0.369516C14.4414 0.0101614 14.9564 0.0101614 15.3039 0.369516L21.7831 7.06952C21.939 7.23075 21.939 7.46925 21.7831 7.63048L15.3039 14.3305C14.9564 14.6898 14.4414 14.6898 14.0939 14.3305C13.7445 13.9692 13.7445 13.4308 14.0939 13.0695L18.6389 8.36952Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/>
                            </svg>
                        </Link></center>
                     </Col>
                </Row> 
            </Container>
        </div>
    );
};

export default Economy;