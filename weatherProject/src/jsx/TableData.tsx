import React, { useState, useEffect } from "react";
import { regionCoords } from "./regionCoords";

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

type PrecipitationData = {
    city: string;
    year: number;
    month: number;
    rnDay: number; // 강수량 총량
    maxRnDay: number; // 1일 최다 강수량
    tmRnDay: number; // 1일 최다 강수량이 나타난 날
};

interface WeatherProps {
    selectedYear: string;
    selectedIndex: number;
}

const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
];

const TableData: React.FC<WeatherProps> = ({ selectedIndex, selectedYear }) => {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [precipitationData, setPrecipitationData] = useState<PrecipitationData[]>([]);
    const [cityName, setCityName] = useState<string>("");

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

        // 기온 데이터 가져오기
        fetch(`http://localhost:5000/api/temperature?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data) => setWeatherData(data))
            .catch((err) => console.error("❌ 기온 데이터 가져오기 실패:", err));

        // 강수량 데이터 가져오기
        fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data) => setPrecipitationData(data))
            .catch((err) => console.error("❌ 강수량 데이터 가져오기 실패:", err));

    }, [selectedYear, selectedIndex]);

    return (
        <div className="table">
            <h2>{selectedYear}년 {cityName} 기상 데이터</h2>
            <table className="tableMain">
                <thead className="customthead">
                    <tr className="customtr">
                        <th className="customth">{cityName}</th>
                        <th className="customth">최고 기온(°C)</th>
                        <th className="customth">평균 기온(°C)</th>
                        <th className="customth">최저 기온(°C)</th>
                        <th className="customth">총 강수량(mm)</th>
                        <th className="customth">최대 강수량</th>
                        <th className="customth">최대 강수일</th>
                    </tr>
                </thead>
                <tbody className="customtbody">
                    {months.map((month, index) => {
                        const tempData = weatherData.find((item) => item.city === cityName && item.month === index + 1);
                        const rainData = precipitationData.find((item) => item.city === cityName && item.month === index + 1);
                        
                        return (
                            <tr key={index} className="customtr">
                                <td className="customtd">{month}</td>
                                <td className="customtd">{tempData?.tamax ?? "-"}</td>
                                <td className="customtd">{tempData?.taavg ?? "-"}</td>
                                <td className="customtd">{tempData?.tamin ?? "-"}</td>
                                <td className="customtd">{rainData?.rnDay ?? "-"}</td>
                                <td className="customtd">{rainData?.maxRnDay ?? "-"}</td>
                                <td className="customtd">{rainData?.tmRnDay ?? "-"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TableData;
