import React from 'react';
import { Col, Container, Row, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
import {
    Link
  } from "react-router-dom";

  import Icon1 from '../assets/images/elem-original.png';
  import Icon2 from '../assets/images/tau-original.png';

function FarmPage() {
    return (
        <Layout>
            <div className="page-content">
                <Container fluid="lg">
                    <Row>
                        <Col lg={4} xl={3} className='mb-lg-0 mb-4'>
                            <div className="card-base card-dark card-left">
                                <h2 className="h3 mb-20 font-semi-bold">Vaults</h2>
                                <h5 className='text-gray text-normal mb-30'>Long term supporters can choose to lock ELEM for a determined period for higher rewards and increased multipliers for Launchpad. <br /><a href="https://x.com/ElementDeFi" target='blank' className="btn-link-white">See how it works.</a></h5>

                                <h6 className='text-gray-D2'>Total value locked(TVL)</h6>
                                <h3 className='mb-30'>$0.00</h3>

                                <h6 className='text-gray-D2'>Farms TVL</h6>
                                <h3 className='mb-30'>$0.00</h3>

                                <h6 className='text-gray-D2'>My Holdings</h6>
                                <h3 className='mb-0'>$0.00</h3>
                            </div>
                        </Col>
                        <Col lg={8} xl={9}>
                            <div className="d-flex filter-responsive font-16 flex-wrap mb-3 align-items-center justify-content-xl-between justify-content-center">
                                <ul className="nav-filter mb-xl-0 mb-3 d-flex align-items-center list-unstyled">
                                    <li><a href="/" className='active'>All Vaults</a></li>
                                    <li><a href="/">My Vaults</a></li>
                                </ul>
                                
                                <p className='text-gray-66'>Everytime you stake or claim rewards your lock time renews</p>
                            </div>

                            <div className="table-group-outer">
                                <div className="table-group-head">
                                    <div className="table-group-tr">
                                        <div className="table-group-th">Liquidity</div>
                                        <div className="table-group-th">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    TVL
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="table-group-th">Rewards</div>
                                        <div className="table-group-th text-end">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                                    APR
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-group-body">
                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>ELEM / ETH</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	element / day</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        annualized
                                                    </Tooltip>
                                                }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                    </svg>
                                                </OverlayTrigger>
                                            </p>
                                            <p>annualized</p>
                                        </div>
                                    </div>

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>ELEM / ETH</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	element / day</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        annualized
                                                    </Tooltip>
                                                }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                    </svg>
                                                </OverlayTrigger>
                                            </p>
                                            <p>annualized</p>
                                        </div>
                                    </div>

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>ELEM / ETH</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	element / day</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        annualized
                                                    </Tooltip>
                                                }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                    </svg>
                                                </OverlayTrigger>
                                            </p>
                                            <p>annualized</p>
                                        </div>
                                    </div>

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>ELEM / ETH</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	element / day</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        annualized
                                                    </Tooltip>
                                                }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                    </svg>
                                                </OverlayTrigger>
                                            </p>
                                            <p>annualized</p>
                                        </div>
                                    </div>

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>ELEM / ETH</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	element / day</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        annualized
                                                    </Tooltip>
                                                }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                    </svg>
                                                </OverlayTrigger>
                                            </p>
                                            <p>annualized</p>
                                        </div>
                                    </div>

                                    <div className="table-group-tr">
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>ELEM / ETH</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td">$60,419.94</div>
                                        <div className="table-group-td">
                                            <div className="d-flex align-items-center td-cell">
                                                <img src={Icon1} alt='icon' />
                                                <img src={Icon2} alt='icon' />
                                                <span>651.30	element / day</span>
                                            </div>
                                        </div>
                                        <div className="table-group-td text-end">
                                            <p>253% 
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        annualized
                                                    </Tooltip>
                                                }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                    </svg>
                                                </OverlayTrigger>
                                            </p>
                                            <p>annualized</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pagination-footer d-flex align-items-center justify-content-between">
                                <p>showing 1-5 from 150</p>

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
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}

export default FarmPage;