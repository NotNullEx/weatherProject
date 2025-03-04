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
import DayWeather from "./DayWeather";

function WeatherDisplay() {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<string>("2024");
    const [selectedCity, setSelectedCity] = useState<string>("서울");
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [selectedCityN, setSelectedCityN] = useState('108');  // 도시 번호 (일별에서 씀)
    const [selectedMonth, setSelectedMonth] = useState("1"); // 월
    const [selectedDay, setSelectedDay] = useState("1");      // 일

    const getDaysInMonth = (year: string, month: string) => {
        const yearNum = Number(year);
        const monthNum = Number(month);
        return new Date(yearNum, monthNum, 0).getDate();
    };

    useEffect(() => {
        const cityMapping = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '경북', '경남', '전북', '전남', '제주'];
        setSelectedCity(cityMapping[selectedIndex] || "서울");
    }, [selectedIndex]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div id="container" className="container">
            <header id="header" className="header">
                <p>Weather Insight</p>
                <div>
                    <button onClick={() => window.open("http://kkms4001.iptime.org/~c21st18/weatherProject/WEATHER%20PROJECT.pdf", "_blank")}>Report</button>
                    <button onClick={() => window.open("https://github.com/NotNullEx/weatherProject", "_blank")}>GitHub</button>
                    <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
                        {darkMode ? "🌞" : "🌙 "}
                    </button>
                </div>
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
                            <DayWeather selectedYear={selectedYear} selectedMonth={selectedMonth} selectedDay={selectedDay} selectedCity={selectedCity} selectedCityN={selectedCityN}></DayWeather>
                        </div>
                        <TotalPrecipitation selectedIndex={selectedIndex} selectedYear={selectedYear} />
                        <div className="c2-2">
                            <p className="circleperTitle">{selectedYear}년 {selectedCity} 강수량</p>
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
        </div >
    );
}

export { WeatherDisplay };
