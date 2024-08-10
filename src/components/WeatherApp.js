import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const WeatherApp = () => {

    const [city, SetCity] = useState('');
    const [country, SetCountry] = useState('');
    const [state, SetState] = useState('');

    const [weatherInfo, SetWeatherInfo] = useState('Type a city');
    const [icon, SetIcon] = useState('');
    const [maximumWindSpeed, SetMaximumWindSpeed] = useState('');
    const [imgOn, SetImgOn] = useState('');


    const inputRef = useRef(null);

    
    useEffect(()=>{
        const initAutocomplete = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
              const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      
              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.address_components) {
                    console.log(place);
                    console.log(place.geometry.location.lat);
                    
                  SetCity(place.name);                  
                }
              });
            }
          };
          console.log(city);

          if (window.google && window.google.maps) {
            initAutocomplete();
          } else {
            window.addEventListener('load', initAutocomplete);
          }
      
          return () => {
            window.removeEventListener('load', initAutocomplete);
          };
          
    }, []);

    useEffect(()=>{
        if (city) {

            const fetchWeather = async () => {
                const apiKey = 'ec23531ff278475e9db221201241207';
                const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
                try {
                    const response = await axios.get(url);
                    if (response.status === 200) {
                        const data = response.data;
                        SetImgOn(true);
                        console.log(data);
                        
                        if (data && data.current && data.current.condition) {
                            SetWeatherInfo(`${data.current.condition.text}, ${data.current.temp_c}°C`);
                            SetIcon(`${data.current.condition.icon}`)
                            SetCountry(`Country: ${data.location.country}`)
                            SetState(`State: ${data.location.region}`)
                            SetMaximumWindSpeed(`Wind Speed: ${data.current.wind_mph}kph`)
                        }else{
                            SetWeatherInfo('Data incomplete');
                        }
                    }else{
                        SetWeatherInfo('Error gettin the weather info');
                    }
                } catch (error) {
                    SetWeatherInfo('Error gettin the weather info');
                }
                
            };
            fetchWeather();
        }
    }, [city]);

    return(
        <div className="container">

            <div className="content" style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:'85vh'}}>
                <h1>Flakundo WeatherApp</h1>
                <input
                    type="text"
                    placeholder="Type the city name"
                    ref={inputRef}
                    id="autocomplete-input" 
                    style={{padding:'10px', fontSize:'16px', width:'300px'}}
                >
                </input>
                {imgOn === true &&
                (<img src={icon} alt="Weather data icon" border="0"></img>)
                }
                <p>{weatherInfo}</p>
                <p>{maximumWindSpeed}</p>
               
                <span>{country}</span>
                <span>{state}</span>
            </div>
        </div>

    );
}

export default WeatherApp;