function WeatherDisplay() {
    return (
        <div id="container" className="container">
            <header id="header" className="header"> <p>ProjcetName</p></header >
            <main id="main" className="main">
                <section id="firstSection" className="firstSection">
                    <div className="a1"> </div>
                    < div className="a"> </div>
                    < div className="a"> </div>
                </section>
                < section id="secondSection" className="secondSection">
                    <div className="b1"> </div>
                    < div className="b2"> </div>
                </section>
                < section id="thirdSection" className="thirdSection">
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

    )
}

export { WeatherDisplay };