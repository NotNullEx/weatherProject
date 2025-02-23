import React, { useEffect,useState } from "react";
import axios from "axios";

interface WeatherInfo {
    stn_id: number; // 지역번호
    stn_ko: string; // 지역명(국문)
    stn_en: string; // 지역명(영문)
    info: {
        si_day: string | null; // 일출 시간
        ps: string; // 기압(hPa)
        ss_day: string; // 일몰 시간
        hm: string; // 습도(%)
        ta_max: string; // 최고 기온(°C)
        ev_s: string | null; // 증발량 (null 가능)
        ca_tot: string | null; // 운량 (null 가능)
        tg_min: string; // 최저 초상온도(°C)
        wd_max: string; // 최대풍향
        ta: string; // 평균 기온(°C)
        td: string; // 이슬점온도(°C)
        ws_max: string; // 최대풍속(m/s)
        ta_min: string; // 최저 기온(°C)
        tm: string; // 시간대 (1~3)
        sd_new: string | null; // 신적설량(cm) (null 가능)
        rn_day: string; // 강수량(mm)
        hm_min: string; // 최저 습도(%)
        ws: string; // 평균 풍속(m/s)
        sd_max: string | null; // 최대적설(cm) (null 가능)
    }[];
}

interface ApiResponse {
    response: {
        body: {
            items: {
                item: {
                    stndays: WeatherInfo;
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
    // 일별 데이터터
    const [weatherData, setWeatherData] = useState<WeatherInfo[] | null>(null);
    const [yearWeatherData, setYearWeatherData] = useState<yearWeatherInfo[] | null>(null);
    useEffect(() => {
        const fetchWeatherData = async () => {
            const apiUrl =
            `/api/typ02/openApi/SfcMtlyInfoService/getDailyWthrData?pageNo=1&numOfRows=10&dataType=JSON&year=2016&month=09&station=90&authKey=SbnYSQwuQ-G52EkMLhPhlQ`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
                }

                const data: ApiResponse = await response.json();
                //console.log("API 응답 데이터:", data.response.body.items.item[0].stndays.info);
                for(let i =0; i<data.response.body.items.item[0].stndays.info.length; i++){

                }
                // API 데이터에서 필요한 정보 추출
                const weatherInfo = data.response.body.items.item[0].stndays.info;
                //console.log(weatherInfo);
                
            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        }
       
        fetchWeatherData();
        
    }, []);

    // 연별데이터
    useEffect(()=>{
        const fetchWeatherData = async () =>{
            const apiUrl =`/api/typ02/openApi/SfcYearlyInfoService/getYearSumry?pageNo=1&numOfRows=10&dataType=JSON&year=2016&authKey=SbnYSQwuQ-G52EkMLhPhlQ`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
                }
    
                const data: yearApiResponse = await response.json();
                
    
                // API 데이터에서 필요한 정보 추출
                const weatherInfo = data.response.body.items.item[0].temp.info;
                
                let addCity = [];
                for(let i=0; i<weatherInfo.length; i++){
                    if(weatherInfo[i].stn_ko == "서울"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "수원"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "천안"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "청주"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "강릉"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "대구"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "창원"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "전주"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "여수"){
                        addCity.push(weatherInfo[i]);
                    }else if(weatherInfo[i].stn_ko == "제주"){
                        addCity.push(weatherInfo[i]);
                    }
                }
                console.log(addCity);
                setYearWeatherData(addCity);
            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        }
        fetchWeatherData();
    },[]);

    return <div></div>;
};

export default CallApi;