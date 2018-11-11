import React, { Component } from 'react';
import './App.css';
import Foursquare from '../../util/Foursquare.js';
import {VenuesList} from '../PlacesList/PlacesList';
import {SearchActions} from '../SearchActions/SearchActions';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nearbyVenues: [],
            recommendedVenues: [],
            error: null,
            isLoading: false,
            code: '',
            venuesType: '' // can be 'nearby' or 'recommended'
        };

        this.findPlaces = this.findPlaces.bind(this)
    }

    findPlaces(recommended) {
        this.setState({isLoading: true})
        Foursquare.findPlaces(recommended).then(venues => {
            recommended
                ? this.setState({recommendedVenues: venues, venuesType: 'recommended', isLoading: false})
                : this.setState({nearbyVenues: venues, venuesType: 'nearby', isLoading: false})
        })
    }

    render() {
        return (
            <div className="foursquare">
                <div className="foursquare__intro intro">
                    <h1 className="intro__title">places.</h1>
                    <SearchActions findPlaces={this.findPlaces} />
                </div>
                <VenuesList
                    recommendedVenues={this.state.recommendedVenues}
                    nearbyVenues={this.state.nearbyVenues}
                    isLoading={this.state.isLoading}
                    venuesType={this.state.venuesType} />
            </div>
        )
    }
}

export default App;
