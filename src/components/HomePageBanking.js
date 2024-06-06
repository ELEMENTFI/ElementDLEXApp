import React from 'react';
import { Container } from 'react-bootstrap';
import Layout from './Layouts/LayoutBanking';
import DeFiPotential from './Sections/DeFiPotentialBanking';
import BlackCollateral from './Sections/BlackCollateral';
import HomeBanner from './Sections/HomeBannerBanking';
import LearnMore from './Sections/ElementLearnMore';
import HeaderBanking from './Layouts/HeaderBanking'
// import PartnersInvestors from './Sections/PartnersInvestors';
// import {Container} from 'react-bootstrap';


function HomePage() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });
    return (
        <Layout>
            <div className="page-home">
                <HeaderBanking />
                <HomeBanner />
                <DeFiPotential />
                <BlackCollateral />

                <Container fluid="lg">
                    <div className="mb-5 pb-md-5">
                        <hr />
                    </div>
                    <div className="mb-5 pb-5">
                        <LearnMore />
                    </div>
                </Container>

                {/* <PartnersInvestors /> */}
            </div>
        </Layout>
    );
}

export default HomePage;