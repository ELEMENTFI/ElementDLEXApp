import React from 'react';
import { Col, Container, Row, Button, Dropdown } from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
// import {
//     Link
//   } from "react-router-dom";

function FarmPage() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });
    const [value, setValue] = React.useState('0.0');
    return (
        <Layout>
            <div className="page-content">
                <Container fluid="sm">
                    <div className="d-flex justify-content-center">
                        <ul className="nav-filter mx-auto mb-40 d-flex align-items-center list-unstyled">
                            <li><a href="#" className='active'>Bridge</a></li>
                            <li><a href="#">History</a></li>
                            <li><a href="#">Swap for gas</a></li>
                        </ul>
                    </div>

                    <h6 className='text-center mb-40'>Bridge tokens to and from the Algorand Network</h6>

                    <Row className='align-items-center mb-20'>
                        <Col md={5}>
                            <div className="card-base card-dropdown d-flex justify-content-center align-items-center card-dark">
                                <div className="card-icon">
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M28.7094 7.50782C27.711 9.24903 26.7614 10.7968 25.9334 12.3929C25.7143 12.8282 25.6169 13.457 25.7386 13.9165C27.0536 18.9224 28.4172 23.9284 29.7565 28.9344C29.8295 29.2246 29.9026 29.539 30 29.9743C28.5146 29.9743 27.1753 30.0227 25.8117 29.9259C25.5682 29.9018 25.2029 29.4423 25.1299 29.1037C24.2289 25.9357 23.401 22.7676 22.5244 19.5996C22.4513 19.3577 22.3782 19.1159 22.2565 18.729C21.9399 19.261 21.6964 19.6479 21.4529 20.0591C19.6753 23.1304 17.8734 26.1775 16.0958 29.273C15.8036 29.7808 15.487 29.9985 14.8782 29.9743C13.4659 29.9259 12.0536 29.9501 10.4464 29.9501C10.6899 29.4906 10.8604 29.1521 11.0552 28.8135C14.0747 23.614 17.0698 18.4388 20.1136 13.2635C20.4545 12.6831 20.5519 12.1994 20.3571 11.5465C19.8701 9.92617 19.4562 8.25751 18.9448 6.39538C18.6769 6.85487 18.4821 7.14507 18.3117 7.43527C14.099 14.6661 9.91072 21.8728 5.7224 29.1279C5.35714 29.7808 4.94318 30.0227 4.18831 29.9985C2.84903 29.9259 1.48539 29.9743 0 29.9743C0.219156 29.539 0.38961 29.2246 0.560065 28.9344C5.99026 19.5996 11.4205 10.2889 16.8019 0.95409C17.2159 0.228585 17.6542 -0.0616174 18.4821 0.0109332C19.3588 0.0834837 20.2354 0.0593002 21.112 0.0109332C21.7208 -0.0132503 22.013 0.156034 22.1834 0.808989C22.6705 2.76785 23.2549 4.72672 23.7662 6.68558C23.9123 7.29017 24.1802 7.532 24.8133 7.50782C26.0308 7.45945 27.2727 7.50782 28.7094 7.50782Z" fill="url(#paint0_linear_2_549)"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_2_549" x1="15" y1="40.1901" x2="15" y2="-8.03762" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#5B86E5"/>
                                        <stop offset="1" stop-color="#36D1DC"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="card-text">
                                    <span>From</span>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                            Ethereum
                                        </Dropdown.Toggle>

                                        {/* <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                        </Dropdown.Menu> */}
                                    </Dropdown>
                                </div>
                            </div>
                        </Col>
                        <Col md={2} className='text-center py-3'>
                            <Button variant='reset' className="d-md-none">
                                <svg width="62" height="61" viewBox="0 0 62 61" className='m-0' fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.919922" y="60.0796" width="60" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.0796)" fill="white"/>
                                    <path d="M31.0488 26.0296L35.9988 21.0796L40.9488 26.0296L39.5348 27.4436L36.9978 24.9076L36.9988 38.0796H34.9988V24.9076L32.4628 27.4436L31.0488 26.0296ZM21.0488 34.1296L22.4628 32.7156L24.9988 35.2516V22.0796H26.9988V35.2516L29.5348 32.7156L30.9488 34.1296L25.9988 39.0796L21.0488 34.1296Z" fill="black"/>
                                </svg>
                            </Button>
                            <Button variant='reset' className="d-md-inline-block d-none">
                                <svg width="60" height="62" viewBox="0 0 60 62" className='m-0' fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="60" height="60.1591" rx="30" transform="matrix(-1 0 0 1 60 0.920532)" fill="white"/>
                                    <path d="M25.95 31.0502L21 36.0002L25.95 40.9502L27.364 39.5362L24.828 36.9992L38 37.0002V35.0002H24.828L27.364 32.4642L25.95 31.0502ZM34.05 21.0502L32.636 22.4642L35.172 25.0002H22V27.0002H35.172L32.636 29.5362L34.05 30.9502L39 26.0002L34.05 21.0502V21.0502Z" fill="black"/>
                                </svg>
                            </Button>
                        </Col>
                        <Col md={5}>
                            <div className="card-base card-dropdown justify-content-center d-flex align-items-center card-dark">
                                <div className="card-icon">
                                    <svg width="44" height="30" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M39.7035 14.7809C40.8265 15.8462 41.9184 16.8804 43.0325 17.9413C42.8861 18.0389 42.8017 18.101 42.713 18.1499C35.904 22.0693 29.0905 25.9842 22.2815 29.908C22.0907 30.019 21.9531 30.0368 21.7578 29.9214C14.9354 25.9798 8.10426 22.0426 1.27751 18.101C1.20649 18.0611 1.13547 18.0167 0.966797 17.9102C1.242 17.6661 1.495 17.4619 1.72582 17.2355C2.41382 16.5519 3.10182 15.8639 3.77207 15.1626C3.96293 14.9629 4.10053 14.9407 4.3491 15.0827C10.1194 18.3762 15.8986 21.6565 21.669 24.95C21.9486 25.1098 22.1395 25.1053 22.4147 24.9456C28.0963 21.5943 33.7867 18.2564 39.4771 14.914C39.5792 14.8519 39.6857 14.7942 39.7035 14.7809Z" fill="url(#paint0_linear_2_566)"/>
                                        <path d="M6.43116 7.5636C7.4565 8.15839 8.42858 8.71767 9.4051 9.28582C13.5154 11.6694 17.63 14.0574 21.7359 16.4499C21.9844 16.5964 22.162 16.6053 22.4194 16.4544C27.3109 13.5825 32.2157 10.724 37.116 7.86099C37.2581 7.77666 37.4045 7.69676 37.6043 7.58579C37.6043 8.00747 37.6043 8.37588 37.6043 8.74874C37.6043 9.9028 37.5998 11.0569 37.6087 12.2065C37.6132 12.4284 37.5555 12.5527 37.3601 12.6681C32.3311 15.571 27.302 18.4828 22.2774 21.3991C22.1043 21.4967 21.9889 21.4923 21.8202 21.3946C16.7822 18.505 11.7399 15.6199 6.70192 12.7258C6.58651 12.6592 6.44447 12.5039 6.44447 12.3929C6.42672 10.8039 6.43116 9.2148 6.43116 7.5636Z" fill="url(#paint1_linear_2_566)"/>
                                        <path d="M12.3828 7.40378C16.6484 4.93142 20.8741 2.48124 25.153 0C25.1663 0.17311 25.1841 0.297394 25.1885 0.421678C25.2151 1.41595 25.2507 2.41022 25.2595 3.40894C25.2595 3.53322 25.1663 3.71077 25.0598 3.77291C21.9571 5.58391 18.85 7.38159 15.7429 9.17483C15.6453 9.2281 15.4722 9.25473 15.3878 9.2059C14.3891 8.61999 13.4082 8.02077 12.3828 7.40378Z" fill="url(#paint2_linear_2_566)"/>
                                        <path d="M27.2085 6.34729C27.2085 7.56794 27.213 8.69537 27.1996 9.82281C27.1996 9.9249 27.0931 10.0625 26.9955 10.1202C25.3931 11.0568 23.7863 11.98 22.175 12.9033C22.0951 12.9521 21.9486 12.9832 21.8821 12.9432C20.8745 12.3662 19.8758 11.7714 18.8193 11.15C21.6202 9.54761 24.3722 7.97186 27.2085 6.34729Z" fill="url(#paint3_linear_2_566)"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_2_566" x1="21.9996" y1="35.1694" x2="21.9996" y2="10.7033" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#5B86E5"/>
                                        <stop offset="1" stop-color="#36D1DC"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_2_566" x1="22.0198" y1="26.1937" x2="22.0198" y2="3.83769" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#5B86E5"/>
                                        <stop offset="1" stop-color="#36D1DC"/>
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_2_566" x1="18.8212" y1="12.3673" x2="18.8212" y2="-2.47337" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#5B86E5"/>
                                        <stop offset="1" stop-color="#36D1DC"/>
                                        </linearGradient>
                                        <linearGradient id="paint3_linear_2_566" x1="23.0143" y1="15.2081" x2="23.0143" y2="4.57518" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#5B86E5"/>
                                        <stop offset="1" stop-color="#36D1DC"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="card-text">
                                    <span>From</span>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="reset" id="dropdown-basic">
                                            Element
                                        </Dropdown.Toggle>

                                        {/* <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                        </Dropdown.Menu> */}
                                    </Dropdown>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="card-base card-dark card-token mb-30">
                        <div className="d-flex flex-sm-row flex-column mb-10 card-token-head align-items-center justify-content-sm-between justify-content-center text-nowrap">
                            <p className='text-uppercase me-3 mb-sm-0 mb-3'>Token to bridge:</p>
                            <input type="text" onChange={(e) => setValue(e.target.value)} placeholder='Enter Token' className='form-control' value={value} />
                        </div>
                        <div className="d-flex flex-sm-row flex-column align-items-center justify-content-sm-between justify-content-center text-nowrap">
                            <span className='py-2 mb-sm-0 mb-2'>Balance on Algorand</span>
                            <Button variant='white'>Select a token</Button>
                        </div>
                    </div>

                    <Button variant='grad' className='btn-xl w-100 mb-10'>Connect wallet</Button>
                    {/* <p className='text-center'>Powered by <strong className='text-uppercase'>element</strong></p> */}
                </Container>
            </div>
        </Layout>
    );
}

export default FarmPage;