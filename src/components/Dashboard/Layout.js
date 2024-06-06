import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import BGTR from '../../assets/images/bg-tr.png';
import BGBL from '../../assets/images/bg-bl.png';


function LayoutInner(props) {
    return (
        <div id="wrapper">
            <Sidebar />
            <div className="dashboard-inner">
                <img src={BGTR} className='dashboard-bg dashboard-bg-tr' alt="shape blue" />
                <img src={BGBL} className='dashboard-bg dashboard-bg-bl' alt="shape blue" />
                <Header />
                {props.children}
                <Footer />
            </div>
        </div>
    );
}

export default LayoutInner;