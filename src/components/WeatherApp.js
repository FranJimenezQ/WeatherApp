import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const WeatherApp = () => {

    const [city, SetCity] = useState('');
    const [weatherInfo, SetWeatherInfo] = useState('Type a city');
    const inputRef = useRef(null);

    
    useEffect(()=>{
        const initAutocomplete = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
              const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      
              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.address_components) {
                  SetCity(place.name);
                }
              });
            }
          };
      
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
                const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
                try {
                    const response = await axios.get(url);
                    if (response.status === 200) {
                        const data = response.data;
                        console.log(data);
                        
                        if (data && data.current && data.current.condition) {
                            SetWeatherInfo(`${data.current.condition.text}, ${data.current.temp_c}°C`);
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
                <h1>WeatherApp</h1>
                <input
                    type="text"
                    placeholder="Type the city name"
                    ref={inputRef}
                    id="autocomplete-input" 
                    style={{padding:'10px', fontSize:'16px', width:'300px'}}
                >
                </input>
                <p>{weatherInfo}</p>
            </div>
        </div>

    );
}

export default WeatherApp;