import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PotentialCard from '../Snippets/PotentialCardBanking';

import Icon1 from '../../assets/images/capital-effency.svg';
import Icon2 from '../../assets/images/self-paying-debt-balance.svg';
import Icon3 from '../../assets/images/smart-risk-mitigation.svg';
import Icon4 from '../../assets/images/competitive-yield.svg';
import Icon5 from '../../assets/images/no-liquidation-risk.svg';
import Icon6 from '../../assets/images/low-maintenance.svg';

import {Link} from "react-router-dom";

const DeFiPotentialBanking = () => {
    return (
        <div className='defi-potential'>
            <Container fluid="lg">
                <Row className='text-center justify-content-center'>
                    <Col lg={8} xl={7} md={8}>
                        <h1>MAGICAL RISK FREE LOANS</h1> <br/><br/>
                    </Col>
                </Row>

                <Row>
                    <Col lg={4} className='mb-4'>
                    {/* <Link to="/swap"> */}
                        <PotentialCard title="Capital effency" icon={Icon1} text="Get instant access to TAU while your deposit earns interest in the background" learnMore={true} />
                    {/* </Link> */}
                    </Col>
                    {/* <Col lg={8} className='mb-4'> 
                        <PotentialCard title="Self—Paying Debt Balance" icon={Icon2} text="Over time your debt is paid off completely automatically" learnMore={true} />
                    </Col> */}
                    {/* <Col lg={4} className='mb-4'>
                     <Link to="/Launchpad"> 
                        <PotentialCard title="SMART Risk Mitigation" icon={Icon3} text="Minimize the DEFI Market risk using debt based yield derivatives" learnMore={true} />
                    </Link>
                    </Col> */}
                    <Col lg={4} className='mb-4'>
                    {/* <a href="https://elementnft.vercel.app/" target="_blank">    */}
                        <PotentialCard title="Competitive Yield" icon={Icon4} text="Choose from a growing number of farming strategies to maximize your purchase power" learnMore={true} />
                    {/* </a>  */}
                    </Col>
                    <Col lg={4} className='mb-4'>
                        <PotentialCard title="No Liquidation Risk" icon={Icon5} text="No matter what happens we'll never liquidate your deposit and you'll keep full access" learnMore={true} />
                    </Col>
                    {/* <Col lg={12} className='mb-4'>
                        <PotentialCard title="Low  Maintenance" icon={Icon6} text="Once you've withdrawn your Collateral you can simply let your loan repay itself" learnMore={true} />
                    </Col> */}
                </Row>
            </Container>
        </div>
    );
};

export default DeFiPotentialBanking;