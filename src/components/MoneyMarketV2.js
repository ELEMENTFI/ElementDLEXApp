import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { Link} from "react-router-dom";
import Layout from './Layouts/LayoutInner';
import Icon1 from '../assets/images/icon1.png';
import Icon2 from '../assets/images/icon2.png';
import tauLogo from '../assets/images/tau-original.png'
import usdcLogo from '../assets/images/usdc-logo.png'
import elemLogo from '../assets/images/elem-original.png'
import colorLogo from '../assets/images/element logo.png'

import BG from '../assets/images/bg-v2.png';

const MoneyMarket = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });
    return (
        <Layout>
            <div className="page-content">
                <Container fluid="lg">
                    <Row>
                        <Col md={4} lg={4} xl={3} className='mb-lg-0 mb-4'>
                            <div className="card-border-grad card-shadow card-market card-left">
                                <div className="card-border-grad-inner" style={{backgroundImage: `url(${BG})`}}>
                                    <h4 className="mb-20 font-bold card-left-title font-normal">Borrow assets and leverage up</h4>
                                    <div className='h8 mb-30'>Borrowing allows you to  obtain liquidity without selling. Your borrow limit depends on the amount of deposited collateral. You will be able to borrow up to 75% of your collateral and repay at any time with accured interest.</div>
                                </div>
                            </div>
                        </Col>
                        <Col md={8} lg={8} xl={9}>
                            <div className="money-market-card">
                                <div className="money-market-card-header d-flex flex-wrap flex-xl-row flex-column align-items-center justify-content-xl-between justify-content-center">
                                    <h4 className='font-normal mb-xl-0 mb-3 text-uppercase'>Borrow</h4>
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

                                <div className="money-market-card-body">
                                    <div className="table-group-outer table-group-market">
                                        <div className="table-group-head px-3">
                                            <div className="table-group-tr">
                                                <div className="table-group-th">Markets</div>
                                                <div className="table-group-th">Lending</div>
                                                <div className="table-group-th">Collateral</div>
                                                {/* <div className="table-group-th">Oracle</div> */}
                                                <div className="table-group-th">APR
                                                    {/* <Dropdown>
                                                        <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                            APR
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown> */}
                                                </div>
                                                <div className="table-group-th">Borrowed</div>
                                                <div className="table-group-th text-end">Total</div>
                                            </div>
                                        </div>

                                        <div className="table-group-body px-3">
                                        <Link to="/borrow-card">
                                            <div className="table-group-tr">
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={usdcLogo} alt='icon' />
                                                        <img src={colorLogo} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase" style={{color:"white"}}>ELEM</div>
                                                <div className="table-group-td text-uppercase" style={{color:"white"}}>USDC</div>
                                                {/* <div className="table-group-td" style={{color:"white"}}>Chainlink</div> */}
                                                <div className="table-group-td" style={{color:"white"}}>8.47%</div>
                                                <div className="table-group-td" style={{color:"white"}}>78.52%</div>
                                                <div className="table-group-td text-end" style={{color:"white"}}>
                                                    <p>1,850 ETH <br />$51,245</p>
                                                </div>
                                            </div>
                                            </Link>
                                            {/* <div className="table-group-tr">
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase">algo</div>
                                                <div className="table-group-td text-uppercase">ETH</div>
                                                <div className="table-group-td">Chainlink</div>
                                                <div className="table-group-td">89.20%</div>
                                                <div className="table-group-td">78.52%</div>
                                                <div className="table-group-td text-end">
                                                    <p>1,850 ETH <br />$51,245</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr">
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase">algo</div>
                                                <div className="table-group-td text-uppercase">ETH</div>
                                                <div className="table-group-td">Chainlink</div>
                                                <div className="table-group-td">89.20%</div>
                                                <div className="table-group-td">78.52%</div>
                                                <div className="table-group-td text-end">
                                                    <p>1,850 ETH <br />$51,245</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr">
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase">algo</div>
                                                <div className="table-group-td text-uppercase">ETH</div>
                                                <div className="table-group-td">Chainlink</div>
                                                <div className="table-group-td">89.20%</div>
                                                <div className="table-group-td">78.52%</div>
                                                <div className="table-group-td text-end">
                                                    <p>1,850 ETH <br />$51,245</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr">
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase">algo</div>
                                                <div className="table-group-td text-uppercase">ETH</div>
                                                <div className="table-group-td">Chainlink</div>
                                                <div className="table-group-td">89.20%</div>
                                                <div className="table-group-td">78.52%</div>
                                                <div className="table-group-td text-end">
                                                    <p>1,850 ETH <br />$51,245</p>
                                                </div>
                                            </div>
                                            <div className="table-group-tr">
                                                <div className="table-group-td">
                                                    <div className="d-flex align-items-center td-cell">
                                                        <img src={Icon1} alt='icon' />
                                                        <img src={Icon2} alt='icon' />
                                                    </div>
                                                </div>
                                                <div className="table-group-td text-uppercase">algo</div>
                                                <div className="table-group-td text-uppercase">ETH</div>
                                                <div className="table-group-td">Chainlink</div>
                                                <div className="table-group-td">89.20%</div>
                                                <div className="table-group-td">78.52%</div>
                                                <div className="table-group-td text-end">
                                                    <p>1,850 ETH <br />$51,245</p>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="table-group-footer py-3 px-3 pagination-footer d-flex align-items-center justify-content-between">
                                        <p>showing 1 from 1</p>

                                        <div className="d-flex align-items-center">
                                            <Button variant='arrow'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                            </Button>
                                            <Button variant='arrow'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
};

export default MoneyMarket;