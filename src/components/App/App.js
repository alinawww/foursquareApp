import React, { Component } from 'react';
import './App.css';
import Foursquare from '../../util/Foursquare.js';
import {getCookie, getLocation} from '../../util/helpers.js';
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
            currentPosition: {
                lat: 0,
                lng: 0
            },
            venuesType: '' // can be 'nearby' or 'recommended'
        };

        this.findPlaces = this.findPlaces.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPosition.lat !== this.state.currentPosition.lat ||
            prevState.currentPosition.lng !== this.state.currentPosition.lng) {
            console.log('in here', this.state.currentPosition.lat, this.state.currentPosition.lng);
            this.findPlaces(this.state.venuesType === 'recommended')
        }
    }

    findPlaces(recommended) {
        this.setState({isLoading: true})
        const latitude = getCookie('latitude')
        const longitude = getCookie('longitude')

        if (latitude === null || longitude === null) {
            return getLocation(position => {
                document.cookie = `latitude=${position.coords.latitude}`
                document.cookie = `longitude=${position.coords.longitude}`
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                this.setState({currentPosition: coords})
            })
        }
        Foursquare.findPlaces(recommended, latitude, longitude).then(venues => {
            recommended
                ? this.setState({
                    recommendedVenues: venues,
                    venuesType: 'recommended',
                    isLoading: false
                    })
                : this.setState({
                    nearbyVenues: venues,
                    venuesType: 'nearby',
                    isLoading: false
                    })
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
