import React from 'react';
import Layout from './Layouts/LayoutLandingV2';
import TUAPotential from './Sections/TuaPotential';
import HomeBanner from './Sections/HomeBannerV2';
import Investement from './Sections/Investement';

function HomePage() {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });
    return (
        <Layout>
            <div className="page-home-v2">
                <HomeBanner />
                <TUAPotential />
                <Investement />
            </div>
        </Layout>
    );
}

export default HomePage;