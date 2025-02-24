import React, { useEffect, useState } from "react";

interface WeatherInfo {
    tm_max: string;
    cnt7: string | null;
    cnt8: string | null;
    cnt5: string;
    cnt6: string | null;
    cnt3: string;
    stn_ko: string; // 지역명
    cnt4: string | null;
    cnt1: string;
    max_rn_day: string;
    cnt2: string;
    tm_rn_day: string;
    ev_s: string | null;
    wd_max: string;
    rn_day_cnt2: string;
    rn_day_cnt1: string;
    rn_day_cnt4: string;
    rn_day_cnt3: string;
    ws_max: string;
    rn_day: string;
    rn: string;
    ws: string;
    stn_id: number; // 지역번호
    cnt9: string | null;
}

interface ApiResponse {
    response: {
        body: {
            items: {
                item: { month: { info: WeatherInfo[] } }[];
            };
        };
    };
}
interface CallApiProps {
    selectedYear: string; // 연도 props 추가
}
const CallApi: React.FC<CallApiProps> = ({ selectedYear }) => {
    const [weatherData, setWeatherData] = useState<WeatherInfo[] | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const apiUrl = `/api/typ02/openApi/SfcMtlyInfoService/getMmSumry2?pageNo=1&numOfRows=10&dataType=json&year=${selectedYear}&month=12&authKey=SbnYSQwuQ-G52EkMLhPhlQ`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP 오류: ${response.status}`);
                }

                const data: ApiResponse = await response.json();
                console.log("API 응답 데이터:", data.response.body.items.item[0].month.info[0]);

                // API 데이터에서 필요한 정보 추출
                const weatherInfo = data.response.body.items.item[0].month.info[0];
                setWeatherData([weatherInfo]); // 상태 업데이트
            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        };

        fetchWeatherData();
    }, [selectedYear]); // 연도가 변경될 때마다 API 호출

    return (
        <div>
            {weatherData ? (
                <div>
                    <h3>날씨 정보 ({selectedYear}년)</h3>
                    <p>최대 기온: {weatherData[0].tm_max}℃</p>
                    <p>강수량: {weatherData[0].rn}mm</p>
                </div>
            ) : (
                <p>API 호출 중...</p>
            )}
        </div>
    );
};

export default CallApi;