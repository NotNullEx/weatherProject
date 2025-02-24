import { useEffect, useState } from "react";
import { getUltraSrtNcst } from "./openWeather";
import { regionCoords } from "./regionCoords";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiNightClear } from "react-icons/wi";

interface WeatherForecastChartProps {
    selectedIndex: number;
}

const weatherIcons: { [key: string]: JSX.Element } = {
    맑음: <WiDaySunny size="1.4vw" color="#FFD700" />,
    구름많음: <WiCloud size="1.4vw" color="#A0A0A0" />,
    흐림: <WiCloud size="1.4vw" color="#808080" />,
    비: <WiRain size="1.4vw" color="#1E90FF" />,
    눈: <WiSnow size="1.4vw" color="#ADD8E6" />,
    "맑음 (밤)": <WiNightClear size="1.4vw" color="#FFD700" />,
};

const WeatherChart: React.FC<WeatherForecastChartProps> = ({ selectedIndex }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [height, setHeight] = useState(180); // 초기값: 20vh

    useEffect(() => {
        // 창 크기 변경 시 height 업데이트
        const updateHeight = () => {
            const newHeight = Math.max(60, window.innerWidth * 0.1); // 최소 120px 유지
            setHeight(newHeight);
        };

        window.addEventListener("resize", updateHeight);
        updateHeight(); // 초기 실행

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                const now = new Date();
                const region = regionCoords[selectedIndex];
                const tempData = [];

                for (let i = 0; i < 12; i++) {
                    const pastTime = new Date(now);
                    pastTime.setHours(now.getHours() - i * 2);

                    const weatherData = await getUltraSrtNcst(region.nx, region.ny, pastTime);
                    const temp = weatherData?.response?.body?.items?.item.find((i: any) => i.category === "T1H")?.obsrValue;
                    const skyCode = weatherData?.response?.body?.items?.item.find((i: any) => i.category === "SKY")?.obsrValue;

                    let weatherCondition = "맑음";
                    if (skyCode === "3") weatherCondition = "구름많음";
                    else if (skyCode === "4") weatherCondition = "흐림";
                    else if (skyCode === "1" && pastTime.getHours() >= 18) weatherCondition = "맑음 (밤)";

                    tempData.unshift({
                        time: `${pastTime.getHours()}시`,
                        기온: temp ?? 0,
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
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data} margin={{ right: 20, left: 20, bottom: 5 }}>
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis hide domain={["dataMin-10", "dataMax+10"]} tickCount={5} />
                    <Tooltip />
                    <Line type="monotone" dataKey="기온" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>

            <div className="chartInfo" style={{ display: "flex", width: "100vw" }}>
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        {weatherIcons[item.weather]}
                        <p className="text-sm">{item.기온}°</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherChart;
