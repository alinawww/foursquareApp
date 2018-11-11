import React from 'react';
import './SearchActions.css';

export const SearchActions = (props) => {
    const {findPlaces} = props
    return (
        <div className="intro__actions">
            <button className="intro__button" onClick={(recommended) => findPlaces(recommended=false)}>Show me places near me</button>
            <button className="intro__button" onClick={(recommended) => findPlaces(recommended=true)}>Show me recommended</button>
        </div>
    )
}
