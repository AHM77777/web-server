document.addEventListener('DOMContentLoaded', () => {
    const weather_form = document.getElementById('weather-form')
    const search = weather_form.querySelector('#weather-location')

    weather_form.addEventListener('submit', e => {
        e.preventDefault();

        clearMsgs()
        setLoadingMsg(true)

        let weather_query = '/weather?address='
        weather_query += search.value
        fetch(weather_query)
        .then(res => res.json())
        .then(data => {
            setLoadingMsg(false)

            if (data.error) {
                setResponseMsg(data.error, 'error')
            } else {
                setResponseMsg('Current weather found!', 'success')

                const weather_info_box = document.getElementById('weather-info')
                weather_info_box.style.display = 'block';
                weather_info_box.querySelector('p:first-child').innerText = data.location
                weather_info_box.querySelector('p:last-child').innerText = data.forecast
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