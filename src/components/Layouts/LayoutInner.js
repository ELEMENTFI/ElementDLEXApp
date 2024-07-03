import React, { useState } from 'react';
import Header from './Header';
import Footer from './FooterInner';
import Blue from '../../assets/images/circle-blue.png';
import { Sidebar } from "../Snippets/sidebar"; // Make sure the path is correct
import '../Snippets/sidebar.css'; // Ensure you have a CSS file for LayoutInner

function LayoutInner(props) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div id="wrapper" className="flex">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={`content ${isOpen ? 'contentOpen' : 'contentClose'}`}>
                <img src={Blue} className='circle-blue' alt="shape blue" />
                <Header isOpen={isOpen} />
                {props.children}
                <Footer />
            </div>
        </div>
    );
}

export default LayoutInner;
