import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import RoadMap from '../../assets/images/roadmap-shape.png';

const ElementRoadMap = () => {
    return (
        <div className='pb-5 mb-xxl-5'>
            <Container>
                <Row className='text-center mb-60 element-protocol-heading'>
                    <Col sm={12}>
                        <h2 className='mb-0'>Roadmap</h2>
                    </Col>
                </Row>
            </Container>

            <div className="roadmap position-relative overflow-auto">
                <Container fluid="lg">
                    <div className="roadmap-inner">
                        <img src={RoadMap} alt="map" className='m-auto d-block' />

                        <div className="roadmap-item roadmap-item-odd roadmap-item-1">
                            <p>Launchpad Yield Farming</p> <small>Q1 2022</small>
                        </div>
                        <div className="roadmap-item roadmap-item-even roadmap-item-2">
                            <p>ELEM Currency NFT Marketplace Element Swap</p> <small>Q2 2022</small>
                        </div>
                        <div className="roadmap-item roadmap-item-odd roadmap-item-3">
                            <p>NFT Staking <br />TAU Currency <br />TWAP API and Analytics <br />Moonpay Integration</p> <small>Q3/Q4 2022</small>
                        </div>
                        <div className="roadmap-item roadmap-item-even roadmap-item-4">
                            <p>Compound Yield Money Market CrossChain Bridge</p> <small>Q1/Q2 2023</small>
                        </div>
                        <div className="roadmap-item roadmap-item-odd roadmap-item-5">
                            <p>All-in-One Mobile App DAO Governance</p> <small>Q3 2023</small>
                        </div>
                        <div className="roadmap-item roadmap-item-even roadmap-item-6">
                            <p>API & SDK Foundation Grants</p> <small>Q4 2023</small>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default ElementRoadMap;