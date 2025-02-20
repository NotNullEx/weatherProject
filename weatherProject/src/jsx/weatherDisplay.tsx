import React, { useState } from "react";
import Weather from "./weather";
import WeatherMap from "./weatherMap";

function WeatherDisplay() {
    const [selectedIndex, setSelectedIndex] = useState<number>(0); // 지역 선택 상태

    return (
        <div id="container" className="container">
            <header id="header" className="header">
                <p>ProjectName</p>
            </header>
            <main id="main" className="main">
                <section id="firstSection" className="firstSection">
                    <div className="selectTime">
                        <div className="selectValuebox">
                            <select name="year" className="selectValue">
                                <option value="1">2024</option>
                            </select>
                            <p>년</p>
                        </div>
                        <div className="selectValuebox">
                            <select name="month" className="selectValue">
                                <option value="1">12</option>
                            </select>
                            <p>월</p>
                        </div>
                        <div className="selectValuebox">
                            <select name="day" className="selectValue">
                                <option value="1">1</option>
                            </select>
                            <p>일</p>
                        </div>
                    </div>
                    <div className="realtimeWeatherArea">
                        {/* 선택된 지역 정보를 Weather 컴포넌트에 전달 */}
                        <Weather selectedIndex={selectedIndex} />
                    </div>
                    <div className="a1">날씨 비교</div>
                </section>
                <section id="secondSection" className="secondSection">
                    <div className="b1" id="map">
                        {/* 선택된 지역을 변경할 수 있도록 props 전달 */}
                        <WeatherMap selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                    </div>
                    <div className="b2" id="map">전년 기온 비교 </div>
                </section>
                <section id="thirdSection" className="thirdSection">
                    <div className="c">
                        <div className="c2-1">강수 avg</div>
                        <div className="c2-1">강수 max</div>
                        <div className="c2-1">강수 ??</div>
                    </div>
                    <div className="c1">기온 그래프</div>
                    <div className="c2">데이터</div>
                </section>
            </main>
        </div>
    );
}

export { WeatherDisplay };