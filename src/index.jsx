import React, {useEffect, useState} from 'react';
import { render } from 'react-dom';
import './style.css';

const getTimefromUnix = (unix) => {
  return(
    `
    ${new Date(unix * 1000).getHours()}:${new Date(unix * 1000).getMinutes()}
    `
  )
}
const cities = ['Abuja', 'Amsterdam', 'Aswān', 'Athens', 'Bangkok', 'Barcelona', 'Belgrade', 'Brno', 'Budapest', 'Buenos Aires', 'Cape Town', 'Dakar', 'El Alto', 'Hanoi', 'Harbin', 'Kingston', 'Kuala Lumpur', 'Kuwait', 'Kyiv', 'Lagos', 'Ljubljana', 'London', 'Madrid', 'Melbourne', 'Miami', 'Minsk', 'Moscow', 'New Delhi', 'New York', 'Norilsk', 'Paris', 'Porto', 'Prague', 'Reykjavik', 'Seoul', 'Skopje', 'Sofia', 'Split', 'Sydney', 'São Paulo', 'Tallinn', 'Tenerife', 'Tirana', 'Toronto', 'Vancouver', 'Vienna', 'Vilnius', 'Warsaw', 'Winnipeg', 'Yakutsk'];


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

const getDayfromUnix = (unix) => {
  const date = new Date(unix * 1000)
  return(`${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`);
}

const filterForecast = (array) => {
  return array.filter((item, index) => index % 8 === 0);
}

const fetchCurrentWeather = (city, setState) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f`)
  .then((response) => {
    if (response.ok) {
      response.json()
      .then((data) => {
        setState(data);
        console.log("fetched", data);
      })
    } else {
      setState(null);
      console.log(response);
    }
  })
}

const fetchWeatherForecast = (city, setState) => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f`)
  .then((response) => {
    if (response.ok) {
      response.json()
      .then((data) => {
        setState(filterForecast(data.list));
      })
    } else {
      setState(null);
      console.log(response);
    }
  })
}

const App = () => {
  const [city, setCity] = useState("Prague");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(false);

  useEffect(() => {
    fetchCurrentWeather(city, setWeather);
    fetchWeatherForecast(city, setForecast);
  }, [city])

  return (
  <div className="container"> 
  <h1>My Weather App</h1>

  <div className="button-group">
    <button className="button" onClick={() => setCity("Prague")}>Prague</button>
    <button className="button" onClick={() => setCity("Tenerife")}>Tenerife</button>
    <button className="button" onClick={() => setCity("Reykjavik")}>Reykjavik</button>
  </div>
    
  <div className="select-wrapper">
    <select className="select" name="cityselect" id="cityselect" value={city} onChange={(e) => setCity(e.target.value)}>
      {cities.map((city) => <option value={city} key={city}>{city}</option>)}
    </select>
  </div>

  <div className="weather">
    { !weather ? 
      (
      <div className="loading">
        Loading data ...
      </div>
      ) : (
      <div className={`weather__current ${weather.main.temp < 10 ? "weather__current--cold": ""}`}>
      
        <h2 className="weather__city" id="mesto">
          {weather.name}, {weather.sys.country}
        </h2>

        <div className="weather__inner weather__inner--center">
          <div className="weather__section weather__section--temp">
            <span className="weather__temp-value" id="teplota">{Math.round(weather.main.temp)}</span>
            <span className="weather__temp-unit">°C</span>
            
            <div className="weather__description" id="popis">{weather.weather[0].main}</div>
          </div>
          <div className="weather__section weather__section--icon" id="ikona">
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="current weather icon" />
          </div>
        </div>

        <div className="weather__inner">
          <div className="weather__section">
            <h3 className="weather__title">Wind</h3>
            <div className="weather__value">
              <span id="vitr">{weather.wind.speed}</span> km/h
            </div>
          </div>
          <div className="weather__section">
            <h3 className="weather__title">Humidity</h3>
            <div className="weather__value">
              <span id="vlhkost">{weather.main.humidity}</span> %
            </div>
          </div>
        </div>

        <div className="weather__inner">
          <div className="weather__section">
            <h3 className="weather__title">Sunrise</h3>
            <div className="weather__value">
              <span id="vychod">{getTimefromUnix(weather.sys.sunrise)}</span>
            </div>
          </div> 
          <div className="weather__section">
            <h3 className="weather__title">Sunset</h3>
            <div className="weather__value">
              <span id="zapad">{getTimefromUnix(weather.sys.sunset)}</span>
            </div>
          </div>
        </div>
    </div>
    )}
  

    <div className="weather__forecast" id="predpoved">
      { !forecast ? 
        (
          <div className="loading">
            Loading data ...
          </div>
        ) : 
        forecast.map((item) => {
          return (
          <div className="forecast" key={item.dt}>
            <div className="forecast__day">{getDayfromUnix(item.dt)}</div>
            <div className="forecast__icon">
              <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} style={{height: "100%"}} alt="current weather icon" />
            </div>
            <div className="forecast__temp">{Math.round(item.main.temp)} °C</div>
          </div>
          )
        })
      }
    </div>
  </div>
</div>
);
}

render(<App />, document.querySelector('#app'));
