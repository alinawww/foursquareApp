import {getCookie} from './Helpers.js';
import {CLIENT_ID, CLIENT_SECRET, APP_VERSION, AUTHORIZATION_CODE} from '../config.js'

let uriRedirect     = process.env.NODE_ENV === 'development'
                        ? 'http://localhost:3000/'
                        : 'https://alinawww.github.io/foursquareApp/'

const redirectUrl   = `https://foursquare.com/oauth2/authenticate?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${uriRedirect}/`
const accessToken   = getCookie('accessToken')

const Foursquare = {
    getAccessToken() {
        if (AUTHORIZATION_CODE) {
            const searchParams = [
                `client_id=${CLIENT_ID}`,
                `client_secret=${CLIENT_SECRET}`,
                `grant_type=authorization_code`,
                `redirect_uri=${uriRedirect}`,
                `code=${AUTHORIZATION_CODE[1]}`
            ]
            const getTokenUrl = `https://foursquare.com/oauth2/access_token?${searchParams.join('&')}`
            fetch(getTokenUrl, {mode: 'cors'})
                .then(results => {
                    if (results.ok) {
                        return results.json()
                    }
                }).then(token => {
                    document.cookie = `accessToken=${token.access_token}`
                })
        }
        else {
            // If there's no access code, redirect user to Authorization screen
            window.location = redirectUrl
        }
        return accessToken
    },

    findPlaces(latitude, longitude, recommended=false) {
        const searchParams = [
            `ll=${latitude},${longitude}`,
            'limit=20',
            `client_id=${CLIENT_ID}`,
            `client_secret=${CLIENT_SECRET}`,
            `v=${APP_VERSION}`
        ]
        if (recommended) {
            if (accessToken) {
                searchParams.push(`accessToken=${accessToken}`)
            }
            else {
                this.getAccessToken()
            }
        }
        const searchUrl = `https://api.foursquare.com/v2/venues/explore?${searchParams.join('&')}`

        return fetch(searchUrl)
            .then(results => results.json())
            .then(jsonData => {
                if (!jsonData.response) return []
                const groupedVenues = jsonData.response.groups.map( recommendedGroup => {
                        return recommendedGroup.items.map( item => {
                            const venue = item.venue
                            const location = venue.location
                            const category = venue.categories.find(category => category.primary)
                            const iconUrl = category ? `${category.icon.prefix}64${category.icon.suffix}` : `${process.env.PUBLIC_URL}/assets/default_icon.svg`
                            const label = category ? `${category.shortName}` : ''
                            const distance = location.distance
                            const mapURL = `http://www.google.com/maps/place/${location.lat},${location.lng}`
                            const reason = item.reasons.items.find(reason => reason.type === 'general')
                            return {
                                id: venue.id,
                                name: venue.name,
                                address: location.address,
                                reason: reason.summary,
                                label,
                                iconUrl,
                                distance,
                                mapURL,
                            }
                        })
                    }
                )
                return groupedVenues.flat()
            })
            .catch(error => {
                console.error('Error when getting the venues information:', error)
            })
    }
}

export default Foursquare
