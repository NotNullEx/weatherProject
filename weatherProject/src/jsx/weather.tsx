import React, { useEffect, useState } from "react";
import { todayRegionCoords } from "./regionCoords";
import { getOpenWeatherData } from "./openWeather";

import sunny from "../assets/img/sunny.png";
import snowySunny from "../assets/img/SnowySunny.png";
import overcast from "../assets/img/overcast.png";
import rain2 from "../assets/img/Rain2.png";
import rain from "../assets/img/rain.png";
import storm from "../assets/img/Storm.png";
import snow from "../assets/img/Snow.png";
import sleet from "../assets/img/sleet.png";
interface WeatherProps {
    selectedIndex: number;
}

const WeatherChart: React.FC<WeatherProps> = ({ selectedIndex }) => {
    const [region, setRegion] = useState("-");
    const [temp, setTemp] = useState("-");
    const [wind, setWind] = useState("-");
    const [maxtemp, setMaxtemp] = useState("-");
    const [mintemp, setMintemp] = useState("-");
    const [humidity, setHumidity] = useState("-");
    const [weatherDesc, setWeatherDesc] = useState("-");
    const [icon, setIcon] = useState("");
    const [loading, setLoading] = useState(false);

    const weatherIcons: { [key: string]: string } = {
        "맑음": sunny,
        "few clouds": snowySunny,
        "약간의 구름이 낀 하늘": overcast,
        "튼구름": overcast,
        "소나기": rain,
        "실 비": rain,
        "비": rain,
        "천둥": storm,
        "눈": snow,
    };
    console.log(weatherIcons[weatherDesc])

    const fetchWeather = async () => {
        setLoading(true);
        const regionData = todayRegionCoords[selectedIndex];

        if (!regionData) {
            console.error("잘못된 지역 선택");
            setLoading(false);

            return;

        }


        const weatherData = await getOpenWeatherData(regionData.lat, regionData.lon);
        setLoading(false);

        if (weatherData) {
            setRegion(regionData.name);
            setMaxtemp(weatherData.main.temp_max.toFixed(1));
            setMintemp(weatherData.main.pressure);
            setTemp(weatherData.main.temp.toFixed(1));
            setWind(weatherData.wind.speed.toFixed(1));
            setHumidity(weatherData.main.humidity);
            setWeatherDesc(weatherData.weather[0].description);
            setIcon(weatherData.weather[0].icon);
        } else {
            console.error("OpenWeather API 응답 오류");


        }

    };
    useEffect(() => {
        fetchWeather();
    }, [selectedIndex]);

    return (
        <div className="realtimeWeather">
            <h2>현재 {region} 날씨</h2>
            {loading ? (
                <p>날씨 정보 불러오는 중...</p>
            ) : (
                <ul className="weather-card">
                    <div
                        className="icon"
                        style={{
                            backgroundImage: `url(${weatherIcons[weatherDesc.toLowerCase()] || sunny})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100px",
                            height: "100px"
                        }}
                    ></div>
                    <div className="temperature">{temp}°C</div>
                    <p className="weatherType">{weatherDesc}</p>
                    <div className="weather-info">
                        <div className="winfoB">
                            <p>최고 기온 : {maxtemp} °C</p>
                        </div>
                        <div className="winfoB">
                            <p>기압 : {mintemp} Pa</p>
                        </div>
                        <div className="winfoB">
                            <p>풍속 : {wind} m/s </p>
                        </div>
                        <div className="winfoB">
                            <p>습도 : {humidity} % </p>
                        </div>
                    </div>
                </ul>
            )}
        </div>
    );
};

export default WeatherChart;
