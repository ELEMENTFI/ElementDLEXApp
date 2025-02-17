import React from 'react';
import Header from './HeaderLandingHome';
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