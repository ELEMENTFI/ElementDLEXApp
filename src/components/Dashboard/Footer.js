import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
// import {
//     Link
//   } from "react-router-dom";
import Shape1 from '../../assets/images/footer-shape-1.png';
function Footer() {
    return (
        <div className="footer footer-inner">
            <img src={Shape1} className='footer-shape-1' alt="shape 1" />
            <Container fluid="lg" className='position-relative'>
                <div className="copyright text-center">
                    Copyright © 2022 Element
                </div>
            </Container>
        </div>
    );
}

export default Footer;