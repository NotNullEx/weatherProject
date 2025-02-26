import { useEffect, useState } from "react";
import { regionCoords } from "./regionCoords";

interface WeatherData {
    city: string;
    year: number;
    rnDay: number; // 월별 총 강수량
}

interface CallApiProps {
    selectedYear: string;
    selectedIndex: number;
}


const regionWeather: React.FC<CallApiProps> = ({ selectedYear, selectedIndex }) => {
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [getTotalPrecipitation, setGetTotalPrecipitation] = useState<string>("0");


    useEffect(() => {
        if (weatherData.length > 0 && regioneweatherData.length > 0) {
            const totalRain = weatherData.reduce((sum, d) => sum + d.rnDay, 0);
            const regionRain = regioneweatherData.reduce((sum, d) => sum + d.rnDay, 0);
            setRegionData(Math.floor(regionRain));
            setPercent(Math.floor((regionRain / totalRain) * 100));
        }
    }, [selectedYear,selectedCity]);


    // 지역 선택 시 도시명 업데이트
    useEffect(() => {
        const cityMapping = ["서울", "수원", "강릉", "충주", "천안", "대구", "창원", "전주", "여수", "제주"];
        setSelectedCity(cityMapping[selectedIndex] || "서울");
    }, [selectedIndex]);


    // 전국 지역 강수량 가져오기
    useEffect(() => {
        if (!selectedCity) return;
        fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}&city=${selectedCity}`)
            .then((res) => res.json())
            .then(setRegionWeatherData)
            .catch((err) => console.error("❌ 지역 강수량 데이터 가져오기 실패:", err));
            const cityMapping = ["서울", "수원", "강릉", "충주", "천안", "대구", "창원", "전주", "여수", "제주"];
            setSelectedCity(cityMapping[selectedIndex] || "서울");
    }, [selectedYear, selectedCity]);

    // 전국 총 강수량 가져오기
    useEffect(() => {
        fetch(`http://localhost:5000/api/precipitation?year=${selectedYear}`)
            .then((res) => res.json())
            .then(setWeatherData)
            .catch((err) => console.error("❌ 전국 강수량 데이터 가져오기 실패:", err));
            
    }, [selectedYear]);

    useEffect(() => {
        const counters: NodeListOf<HTMLElement> = document.querySelectorAll(".allhighestprecipitation");

        counters.forEach((counter) => {
            counter.textContent = "0";

            const targetAttr = counter.getAttribute("data-target");
            if (!targetAttr) return;

            const targetNum: number = parseInt(targetAttr, 10);

            const updateCounter = () => {
                const count: number = parseInt(counter.textContent || "0", 10);
                const increment: number = targetNum / 100;
                const nextCount: number = Math.ceil(count + increment);

                counter.textContent = String(nextCount > targetNum ? targetNum : nextCount);

                if (count < targetNum) {
                    requestAnimationFrame(updateCounter);
                }
            };

            updateCounter();
        });
    }, [selectedIndex, selectedYear]);
}
export default regionWeather