import React from 'react';
import './Place.css';

export const VenueItem = (props) => {
    const {goToMap} = props
    const {iconUrl, address, name, label, distance, mapURL} = props.venue
    return (
        <div className="venues__item" onClick={() => goToMap(mapURL)}>
            <div className="venues__item-icon">
                <img src={iconUrl} alt="venue icon"/>
            </div>
            <div className="venues__item-content">
                <h2 className="venues__item-title">{name}</h2>
                { label && <p className="venue__item-label">{label}</p> }
                <div>
                    { address && <span className="venue__item-address">{address}</span> }{address && distance && ', '}
                    { distance && <span className="venues__item-distance">{distance} meters away</span> }
                </div>
            </div>
        </div>
    )
}

export const FakeVenueItem = () => {
    return (
        <div className="venues__item">
            <div className="venues__item-icon"><span className='fake-element fake-element--icon'>&nbsp;</span></div>
            <div className="venues__item-content">
                <h2 className="venues__item-title"><span className='fake-element fake-element--title'>&nbsp;</span></h2>
                <p className="venue__item-address"><span className='fake-element fake-element--address'>&nbsp;</span></p>
            </div>
        </div>
    )
}
