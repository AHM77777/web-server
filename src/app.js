const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./geocode.js')

const app = express()
const port = process.env.PORT || 3000

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
    return res.render('index', {
        title: 'Weather App',
        name: 'Antonio Hernandez',
    })
})

app.get('/about', (req, res) => {
    return res.render('about', {
        title: 'About Me',
        name: 'Antonio Hernandez',
    })
})

app.get('/help', (req, res) => {
    return res.render('help', {
        title: 'Help Page',
        name: 'Antonio Hernandez',
        helpText: 'This is a simple test help message.'
    })
})

app.get('/help/*', (req, res) => {
    return res.render('404', {
        error: 'Try being more specific with your search',
        title: 'Help Article Not Found',
        name: 'Antonio Hernandez'
    })
})

// Define API routes
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'Address required' })
    } else {
        geocode.geocode(req.query.address, 'forecast', (error, data) => {
            if (error) {
                return res.send({ error })
            } else {
                const {lat, lon} = data
                geocode.forecast(lat, lon, (error, data) => {
                    if (error) {
                        return res.send({ error })
                    } else {
                        // This line works considering there will be always one result inside the forecast object
                        // not quite an ideal solution, but it will do for now
                        const {maxtemp, mintemp} = data.forecast[Object.keys(data.forecast)[0]]
                        /////////////////////////
                        const {weather_descriptions, temperature, precip, feelslike} = data.current
                        const {name, region, country} = data.location
                        return res.send({
                            forecast: '(Summary: ' + weather_descriptions + ') The highest temperature today will be of ' + maxtemp + ' degrees and the minimum of ' + mintemp +'. It is currently ' + temperature + ' degrees out and feels like ' + feelslike + '. There is a ' + precip + '% chance of rain.',
                            location: 'Location:' + name + ', ' + region + ', ' + country,
                        })
                    }
                })
            }
        })
    }
})

// Setup error pages
app.get('*', (req, res) => {
    return res.render('404', {
        error: 'This page does not exist',
        title: 'Page Not found',
        name: 'Antonio Hernandez'
    })
})

// Open server port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})