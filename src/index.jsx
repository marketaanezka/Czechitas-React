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
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset]= useState (null)

  const fetchWeather = () => {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Paris&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f")
    .then((response) => { 
      return response.json().then((data) => {
        console.log(data);
        setWeather(data);
        setSunrise(getTimefromUnix(data.sys.sunrise));
        setSunset(getTimefromUnix(data.sys.sunset))
      }).catch((err) => {
          console.log("error", err);
      }) 
  });
  };

  const getCityWeather = (city) => {
    fetch(`api.openweathermap.org/data/2.5/weather?q=${city}&appid=60990aef3d3c4f5a36b9de246444ca2f`)
      .then(res => res.json())
  }


  useEffect(() => {
    fetchWeather();
  }, [])

  return (
  <div className="container">
    
  <h1>Počasí</h1>


{/* tlačítka pro výběr města - bonusová část úkolu */}

{/* <div className="button-group">
  <button className="button"><i className="fas fa-map-marker-alt"></i></button>
  <button className="button" onClick={() => getCityWeather(Prague)}>Praha</button>
  <button className="button" onClick={() => getCityWeather(NewYork)}>New York</button>
  <button className="button" onClick={() => getCityWeather(Sydney)}>Sydney</button>
</div> */}



<div className="weather">
{weather === null ? "loading" : (
  <div className="weather__current">
    <h2 className="weather__city" id="mesto">
      {weather.name}
    </h2>

    <div className="weather__inner weather__inner--center">
      <div className="weather__section weather__section--temp">
        {weather && (<span className="weather__temp-value" id="teplota">{Math.round(weather.main.temp)}</span>
        )}
        <span className="weather__temp-unit">°C</span>
        
        <div className="weather__description" id="popis">{weather.weather[0].main}</div>
      </div>
      <div className="weather__section weather__section--icon" id="ikona">
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="current weather icon" />
      </div>
    </div>

    <div className="weather__inner">
      <div className="weather__section">
        <h3 className="weather__title">Vítr</h3>
        <div className="weather__value">
          <span id="vitr">{weather.wind.speed}</span> km/h
        </div>
      </div>
      <div className="weather__section">
        <h3 className="weather__title">Vlhkost</h3>
        <div className="weather__value">
          <span id="vlhkost">{weather.main.humidity}</span> %
        </div>
      </div>
    </div>

    <div className="weather__inner">
     
       <div className="weather__section">
        <h3 className="weather__title">Východ slunce</h3>
        <div className="weather__value">
          <span id="vychod">{sunrise}</span>
        </div>
      </div>
       
      <div className="weather__section">
        <h3 className="weather__title">Západ slunce</h3>
        <div className="weather__value">
          <span id="zapad">{sunset}</span>
        </div>
      </div>
    </div>
  </div>

  
)}
  

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
