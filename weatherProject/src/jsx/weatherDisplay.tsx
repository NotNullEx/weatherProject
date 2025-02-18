import Weather from "./weather";

function WeatherDisplay() {


    return (
        <div id="container" className="container">
            <header id="header" className="header">
                <p>ProjcetName</p>
            </header>
            <main id="main" className="main">
                <section id="firstSection" className="firstSection">
                    <div className="selectTime">
                        <div className="selectValuebox">
                            <select name="year" id="year" className="selectValue">
                                <option value="1">2024</option><p>sss</p>
                            </select>
                            <p>년</p>
                        </div>
                        <div className="selectValuebox">
                            <select name="year" id="year" className="selectValue">
                                <option value="1">12</option><p>sss</p>
                            </select>
                            <p>월</p>
                        </div>
                        <div className="selectValuebox">
                            <select name="year" id="year" className="selectValue">
                                <option value="1">1</option><p>sss</p>
                            </select>
                            <p>일</p>
                        </div>
                    </div>
                    <div className="realtimeWeatherArea">
                        <Weather />
                    </div>
                    <div className="a1"></div>
                </section>
                <section id="secondSection" className="secondSection">
                    <div className="b1" id="map">

                    </div>
                    <div className="b2" id="map">

                    </div>

                </section>
                <section id="thirdSection" className="thirdSection">
                    <div className="c">
                        <div className="c2-1"></div>
                        <div className="c2-1"></div>
                        <div className="c2-1"></div>
                    </div>
                    <div className="c1"></div>
                    <div className="c2"></div>
                </section>
            </main>
        </div>
    );
}

export { WeatherDisplay };
