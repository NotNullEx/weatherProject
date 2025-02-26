// import { useEffect, useState } from "react";
// import { regionCoords } from "./regionCoords";

// interface WeatherData {
//     city: string;
//     year: number;
//     Va_lst_11: number;
// }

// interface CallApiProps {
//     selectedYear: string;
//     selectedIndex: number;
// }

// const TotalPrecipitation: React.FC<CallApiProps> = ({ selectedYear, selectedIndex }) => {
//     const [selectedCity, setSelectedCity] = useState<string>("");
//     const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
//     const [getTotalPrecipitation, setGetTotalPrecipitation] = useState<string>("0");

    
//     useEffect(() => {
//         const region = regionCoords[selectedIndex];

//         const regionMapping: { [key: string]: string } = {
//             "경기": "수원",
//             "강원": "강릉",
//             "전남": "여수",
//             "전북": "전주",
//             "충남": "천안",
//             "충북": "청주",
//             "경남": "창원",
//             "경북": "포항"
//         };

//         const mappedCity = regionMapping[region.name] || region.name;
//         setSelectedCity(mappedCity);
//     }, [selectedIndex]);

//     useEffect(() => {
//         fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}&city=${selectedCity}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 let totalRain = 0;
//                 console.log(data);
//                 for (let i = 0; i < data.length; i++) {
//                     totalRain += data[i].rnDay;
//                 }
//                 console.log(totalRain)
//                 setGetTotalPrecipitation(String(Math.floor(totalRain))); // 값을 업데이트
//             })
//             .catch((err) => console.error('❌ 데이터 가져오기 실패:', err));
//     }, [selectedYear, selectedCity]);



//     // useEffect(() => {
//     //     if (!selectedCity) return;
//     //     console.log(`📡 Fetching 지역 강수량 데이터: ${selectedCity} (${selectedYear})`);

//     //     fetch(`http://localhost:5000/api/yearWeather?year=${selectedYear}&city=${selectedCity}`)
//     //         .then((res) => res.json())
//     //         .then((data) => {
//     //             setWeatherData(data);
//     //         })
//     //         .catch((err) => console.error("❌ 지역 강수량 데이터 가져오기 실패:", err));
//     // }, [selectedYear, selectedCity]);

//     // useEffect(() => {
//     //     if (weatherData.length > 0) {
//     //         setGetTotalPrecipitation(String(weatherData[0]?.Va_lst_11 || "0"));
//     //     }
//     // }, [weatherData]);

//     return (
//         <div className="c2-1">
//             <p className="circleperTitle">전국 총 강수량(ml)</p>
//             <p className="allhighestprecipitation">{getTotalPrecipitation} (ml)</p>
//         </div>
//     );
// };

// export default TotalPrecipitation;

import { useEffect, useState } from "react";
import { regionCoords } from "./regionCoords"

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

    // 지역 인덱스를 기반으로 도시 매핑
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

    // 선택된 연도와 도시를 기반으로 강수량 데이터 가져오기
    useEffect(() => {
        if (!selectedCity) return;

        fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data: WeatherData[]) => {
                const totalRain = data.reduce((sum, item) => sum + item.rnDay, 0);
                setGetTotalPrecipitation(String(Math.floor(totalRain)));
            })
            .catch((err) => console.error("❌ 강수량 데이터 가져오기 실패:", err));
    }, [selectedYear, selectedCity]);

    return (
        <div className="c2-1">
            <p className="circleperTitle">총 강수량</p>
            <p className="allhighestprecipitation">{getTotalPrecipitation} (mm)</p>
        </div>
    );
};

export default TotalPrecipitation;
