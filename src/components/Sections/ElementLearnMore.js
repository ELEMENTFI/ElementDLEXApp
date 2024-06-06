import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Icon1 from '../../assets/images/learnMore-icon1.png';
import Icon2 from '../../assets/images/learnMore-icon2.png';
import Icon3 from '../../assets/images/learnMore-icon3.png';
import Icon4 from '../../assets/images/learnMore-icon4.png';
import learnCircle from '../../assets/images/learn-more-circle.png';
import { Link } from 'react-router-dom';

const ElementLearnMore = () => {
    return (
        <div>
            <Row className='text-center mb-60 element-protocol-heading'>
                <Col sm={12}>
                    <h2 className='mb-0 text-uppercase'>Learn More</h2>
                </Col>
            </Row>

            <Row>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon1} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span className="text-uppercase">Algorithmic Stable coin</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>Users mint any type of stablecoins by burning ELEM and depositing collateral.</p>

                        <a href='https://docs.elementfi.io' target="_blank" rel="noreferrer" className="btn btn-secondary">Learn More</a>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon2} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span className="text-uppercase">Decentralized currency</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>ELEM is the first decentralized liquidity owned algorithmic currency on the Algorand... </p>

                        <a href='https://docs.elementfi.io' target="_blank" rel="noreferrer" className="btn btn-secondary">Learn More</a>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon3} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span className="text-uppercase">Zero fee exchange</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>Capital Efficient Automated Market Maker with staking and Yield Farming benefits</p><br/>

                        <a href='https://docs.elementfi.io' target="_blank" rel="noreferrer" className="btn btn-secondary">Learn More</a>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon4} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span className="text-uppercase">NFT Marketplace</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>Enterprise-Grade No cost ASA based NFT trading platform</p><br/><br/>

                        <a href='https://docs.elementfi.io' target="_blank" rel="noreferrer" className="btn btn-secondary">Learn More</a>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ElementLearnMore;