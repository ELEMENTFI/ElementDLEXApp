import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Picture from '../../assets/images/price-stability-image.png';

const PriceStability = () => {
    return (
        <div className='element-statbiliy pt-md-5 pt-4 text-md-start text-center'>
            <Container fluid="lg">
                <Row className='justify-content-between align-items-center'>
                    <Col md={6} lg={5} className="mb-4 md-md-0">
                        <h3 className="h3">PRICE STABILITY</h3>
                        <p>The balancer ratio algorithmically allocates assets to maintain the equilibrium through <span style={{fontWeight: "bold"}}>Autonomous Demand Supply Balance (ADSB)</span> principles and arbitrage opportunities.</p>
                    </Col>
                    <Col md={6} lg={6} className="mb-3 md-md-0 text-center">
                        <img src={Picture} alt="Picture2" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PriceStability;