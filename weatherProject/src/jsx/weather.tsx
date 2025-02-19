import React, { useEffect, useState } from "react";
import { regionCoords } from "./regionCoords";
import { getUltraSrtNcst } from "./openWeather";

interface WeatherProps {
    selectedIndex: number;
}

const Weather: React.FC<WeatherProps> = ({ selectedIndex }) => {
    const [temp, setTemp] = useState("-");
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
            setTemp(items.find((item: any) => item.category === "T1H")?.obsrValue || "-");
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
            <h2>오늘의 날씨</h2>
            {loading ? (
                <p>날씨 정보 불러오는 중...</p>
            ) : (
                <ul>
                    <li>기온: {temp} °C</li>
                    <li>습도: {humidity} %</li>
                    <li>강수형태: {rainType}</li>
                </ul>
            )}
        </div>
    );
};

export default Weather;