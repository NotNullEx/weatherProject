import React, { useState } from "react";
import Weather from "./weather";
import WeatherMap from "./weatherMap";
import TemperatureGraph from "./TemperatureGraph";
import PrecipitationGraph from "./Precipitation graph";
import SuggestWeather from "./SuggestClothes";
import { regionCoords } from "./regionCoords";
import TableData from "./TableData";
import WeatherChart from "./weatherChart";
import CallApi from "../tsx/getPrecipitation";
import Totalprecipitation from "./Totalprecipitation";





function WeatherDisplay() {
    const [selectedIndex, setSelectedIndex] = useState<number>(0); // 지역 선택 상태
    const [selectedYear, setSelectedYear] = useState<string>("2024"); // 선택된 연도 상태

    return (
        <div id="container" className="container">
            <header id="header" className="header">
                <p>ProjectName</p>
            </header>
            <main id="main" className="main">
                <section id="secondSection" className="secondSection">
                    <div className="b1" id="map">
                        {/* 선택된 지역을 변경할 수 있도록 props 전달 */}
                        <WeatherMap selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                    </div>
                    <div className="b2" id="wchart">
                        <WeatherChart selectedIndex={selectedIndex} />
                    </div>
                </section>
                <section id="firstSection" className="firstSection">
                    <div className="selectTime">
                        <div className="selectValuebox">
                            <div className="yearBox">
                                <select name="year"
                                    className="selectValue"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)} // 선택된 연도 변경
                                >
                                    <option value="2024">2024년</option>
                                    <option value="2023">2023년</option>
                                    <option value="2022">2022년</option>
                                    <option value="2021">2021년</option>
                                    <option value="2020">2020년</option>
                                    <option value="2019">2019년</option>
                                    <option value="2018">2018년</option>
                                    <option value="2017">2017년</option>
                                </select>
                            </div>
                            <div className="mapBox">
                                <select value={selectedIndex} onChange={(e) => setSelectedIndex(Number(e.target.value))} className="mapSelect">
                                    {regionCoords.map((region, idx) => (
                                        <option key={region.name} value={idx}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="realtimeWeatherArea">
                        {/* 선택된 지역 정보를 Weather 컴포넌트에 전달 */}
                        <Weather selectedIndex={selectedIndex} />
                    </div>
                    <div className="perceived ">
                        <SuggestWeather />
                    </div>
                </section>

                <section id="thirdSection" className="thirdSection">
                    <div className="c">
                        <div className="c2-1">
                            <p className="circleperTitle">전국 총 강수량</p>
                            <Totalprecipitation />
                            <p className="allhighestprecipitation">1132ml</p>
                        </div>
                        <div className="c2-1">
                            <p className="circleperTitle">전국 중 지역 강수량</p>
                            <PrecipitationGraph value={60} />
                        </div>
                        <div className="c2-1">
                            <p className="circleperTitle">최다 강수량</p>
                            <p className="highestprecipitationDay">2월</p>
                            <p className="highestprecipitation">1132ml</p>
                        </div>
                    </div>
                    <div className="c1">
                        <h2 className="tgtitle">기온 그래프</h2>
                        <TemperatureGraph></TemperatureGraph>
                    </div>
                    <div className="c2">
                        <h2>데이터</h2>
                        <TableData selectedIndex={selectedIndex} />
                    </div>
                </section>
            </main>
            <CallApi selectedYear={selectedYear} />
        </div >
    );
}

export { WeatherDisplay };