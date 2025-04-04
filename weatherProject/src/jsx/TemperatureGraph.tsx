import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { regionCoords } from "./regionCoords";
import { useEffect, useState } from 'react';
import url from './json/url.json';

type WeatherData = {
    id: number;
    city: string;
    year: number;
    month: number;
    taavg: number;
    tamax: number;
    tamin: number;
    avghm: number;
};

interface CallApiProps {
    selectedYear: string;
    selectedIndex: number;
}

const TemperatureGraph: React.FC<CallApiProps> = ({ selectedYear, selectedIndex }) => {
    const [chartData, setChartData] = useState<{ name: string; 최고: number; 평균: number; 최저: number }[]>([]);
    const [cityName, setCityName] = useState<string>("");
    const [viewCityName,setViewCityName] = useState<string>("");

    useEffect(() => {
        const region = regionCoords[selectedIndex];

        const regionMapping: { [key: string]: string } = {
            "경기": "수원",
            "강원": "강릉",
            "전남": "여수",
            "전북": "전주",
            "충남": "천안",
            "충북": "청주",
            "경남": "창원",
            "경북": "포항"
        };

        const mappedCityName = regionMapping[region.name] || region.name;
        setCityName(mappedCityName);
        setViewCityName(region.name);

        fetch(`${url.host2}/api/temperature?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data) => {
                const months = [
                    "1월", "2월", "3월", "4월", "5월", "6월",
                    "7월", "8월", "9월", "10월", "11월", "12월"
                ];

                const cityData = data.filter((item: WeatherData) => item.city === mappedCityName);

                const processedData = months.map((month, index) => {
                    const monthData = cityData.find((item: any) => item.month === index + 1);

                    return {
                        name: month,
                        최고: monthData?.tamax ?? 0,
                        평균: monthData?.taavg ?? 0,
                        최저: monthData?.tamin ?? 0,
                    };
                });

                setChartData(processedData);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
    }, [selectedYear, selectedIndex]);

    return (
        <div className="temperatureGraph">
            <h2 className="tgtitle">{selectedYear}년 {viewCityName} 기온 그래프</h2>
            <ResponsiveContainer width="110%" height="92%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize="12px" />
                    <YAxis tickCount={12} domain={[-15, 40]} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "8px", border: "none" }}/>
                    <Legend />

                    <Line type="monotone" className='tendata' dataKey="최고" stroke="#ff0000" activeDot={{ r: 8 }} name="최고 기온" />
                    <Line type="monotone" dataKey="평균" stroke="#007BFF" name="평균 기온" />
                    <Line type="monotone" dataKey="최저" stroke="#00FF00" name="최저 기온" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureGraph;
