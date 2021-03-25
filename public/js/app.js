document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://api.weatherstack.com'
    const API_KEY = '5779824dcd6b3e016ede3637dc470d21'
    
    const weather_form = document.getElementById('weather-form')
    const search = weather_form.querySelector('#weather-location')

    weather_form.addEventListener('submit', e => {
        e.preventDefault();

        clearMsgs()

        setLoadingMsg(true)

        if (!search.value) {
            setLoadingMsg(false)
            setResponseMsg('Address is required', 'error')
            return false;
        }

        let weather_query = API_BASE + '/forecast?access_key=' + API_KEY + '&query='
        weather_query += search.value
        fetch(weather_query)
        .then(res => res.json())
        .then(data => {
            setLoadingMsg(false)

            if (data.error) {
                setResponseMsg('Unable to find location. Try another search.', 'error')
            } else {
                setResponseMsg('Current weather found!', 'success')

                const {name, region, country} = data.location
                const {weather_descriptions, temperature, precip} = data.current

                const weather_info_box = document.getElementById('weather-info')
                weather_info_box.style.display = 'block';
                weather_info_box.querySelector('p:first-child').innerText = name + ', ' + region + ', ' + country
                weather_info_box.querySelector('p:last-child').innerText = '(Summary: ' + weather_descriptions + ') It is currently ' + temperature + ' degrees out. There is a ' + precip + '% chance of rain.'
            }
        })
        .catch(err =>{
            setLoadingMsg(false)
            setResponseMsg('Unable to connect to location services! (' + err + ')', 'error')
        })
    })

    // Set response msg
    const setResponseMsg = (msg, type) => {
        const response_box = document.getElementById('response-msg')
        response_box.className = ''
        response_box.classList.add(type)
        response_box.querySelector('p').innerText = msg
    }

    // Clear msgs
    const clearMsgs = () => {
        const response_box = document.getElementById('response-msg')
        response_box.className = ''
        response_box.querySelector('p').innerText = ''

        const weather_info_box = document.getElementById('weather-info')
        weather_info_box.style.display = 'none'
        weather_info_box.querySelector('p:first-child').innerText = ''
        weather_info_box.querySelector('p:last-child').innerText = ''
    }

    const setLoadingMsg = enabled => {
        if (enabled) {
            document.getElementById('loading-msg').style.display = 'block'
        } else {
            document.getElementById('loading-msg').style.display = 'none'
        }
    }
})