import React, { useState, useEffect } from "react";
import Weather from "./weather";
import WeatherMap from "./weatherMap";
import TemperatureGraph from "./TemperatureGraph";
import PrecipitationGraph from "./PrecipitationGraph";
import SuggestWeather from "./SuggestClothes";
import { regionCoords } from "./regionCoords";
import TableData from "./TableData";
import WeatherChart from "./weatherChart";
import TotalPrecipitation from "./Totalprecipitation";

type monthPrecipitation = {
    city: string;
    year: number;
    month: number;
    rnDay: number; // 강수량 총량
    maxRnDay: number; // 1일 최다 강수량
    tmRnDay: number; // 1일 최다 강수량이 나타난 날
};

function WeatherDisplay() {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<string>("2024");
    const [selectedCity, setSelectedCity] = useState<string>("서울");
    // const [selectedMonth, setSelectedMonth] = useState<string>("");
    // const [selectedDay, setSelectedDay] = useState<string>("");
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [weatherData, setWeatherData] = useState<monthPrecipitation[]>([]);
    const [regionWeatherData, setRegionWeatherData] = useState<monthPrecipitation[]>([]);
    const [selectedCityN, setSelectedCityN] = useState('108');  // 도시 번호 (일별에서 씀)
    const [selectedMonth, setSelectedMonth] = useState("1"); // 월
    const [selectedDay, setSelectedDay] = useState("1");      // 일
    const [dayWeather, setDayWeather] = useState<any>([]);       // 선택된 월의 일들의 자료

    const getDaysInMonth = (year: string, month: string) => {
        const yearNum = Number(year);
        const monthNum = Number(month);
        return new Date(yearNum, monthNum, 0).getDate();
    };


    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);

    let selectMonth = Number(selectedMonth) < 10 ? "0" + selectedMonth : selectedMonth;
    const apiUrl2 = `/api/typ02/openApi/SfcMtlyInfoService/getDailyWthrData?pageNo=1&numOfRows=10&dataType=JSON&year=${selectedYear}&month=${selectMonth}&station=${selectedCityN}&authKey=hVqmw5caSHOapsOXGhhz3Q`;
    function callJsonApi(url: any) {  // Text API 호출 함수
        console.log("출력중");
        fetch(url)  // fetch를 통해 API 호출
            .then(response => response.json())  // 응답을 JSON으로 변환
            .then(data => { setDayWeather(data.response.body.items.item[0].stndays.info); })
            .catch(error => {
                console.error('API 호출 중 오류가 발생했습니다:', error);
                // 오류 처리를 수행할 수 있습니다.
            });
    }

    useEffect(() => {
        callJsonApi(apiUrl2);
    }, [apiUrl2, selectedYear, selectedMonth, selectedCityN, selectedDay]);

    let weatherDay: any = [];
    dayWeather.forEach((v: any) => {
        if (v.tm == selectedDay) {
            weatherDay = v;
        }
    });

    return (
        <div id="container" className="container">
            <header id="header" className="header">
                <p>WeatherLand</p>
                <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
                    {darkMode ? "다크" : "라이트 "}
                </button>
            </header>
            <main id="main" className="main">
                <section id="secondSection" className="secondSection">
                    <div className="b1" id="map">
                        <WeatherMap selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                    </div>
                    <div className="b2" id="wchart">
                        <WeatherChart selectedIndex={selectedIndex} />
                    </div>
                </section>
                <section id="firstSection" className="firstSection">
                    <div className="selectTime">
                        <div className="selectValuebox">
                            <div className="sb">
                                {/* 연도 선택 */}
                                <select className="selectValue" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                    {Array.from({ length: 8 }, (_, i) => {
                                        const year = 2024 - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}년
                                            </option>
                                        );
                                    })}
                                </select>

                                {/* 월 선택 */}
                                {/* <select className="selectValue" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return (
                        <option key={month} value={month}>
                            {month}월
                        </option>
                    );
                })}
            </select> */}

                                {/* 일 선택 - 해당 연도와 월에 맞게 일 수 조정 */}
                                {/* <select className="selectValue" value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))}>
                {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
                    const day = i + 1;
                    return (
                        <option key={day} value={day}>
                            {day}일
                        </option>
                    );
                })}
            </select>
            <select className="mapSelect" value={selectedIndex} onChange={(e) => setSelectedIndex(Number(e.target.value))}>
                                    {regionCoords.map((region, idx) => (
                                        <option key={region.name} value={idx}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select> */}
                                <select className="selectValue" value={selectedMonth} onChange={(e) => {
                                    if (Number(e.target.value) > 9) {
                                        setSelectedMonth(e.target.value);
                                    } else if (Number(e.target.value) < 10) {
                                        setSelectedMonth(e.target.value);
                                    }
                                }}>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = i + 1;
                                        return (
                                            <option key={month} value={`${month}`}>
                                                {month}월
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="sb">
                                <select className="selectValue" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                                    {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
                                        const day = i + 1;
                                        return (
                                            <option key={day} value={`${day}`}>
                                                {day}일
                                            </option>
                                        );
                                    })}
                                </select>

                                <select className="mapSelect" value={selectedIndex} onChange={(e) => { setSelectedIndex(Number(e.target.value)); setSelectedCityN(String(e.target.options[e.target.selectedIndex].id)) }}>
                                    {regionCoords.map((region, idx) => (
                                        <option key={region.name} value={idx} id={region.index}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="realtimeWeatherArea">
                        <Weather selectedIndex={selectedIndex} />
                    </div>
                    <div className="perceived ">
                        <SuggestWeather selectedIndex={selectedIndex} />
                    </div>
                </section>

                <section id="thirdSection" className="thirdSection">
                    <div className="c">
                        <div className="c2-3">
                            <p className="circleperTitle">{selectedYear}년 {selectedMonth}월 {selectedDay}일</p>
                            <div className="daytemer">
                                <p className="daytemerMax">최고 기온 : {weatherDay.ta_max}°C</p>
                                <p className="daytemerMin">최저 기온 : {weatherDay.ta_min}°C</p>
                            </div>
                            <div className="dayprec">
                                <p className="prec">강수량 : {weatherDay.rn_day === "null" ? "-- " : weatherDay.rn_day + "mm"}</p>
                            </div>
                            <div className="dayhumidity">습도 : {weatherDay.hm}%</div>
                        </div>
                        <TotalPrecipitation selectedIndex={selectedIndex} selectedYear={selectedYear} />
                        <div className="c2-2">
                            <p className="circleperTitle">전국 중 지역 강수량</p>
                            <PrecipitationGraph selectedIndex={selectedIndex} selectedYear={selectedYear} />
                        </div>
                    </div>
                    <div className="c1">
                        <TemperatureGraph selectedYear={selectedYear} selectedIndex={selectedIndex}></TemperatureGraph>
                    </div>
                    <div className="c2">
                        <TableData selectedIndex={selectedIndex} selectedYear={selectedYear} />
                    </div>
                </section>
            </main>
            {/* <CallApi selectedYear={selectedYear} /> */}
        </div >
    );
}

export { WeatherDisplay };
