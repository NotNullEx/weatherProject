import React, { useEffect, useState } from "react";
import { regionCoords } from "./regionCoords";
import { getUltraSrtFcst, getUltraSrtNcst } from "./openWeather";

interface WeatherProps {
    selectedIndex: number;
}

const WeatherChart: React.FC<WeatherProps> = ({ selectedIndex }) => {
    const [region, setRegion] = useState("-");
    const [time, setTime] = useState("-");
    const [temp, setTemp] = useState("-");
    const [wind, setWind] = useState("-");
    const [humidity, setHumidity] = useState("-");
    const [rainType, setRainType] = useState("0"); // 실황 강수 (PTY)
    const [skyCode, setSkyCode] = useState("-"); // 예보 SKY 
    const [rainCode, setRainCode] = useState("0"); // 예보 PTY 
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        const region = regionCoords[selectedIndex];
        const ncstData = await getUltraSrtNcst(region.nx, region.ny); // 실황 API
        const fcstData = await getUltraSrtFcst(region.nx, region.ny); // 예보 API
        setLoading(false);

        if (ncstData?.response?.header?.resultCode === "00") {
            const items = ncstData.response.body.items.item;
            setRegion(region.name || "-");
            setTime(items.find((item: any) => item.baseTime)?.baseTime || "-");
            setTemp(items.find((item: any) => item.category === "T1H")?.obsrValue || "-");
            setWind(items.find((item: any) => item.category === "WSD")?.obsrValue || "-");
            setHumidity(items.find((item: any) => item.category === "REH")?.obsrValue || "-");
            setRainType(items.find((item: any) => item.category === "PTY")?.obsrValue || "0");
        } else {
            console.log("실황 API 응답 오류:", ncstData?.response?.header?.resultMsg);
        }

        if (fcstData?.response?.header?.resultCode === "00") {
            const forecastItems = fcstData.response.body.items.item;
            const sky = forecastItems.find((item: any) => item.category === "SKY")?.fcstValue || "-";
            const rain = forecastItems.find((item: any) => item.category === "PTY")?.fcstValue || "0";
            setSkyCode(sky);
            setRainCode(비);
        } else {
            console.log("예보 API 응답 오류:", fcstData?.response?.header?.resultMsg);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [selectedIndex]);

    // 현재 강수 상태(rainType)
    const getWeatherClass = (skyCode: string, rainType: string) => {
        if (rainType !== "0") {
            switch (rainType) {
                case "1": return "rain";    // 비
                case "2": return "sleet";   // 눈비
                case "3": return "Snow";    // 눈 
                case "4": return "shower";  // 소나기
                case "5": return "drizzle"; // 빗방울
                case "6": return "sleet";   // 눈비    
                case "7": return "snowySunny"; // 눈날림
                default: return "unknown";
            }
        }

        switch (skyCode) {
            case "1": return "clear";    // 맑음
            case "3": return "cloudy";    // 구름 많음
            case "4": return "overcast";  // 흐림
            default: return "unknown";
        }
    };

    // 오전/오후 변환
    const formatTimeWithMeridiem = (time: string) => {
        if (time.length !== 4) return "-";

        const hour = parseInt(time.substring(0, 2), 10);
        const minute = time.substring(2);
        const meridiem = hour < 12 ? "오전" : "오후";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

        return `${meridiem} ${formattedHour}:${minute}`;
    };

    return (
        <div className="realtimeWeather">
            <h2>
                {region}
                <p>{formatTimeWithMeridiem(time)} 기준</p>
            </h2>
            {loading ? (
                <p>날씨 정보 불러오는 중...</p>
            ) : (
                <ul className="weather-card">
                    <div className={`icon ${getWeatherClass(skyCode, rainType)}`}></div>
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
