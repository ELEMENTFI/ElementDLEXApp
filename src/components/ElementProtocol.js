import React from 'react';
import Layout from './Layouts/LayoutLandingHome';
import PriceStability from './Sections/PriceStability';
import HomeBanner from './Sections/HomeBannerProtocol';
import ELEMGovernance from './Sections/ELEMGovernance';
import Economy from './Sections/Economy';
import PartnersInvestorsHome from './Sections/PartnersInvestorsHome';
import StablecoinPortfolio from './Sections/StablecoinPortfolio';
// import PartnersInvestors from './Sections/PartnersInvestors';
// import {Container} from 'react-bootstrap';


function HomePage() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });
    return (
        
            <div className="page-home-protocol">
                <Layout>
                <HomeBanner />
                <PriceStability />
                <StablecoinPortfolio />
                <ELEMGovernance />
                <Economy /> 
                <PartnersInvestorsHome />
                </Layout>               
            </div>
        
    );
}

export default HomePage;