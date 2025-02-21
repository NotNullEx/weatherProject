import React, { useState, useEffect } from "react";

const API_KEY = "b38c1aa9b51d2705b80ad742bf49fba8"; // OpenWeatherMap API 키
const CITY = "Seoul"; // 기본 도시
const LANG = "kr"; // 한국어 설정
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&lang=${LANG}&units=metric`;

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

// 사용 예제
console.log(suggestClothes(15)); // ["야상", "니트", "기모 바지", "레깅스"]

const SuggestWeather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
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
    }, []);

    if (loading) return <p>날씨 정보를 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div>
            <div className="thermometerIconbox">
                <div className="thermometerIcon"></div> <div>체감 온도 <p>{weather?.main.feels_like} °C</p></div>
            </div>
            <div className="suggestion">
                <div className="suggestionT">추천 의상</div><div className="suggestionM"> {suggestClothes(weather?.main.feels_like || 0).join(", ")}</div></div>
        </div >
    );
};

export default SuggestWeather;
