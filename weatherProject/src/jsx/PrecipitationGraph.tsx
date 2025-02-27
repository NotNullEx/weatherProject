import React, { useEffect, useState } from "react";

interface WeatherData {
    city: string;
    year: number;
    rnDay: number; // 월별 총 강수량
}

interface CallApiProps {
    selectedYear: string;
    selectedIndex: number;
}

const PrecipitationGraph: React.FC<CallApiProps> = ({ selectedYear, selectedIndex }) => {
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [regionWeatherData, setRegionWeatherData] = useState<WeatherData[]>([]);
    const [getTotalPrecipitation, setGetTotalPrecipitation] = useState<string>("0");
    const [regionData, setRegionData] = useState<number>(0);
    const [percent, setPercent] = useState<number>(0);

    // 선택된 지역 설정
    useEffect(() => {
        const cityMapping = ['서울', '수원', '천안', '청주', '강릉', '대구', '창원', '전주', '여수', '제주', '부산', '인천', '대전', '광주', '울산', '포항'];
        setSelectedCity(cityMapping[selectedIndex] || "서울");
    }, [selectedIndex]);

    // 전국 총 강수량 가져오기
    useEffect(() => {
        fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data: WeatherData[]) => {
                const totalRain = data.reduce((sum, item) => sum + item.rnDay, 0);
                setGetTotalPrecipitation(String(Math.floor(totalRain)));
            })
            .catch((err) => console.error("❌ 강수량 데이터 가져오기 실패:", err));
    }, [selectedYear, selectedCity]);

    // 특정 지역 강수량 가져오기
    useEffect(() => {
        if (!selectedCity) return;

        fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}&city=${selectedCity}`)
            .then((res) => res.json())
            .then((data) => setRegionWeatherData(data))
            // .then(setRegionWeatherData)
            .catch((err) => console.error("❌ 지역 강수량 데이터 가져오기 실패:", err));
    }, [selectedYear, selectedCity]);

    // 강수량 데이터 계산
    useEffect(() => {
        if (regionWeatherData.length > 0) {
            //const totalRain = weatherData.reduce((sum, d) => sum + d.rnDay, 0);
            const regionRain = regionWeatherData.reduce((sum, d) => sum + d.rnDay, 0);
            setRegionData(Math.floor(regionRain));
            setPercent(Math.floor((regionRain / Number(getTotalPrecipitation)) * 100));
            console.log(regionRain)
        }
    }, [weatherData, regionWeatherData]);
    console.log(selectedCity);
    // 원형 그래프 설정
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * ((100 - percent) / 100);

    return (
        <div className="circleBox">
            <svg viewBox="0 -10 100 100" className="circle">
                {/* 배경 원 */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                    transform="rotate(-90 50 50)"
                    className="circleIn"
                />
                {/* 진행 바 */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    className="circleIn2"
                />
            </svg>
            {/* 중앙 텍스트 */}
            <div className="absolute text-white text-sm font-semibold">
                <p className="circleper">{percent}%</p>
                <p className="ml">{regionData}mm</p>
            </div>
        </div>
    );
};

export default PrecipitationGraph;
