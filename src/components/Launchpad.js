import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button} from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
import {
    Link
  } from "react-router-dom";

import Banner from '../assets/images/eclipse-banner-image.png'
import PostCard from './Snippets/PostCard';
import PostCardElem from './Snippets/PostCardElem';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import './toast-style-override.css'
function Launchpad() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });
    return (
        <Layout>
            <div className="page-content">
            
                <div className="eclipse-banner">
                    <Container fluid="lg">
                    
                        <img src={Banner} className='eclipse-banner-image' alt="banner" />
                        <Row>
                            <Col md={6} lg={5}>
                                <h2 className='h3'>ELEMENT LAUNCHPAD</h2>
                                <p className='text-gray-D2'>Be the first to join the first regulated crowdfunding platform on Algorand enabling projects to raise capital on a decentralized and interoperable environment.</p>
                                <h6 className='mb-10'>Want to launch your project with us?</h6>
                                <Link to="#" className="btn-link-purple">Click here to apply</Link>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Container fluid="lg">
                    <div className="d-flex filter-responsive flex-wrap mb-20 align-items-center justify-content-xl-between justify-content-center">
                        <ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                            <li><a href="#" className='active'>live</a></li>
                            <li><a href="#">upcoming</a></li>
                            <li><a href="#">completed</a></li>
                        </ul>
                        
                        <Form>
                            <InputGroup className="input-group-search">
                                <Form.Control placeholder="Search by name, symbol or address" />
                                <Button variant="reset">
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.0693 2.06396C16.0373 2.06396 20.0693 6.09596 20.0693 11.064C20.0693 16.032 16.0373 20.064 11.0693 20.064C6.10134 20.064 2.06934 16.032 2.06934 11.064C2.06934 6.09596 6.10134 2.06396 11.0693 2.06396ZM11.0693 18.064C14.9363 18.064 18.0693 14.931 18.0693 11.064C18.0693 7.19596 14.9363 4.06396 11.0693 4.06396C7.20134 4.06396 4.06934 7.19596 4.06934 11.064C4.06934 14.931 7.20134 18.064 11.0693 18.064ZM19.5543 18.135L22.3833 20.963L20.9683 22.378L18.1403 19.549L19.5543 18.135Z" fill="white"/>
                                    </svg>
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>

                    <Row className='mb-5'>
                        <Col lg={4} className='mb-4'>
                            <PostCard />
                        </Col>
                        {/* <Col lg={4} className='mb-4'>
                            <PostCardElem />
                        </Col> */}
                        {/* <Col lg={4} className='mb-4'>
                            <PostCard />
                        </Col>
                        <Col lg={4} className='mb-4'>
                            <PostCard />
                        </Col> */}
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}

export default Launchpad;