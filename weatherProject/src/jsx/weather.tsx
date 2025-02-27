import React, { useEffect, useState } from "react";
import { todayRegionCoords } from "./regionCoords";
import { getOpenWeatherData } from "./openWeather";

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
            <h2>{region}</h2>
            {loading ? (
                <p>날씨 정보 불러오는 중...</p>
            ) : (
                <ul className="weather-card">
                    <div className="icon">

                    </div>
                    <div className="temperature">{temp}°C</div>
                    <p className="weatherType">{weatherDesc}</p>
                    <div className="weather-info">
                        <div className="winfoB">
                            <p>최고 기온 : {maxtemp} °C</p>
                        </div>
                        <div className="winfoB">
                            <p>기압 : {(mintemp)} Pa</p>
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
