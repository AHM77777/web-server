const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./geocode.js')

const app = express()

// Define paths for Express config
const public_dir_path = path.join(__dirname, '..', 'public')
const views_path = path.join(__dirname, '..', 'templates', 'views')
const partials_path = path.join(__dirname, '..', 'templates','partials')

// Set handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', views_path)

// Configure HBS partials directory
hbs.registerPartials(partials_path)

// Setup static directory to serve
app.use('/', express.static(public_dir_path))

// Define frontend routes
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Antonio Hernandez',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Antonio Hernandez',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Antonio Hernandez',
        helpText: 'This is a simple test help message.'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        error: 'Try being more specific with your search',
        title: 'Help Article Not Found',
        name: 'Antonio Hernandez'
    })
})

// Define API routes
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'Address required'
        })
    } else {
        geocode.geocode(req.query.address, 'forecast', (error, data) => {
            if (error) {
                console.log(error)
            } else {
                const {lat, lon} = data
                geocode.forecast(lat, lon, (error, data) => {
                    if (error) {
                        console.log(error)
                    } else {
                        const {weather_descriptions, temperature, precip} = data.current
                        const {name, region, country} = data.location
                        res.send({
                            forecast: '(Summary: ' + weather_descriptions + ') It is currently ' + temperature + ' degrees out. There is a ' + precip + '% chance of rain.',
                            location: name + ', ' + region + ', ' + country,
                            address: req.query.address,
                        })
                    }
                })
            }
        })
    }
})

// Setup error pages
app.get('*', (req, res) => {
    res.render('404', {
        error: 'This page does not exist',
        title: 'Page Not found',
        name: 'Antonio Hernandez'
    })
})

// Open server port
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})