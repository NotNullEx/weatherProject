import React, { useEffect, useState } from "react";
import axios from "axios";

// 월별데이터
interface WeatherInfo {
    tm_max: string | null; // 
    cnt7: string; // 
    cnt8: string; // 
    cnt5: string; // 
    cnt6: string; // 
    cnt3: string | null; // 
    stn_ko: string | null; // 지역명(국문)
    cnt4: string; // 
    cnt1: string; // 
    max_rn_day: string; // 1일 최다 강수량(mm)
    cnt2: string; // 
    tm_rn_day: string; // 1일 최다 강수량이 나타난 날
    ev_s: string; // 
    wd_max: string; // 시
    rn_day_cnt2: string | null; // 
    rn_day_cnt1: string; // 
    rn_day_cnt4: string; // 
    rn_day_cnt3: string; // 
    ws_max: string | null; // 
    rn_day: string; // 강수량 총량(mm)
    rn: string; // 강수량 평년차(mm)
    ws: string;
    stn_id: number; // 지역번호
    cnt9: string;
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
interface CallApiProps {
    selectedYear: string; // 연도 props 추가
}


const CallApi: React.FC<CallApiProps> = ({ selectedYear }) => {
    // 월별 데이터
    const [monthWeatherData, setMonthWeatherData] = useState<WeatherInfo[] | null>(null);
    const [yearWeatherData, setYearWeatherData] = useState<yearWeatherInfo[] | null>(null);
    const [selectValue, setSelecValue] = useState<string>("");
    // const handleAction = () => {
    //     console.log(`선택된 값: ${selectValue}`);
    // };
    // handleAction();
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                
                let addCity = [];
                let apiUrl: string = "";
                console.log(selectedYear);
                for (let i = 1; i <= 12; i++) {
                    if (i < 10) {
                        apiUrl = `/api/typ02/openApi/SfcMtlyInfoService/getMmSumry2?pageNo=1&numOfRows=10&dataType=JSON&year=${selectedYear}&month=0${i}&authKey=SbnYSQwuQ-G52EkMLhPhlQ`;
                    } else {
                        apiUrl = `/api/typ02/openApi/SfcMtlyInfoService/getMmSumry2?pageNo=1&numOfRows=10&dataType=JSON&year=${selectedYear}&month=${i}&authKey=SbnYSQwuQ-G52EkMLhPhlQ`;
                    }

                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP 오류: ${response.status}`);
                    }

                    const data: ApiResponse = await response.json();
                    const monthInfo = data.response.body.items.item[0].month.info;
                    for (let i = 0; i < monthInfo.length; i++) {
                        if (monthInfo[i].stn_ko == "서울") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "수원") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "천안") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "청주") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "강릉") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "대구") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "창원") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "전주") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "여수") {
                            addCity.push(monthInfo[i]);
                        } else if (monthInfo[i].stn_ko == "제주") {
                            addCity.push(monthInfo[i]);
                        }
                    }
                }
                // API 데이터에서 필요한 정보 추출
                console.log("API 응답 데이터:", addCity);
                setMonthWeatherData(addCity);

            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        }

        fetchWeatherData();

    }, [selectedYear]);

    // 연별데이터
    useEffect(() => {
        const fetchWeatherData = async () => {
            const apiUrl = `/api/typ02/openApi/SfcYearlyInfoService/getYearSumry?pageNo=1&numOfRows=10&dataType=JSON&year=2017&authKey=SbnYSQwuQ-G52EkMLhPhlQ`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP 오류: ${response.status}`);
                }
                const data: yearApiResponse = await response.json();
                // API 데이터에서 필요한 정보 추출
                const weatherInfo = data.response.body.items.item[0].temp.info;

                let addCity = [];
                for (let i = 0; i < weatherInfo.length; i++) {
                    if (weatherInfo[i].stn_ko == "서울") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "수원") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "천안") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "청주") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "강릉") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "대구") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "창원") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "전주") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "여수") {
                        addCity.push(weatherInfo[i]);
                    } else if (weatherInfo[i].stn_ko == "제주") {
                        addCity.push(weatherInfo[i]);
                    }
                }
                setYearWeatherData(addCity);
            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        }
        fetchWeatherData();
    }, []);

    return <div></div>;
};

export default CallApi;