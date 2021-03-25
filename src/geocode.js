const chalk = require('chalk')
const request = require('request-promise-native')

const API_BASE = 'http://api.weatherstack.com'
const API_KEY = '5779824dcd6b3e016ede3637dc470d21'

const geocode = (data, type, callback) => {
    const options = {
        uri: API_BASE + '/' + type,
        qs: {
            access_key: API_KEY,
            query: encodeURI(data)
        },
        json: true
    }
    request(options).then(res => {
        if (res.error) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, { ...res.location })
        }
    }).catch(err => {
        callback('Unable to connect to location services!', undefined)
    })
}

const forecast = (lat, lon, callback) => {
    const options = {
        uri: API_BASE + '/forecast',
        qs: {
            access_key: API_KEY,
            query: encodeURI(lat+','+lon)
        },
        json: true
    }
    request(options).then(res => {
        if (res.error) {
            callback('Unable to find coordinates. Try another search.', undefined)
        } else {
            callback(undefined, {...res})
        }
    }).catch(err => {
        callback('Unable to connect to location services!', undefined)
    })
}

module.exports = {
    geocode: geocode,
    forecast: forecast,
}