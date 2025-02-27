import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { regionCoords } from "./regionCoords";

const API_KEY = "b38c1aa9b51d2705b80ad742bf49fba8";
const LANG = "kr";

interface WeatherForecastChartProps {
    selectedIndex: number;
}

const weatherIcons: { [key: string]: string } = {
    Clear: "☀️",
    Clouds: "⛅",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️",
    Fog: "🌁",
    Haze: "🌆",
};

const WeatherChart: React.FC<WeatherForecastChartProps> = ({ selectedIndex }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cityName, setCityName] = useState<string>("");

    useEffect(() => {
        if (selectedIndex < 0 || selectedIndex >= regionCoords.length) return;
        const region = regionCoords[selectedIndex];
        const regionMapping: { [key: string]: string } = {
            "서울": "Seoul",
            "부산": "Busan",
            "대구": "Daegu",
            "인천": "Incheon",
            "광주": "Gwangju",
            "대전": "Daejeon",
            "울산": "Ulsan",
            "경기": "Suwon",
            "강원": "Gangneung",
            "충북": "Cheongju",
            "충남": "Cheonan",
            "경북": "Pohang",
            "경남": "Changwon",
            "전북": "Jeonju",
            "전남": "Yeosu",
            "제주": "Jeju"
        };
        const mappedCityName = regionMapping[region.name] || region.name;
        setCityName(mappedCityName);

        const fetchWeatherForecast = async () => {
            try {
                setLoading(true);
                setError(null);
                const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${mappedCityName}&appid=${API_KEY}&lang=${LANG}&units=metric`;

                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error("날씨 데이터를 불러오는 데 실패했습니다.");
                }

                const result = await response.json();
                const forecastData = result.list;

                // 현재 시간을 가져옴
                const now = new Date();
                const closestHour = new Date(now);
                closestHour.setMinutes(0, 0, 0); // 정각으로 맞춤
                if (now.getMinutes() > 30) {
                    closestHour.setHours(now.getHours() + 1);
                }

                // 현재 시간 이후 데이터만 필터링
                const filteredData = forecastData
                    .filter((entry: any) => new Date(entry.dt_txt) >= closestHour)
                    .slice(0, 12); // 가장 가까운 정각부터 12개 데이터 선택

                const chartData = filteredData.map((entry: any) => ({
                    time: entry.dt_txt.split(" ")[1].slice(0, 5), // HH:MM 포맷
                    temperature: entry.main.temp,
                    weather: entry.weather[0].main,
                }));

                setData(chartData);
            } catch (err) {
                setError("날씨 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherForecast();
    }, [selectedIndex]);

    if (loading) return <p>날씨 데이터를 불러오는 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text">날씨 예보</h2>
            <ResponsiveContainer width="100%" className="chart">
                <AreaChart data={data} margin={{ right: 20, left: 20, bottom: 5 }} >
                    <defs className="grdt" >
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1" >
                            <stop className="grdt1" offset="20%" stopColor="" stopOpacity={0.2} />
                            <stop className="grdt2" offset="100%" stopColor="" stopOpacity={1} />

                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#ffffff" }} interval="preserveStartEnd" />
                    <YAxis hide />
                    <Tooltip formatter={(value) => [`${value}°C`, "온도"]}
                        contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "8px", border: "none" }}
                        labelStyle={{ color: "#fff" }} />
                    <Area
                        className="chartline"
                        type="monotone"
                        dataKey="temperature"
                        stroke=""
                        strokeWidth={3}
                        fill="url(#colorTemp)" // 그래디언트 적용
                        dot={{ r: 5, fill: "#ffffff" }}
                        activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2, fill: "#ffffff" }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className="chartInfo" >
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        {weatherIcons[item.weather]}
                        <p className="text-sm">{item.temperature}°</p>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default WeatherChart;
