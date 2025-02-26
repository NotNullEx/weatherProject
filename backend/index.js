import mysql from 'mysql2/promise';
import https from 'https';
import './server.js';

// MySQL 연결 설정
const connection = await mysql.createConnection({
  host: 'mysql-db',
  user: 'weather',
  password: '1q2w3e',
  database: 'weatherDB',
  charset: 'utf8mb4',
});

console.log('MySQL 연결 성공!');

// 인코딩 강제 설정
await connection.query("SET NAMES utf8mb4;");
await connection.query("SET CHARACTER SET utf8mb4;");
await connection.query("SET character_set_connection=utf8mb4;");

// 필터링할 도시 목록
const targetCities = ['서울', '수원', '천안', '청주', '강릉', '대구', '창원', '전주', '여수', '제주', '부산', '인천', '대전', '광주', '울산', '포항'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const fetchWeatherData = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(url).hostname,
      path: new URL(url).pathname + new URL(url).search,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let result = '';

      res.on('data', (chunk) => (result += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(result));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
};



const insertWeatherData = async (data, year, month, type) => {
  try {
    const infoList = data?.response?.body?.items?.item?.flatMap(item => item.month?.info) || [];
    if (infoList.length === 0) return console.warn(`유효한 데이터 없음: ${year}-${month}`);

    for (const cityData of infoList) {
      const cityName = cityData.stnko || cityData.stn_ko;
      if (!targetCities.includes(cityName)) continue;

      const isTemperature = type === 'temperature';
      const tableName = isTemperature ? 'month_temperature_weather' : 'month_precipitation_weather';
      const columns = isTemperature
        ? '(city, year, month, taavg, tamax, tamin, avghm)'
        : '(city, year, month, rnDay, maxRnDay, tmRnDay)';
      
      // null로 변환 처리 함수
      const toValidValue = (value) => value != 'null' ? value : null;

      const values = isTemperature
        ? [
            cityName, 
            year, 
            month,
            toValidValue(cityData.taavg),
            toValidValue(cityData.tamax),
            toValidValue(cityData.tamin),
            toValidValue(cityData.avghm)
          ]
        : [
            cityName, 
            year, 
            month,
            toValidValue(cityData.rn_day),
            toValidValue(cityData.max_rn_day),
            toValidValue(cityData.tm_rn_day)
          ];

      const [existing] = await connection.query(
        `SELECT * FROM ${tableName} WHERE city = ? AND year = ? AND month = ?`,
        [cityName, year, month]
      );

      if (existing.length > 0) {
        console.log(`이미 존재: ${year}-${month}, 도시: ${cityName}`);
        continue;
      }

      // 데이터 삽입 쿼리
      const query = `INSERT INTO ${tableName} ${columns} VALUES (${values.map(() => '?').join(', ')})`;
      await connection.query(query, values);
      console.log(`데이터 삽입 완료: ${year}-${month}, 도시: ${cityName}`);
    }
  } catch (error) {
    console.error('데이터 삽입 중 오류 발생:', error);
  }
};


const insertWeatherData2 = async (data, year, type) => {
  try {
    const infoList = data.response.body.items.item[0].temp.info;
    if (infoList.length === 0) return console.warn(`유효한 데이터 없음: ${year}`);

    for (const cityData of infoList) {
      const cityName = cityData.stn_ko;
      if (!targetCities.includes(cityName)) continue;

      const tableName = 'year_temper_precipi_weather';
      const columns = '(city, year, Va_lst_11, Va_lst_13, Va_lst_14, Va_lst_03, Va_lst_05, Va_lst_06, Va_lst_07, Va_lst_09, Va_lst_10)';
  
      const values = [
        cityName, 
        year, 
        cityData.va_lst_11 != 'null' ? cityData.va_lst_11 : 0,
        cityData.va_lst_13 != 'null' ? cityData.va_lst_13 : 0,
        cityData.va_lst_14 != 'null' ? cityData.va_lst_14 : 0,
        cityData.va_lst_03 != 'null' ? cityData.va_lst_03 : 0,
        cityData.va_lst_05 != 'null' ? cityData.va_lst_05 : 0,
        cityData.va_lst_06 != 'null' ? cityData.va_lst_06 : 0,
        cityData.va_lst_07 != 'null' ? cityData.va_lst_07 : 0,
        cityData.va_lst_09 != 'null' ? cityData.va_lst_09 : 0,
        cityData.va_lst_10 != 'null' ? cityData.va_lst_10 : 0
      ];
      

      const [existing] = await connection.query(
        `SELECT * FROM ${tableName} WHERE city = ? AND year = ?`,
        [cityName, year]
      );

      if (existing.length > 0) {
        console.log(`이미 존재: ${year}, 도시: ${cityName}`);
        continue;
      }

      if(type==="precipi"){
        const query = `INSERT INTO ${tableName} ${columns} VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)`;
        await connection.query(query, values);
        console.log(`데이터 삽입 완료: ${year}, 도시: ${cityName}`);        
      }
    }
  } catch (error) {
    console.error('데이터 삽입 중 오류 발생:', error);
  }
};

// 메인 실행 함수
const main = async () => {
  try {
    for (let year = 2017; year <= 2024; year++) {
      const weatherData3 = await fetchWeatherData(`https://apihub.kma.go.kr/api/typ02/openApi/SfcYearlyInfoService/getYearSumry?pageNo=1&numOfRows=10&dataType=JSON&year=${year}&authKey=hVqmw5caSHOapsOXGhhz3Q`).catch(() => null); 
      if (weatherData3) await insertWeatherData2(weatherData3,year,"precipi");

      for (const month of months) {
        console.log(`데이터 수집 중: ${year}-${month}`);
        
        const weatherData1 = await fetchWeatherData(`https://apihub.kma.go.kr/api/typ02/openApi/SfcMtlyInfoService/getMmSumry?pageNo=1&numOfRows=10&dataType=JSON&year=${year}&month=${month}&authKey=hVqmw5caSHOapsOXGhhz3Q`).catch(() => null);
        const weatherData2 = await fetchWeatherData(`https://apihub.kma.go.kr/api/typ02/openApi/SfcMtlyInfoService/getMmSumry2?pageNo=1&numOfRows=10&dataType=JSON&year=${year}&month=${month}&authKey=hVqmw5caSHOapsOXGhhz3Q`).catch(() => null);
        if (weatherData1) await insertWeatherData(weatherData1, year, month, 'temperature');
        if (weatherData2) await insertWeatherData(weatherData2, year, month, 'precipitation');

        // API 요청 간 지연 (1초)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await connection.end();
    console.log('MySQL 연결 종료');
  }
};

main();
