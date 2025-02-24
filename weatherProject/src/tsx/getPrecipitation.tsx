import React, { useEffect, useState } from "react";
import axios from "axios";

// 월별데이터
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
                item: {
                    month: {
                        info: WeatherInfo[];
                    }
                }[];
            };
        };
    };
}

interface yearWeatherInfo {
    va_lst_01: string; // 예: "10155"
    va_lst_02: string; // 예: "4"
    va_lst_03: string; // 예: "128"
    va_lst_04: string; // 예: "6"
    va_lst_05: string; // 예: "168"
    va_lst_06: string; // 예: "359"
    va_lst_07: string; // 예: "20160813"
    va_lst_08: string; // 예: "90"
    va_lst_09: string; // 예: "-164"
    va_lst_10: string; // 예: "20160124"
    va_lst_11: string; // 예: "13338"
    va_lst_12: string; // 예: "-684"
    va_lst_13: string; // 예: "0000002064"
    va_lst_14: string; // 예: "0705"
    va_lst_15: string; // 예: "1004"
    va_lst_16: string; // 예: "2016-07-05 00:00:00.0"
    va_lst_17: string; // 예: "85"
    va_lst_18: string; // 예: "107"
    va_lst_19: string; // 예: ""
    va_lst_20: string; // 예: ""
    stn_ko: string; // 지역명(국문)
    stn_id: number; // 지역 번호
}

interface yearApiResponse {
    response: {
        body: {
            items: {
                item: {
                    temp: {
                        info: yearWeatherInfo[];
                    };
                }[];
            };
        };
    };
}
const CallApi: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherInfo[] | null>(null);
    useEffect(() => {
        const fetchWeatherData = async () => {
            const apiUrl =
            "/api/typ02/openApi/SfcMtlyInfoService/getMmSumry2?pageNo=1&numOfRows=10&dataType=json&year=2024&month=12&authKey=SbnYSQwuQ-G52EkMLhPhlQ";

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
                }

                const data: ApiResponse = await response.json();
                console.log("API 응답 데이터:", data.response.body.items.item[0].month.info[0]);

                // API 데이터에서 필요한 정보 추출
                const weatherInfo = data.response.body.items.item[0].month.info[0];
                console.log(weatherInfo);
                // setWeatherData(weatherInfo);
                // axios
                // .get(apiUrl)
                // .then((response) => {
                //     console.log("API 응답:", response.data);

                // })
                // .catch((error) => {
                //     console.error("API 호출 중 오류 발생:", error);
                // });
            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        }

        fetchWeatherData();
        
    }, []);

    return <div></div>;
};

export default CallApi;