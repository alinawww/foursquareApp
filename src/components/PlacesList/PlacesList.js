import React from 'react';
import {VenueItem, FakeVenueItem} from '../Place/Place';

const EmptyVenuesList = () => {
    console.log('process.env', process.env);
    return (
        <div className="venues-empty">
            <h2 className="venues-empty__title">Where to next?</h2>
            <p className="venues-empty__text">Discover places around your by using the options above</p>
            <img className="venues-empty__image" src={`${process.env.PUBLIC_URL}/../../assets/undraw_lost.svg`} alt="woman"/>
        </div>
    )
}

export const VenuesList = (props) => {
    const {recommendedVenues, nearbyVenues, venuesType, isLoading} = props
    let venues;
    if (isLoading || !venuesType.length) {
        venues = []
    }
    else {
        if (venuesType === 'nearby') {
            venues = nearbyVenues
        }
        else if (venuesType === 'recommended') {
            venues = recommendedVenues
        }
    }

    return (
        <div className="foursquare__venues venues">
            {isLoading && [...Array(3)].map((item, idx) => {
                return <FakeVenueItem key={idx} isLoading={isLoading}/>
                })
            }
            {venues.length > 0 && venues.map(venue => {
                return <VenueItem key={venue.id} venue={venue} />
                })
            }
            {venues.length === 0 && !isLoading && <EmptyVenuesList />}
        </div>
    )
}
