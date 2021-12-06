// capture references to important DOM elements
const weatherContainer = document.getElementById('weather');
const formEl = document.querySelector('form');
const inputEl = document.querySelector('input');


formEl.onsubmit = function(e) {
    // prevent the page from refreshing
    e.preventDefault();
  
    // capture user's input from form field
    const userInput = inputEl.value.trim()
    // abort API call if user entered no value
    if (!userInput) return
    // call the API and then update the page
    getWeather(userInput)
      .then(displayWeatherInfo)
      .catch(displayLocNotFound)
       
    // reset form field to a blank state
    inputEl.value = ""
  }

// calls the OpenWeather API and returns an object of weather info
async function getWeather(query) {
  try {
  // default search to USA
  if (!query.includes(",")) query += ',us'
  // return the fetch call which returns a promise
  // allows us to call .then on this function
    const res = await fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      query +
      '&units=imperial&appid=6efff70fe1477748e31c17d1c504635f'
    )
    
    const data = await res.json()
    
    // location not found, throw error/reject promise
    if (data.cod === "404") throw new Error('location not found')
    
     // this object is used by displayWeatherInfo to update the HTML
     const weatherData = {
       coords: data.coord.lat + ',' + data.coord.lon,
       description: data.weather[0].description,
       // create weather icon URL
       iconUrl: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png',
       actualTemp: data.main.temp,
       feelsLikeTemp: data.main.feels_like,
       place: data.name + ", " + data.sys.country,
       // create JS date object from Unix timestamp
       updatedAt: new Date(data.dt * 1000)
     }  
     
     return weatherData  
     
    } catch(err) {
      console.log(err)
    }
  }
  
  // show error message when location isn't found
  const displayLocNotFound = () => {
    // clears any previous weather info
    weatherContainer.innerHTML = "";
    // create h2, add error msg, and add to page
    const errMsg = document.createElement('h2')
    errMsg.textContent = "Location not found"
    weatherContainer.appendChild(errMsg)
  }
  
  
  // updates HTML to display weather info
  const displayWeatherInfo = (weatherObj) => {
    // clears any previous weather info
    weatherContainer.innerHTML = "";
    
    const { coords, description, iconUrl, actualTemp, feelsLikeTemp, place, updatedAt } = weatherObj

    // inserts a linebreak <br> to weather section tag
    const addBreak = () => {
      weatherContainer.appendChild(
        document.createElement('br')
        )           
      }
          
    // weather location element
    const placeName = document.createElement('h2')
    placeName.textContent = place
    weatherContainer.appendChild(placeName)

    // map link element based on lat/long
    const whereLink = document.createElement('a')
    whereLink.textContent = "Click to view map"
    whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + coords
    whereLink.target = "__BLANK"
    weatherContainer.appendChild(whereLink)

    // weather icon img
    const icon = document.createElement('img')
    icon.src = iconUrl
    weatherContainer.appendChild(icon)

    // weather description
    const weatherDescription = document.createElement('p')
    weatherDescription.textContent = description
    weatherDescription.style.textTransform = 'capitalize'
    weatherContainer.appendChild(weatherDescription)

    addBreak()

    // current temperature
    const temp = document.createElement('p')
    temp.textContent = `Current: ${actualTemp}° F`
    weatherContainer.appendChild(temp)

    // "feels like" temperature
    const feelsLike = document.createElement('p')
    feelsLike.textContent = `Feels like: ${feelsLikeTemp}° F`
    weatherContainer.appendChild(feelsLike)

    addBreak()

    // time weather was last updated
    const update = document.createElement('p')
    update.textContent = "Last updated: " +
      updatedAt.toLocaleTimeString(
        'en-US',
        {
          hour: 'numeric',
          minute: '2-digit'
        }
      )
    weatherContainer.appendChild(update)
}

