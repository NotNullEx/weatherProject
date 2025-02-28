import React, { useState, useEffect } from "react";
import { regionCoords } from "./regionCoords"; 
const API_KEY = "b38c1aa9b51d2705b80ad742bf49fba8";
const LANG = "kr"; 

interface WeatherData {
    main: {
        feels_like: number;
    };
    weather: { description: string; icon: string }[];
    name: string;
}

const suggestClothes = (feelsLike: number): string[] => {
    if (feelsLike <= 4) return ["패딩", "롱 패딩", "털 장갑", "목도리"];
    if (feelsLike <= 8) return ["울코트", "목도리", "털 옷"];
    if (feelsLike <= 11) return ["코트", "야상", "패딩조끼", "니트조끼"];
    if (feelsLike <= 16) return ["야상", "니트", "기모 바지", "레깅스"];
    if (feelsLike <= 19) return ["자켓", "후드", "청바지", "긴 바지"];
    if (feelsLike <= 22) return ["가디건", "긴팔 셔츠", "청바지", "면바지"];
    if (feelsLike <= 27) return ["반팔", "얇은 셔츠", "반바지", "면바지"];
    return ["민소매", "반팔", "반바지", "원피스"];
};

interface SuggestWeatherProps {
    selectedIndex: number;
}

const SuggestWeather: React.FC<SuggestWeatherProps> = ({ selectedIndex }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
            "경기": "Suwon",  // 경기 (수원)
            "강원": "Gangneung", // 강원 (강릉)
            "충북": "Cheongju", // 충북 (청주)
            "충남": "Cheonan", // 충남 (천안)
            "경북": "Pohang", // 경북 (포항)
            "경남": "Changwon", // 경남 (창원)
            "전북": "Jeonju", // 전북 (전주)
            "전남": "Yeosu", // 전남 (여수)
            "제주": "Jeju"
        };
        const mappedCityName = regionMapping[region.name] || region.name;
        setCityName(mappedCityName);

        const fetchWeather = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${mappedCityName}&appid=${API_KEY}&lang=${LANG}&units=metric`;

                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error("날씨 데이터를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [selectedIndex]);

    if (loading) return <p>날씨 정보를 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div>
            <div className="thermometerIconbox">
                <div className="thermometerIcon"></div>
                <div>
                    현재<br/>
                    체감 온도<p>{weather?.main.feels_like}°C</p>
                </div>
            </div>
            <div className="suggestion">
                <div className="suggestionT">추천 의상</div>
                <div className="suggestionM">
                    {suggestClothes(weather?.main.feels_like || 0).join(", ")}
                </div>
            </div>
        </div>
    );
};

export default SuggestWeather;
