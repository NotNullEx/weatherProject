import React, { useEffect, useState } from "react";
import url from './json/url.json';

interface CallApiProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  selectedCity: string;
  selectedCityN: string;
}

const DayWeather: React.FC<CallApiProps> = ({ selectedYear, selectedMonth, selectedDay, selectedCity, selectedCityN }) => {
  const [dayWeather, setDayWeather] = useState<any>([]);
  const [taMax, setTaMax] = useState<string>("--");
  const [taMin, setTaMin] = useState<string>("--");
  const [rnDay, setRnDay] = useState<string>("--");
  const [hm, setHm] = useState<string>("--");

  // 날씨 데이터 가져오기
  useEffect(() => {
    if (!selectedCityN) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `${url.host2}/api/dayWeather?year=${selectedYear}&month=${selectedMonth}&city=${selectedCity}&day=${selectedDay}`
        );
        const data = await response.json();
        console.log("API 응답 데이터: ", data);
        setDayWeather(data);
      } catch (error) {
        console.error('API 호출 중 오류가 발생했습니다:', error);
      }
    };

    fetchWeather();
  }, [selectedYear, selectedMonth, selectedCityN, selectedDay]);

  // 날씨 정보 업데이트
  useEffect(() => {
    if (dayWeather.length > 0) {
      setTaMax(dayWeather[0]?.ta_max ?? "--");
      setTaMin(dayWeather[0]?.ta_min ?? "--");
      setRnDay(dayWeather[0]?.rn_day ?? "--");
      setHm(dayWeather[0]?.hm ?? "--");
    }
  }, [dayWeather]);

  return (
    <>
      <div className="daytemer">
        <p className="daytemerMax">
          <span>최고 기온 :</span>
          <span className="textLeft">{taMax}°C</span>
        </p>
        <p className="daytemerMin">
          <span>최저 기온 :</span>
          <span className="textLeft">{taMin}°C</span>
        </p>
      </div>
      <div className="dayprec">
        <p className="prec">
          <span>강수량 :</span>
          <span className="textLeft">{rnDay === "null" ? "--" : rnDay + "mm"}</span>
        </p>
      </div>
      <div className="dayhumidity">
        <span>습도 :</span>
        <span className="textLeft">{hm}%</span>
      </div>
    </>
  );
};

export default DayWeather;
