import {getLocation} from './helpers';

const CLIENT_ID = 'SPCGCBMXAIUCDAL1JJHXB0OWEIVIWZGKWYCPFQNPAUDZCNQH'
const CLIENT_SECRET = '2IGTREZMXLUYXYIELZ1P4FEQ0VSMXX5DY2GALBQL0NPD34LC'
// const redirectUri = 'https://alinawww.github.io/testgp/'
const redirectUri = 'http://localhost:3000/'
const redirectUrl = `https://foursquare.com/oauth2/authenticate?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}/`

const latitude = window.localStorage.getItem('latitude')
const longitude = window.localStorage.getItem('longitude')
const accessToken = window.localStorage.getItem('accessToken')
const authorizationCode = window.location.href.match(/code=([^&]*)/)

const Foursquare = {
    getAccessToken() {
        if (authorizationCode) {
            const getTokenUrl = `https://foursquare.com/oauth2/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${redirectUri}&code=${authorizationCode[1]}`
            fetch(getTokenUrl, {mode: 'cors'})
                .then(results => {
                    console.log('results', results);
                    if (results.ok) {
                        return results.json()
                    }
                }).then(token => {
                    console.log(token);
                    window.localStorage.setItem('accessToken', token.access_token)
                })
        }
        else {
            // If there's no access code, redirect user to Authorization screen
            window.location = redirectUrl
        }
        return accessToken
    },


    findPlaces(recommended=false) {
        if (!latitude || !longitude) {
            return getLocation(position => {
                window.localStorage.setItem('latitude', position.coords.latitude)
                window.localStorage.setItem('longitude', position.coords.longitude)
            })
        }
        const searchParams = [
            `ll=${latitude},${longitude}`,
            `client_id=${CLIENT_ID}`,
            `client_secret=${CLIENT_SECRET}`,
            `v=20191106`
        ]
        if (recommended) {
            if (accessToken) {
                searchParams.push(`oauth_token=${accessToken}`)
            }
            else {
                this.getAccessToken()
            }
        }
        const searchUrl = `https://api.foursquare.com/v2/venues/search?${searchParams.join('&')}`

        return fetch(searchUrl)
            .then(results => results.json())
            .then(jsonData => {
                if (!jsonData.response) return []
                return jsonData.response.venues.map(
                    venue => {
                        const category = venue.categories[0] // the venues usually have only one cat
                        const iconUrl = category ? `${category.icon.prefix}64${category.icon.suffix}` : ''
                        return {
                            id: venue.id,
                            name: venue.name,
                            address: venue.location.address,
                            iconUrl,
                        }
                    }
                )
            })
            .catch(error => {
                console.error('Error when getting the venues information:', error)
        })
    }
}

export default Foursquare
