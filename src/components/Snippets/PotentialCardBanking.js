import React from 'react';
import { Card } from 'react-bootstrap';

const PotentialCardBanking = (props) => {
    return (
        <Card className='card-potential card-potential-banking'>
            <Card.Body>
                <h5 className='text-gray text-uppercase'>{props.title}</h5>
                <img src={props.icon} alt="icon" />
                <p className="h4" style={{color:"white"}}>{props.text}</p>
                {props.learnMore && <h5 className='text-gray text-normal text-uppercase'>Learn More</h5>}
            </Card.Body>
        </Card>
    );
};

export default PotentialCardBanking;