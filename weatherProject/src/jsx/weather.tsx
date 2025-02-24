import React, { useEffect, useState } from "react";
import { regionCoords } from "./regionCoords";
import { getUltraSrtNcst } from "./openWeather";

interface WeatherProps {
    selectedIndex: number;
}

const WeatherChart: React.FC<WeatherProps> = ({ selectedIndex }) => {
    const [region, setRegion] = useState("-");
    const [time, setTime] = useState("-");
    const [temp, setTemp] = useState("-");
    const [wind, setWind] = useState("-");
    const [humidity, setHumidity] = useState("-");
    const [rainType, setRainType] = useState("-");
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        const region = regionCoords[selectedIndex];
        const data = await getUltraSrtNcst(region.nx, region.ny);
        setLoading(false);

        if (data?.response?.header?.resultCode === "00") {
            const items = data.response.body.items.item;
            setRegion(region.name || "-");
            setTime(items.find((item: any) => item.baseTime)?.baseTime || "-");
            setTemp(items.find((item: any) => item.category === "T1H")?.obsrValue || "-");
            setWind(items.find((item: any) => item.category === "WSD")?.obsrValue || "-");
            setHumidity(items.find((item: any) => item.category === "REH")?.obsrValue || "-");
            setRainType(items.find((item: any) => item.category === "PTY")?.obsrValue || "-");
        } else {
            console.log("API 응답 오류:", data?.response?.header?.resultMsg);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [selectedIndex]);

    return (
        <div className="realtimeWeather">
            <h2>
                {region}
                <p>{time.substring(0, 2) + " : " + time.substring(2)}시 기준</p>
            </h2>
            {loading ? (
                <p>날씨 정보 불러오는 중...</p>
            ) : (
                <ul className="weather-card">
                    <div className="icon"></div>
                    <div className="temperature">{temp}°C</div>
                    <div className="weather-info">
                        <div className="winfoB">
                            <span className="windIcon"></span><p> {wind} m/s <br /> 풍속</p>
                        </div>
                        <div className="winfoB">
                            <span className="humidityIcon"></span> <p>{humidity} % <br /> 습도</p>
                        </div>
                        <div className="winfoB">
                            <span className="VisibilityIcon"></span> <p>{rainType} <br /> 강수형태</p>
                        </div>
                    </div>
                </ul>
            )}
        </div>
    );
};

export default WeatherChart;