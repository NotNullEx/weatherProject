import mysql from 'mysql2/promise';
import https from 'https';
import getSelect from "./select.js";
import './server.js';

// MySQL 연결 설정
const connection = await mysql.createConnection({
  host: 'mysql-db',
  user: 'weather',
  password: '1q2w3e',
  database: 'weatherDB',
  charset: 'utf8mb4',
});

console.log('✅ MySQL 연결 성공!');

// 필터링할 도시 목록
const targetCities = ['서울', '수원', '천안', '청주', '강릉', '대구', '창원', '전주', '여수', '제주'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

// 날씨 데이터 가져오기
const fetchWeatherData = (year, month) => {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://apihub.kma.go.kr/api/typ02/openApi/SfcMtlyInfoService/getMmSumry?pageNo=1&numOfRows=10&dataType=JSON&year=${year}&month=${month}&authKey=iaVHnTfZQlulR5032dJbtQ`;

    const url = new URL(apiUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(result);
          // console.log('📊 API 응답 데이터:', JSON.stringify(jsonResponse, null, 2));
          resolve(jsonResponse);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
};

// 데이터 삽입 함수
const insertWeatherData = async (data, year, month) => {
  try {
    const infoList = data?.response?.body?.items?.item?.flatMap(item => item.month?.info) || [];
    if (infoList.length === 0) {
      console.warn(`⚠️ 유효한 데이터 없음: ${year}-${month}`);
      return;
    }

    for (const cityData of infoList) {
      if (targetCities.includes(cityData.stnko)) {
        console.log(`🔍 처리 중: ${cityData.stnko}, ${year}-${month}`);
        const values = [cityData.stnko, year, month, cityData.taavg, cityData.tamax, cityData.tamin, cityData.avghm];

        // 중복 확인
        const [existing] = await connection.query(
          `SELECT * FROM month_temperature_weather WHERE city = ? AND year = ? AND month = ?`,
          [cityData.stnko, year, month]
        );

        if (existing.length > 0) {
          console.log(`🔄 이미 존재: ${year}-${month}, 도시: ${cityData.stnko}`);
          continue;
        }

        // 데이터 삽입
        const query = `
          INSERT INTO month_temperature_weather
          (city, year, month, taavg, tamax, tamin, avghm)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      
        await connection.query(query, values);
        console.log(`✅ 데이터 삽입 완료: ${year}-${month}, 도시: ${cityData.stnko}`);
      }
    }
  } catch (error) {
    console.error('❌ 데이터 삽입 중 오류 발생:', error);
  }
};

// 메인 실행 함수
const main = async () => {
  try {
    for (let year = 2017; year < 2025; year++) {
      for (const month of months) {
        console.log(`📊 데이터 수집 중: ${year}-${month}`);
        const weatherData = await fetchWeatherData(year, month);
        await insertWeatherData(weatherData, year, month);

        // API 요청 간 지연 (1초)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await connection.end();
    console.log('🔌 MySQL 연결 종료');
  }
};

main();
