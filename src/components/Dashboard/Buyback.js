import React from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import Arrow from '../../assets/images/arrow-tr.svg';
// import FilterDropdown from '../Snippets/FilterDropdown';

const Buyback = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <Layout>
            <Container fluid="lg">
                <Row className='mb-40'>
                    <Col md="4" sm="12" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>COLLATERAL</span>
                            <strong>35.06M USDC</strong>
                            {/* <div className="btn-filter-full">
                                <FilterDropdown />
                            </div> */}
                        </div>
                    </Col>
                    <Col md="4" sm="6" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>THEORETICALLY AVAILABLE</span>
                            <strong>35.06M USDC</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" className="mb-3">
                        <div className="card-graph flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>COLLATERAL RATIO</span>
                            <strong>84.50%</strong>
                        </div>
                    </Col>
                </Row>

                
                <Row>
                    <Col md={4} className="mb-4">
                        <div className="card-graph h-100">
                            <div className="my-auto">
                                <div className="card-graph-header mb-3 d-flex align-items-center justify-content-between">
                                    <div className='pe-5'>
                                        <p className='mb-1'>TAU</p>
                                    </div>
                                </div>

                                <div className="card-graph-body text-center pb-4 m-0">
                                    <Row className='align-items-center mb-4'>
                                        <Col md={12} className="mb-3">
                                            <input type="text" placeholder="Amount" className="form-control form-control-reset" />
                                        </Col>
                                        <Col md={12}>
                                            <Button variant='reset' className='text-white'>0 ELEM Balance</Button>
                                        </Col>
                                    </Row>

                                    <p className='text-center'><small>200K USDC Available for Buyback (7.52K ELEM)</small></p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="mb-4">
                        <div className="card-graph h-100 p-4">
                            <div className="card-graph-header mb-4 d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>EXCHANGE RATES</p>
                                </div>
                            </div>

                            <div className="card-graph-body pb-4 m-0">
                                <div className="mb-5">
                                    <div className="token-list-item token-list-item-nohover px-0">
                                        <div className="token-list-icon">
                                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                            </svg>
                                        </div>
                                        <div className="token-list-title">
                                            <span>USDC:</span><h6>$1.000</h6>                                        
                                        </div>
                                    </div>
                                    <div className="token-list-item token-list-item-nohover px-0">
                                        <div className="token-list-icon">
                                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                                <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                                <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                            </svg>
                                        </div>
                                        <div className="token-list-title">
                                            <span>USDC:</span><h6>$1.000</h6>                                        
                                        </div>
                                    </div>
                                </div>
                                <p className='text-center'>
                                0.4500% <strong>SWAP FEE</strong> <br /> <span className='text-green'>(0.00000 TAU)</span>
                                </p>
                                {/* <p className='text-center'>Pool (V3) 🌊 : 0x2fE0 ... 0729</p> */}
                            </div>
                        </div>
                    </Col>

                    <Col md={4} className="mb-4">
                        <div className="card-graph h-100 p-4">
                            <div className="card-graph-header mb-3 d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>YOU RECEIVE</p>
                                </div>
                            </div>

                            <div className="card-graph-body pb-4 m-0">
                                <div className="token-list-item token-list-item-nohover px-0">
                                    <div className="token-list-icon">
                                        <svg width="31" height="30" viewBox="0 0 31 30" fill="none" >
                                            <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg>
                                    </div>
                                    <div className="token-list-title flex-grow-1">
                                        <input type="text" placeholder="-" className="form-control text-center form-control-reset" />                  
                                    </div>
                                </div>
                            </div>
                            <center>
                            <button className='btn m-2 px-sm-5 btn-grad '>Buyback</button>
                            </center>
                        </div>
                    </Col>
                </Row>
                

            </Container>
        </Layout>
    );
};

export default Buyback;