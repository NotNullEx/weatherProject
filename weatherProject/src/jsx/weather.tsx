// src/components/WeatherSelector.tsx
import React, { useEffect, useState } from "react";
import { regionCoords, RegionCoord } from "./regionCoords";
import { getUltraSrtNcst } from "./openWeather";

interface KmaItem {
    category: string;
    obsrValue: string;
}

const WeatherSelector: React.FC = () => {
    // 선택된 지역 index (기본: 0 → 서울)
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    // 기온, 습도, 강수형태 등 상태
    const [temp, setTemp] = useState("-");
    const [humidity, setHumidity] = useState("-");
    const [rainType, setRainType] = useState("-");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIndex(Number(e.target.value));
    };

    const fetchWeather = async (region: RegionCoord) => {
        setLoading(true);
        const data = await getUltraSrtNcst(region.nx, region.ny);
        setLoading(false);

        if (data?.response?.header?.resultCode === "00") {
            const items: KmaItem[] = data.response.body.items.item;
            // T1H(기온), REH(습도), PTY(강수형태)
            const t1hItem = items.find((item) => item.category === "T1H");
            const rehItem = items.find((item) => item.category === "REH");
            const ptyItem = items.find((item) => item.category === "PTY");

            setTemp(t1hItem ? t1hItem.obsrValue : "-");
            setHumidity(rehItem ? rehItem.obsrValue : "-");
            setRainType(ptyItem ? ptyItem.obsrValue : "-");
        } else {
            console.log("API 응답 오류:", data?.response?.header?.resultMsg);
            setTemp("-");
            setHumidity("-");
            setRainType("-");
        }
    };

    // selectedIndex가 바뀔 때마다 API 호출
    useEffect(() => {
        fetchWeather(regionCoords[selectedIndex]);
    }, [selectedIndex]);

    return (
        <div style={{ margin: "1rem" }} className="realtimeWeather">
            <h2>기상청 초단기실황</h2>
            <select value={selectedIndex} onChange={handleChange}>
                {regionCoords.map((region, idx) => (
                    <option value={idx} key={region.name}>
                        {region.name}
                    </option>
                ))}
            </select>

            {loading ? (
                <p>날씨 정보 불러오는 중...</p>
            ) : (
                <ul style={{ marginTop: "1rem" }}>
                    <li>지역: {regionCoords[selectedIndex].name}</li>
                    <li>기온(T1H): {temp} °C</li>
                    <li>습도(REH): {humidity} %</li>
                    <li>강수형태(PTY): {rainType}</li>
                </ul>
            )}
        </div>
    );
};

export default WeatherSelector;
