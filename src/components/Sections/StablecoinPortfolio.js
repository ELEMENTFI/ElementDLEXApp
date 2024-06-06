import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Picture from '../../assets/images/elem-governance white.png';

const StablecoinPortfolio = () => {
    return (
        <div className='element-statbiliy element-statbiliy-gov pt-5 text-md-start text-center'>
            <Container fluid="lg">
                <Row className='justify-content-between align-items-center'>
                    <Col md={5} lg={5} className="mb-3 md-md-0 order-md-2">
                        <h3 className="h3">STABLECOIN PORTFOLIO</h3>
                        <p>Element aims to address vital region-specific currency needs as a portfolio of stablecoins, each pegged to the world's major currencies.</p>
                    </Col>
                    <Col md={7} lg={7} className="mb-3 md-md-0 text-center">
                        <img src={Picture} alt="Picture1" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StablecoinPortfolio;