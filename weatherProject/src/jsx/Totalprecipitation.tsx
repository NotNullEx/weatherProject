import { useEffect, useState } from "react";
import { regionCoords } from "./regionCoords"
import url from './json/url.json';

interface WeatherData {
    city: string;
    year: number;
    rnDay: number; // 월별 총 강수량
}

interface CallApiProps {
    selectedYear: string;
    selectedIndex: number;
}

const TotalPrecipitation: React.FC<CallApiProps> = ({ selectedYear, selectedIndex }) => {
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [getTotalPrecipitation, setGetTotalPrecipitation] = useState<string>("0");

    useEffect(() => {
        const region = regionCoords[selectedIndex];

        const regionMapping: { [key: string]: string } = {
            경기: "수원",
            강원: "강릉",
            전남: "여수",
            전북: "전주",
            충남: "천안",
            충북: "청주",
            경남: "창원",
            경북: "포항",
        };

        setSelectedCity(regionMapping[region.name] || region.name);
    }, [selectedIndex]);

    // 선택된 연도, 도시로 불러옴
    useEffect(() => {
        if (!selectedCity) return;

        fetch(`${url.host2}/api/precipitation?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data: WeatherData[]) => {
                const totalRain = data.reduce((sum, item) => sum + item.rnDay, 0);
                setGetTotalPrecipitation(String(Math.floor(totalRain)));
            })
            .catch((err) => console.error("강수량 가져오기 실패:", err));
    }, [selectedYear, selectedCity]);

    return (
        <div className="c2-1">
            <p className="circleperTitle">{selectedYear}년 총 강수량</p>
            <p className="allhighestprecipitation">{getTotalPrecipitation.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} (mm)</p>
        </div>
    );
};

export default TotalPrecipitation;
