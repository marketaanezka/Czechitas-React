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

const getDayfromUnix = (unix) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(unix * 1000)
  return(`${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`);
}

const filterForecast = (array) => {
  return array.filter((item, index) => index % 8 === 0);
}

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [forecast, setForecast] = useState(false);

  const fetchWeather = () => {
    setLoading(true);
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Brno&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f")
    .then((response) => { 
      return response.json().then((data) => {
        setWeather(data);
        console.log(data);
        setLoading(false);
      }).catch((err) => {
         console.log("error", err);
      }) 
  });
  };

  const fetchForecast = () => {
    setLoading(true);
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=Brno&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f")
    .then((response) => { 
      return response.json().then((data) => {
        setForecast(filterForecast(data.list));
        setLoading(false);
      }).catch((err) => {
         console.log("error", err);
      }) 
  });
  };

  const getCityWeather = (city) => {
    if (city !== "") {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=60990aef3d3c4f5a36b9de246444ca2f`)
    .then((response) => { 
      if (response.ok) {
        return response.json().then((data) => {
          setWeather(data);
          console.log(data);
          setError(false);
        })
      } else {
        setError(true)
      }})      
    .catch((err) => {
      setError(true);
      console.log("error", err);
      }) 
    }
    }
  


  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, [])

  return (
  <div className="container">
    
  <h1>Počasí</h1>


{/* tlačítka pro výběr města - bonusová část úkolu */}

<div className="button-group">
  <button className="button" onClick={() => getCityWeather("Prague")}>Prague</button>
  <button className="button" onClick={() => getCityWeather("Moscow")}>Moscow</button>
  <button className="button" onClick={() => getCityWeather("Reykjavik")}>Reykjavik</button>
</div>

  {/* <form id="search"  className="search-bar" onSubmit={(e) => {
    e.preventDefault();
    getCityWeather(city)
    setCity("");
  }}>
    <input type="text" placeholder="Search..." value={city} onChange={(e) => {
      setCity(e.target.value)
    }
    }
    className="search-bar__input"/>
    <input type="submit" value="Show weather" className="search-bar__button" />
  </form> */}


<div className="weather">

  <div className="weather__current">
  { !weather ? "loading" : (
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

    <div className="weather__forecast" id="predpoved">
      { !forecast ? "loading" : 
        forecast.map((item) => {
          console.log(item)
        return(
          <div className="forecast" key={item.dt}>
            <div className="forecast__day">{getDayfromUnix(item.dt)}</div>
            <div className="forecast__icon">
              <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} style={{height: "100%"}} alt="current weather icon" />
            </div>
            <div className="forecast__temp">{Math.round(item.main.temp)} °C</div>
          </div>
        )
        }
          )
      
        
        }
    </div>

  </div>
</div>
);
}

render(<App />, document.querySelector('#app'));
