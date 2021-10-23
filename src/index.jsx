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

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');

  const fetchWeather = () => {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Brno&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f")
    .then((response) => { 
      return response.json().then((data) => {
        setWeather(data);
      }).catch((err) => {
          console.log("error", err);
      }) 
  });
  };

  const getCityWeather = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f`)
    .then((response) => { 
      return response.json().then((data) => {
        setWeather(data);
      }).catch((err) => {
          console.log("error", err);
      }) 
  });
  }


  useEffect(() => {
    fetchWeather();
  }, [])

  return (
  <div className="container">
    
  <h1>Počasí</h1>


{/* tlačítka pro výběr města - bonusová část úkolu */}

<div className="button-group">
  <button className="button" onClick={() => getCityWeather("Prague")}>Prague</button>
  <button className="button" onClick={() => getCityWeather("Tenerife")}>Tenerife</button>
  <button className="button" onClick={() => getCityWeather("Reykjavik")}>Reykjavik</button>
</div>

<div className="button-group">
  <form id="search" onSubmit={(e) => {
    e.preventDefault();
    getCityWeather(city)
    setCity("");
    console.log(city)
  }}>
    <input type="text" placeholder="Search..." value={city} onChange={(e) => {
      setCity(e.target.value)
    }
    }/>
    <input type="submit" value="Show weather" />
  </form>
</div>


<div className="weather">

  <div className="weather__current">
  {weather === null ? "loading" : (
    <>
    <h2 className="weather__city" id="mesto">
      {weather.name}
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
    </>
    )}
  </div>

  

  

  {/* <div className="weather__forecast" id="predpoved">

   
      do tohoto divu vygeneruj HTML pro jednotlivé dny předpovědi
      podle následující šablony
   
    <div className="forecast">
      <div className="forecast__day">Pondělí 22. 4.</div>
      <div className="forecast__icon">
        <i className="wi wi-owm-night-602"></i>
      </div>
      <div className="forecast__temp">18 °C</div>
    </div>

  </div> */}

</div>
  </div>
);
}

render(<App />, document.querySelector('#app'));
