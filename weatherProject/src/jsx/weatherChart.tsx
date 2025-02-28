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
        
                // 현재 시간, 기준 설정
                const now = new Date();
                const closestHour = new Date(now);
                closestHour.setMinutes(0, 0, 0);
                if (now.getMinutes() > 30) {
                    closestHour.setHours(now.getHours() + 1);
                }
        
                const filteredData = forecastData
                    .filter((entry: any) => new Date(entry.dt_txt) >= closestHour)
                    .slice(0, 12); 
        
                    const chartData = filteredData.map((entry: any) => {
                        const dateTime = new Date(entry.dt_txt);
                        dateTime.setHours(dateTime.getHours() + 9);
                    
                        const month = dateTime.getMonth() + 1;
                        const day = dateTime.getDate();
                        const hours = dateTime.getHours();
                    
                        return {
                            date: `${month}월 ${day}일`,
                            time: `${hours}시`,  // 
                            temperature: entry.main.temp,
                            weather: entry.weather[0].main,
                        };
                    });
                    
        
                setData(chartData);
            } catch (err) {
                setError("날씨 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherForecast();

    }, [selectedIndex]);

    const today = new Date();
    const todayStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;
    
    const nowHour = new Date().getHours();
    const baseHour = Math.floor(nowHour / 3) * 3; 

    const highlightIndex = data.findIndex((item) => parseInt(item.time) === baseHour);
    
    if (loading) return <p>날씨 데이터를 불러오는 중...</p>;
    if (error) return <p>{error}</p>;

    return (
<div className="p-4 border rounded-lg shadow-lg bg-white">
        <h2 className="text">날씨 예보 ({todayStr}~)</h2>
        <ResponsiveContainer width="100%" className="chart">
            <AreaChart data={data} margin={{ right: 20, left: 20, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8884d8" stopOpacity={0.3} /> 
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="time" />
                <YAxis hide />
                <Tooltip 
                    formatter={(value) => [`${value}°C`, "온도"]}
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "8px", border: "none", color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                />
                <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    strokeWidth={3}
                    fill="url(#colorTemp)"
                    dot={(props) => {
                        const { cx, cy, index } = props;
                        return (
                            <>
                                <circle 
                                    cx={cx} cy={cy} 
                                    r={index === highlightIndex ? 8 : 5} 
                                    fill={index === highlightIndex ? "#ffcc00" : "#ffffff"} 
                                    stroke={index === highlightIndex ? "#ff6600" : "#8884d8"} 
                                    strokeWidth={index === highlightIndex ? 3 : 1} 
                                />
                                {index === highlightIndex && (
                                    <text x={cx - 19} y={Math.max(cy - 12, 10)} fill="#ff6600" fontSize={10} fontWeight="bold">
                                    기준시간
                                </text>
                                    
                                )}
                            </>
                        );
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>

        <div className="chartInfo flex justify-around mt-4">
            {data.map((item, index) => (
                <div 
                    key={index} 
                    className={`text-center ${index === highlightIndex ? "font-bold text-lg text-orange-500" : "text-sm text-gray-700"}`}
                >
                    <span className={`text-2xl ${index === highlightIndex ? "animate-bounce" : ""}`}>
                        {weatherIcons[item.weather]}
                    </span>
                    <p>{item.temperature}°</p>
                </div>
            ))}
        </div>
    </div> 
    );
};

export default WeatherChart;
