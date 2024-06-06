import React from 'react';
import Header from './HeaderLandingV2';
import Footer from './Footer';

function Layout(props) {
    return (
        <div id="wrapper">
            <Header />
            {props.children}
            <Footer />
        </div>
    );
}

export default Layout;