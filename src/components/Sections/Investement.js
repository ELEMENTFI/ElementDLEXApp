import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Circles from '../../assets/images/sm-planet.png'
import BigCircles from '../../assets/images/investment-vectores.png'

const Investement = () => {
    return (
        <div className='investement position-relative'>
            <Container>
                <div className="investement-inner">
                    <img src={Circles} className='investement-circles' alt="investement circles" />
                    <img src={BigCircles} className='investement-circles-big' alt="investement circles" />
                    <Row>
                        <Col lg={7}>
                            <h1 className='mb-3'>ARBITRAGE OPPORTUNITY</h1>
                            <h2>Price Stability</h2>
                            <p>Arbitrage Opportunities help regulate the demand-supply chain in the open market.</p>
                            {/* <p>The ELEM treasury will increase in value through a series of strategic investments thus increasing the backed price.</p> */}
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default Investement;