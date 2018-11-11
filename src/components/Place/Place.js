import React from 'react';

export const VenueItem = (props) => {
    const {iconUrl, address, name} = props.venue
    return (
        <div className="venues__item">
            <div className="venues__item-icon">
                <img src={iconUrl} alt="venue icon"/>
            </div>
            <div className="venues__item-content">
                <h2 className="venues__item-title">{name}</h2>
                { address && <p className="venue__item-address">{address}</p> }
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
