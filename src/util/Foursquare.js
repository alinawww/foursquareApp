import {getCookie} from './helpers';

const CLIENT_ID     = 'SPCGCBMXAIUCDAL1JJHXB0OWEIVIWZGKWYCPFQNPAUDZCNQH'
const CLIENT_SECRET = '2IGTREZMXLUYXYIELZ1P4FEQ0VSMXX5DY2GALBQL0NPD34LC'

let uriRedirect     = process.env.NODE_ENV === 'development'
                        ? 'http://localhost:3000'
                        : 'https://alinawww.github.io/foursquareApp/'
const redirectUrl   = `https://foursquare.com/oauth2/authenticate?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${uriRedirect}/`
const accessToken   = getCookie('accessToken')
const authorizationCode = window.location.href.match(/code=([^&]*)/)

const Foursquare = {
    getAccessToken() {
        if (authorizationCode) {
            const searchParams = [
                `client_id=${CLIENT_ID}`,
                `client_secret=${CLIENT_SECRET}`,
                `grant_type=authorization_code`,
                `redirect_uri=${uriRedirect}`,
                `code=${authorizationCode[1]}`
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

    findPlaces(recommended=false, latitude, longitude) {
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
