import { useEffect, useState } from "react";
import { getUltraSrtNcst, getUltraSrtFcst } from "./openWeather";
import { regionCoords } from "./regionCoords";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface WeatherForecastChartProps {
    selectedIndex: number;
}

const weatherIcons: { [key: string]: string } = {
    맑음: "☀️",
    구름많음: "⛅",
    흐림: "☁️",
    비: "🌧️",
    비눈: "🌦️",
    소나기: "🌦️",
    눈: "❄️",
    밤: "🌙"
};

const WeatherChart: React.FC<WeatherForecastChartProps> = ({ selectedIndex }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                const now = new Date();
                const region = regionCoords[selectedIndex];
                const tempData = [];

                for (let i = 12; i >= 1; i--) { // ✅ 현재 시간에서 -24시간까지 가져오기 (2시간 간격)
                    const timePoint = new Date(now);
                    timePoint.setHours(now.getHours() - i * 2);

                    // 날씨 데이터 가져오기
                    const weatherData = await getUltraSrtNcst(region.nx, region.ny, timePoint);
                    const skyWeatherData = await getUltraSrtFcst(region.nx, region.ny, timePoint);
                    // 기온, 하늘 상태, 강수 상태 가져오기
                    const temp = weatherData?.response?.body?.items?.item.find((i: any) => i.category === "T1H")?.obsrValue;
                    const rainType = weatherData?.response?.body?.items?.item.find((i: any) => i.category === "PTY")?.obsrValue || "0";
                    const skyCode = skyWeatherData?.response?.body?.items?.item.find((i: any) => i.category === "SKY")?.fcstValue;


                    let weatherCondition = "맑음";

                    if (rainType !== "0") {
                        switch (rainType) {
                            case "1":
                                weatherCondition = "비";
                                break;
                            case "2":
                                weatherCondition = "비눈";
                                break;
                            case "3":
                                weatherCondition = "눈";
                                break;
                            case "4":
                                weatherCondition = "소나기";
                                break;
                        }
                    } else {
                        switch (skyCode) {
                            case "3":
                                weatherCondition = "구름많음";
                                break;
                            case "4":
                                weatherCondition = "흐림";
                                break;
                            case "1":
                                if (timePoint.getHours() >= 20 || timePoint.getHours() < 6) {
                                    weatherCondition = "밤";
                                }
                                break;
                        }
                    }

                    //  데이터 저장
                    tempData.push({
                        time: `${timePoint.getHours()}시`,
                        temperature: temp ?? 0,
                        weather: weatherCondition,
                    });
                }

                setData(tempData);
            } catch (err) {
                setError("날씨 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [selectedIndex]);

    if (loading) return <p>날씨 데이터를 불러오는 중...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div className="p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-lg font-semibold mb-4"></h2>
            <ResponsiveContainer width="100%" className="chart">
                <LineChart data={data} margin={{ right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#ffffff" }} interval="preserveStartEnd" />
                    <YAxis hide domain={["dataMin-10", "dataMax+10"]} tickCount={5} />
                    <Tooltip
                        formatter={(value) => [`${value}°C`, "온도"]}
                        contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "8px", border: "none" }}
                        labelStyle={{ color: "#fff" }}
                    />

                    <Line
                        className="chartline"
                        type="monotone"
                        dataKey="temperature"
                        name="온도"
                        stroke=""
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#ffffff" }}
                        activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2, fill: "#b399ff" }}
                    />

                </LineChart>
            </ResponsiveContainer>

            <div className="chartInfo" >
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        {weatherIcons[item.weather]}
                        <p className="text-sm">{item.temperature}°</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherChart;
