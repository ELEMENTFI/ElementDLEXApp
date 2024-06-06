import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ProtocolIcon1 from '../../assets/images/protocol-icon1.png';
import ProtocolIcon2 from '../../assets/images/protocol-icon2.png';
import ProtocolIcon3 from '../../assets/images/protocol-icon3.png';
import ElementLearnMore from './ElementLearnMore';

const ElementProtocol = () => {
    return (
        <div className='element-protocol'>
            <Container fluid="lg">
                <Row className='text-center mb-60 element-protocol-heading'>
                    <Col sm={12}>
                        <h2 className='mb-4'>ELEMENT PROTOCOL</h2>
                        <p>Element is an algorithmic stablecoin and decentralized reserve currency minting protocol where price and supply volatility of two fundamentally different token mechanics autonomously balance each other through the minting and burning process in a closed ecosystem.</p>
                    </Col>
                </Row>

                <Row>
                    <Col lg={4} className='mb-lg-0 mb-3'>
                        <div className="ep-card">
                            <div className="ep-card-head">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className='mb-0'>STABLECOIN</h5>
                                    <img src={ProtocolIcon1} alt="icon" />
                                </div>
                            </div>

                            <h3 className="h3">Stablecoin Architecture is the core feature of the Element Protocol..</h3>

                            <Link to="/" className="btn btn-secondary">Learn More</Link>
                        </div>
                    </Col>
                    <Col lg={4} className='mb-lg-0 mb-3'>
                        <div className="ep-card">
                            <div className="ep-card-head">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className='mb-0'>Expansion</h5>
                                    <img src={ProtocolIcon2} alt="icon" />
                                </div>
                            </div>

                            <h3 className="h3">When the price of CARBON (TAU) is high relative to its peg, supply is too..</h3>

                            <Link to="/" className="btn btn-secondary">Learn More</Link>
                        </div>
                    </Col>
                    <Col lg={4} className='mb-lg-0 mb-3'>
                        <div className="ep-card">
                            <div className="ep-card-head">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className='mb-0'>Contraction</h5>
                                    <img src={ProtocolIcon3} alt="icon" />
                                </div>
                            </div>

                            <h3 className="h3">When the price of CARBON (TAU) is too low relative to its peg, supply is too large..</h3>

                            <Link to="/" className="btn btn-secondary">Learn More</Link>
                        </div>
                    </Col>
                </Row>

                <hr className='dotted-line' />

                <ElementLearnMore />

                <hr className='dotted-line' />
            </Container>
        </div>
    );
};

export default ElementProtocol;